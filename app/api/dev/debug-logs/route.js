import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const debugLogPath = path.join(process.cwd(), 'debug.log');
    
    // Check if log file exists
    if (!fs.existsSync(debugLogPath)) {
      return NextResponse.json({ 
        logs: [], 
        message: 'No debug log file found. Run some analyses to generate logs.' 
      });
    }

    // Read the log file
    const logContent = fs.readFileSync(debugLogPath, 'utf-8');
    
    // Parse log entries (each line is a JSON object)
    const logLines = logContent.trim().split('\n').filter(line => line.trim());
    const logs = [];

    for (const line of logLines) {
      try {
        // Extract JSON from the log line format: [timestamp] TYPE: {json}
        const jsonStart = line.indexOf(': ') + 2;
        const jsonStr = line.substring(jsonStart);
        const logEntry = JSON.parse(jsonStr);
        logs.push(logEntry);
      } catch (parseError) {
        // Skip malformed log lines
        console.error('Failed to parse log line:', parseError);
      }
    }

    // Return the most recent 50 log entries
    const recentLogs = logs.slice(-50).reverse();

    return NextResponse.json({
      logs: recentLogs,
      totalEntries: logs.length,
      message: `Showing ${recentLogs.length} most recent log entries`
    });

  } catch (error) {
    console.error('Failed to read debug logs:', error);
    return NextResponse.json({
      error: 'Failed to read debug logs',
      message: error.message
    }, { status: 500 });
  }
}

export async function DELETE() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const debugLogPath = path.join(process.cwd(), 'debug.log');
    
    if (fs.existsSync(debugLogPath)) {
      fs.unlinkSync(debugLogPath);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Debug log cleared' 
    });

  } catch (error) {
    console.error('Failed to clear debug logs:', error);
    return NextResponse.json({
      error: 'Failed to clear debug logs',
      message: error.message
    }, { status: 500 });
  }
}