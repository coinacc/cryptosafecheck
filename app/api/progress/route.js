import { NextResponse } from 'next/server';
import { setProgressCallback, removeProgressCallback } from '../../lib/gemini';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get('analysis_id');

  if (!analysisId) {
    return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      console.log(`📡 Starting SSE connection for analysis: ${analysisId}`);

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        step: '🔄 Initializing comprehensive analysis...',
        status: 'in_progress',
        timestamp: new Date().toISOString()
      })}\n\n`));

      // Complete initialization after a brief moment
      setTimeout(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          step: '🔄 Initializing comprehensive analysis...',
          status: 'complete',
          timestamp: new Date().toISOString()
        })}\n\n`));
      }, 500);

      // Set up progress callback
      const progressCallback = (progress) => {
        console.log(`📡 Sending progress update for ${analysisId}:`, progress);
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(progress)}\n\n`));
        } catch (error) {
          console.error('Error sending progress update:', error);
        }
      };

      setProgressCallback(analysisId, progressCallback);

      // Clean up when connection closes
      const cleanup = () => {
        console.log(`📡 Cleaning up SSE connection for analysis: ${analysisId}`);
        removeProgressCallback(analysisId);
      };

      // Set up cleanup on abort
      request.signal?.addEventListener('abort', cleanup);

      // Auto-cleanup after 10 minutes
      setTimeout(() => {
        console.log(`📡 Auto-cleanup SSE connection for analysis: ${analysisId}`);
        cleanup();
        try {
          controller.close();
        } catch (error) {
          // Connection might already be closed
        }
      }, 10 * 60 * 1000);
    },

    cancel() {
      console.log(`📡 SSE connection cancelled for analysis: ${analysisId}`);
      removeProgressCallback(analysisId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}
