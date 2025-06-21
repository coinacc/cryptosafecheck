import { clearCachedAnalysis } from '../../../lib/cache.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return Response.json({ error: 'Key parameter required' }, { status: 400 });
    }

    // Use the proper cache clearing function
    await clearCachedAnalysis(key);

    console.log(`🗑️ DEV: Cleared cache for key: ${key}`);

    return Response.json({
      success: true,
      message: `Cache cleared for: ${key}`
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return Response.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}
