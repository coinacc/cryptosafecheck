import { supabaseAdmin } from './supabase';
import crypto from 'crypto';

// Cache configuration
const CACHE_TTL_HOURS = 24; // 24 hours

/**
 * Generate a cache key for a given URL/input
 */
function generateCacheKey(input, scanType = 'full') {
  // Normalize the input (lowercase, trim)
  const normalized = input.toLowerCase().trim();
  
  // Create a hash for consistent key generation
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  
  return `${scanType}:${hash}`;
}

/**
 * Get cached analysis result from Supabase
 */
export async function getCachedAnalysis(input, scanType = 'full') {
  try {
    const cacheKey = generateCacheKey(input, scanType);
    const cutoffTime = new Date(Date.now() - (CACHE_TTL_HOURS * 60 * 60 * 1000));

    // Query Supabase for cached result
    const { data, error } = await supabaseAdmin
      .from('analytics_records')
      .select('*')
      .eq('project', input)
      .eq('scan_type', scanType)
      .eq('success', true)
      .eq('cached', false) // Get original analysis, not cached hits
      .gte('timestamp', cutoffTime.toISOString())
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.log(`Cache MISS for: ${input} (${scanType})`);
      return null;
    }

    // Check if we have the full analysis result stored
    // For now, return null to force fresh analysis
    // TODO: Store full analysis results in a separate table if needed
    console.log(`Cache data found but returning MISS to ensure fresh analysis: ${input} (${scanType})`);
    return null;

  } catch (error) {
    console.error('Cache read error:', error);
    return null; // Fail gracefully
  }
}

/**
 * Store analysis result - handled by analytics tracking
 * Analysis results are now tracked via analytics_records table
 */
export async function setCachedAnalysis(input, result, scanType = 'full') {
  try {
    // Analysis results are automatically stored via trackApiUsage
    // This function is kept for compatibility but doesn't need to do anything
    console.log(`Analysis stored via analytics tracking for: ${input} (${scanType})`);
  } catch (error) {
    console.error('Cache write error:', error);
    // Don't throw - caching is optional
  }
}

/**
 * Clear cache for a specific input (for development)
 */
export async function clearCachedAnalysis(input) {
  try {
    // In development, we could delete analytics records for this input
    // But for now, we'll keep all analytics data
    console.log(`Cache clear requested for: ${input} (keeping analytics data)`);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const { count, error } = await supabaseAdmin
      .from('analytics_records')
      .select('*', { count: 'exact', head: true })
      .eq('success', true);

    if (error) {
      console.error('Cache stats error:', error);
      return { error: 'Unable to fetch cache stats' };
    }

    return {
      totalAnalysisRecords: count || 0,
      ttlHours: CACHE_TTL_HOURS,
      storage: 'supabase'
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { error: 'Unable to fetch cache stats' };
  }
}