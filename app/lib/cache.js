import { kv } from '@vercel/kv';
import crypto from 'crypto';

// Cache configuration
const CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds
const CACHE_PREFIX = 'aicryptocheck:';

/**
 * Generate a cache key for a given URL/input
 */
function generateCacheKey(input, scanType = 'full') {
  // Normalize the input (lowercase, trim)
  const normalized = input.toLowerCase().trim();

  // Create a hash for consistent key generation
  const hash = crypto.createHash('md5').update(normalized).digest('hex');

  return `${CACHE_PREFIX}${scanType}:${hash}`;
}

/**
 * Get cached analysis result
 */
export async function getCachedAnalysis(input, scanType = 'full') {
  try {
    const cacheKey = generateCacheKey(input, scanType);
    const cached = await kv.get(cacheKey);

    if (cached) {
      console.log(`Cache HIT for: ${input} (${scanType})`);
      console.log(`🔍 Cached data red_flags count: ${cached.red_flags?.length || 0}`);
      console.log(`🔍 Cached data community_warnings count: ${cached.community_warnings?.length || 0}`);
      console.log(`🔍 Cached at: ${cached._cachedAt}`);
      return cached;
    }

    console.log(`Cache MISS for: ${input} (${scanType})`);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null; // Fail gracefully
  }
}

/**
 * Store analysis result in cache
 */
export async function setCachedAnalysis(input, result, scanType = 'full') {
  try {
    const cacheKey = generateCacheKey(input, scanType);

    // Add cache metadata
    const cacheData = {
      ...result,
      _cached: true,
      _cachedAt: new Date().toISOString(),
      _input: input,
      _scanType: scanType
    };

    await kv.set(cacheKey, cacheData, { ex: CACHE_TTL });
    console.log(`Cached analysis for: ${input} (${scanType})`);
  } catch (error) {
    console.error('Cache write error:', error);
    // Don't throw - caching is optional
  }
}

/**
 * Clear cache for a specific input (useful for debugging)
 */
export async function clearCachedAnalysis(input) {
  try {
    const cacheKey = generateCacheKey(input);
    await kv.del(cacheKey);
    console.log(`Cleared cache for: ${input}`);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Get cache statistics (useful for monitoring)
 */
export async function getCacheStats() {
  try {
    const keys = await kv.keys(`${CACHE_PREFIX}*`);
    return {
      totalCachedItems: keys.length,
      cachePrefix: CACHE_PREFIX,
      ttl: CACHE_TTL
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { error: 'Unable to fetch cache stats' };
  }
}
