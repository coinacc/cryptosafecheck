import { NextResponse } from 'next/server';
import { getRealTimeStats } from '../../../lib/analytics';

export async function GET() {
  try {
    const stats = await getRealTimeStats();
    
    if (!stats) {
      return NextResponse.json({ error: 'Failed to fetch real-time stats' }, { status: 500 });
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Real-time stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch real-time stats' }, { status: 500 });
  }
}
