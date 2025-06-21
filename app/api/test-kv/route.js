import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test KV connection
    const testKey = 'test-connection';
    const testValue = { message: 'KV is working!', timestamp: new Date().toISOString() };
    
    // Try to set a value
    await kv.set(testKey, testValue, { ex: 60 }); // Expire in 60 seconds
    
    // Try to get the value back
    const retrieved = await kv.get(testKey);
    
    return NextResponse.json({
      success: true,
      message: 'KV is working correctly!',
      test: {
        stored: testValue,
        retrieved: retrieved
      },
      env: {
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      env: {
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
