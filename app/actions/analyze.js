'use server';

import { analyzeUrl as geminiAnalyzeUrl } from '../lib/gemini';

// Preloaded results for common domains (to provide instant responses)
const PRELOADED_RESULTS = {
  'https://bitcoin.org': {
    category: 'UTILITY_TOOL',
    riskScore: 5,
    riskLevel: 'low',
    confidence: 98,
    summary: 'Bitcoin.org is the official Bitcoin protocol documentation website - not a scam detection target.',
    findings: [
      'Official Bitcoin protocol documentation site',
      'Well-established and legitimate cryptocurrency resource'
    ],
    redFlags: [],
    positiveSignals: [
      'Official protocol website with transparent purpose'
    ],
    riskBreakdown: {
      technical: 5,
      team: 3,
      marketing: 8,
      legal: 10
    }
  },
  'https://ethereum.org': {
    category: 'UTILITY_TOOL',
    riskScore: 8,
    riskLevel: 'low',
    confidence: 96,
    summary: 'Ethereum.org is the official Ethereum Foundation documentation website - not a scam detection target.',
    findings: [
      'Official Ethereum protocol documentation site',
      'Well-established blockchain platform resource'
    ],
    redFlags: [],
    positiveSignals: [
      'Official protocol website with transparent purpose'
    ],
    riskBreakdown: {
      technical: 3,
      team: 5,
      marketing: 12,
      legal: 15
    }
  },
  'https://coinbase.com': {
    category: 'UTILITY_TOOL',
    riskScore: 15,
    riskLevel: 'low',
    confidence: 94,
    summary: 'Coinbase is a well-established, publicly traded cryptocurrency exchange - not a scam detection target.',
    findings: [
      'Publicly traded company with regulatory compliance',
      'Well-established cryptocurrency exchange service'
    ],
    redFlags: [],
    positiveSignals: [
      'Public company with transparent operations'
    ],
    riskBreakdown: {
      technical: 10,
      team: 8,
      marketing: 20,
      legal: 5
    }
  }
};

export async function analyzeUrl(url) {
  try {
    // No URL validation needed - we support both URLs and project names

    // Check preloaded results first for instant response
    if (PRELOADED_RESULTS[url]) {
      console.log('Using preloaded result for:', url);
      return PRELOADED_RESULTS[url];
    }

    // Get analysis from Gemini (always fresh for full analysis)
    const result = await geminiAnalyzeUrl(url);

    // Analysis results are cached in Supabase via analytics tracking

    return result;
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw new Error('Failed to analyze URL');
  }
}