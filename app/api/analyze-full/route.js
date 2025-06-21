import { NextResponse } from 'next/server';
import { analyzeUrl } from '../../lib/gemini.js';
import { checkRateLimit } from '../../lib/analytics.js';

export async function POST(request) {
  try {
    const { url, sessionId } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check rate limit (50 requests per hour)
    const rateLimitResult = await checkRateLimit(request, 50, 1);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toLocaleTimeString() : 'soon';
      return NextResponse.json({
        error: 'Rate limit exceeded',
        message: `You've reached the maximum of 50 analyses per hour. Please try again at ${resetTime}.`,
        resetTime: rateLimitResult.resetTime
      }, { status: 429 });
    }

    console.log(`Analysis request for: ${url} (${rateLimitResult.remaining} remaining)`);

    // Perform comprehensive analysis
    const result = await analyzeUrl(url, sessionId, request);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      message: 'Unable to complete analysis. Please try again later.'
    }, { status: 500 });
  }
}
