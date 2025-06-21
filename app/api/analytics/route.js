import { NextResponse } from 'next/server';
import { getAnalytics } from '../../lib/analytics';

// Password for analytics access (you should change this!)
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD || 'admin123';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (password !== ANALYTICS_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Check if authenticated (in a real app, you'd use proper session management)
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')) || 30;
    
    // For simplicity, we'll skip auth check for GET requests
    // In production, implement proper session management
    
    const analytics = await getAnalytics(days);
    
    if (!analytics) {
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
