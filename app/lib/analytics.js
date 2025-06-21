import { supabaseAdmin } from './supabase';

// Get current environment
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get client IP from request headers
const getClientIP = (request) => {
  // Try various headers to get real IP
  const forwarded = request?.headers?.get('x-forwarded-for');
  const realIp = request?.headers?.get('x-real-ip');
  const cfConnectingIp = request?.headers?.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  return '127.0.0.1'; // Fallback for local development
};

// Track API usage with Supabase storage
export async function trackApiUsage(data, request = null) {
  try {
    const environment = getEnvironment();
    const clientIP = request ? getClientIP(request) : null;
    const userAgent = request?.headers?.get('user-agent') || null;

    const usageRecord = {
      environment,
      project: data.project || 'unknown',
      model: data.model || 'gemini-2.5-flash-lite-preview-06-17',
      input_tokens: data.inputTokens || 0,
      output_tokens: data.outputTokens || 0,
      response_time_ms: data.responseTime || 0,
      cost_usd: data.realCostUSD || 0,
      cost_source: data.realCostUSD ? 'ai_provided' : 'not_provided',
      cached: data.cached || false,
      success: data.success !== false,
      error_message: data.error || null,
      user_agent: userAgent,
      client_ip: clientIP,
      scan_type: data.scanType || 'full'
    };

    // Insert into analytics_records table
    const { error } = await supabaseAdmin
      .from('analytics_records')
      .insert(usageRecord);

    if (error) {
      console.error('Failed to track analytics:', error);
      return false;
    }

    console.log('Analytics tracked successfully:', {
      project: usageRecord.project,
      environment: usageRecord.environment,
      cached: usageRecord.cached,
      cost: usageRecord.cost_usd
    });

    return true;
  } catch (error) {
    console.error('Error in trackApiUsage:', error);
    return false;
  }
}

// Get analytics data for dashboard
export async function getAnalytics(days = 30, environment = null) {
  try {
    const currentEnv = environment || getEnvironment();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily summaries for the specified period
    let dailyQuery = supabaseAdmin
      .from('daily_summaries')
      .select('*')
      .eq('environment', currentEnv)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const { data: dailyData, error: dailyError } = await dailyQuery;

    if (dailyError) {
      console.error('Error fetching daily summaries:', dailyError);
      return null;
    }

    // Get recent individual requests (last 100)
    const { data: recentRequests, error: recentError } = await supabaseAdmin
      .from('analytics_records')
      .select('*')
      .eq('environment', currentEnv)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (recentError) {
      console.error('Error fetching recent requests:', recentError);
      return null;
    }

    // Calculate totals from daily data
    const totals = (dailyData || []).reduce((acc, day) => ({
      totalRequests: acc.totalRequests + (day.total_requests || 0),
      totalTokens: acc.totalTokens + (day.total_tokens || 0),
      totalCost: acc.totalCost + parseFloat(day.total_cost_usd || 0),
      cachedRequests: acc.cachedRequests + (day.cached_requests || 0),
      errors: acc.errors + (day.error_count || 0)
    }), {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      cachedRequests: 0,
      errors: 0
    });

    // Transform daily data to match expected camelCase format
    const transformedDailyData = (dailyData || []).map(day => ({
      ...day,
      totalRequests: day.total_requests,
      totalTokens: day.total_tokens,
      totalCost: parseFloat(day.total_cost_usd || 0),
      cachedRequests: day.cached_requests,
      errors: day.error_count,
      avgResponseTime: parseFloat(day.avg_response_time_ms || 0)
    }));

    // Transform recent requests to match expected camelCase format
    const transformedRecentRequests = (recentRequests || []).map(request => ({
      ...request,
      totalTokens: request.total_tokens || (request.input_tokens || 0) + (request.output_tokens || 0),
      responseTime: request.response_time_ms,
      cost: request.cost_usd,
      costSource: request.cost_source
    }));

    return {
      dailyData: transformedDailyData,
      recentRequests: transformedRecentRequests,
      totals,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days,
        environment: currentEnv
      }
    };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return null;
  }
}

// Get real-time stats for current day
export async function getRealTimeStats(environment = null) {
  try {
    const currentEnv = environment || getEnvironment();
    const today = new Date().toISOString().split('T')[0];

    // Get today's daily summary
    const { data: todayData, error: todayError } = await supabaseAdmin
      .from('daily_summaries')
      .select('*')
      .eq('environment', currentEnv)
      .eq('date', today)
      .single();

    let todayStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      cachedRequests: 0,
      errors: 0,
      avgResponseTime: 0
    };

    if (!todayError && todayData) {
      todayStats = {
        totalRequests: todayData.total_requests || 0,
        totalTokens: todayData.total_tokens || 0,
        totalCost: parseFloat(todayData.total_cost_usd || 0),
        cachedRequests: todayData.cached_requests || 0,
        errors: todayData.error_count || 0,
        avgResponseTime: parseFloat(todayData.avg_response_time_ms || 0)
      };
    }

    // Get last hour activity count
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: lastHourRequests, error: hourError } = await supabaseAdmin
      .from('analytics_records')
      .select('*', { count: 'exact', head: true })
      .eq('environment', currentEnv)
      .gte('timestamp', oneHourAgo);

    if (hourError) {
      console.error('Error fetching last hour stats:', hourError);
    }

    return {
      today: todayStats,
      lastHour: lastHourRequests || 0,
      cacheHitRate: todayStats.totalRequests > 0 ?
        ((todayStats.cachedRequests / todayStats.totalRequests) * 100).toFixed(1) : '0',
      errorRate: todayStats.totalRequests > 0 ?
        ((todayStats.errors / todayStats.totalRequests) * 100).toFixed(1) : '0',
      environment: currentEnv
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
      cacheHitRate: '0',
      errorRate: '0',
      environment: getEnvironment()
    };
  }
}

// Rate limiting functions
export async function checkRateLimit(request, maxRequests = 50, windowHours = 1) {
  try {
    const environment = getEnvironment();
    const clientIP = getClientIP(request);
    const windowStart = new Date(Date.now() - (windowHours * 60 * 60 * 1000));

    // Get or create rate limit record for this IP
    const { data: rateLimitData, error: fetchError } = await supabaseAdmin
      .from('rate_limits')
      .select('*')
      .eq('client_ip', clientIP)
      .eq('environment', environment)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking rate limit:', fetchError);
      return { allowed: true, remaining: maxRequests }; // Allow on error
    }

    const now = new Date();

    if (!rateLimitData) {
      // Create new rate limit record
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({
          client_ip: clientIP,
          environment,
          request_count: 1,
          window_start: now.toISOString(),
          last_request: now.toISOString()
        });

      if (insertError) {
        console.error('Error creating rate limit:', insertError);
        return { allowed: true, remaining: maxRequests - 1 };
      }

      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Check if current window has expired
    const recordWindowStart = new Date(rateLimitData.window_start);
    if (recordWindowStart < windowStart) {
      // Reset the window
      const { error: resetError } = await supabaseAdmin
        .from('rate_limits')
        .update({
          request_count: 1,
          window_start: now.toISOString(),
          last_request: now.toISOString()
        })
        .eq('id', rateLimitData.id);

      if (resetError) {
        console.error('Error resetting rate limit:', resetError);
      }

      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Check if limit exceeded
    if (rateLimitData.request_count >= maxRequests) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: new Date(recordWindowStart.getTime() + (windowHours * 60 * 60 * 1000))
      };
    }

    // Increment request count
    const newCount = rateLimitData.request_count + 1;
    const { error: updateError } = await supabaseAdmin
      .from('rate_limits')
      .update({
        request_count: newCount,
        last_request: now.toISOString()
      })
      .eq('id', rateLimitData.id);

    if (updateError) {
      console.error('Error updating rate limit:', updateError);
    }

    return { 
      allowed: true, 
      remaining: maxRequests - newCount 
    };
  } catch (error) {
    console.error('Error in checkRateLimit:', error);
    return { allowed: true, remaining: maxRequests }; // Allow on error
  }
}

// Reset rate limit for specific IP (for development)
export async function resetRateLimit(request) {
  try {
    const environment = getEnvironment();
    const clientIP = getClientIP(request);

    const { error } = await supabaseAdmin
      .from('rate_limits')
      .delete()
      .eq('client_ip', clientIP)
      .eq('environment', environment);

    if (error) {
      console.error('Error resetting rate limit:', error);
      return false;
    }

    console.log(`Rate limit reset for IP: ${clientIP} in ${environment}`);
    return true;
  } catch (error) {
    console.error('Error in resetRateLimit:', error);
    return false;
  }
}

// Cleanup old rate limit records (call periodically)
export async function cleanupOldRateLimits() {
  try {
    const twoHoursAgo = new Date(Date.now() - (2 * 60 * 60 * 1000));

    const { error } = await supabaseAdmin
      .from('rate_limits')
      .delete()
      .lt('window_start', twoHoursAgo.toISOString());

    if (error) {
      console.error('Error cleaning up rate limits:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in cleanupOldRateLimits:', error);
    return false;
  }
}