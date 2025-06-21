import { kv } from '@vercel/kv';

// Track API usage with real costs from AI
export async function trackApiUsage(data) {
  try {
    const timestamp = new Date().toISOString();
    const usageRecord = {
      timestamp,
      project: data.project || 'unknown',
      model: data.model || 'gemini-2.5-flash-lite-preview-06-17',
      inputTokens: data.inputTokens || 0,
      outputTokens: data.outputTokens || 0,
      totalTokens: (data.inputTokens || 0) + (data.outputTokens || 0),
      responseTime: data.responseTime || 0,
      cost: data.realCostUSD || null, // Use real cost from AI, or null if not provided
      costSource: data.realCostUSD ? 'ai_provided' : 'not_provided',
      cached: data.cached || false,
      success: data.success !== false,
      error: data.error || null,
      userAgent: data.userAgent || null,
      ip: data.ip || null,
      scanType: data.scanType || 'full'
    };

    // Store in KV with a unique key
    const key = `analytics:${timestamp}:${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(key, usageRecord, { ex: 60 * 60 * 24 * 30 }); // Keep for 30 days

    // Also update daily summary
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `daily:${today}`;

    const existingDaily = await kv.get(dailyKey) || {
      date: today,
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      cachedRequests: 0,
      errors: 0,
      avgResponseTime: 0,
      basicScans: 0,
      fullScans: 0
    };

    existingDaily.totalRequests += 1;
    existingDaily.totalTokens += usageRecord.totalTokens;
    existingDaily.totalCost += usageRecord.cost || 0; // Handle null costs
    if (usageRecord.cached) existingDaily.cachedRequests += 1;
    if (!usageRecord.success) existingDaily.errors += 1;
    if (usageRecord.scanType === 'basic') existingDaily.basicScans += 1;
    if (usageRecord.scanType === 'full') existingDaily.fullScans += 1;
    existingDaily.avgResponseTime = ((existingDaily.avgResponseTime * (existingDaily.totalRequests - 1)) + usageRecord.responseTime) / existingDaily.totalRequests;

    await kv.set(dailyKey, existingDaily, { ex: 60 * 60 * 24 * 90 }); // Keep daily summaries for 90 days

    console.log('Analytics tracked:', usageRecord);
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}

// Note: Cost calculation removed - now using real costs provided directly by AI
// If AI doesn't provide cost data, we show "not provided" in analytics

// Get analytics data for dashboard
export async function getAnalytics(days = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily summaries
    const dailyData = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dailyKey = `daily:${dateStr}`;
      const data = await kv.get(dailyKey);
      if (data) {
        dailyData.push(data);
      }
    }

    // Get recent individual requests
    const keys = await kv.keys('analytics:*');
    const recentKeys = keys
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 100); // Get last 100 requests

    const recentRequests = [];
    for (const key of recentKeys) {
      const data = await kv.get(key);
      if (data) {
        recentRequests.push(data);
      }
    }

    // Calculate totals
    const totals = dailyData.reduce((acc, day) => ({
      totalRequests: acc.totalRequests + day.totalRequests,
      totalTokens: acc.totalTokens + day.totalTokens,
      totalCost: acc.totalCost + day.totalCost,
      cachedRequests: acc.cachedRequests + day.cachedRequests,
      errors: acc.errors + day.errors
    }), {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      cachedRequests: 0,
      errors: 0
    });

    return {
      dailyData,
      recentRequests,
      totals,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days
      }
    };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return null;
  }
}

// Get real-time stats - now uses the same data source as main analytics for consistency
export async function getRealTimeStats() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const defaultStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      cachedRequests: 0,
      errors: 0,
      avgResponseTime: 0
    };

    let todayStats = defaultStats;

    // First, try to get today's data directly from daily summary
    const dailyKey = `daily:${today}`;
    const todayData = await kv.get(dailyKey);



    if (todayData) {
      todayStats = todayData;
    } else {
      // If no daily summary exists, calculate from recent requests
      const keys = await kv.keys('analytics:*');
      const recentKeys = keys
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 100); // Get last 100 requests

      const recentRequests = [];
      for (const key of recentKeys) {
        const data = await kv.get(key);
        if (data) {
          recentRequests.push(data);
        }
      }

      // Count requests from today
      const todayRequests = recentRequests.filter(req => {
        const reqDate = new Date(req.timestamp).toISOString().split('T')[0];
        return reqDate === today;
      });

      if (todayRequests.length > 0) {
        todayStats = {
          totalRequests: todayRequests.length,
          totalTokens: todayRequests.reduce((sum, req) => sum + (req.totalTokens || 0), 0),
          totalCost: todayRequests.reduce((sum, req) => sum + (req.cost || 0), 0),
          cachedRequests: todayRequests.filter(req => req.cached).length,
          errors: todayRequests.filter(req => !req.success).length,
          avgResponseTime: todayRequests.length > 0 ?
            todayRequests.reduce((sum, req) => sum + (req.responseTime || 0), 0) / todayRequests.length : 0
        };
      }
    }

    // Calculate last hour activity from recent requests
    let lastHourRequests = 0;
    const keys = await kv.keys('analytics:*');
    const recentKeys = keys
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 100);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    for (const key of recentKeys) {
      const data = await kv.get(key);
      if (data && data.timestamp > oneHourAgo) {
        lastHourRequests++;
      }
    }

    return {
      today: todayStats,
      lastHour: lastHourRequests,
      cacheHitRate: todayStats.totalRequests > 0 ?
        (todayStats.cachedRequests / todayStats.totalRequests * 100).toFixed(1) : 0,
      errorRate: todayStats.totalRequests > 0 ?
        (todayStats.errors / todayStats.totalRequests * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error('Failed to get real-time stats:', error);
    return {
      today: {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        cachedRequests: 0,
        errors: 0,
        avgResponseTime: 0
      },
      lastHour: 0,
      cacheHitRate: 0,
      errorRate: 0
    };
  }
}
