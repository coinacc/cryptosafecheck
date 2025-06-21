import { NextResponse } from 'next/server';
import { resetRateLimit, getClientIP } from '../../../lib/rate-limit';

export async function POST(request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({
      error: 'Not allowed',
      message: 'This endpoint is only available in development mode.'
    }, { status: 403 });
  }

  try {
    // Get client IP
    const clientIP = getClientIP(request);

    // Reset rate limits for both basic and full scan types
    await resetRateLimit(clientIP, 'basic');
    await resetRateLimit(clientIP, 'full');

    console.log(`🔄 DEV: Reset rate limits for IP: ${clientIP} (both basic and full)`);

    return NextResponse.json({
      success: true,
      message: `Rate limits reset for IP: ${clientIP} (both basic and full)`,
      ip: clientIP
    });

  } catch (error) {
    console.error('Error resetting rate limit:', error);
    return NextResponse.json({
      error: 'Reset failed',
      message: 'Unable to reset rate limit. Please try again.'
    }, { status: 500 });
  }
}
