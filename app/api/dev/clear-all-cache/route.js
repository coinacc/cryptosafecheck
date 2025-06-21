import { kv } from '@vercel/kv';

export async function GET(request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({
      error: 'Not allowed',
      message: 'This endpoint is only available in development mode.'
    }, { status: 403 });
  }

  try {
    console.log('🗑️ DEV: Starting comprehensive cache clearing...');

    // Define all possible cache key patterns
    const cachePatterns = [
      'aicryptocheck:*',           // Legacy format
      'aicryptocheck:full:*',      // Full analysis cache
      'aicryptocheck:basic:*',     // Basic analysis cache
      'precheck:*',                // Pre-check cache
      'rate_limit:*',              // Rate limiting cache
      'analytics:*',               // Analytics cache
      'search:*',                  // Search cache
      'gemini:*',                  // Gemini response cache
    ];

    // Collect all keys from all patterns
    const allKeysPromises = cachePatterns.map(pattern => kv.keys(pattern));
    const allKeysArrays = await Promise.all(allKeysPromises);

    // Flatten and deduplicate
    const allKeys = [...new Set(allKeysArrays.flat())];

    console.log(`🗑️ DEV: Found ${allKeys.length} total cache keys across all patterns`);
    console.log(`🗑️ DEV: Cache breakdown:`, {
      total: allKeys.length,
      patterns: cachePatterns.map((pattern, i) => ({
        pattern,
        count: allKeysArrays[i].length
      }))
    });

    if (allKeys.length === 0) {
      console.log('🗑️ DEV: No cache keys found to clear');
      return Response.json({
        success: true,
        message: 'No cached items found',
        cleared: 0,
        patterns: cachePatterns
      });
    }

    // Batch delete for efficiency (KV supports batch operations)
    console.log(`🗑️ DEV: Starting batch deletion of ${allKeys.length} keys...`);

    const batchSize = 50; // Process in batches to avoid overwhelming KV
    const batches = [];
    for (let i = 0; i < allKeys.length; i += batchSize) {
      batches.push(allKeys.slice(i, i + batchSize));
    }

    let totalDeleted = 0;
    const failedKeys = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🗑️ DEV: Processing batch ${i + 1}/${batches.length} (${batch.length} keys)`);

      // Delete batch in parallel
      const deletePromises = batch.map(async (key) => {
        try {
          const result = await kv.del(key);
          if (result > 0) {
            totalDeleted++;
            console.log(`🗑️ DEV: ✅ Deleted ${key}`);
          } else {
            console.log(`🗑️ DEV: ⚠️ Key not found: ${key}`);
          }
          return { key, success: result > 0 };
        } catch (error) {
          console.error(`🗑️ DEV: ❌ Failed to delete ${key}:`, error);
          failedKeys.push(key);
          return { key, success: false, error: error.message };
        }
      });

      await Promise.all(deletePromises);

      // Small delay between batches to be nice to KV
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Wait for KV propagation
    console.log('🗑️ DEV: Waiting for cache propagation...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify deletion by checking remaining keys
    const verificationPromises = cachePatterns.map(pattern => kv.keys(pattern));
    const remainingKeysArrays = await Promise.all(verificationPromises);
    const remainingKeys = remainingKeysArrays.flat();

    console.log(`🗑️ DEV: Verification complete. Remaining keys: ${remainingKeys.length}`);

    // Final cleanup for any remaining keys
    if (remainingKeys.length > 0) {
      console.log(`🗑️ DEV: Performing final cleanup of ${remainingKeys.length} remaining keys...`);
      const finalCleanupPromises = remainingKeys.map(key => kv.del(key));
      await Promise.all(finalCleanupPromises);
    }

    const result = {
      success: true,
      message: `Successfully cleared cache - ${totalDeleted} items deleted`,
      cleared: totalDeleted,
      totalFound: allKeys.length,
      failedKeys: failedKeys,
      remainingAfterCleanup: remainingKeys.length,
      patterns: cachePatterns
    };

    console.log('🗑️ DEV: Cache clearing completed:', result);
    return Response.json(result);

  } catch (error) {
    console.error('🗑️ DEV: Error during cache clearing:', error);
    return Response.json({
      success: false,
      error: 'Failed to clear cache',
      details: error.message
    }, { status: 500 });
  }
}
