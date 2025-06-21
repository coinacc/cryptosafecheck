import { NextResponse } from 'next/server';
import { analyzeUrl } from '../../lib/gemini.js';

export async function POST(request) {
  try {
    const { url, sessionId } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(`Analysis request for: ${url}`);

    // Perform comprehensive analysis (no rate limits, no pre-checks)
    const result = await analyzeUrl(url, sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      message: 'Unable to complete analysis. Please try again later.'
    }, { status: 500 });
  }
}
