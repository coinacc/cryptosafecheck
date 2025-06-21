import { supabaseAdmin } from './supabase';

/**
 * Get cached analysis result for a URL
 * @param {string} url - The URL to check for cached analysis
 * @returns {Object|null} - Cached analysis result or null if not found
 */
export async function getCachedAnalysis(url) {
  try {
    const { data, error } = await supabaseAdmin
      .from('url_analyses')
      .select('*')
      .eq('url', url)
      .single();

    if (error) {
      // If no record found, return null (this is expected)
      if (error.code === 'PGRST116') {
        return null;
      }
      // If table doesn't exist, return null (database not set up yet)
      if (error.code === '42P01') {
        console.warn('Database table not found. Please run the schema setup.');
        return null;
      }
      console.error('Error fetching cached analysis:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCachedAnalysis:', error);
    return null;
  }
}

/**
 * Store analysis result in the database
 * @param {string} url - The analyzed URL
 * @param {Object} result - The analysis result from Claude
 * @returns {boolean} - Success status
 */
export async function storeAnalysisResult(url, result) {
  try {
    const { error } = await supabaseAdmin
      .from('url_analyses')
      .upsert({
        url: url,
        risk_score: result.riskScore,
        risk_level: result.riskLevel,
        summary: result.summary,
        findings: result.findings,
        red_flags: result.redFlags,
        positive_signals: result.positiveSignals,
        analyzed_at: new Date().toISOString()
      }, {
        onConflict: 'url'
      });

    if (error) {
      // If table doesn't exist, warn but don't crash
      if (error.code === '42P01') {
        console.warn('Database table not found. Analysis will work but results won\'t be cached.');
        return false;
      }
      console.error('Error storing analysis result:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in storeAnalysisResult:', error);
    return false;
  }
}

/**
 * Get recent analysis results for dashboard/admin purposes
 * @param {number} limit - Number of results to fetch (default: 10)
 * @returns {Array} - Array of recent analysis results
 */
export async function getRecentAnalyses(limit = 10) {
  try {
    const { data, error } = await supabaseAdmin
      .from('url_analyses')
      .select('*')
      .order('analyzed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent analyses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentAnalyses:', error);
    return [];
  }
}

/**
 * Get analysis statistics
 * @returns {Object} - Statistics about analyses
 */
export async function getAnalysisStats() {
  try {
    const { data, error } = await supabaseAdmin
      .from('url_analyses')
      .select('risk_level');

    if (error) {
      console.error('Error fetching analysis stats:', error);
      return { total: 0, high: 0, medium: 0, low: 0 };
    }

    const stats = data.reduce((acc, item) => {
      acc.total++;
      acc[item.risk_level]++;
      return acc;
    }, { total: 0, high: 0, medium: 0, low: 0 });

    return stats;
  } catch (error) {
    console.error('Error in getAnalysisStats:', error);
    return { total: 0, high: 0, medium: 0, low: 0 };
  }
}
