import { resetRateLimit } from '../../../lib/analytics';

export async function POST(request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({
      error: 'Not allowed',
      message: 'This endpoint is only available in development mode.'
    }, { status: 403 });
  }

  try {
    console.log('🔄 DEV: Resetting rate limit for current IP...');

    const success = await resetRateLimit(request);

    if (success) {
      console.log('✅ DEV: Rate limit reset successfully');
      return Response.json({
        success: true,
        message: 'Rate limit reset successfully for your IP'
      });
    } else {
      console.log('❌ DEV: Failed to reset rate limit');
      return Response.json({
        success: false,
        message: 'Failed to reset rate limit'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('🔄 DEV: Error resetting rate limit:', error);
    return Response.json({
      success: false,
      error: 'Failed to reset rate limit',
      details: error.message
    }, { status: 500 });
  }
}