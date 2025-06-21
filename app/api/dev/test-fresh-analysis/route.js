import { analyzeUrl } from '../../../lib/gemini';

export async function GET(request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({
      error: 'Not allowed',
      message: 'This endpoint is only available in development mode.'
    }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project') || 'SafeMoon';
    
    console.log(`🧪 DEV: Running analysis for: ${project} (always fresh - no caching)`);

    // Full analysis is always fresh (no caching)
    const result = await analyzeUrl(project);
    
    return Response.json({
      success: true,
      message: `Analysis completed for ${project} (always fresh)`,
      project: project,
      red_flags_count: result.red_flags?.length || 0,
      community_warnings_count: result.community_warnings?.length || 0,
      caching: 'Disabled for full analysis',
      result: result
    });
  } catch (error) {
    console.error('Error running fresh analysis:', error);
    return Response.json({ error: 'Failed to run fresh analysis' }, { status: 500 });
  }
}
