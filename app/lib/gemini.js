import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCachedAnalysis, setCachedAnalysis } from './cache.js';
import { trackApiUsage } from './analytics.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite-preview-06-17",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

// Progress tracking for SSE
const progressCallbacks = new Map();

export function registerProgressCallback(sessionId, callback) {
  progressCallbacks.set(sessionId, callback);
}

export function unregisterProgressCallback(sessionId) {
  progressCallbacks.delete(sessionId);
}

function sendProgress(sessionId, message, status = 'in_progress') {
  const callback = progressCallbacks.get(sessionId);
  if (callback) {
    callback({ message, status });
  }
}

// Helper function to clean citation tags from text
function cleanCitationTags(text) {
  if (!text) return '';
  return text.replace(/\【\d+:\d+†[^\】]*\】/g, '').trim();
}

// Helper function to clean string arrays
function cleanStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => cleanCitationTags(item)).filter(item => item.length > 0);
}

// Helper function to clean sources array
function cleanSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources.map(source => ({
    name: cleanCitationTags(source.name || ''),
    url: source.url || null
  })).filter(source => source.name.length > 0);
}

// Main analysis function - comprehensive crypto project analysis
export const analyzeUrl = async (userInput, sessionId = null, request = null) => {
  const startTime = Date.now();
  let cached = false;

  // Check Supabase cache first
  const cachedResult = await getCachedAnalysis(userInput, 'full');
  if (cachedResult) {
    cached = true;
    console.log(`🎯 Cache HIT for analysis: ${userInput}`);
    
    // Track cached request
    await trackApiUsage({
      project: userInput,
      responseTime: Date.now() - startTime,
      cached: true,
      success: true,
      scanType: 'full'
    }, request);
    return cachedResult;
  }

  console.log(`🚀 Starting fresh analysis for: ${userInput} (cache miss)`);

  // Send initial progress update
  if (sessionId) {
    sendProgress(sessionId, '🔍 Starting comprehensive analysis...', 'in_progress');
  }

  // Optimized system prompt for crypto project analysis
  const prompt = `Analyze "${userInput}" as a crypto project analyst. Search for real-time data and return only JSON.

### ANALYSIS PROCESS ###
1. **IDENTIFY**: Determine if input is project name, ticker, contract address, or URL
2. **SEARCH**: Prioritize official sites → CoinGecko/CMC → GitHub → social media → regulatory sources
3. **EVALUATE**: Rate each category using search results only (not training data)
4. **RETURN**: JSON only, no other text

### RULES ###
- Bitcoin/Ethereum base layers = VERY_SAFE
- No crypto project = {"status": "not_applicable"}
- Missing data = use most conservative rating + note in explanation
- Base analysis on search results only

### RATING SCALES ###
**team_transparency**: VERIFIED → PARTIAL → PSEUDONYMOUS → ANONYMOUS → FAKE
**technical_security**: AUDITED → PARTIALLY_AUDITED → UNAUDITED → FAILED_AUDIT → BACKDOOR_DETECTED  
**legal_regulatory**: COMPLIANT → UNCLEAR → UNREGISTERED → CEASE_AND_DESIST → CRIMINAL_CHARGES
**financial_transparency**: TRANSPARENT → PARTIAL → CONCERNING → PONZI_STRUCTURE → RUG_PULL_RISK
**community_marketing**: ORGANIC → SHILLED → FAKE_FOLLOWERS → PUMP_SCHEME → CULT_LIKE
**product_delivery**: DELIVERED → DELAYED → VAPORWARE → PLAGIARIZED → IMPOSSIBLE

**safety_level**: VERY_SAFE (established, audited, verified) → SAFE (good transparency, minimal flags) → RISKY (some concerns) → DANGEROUS (clear scam indicators)
**confidence**: HIGH (ample data) → MEDIUM (partial data) → LOW (minimal data)

### JSON FORMAT ###
{
  "status": "analyzed",
  "project_name": "string",
  "project_type": "string",
  "blockchain_network": "string", 
  "token_symbol": "string|null",
  "safety_level": "VERY_SAFE|SAFE|RISKY|DANGEROUS",
  "confidence": "HIGH|MEDIUM|LOW",
  "team_transparency": "VERIFIED|PARTIAL|PSEUDONYMOUS|ANONYMOUS|FAKE",
  "team_transparency_explanation": "1-2 sentences with findings",
  "technical_security": "AUDITED|PARTIALLY_AUDITED|UNAUDITED|FAILED_AUDIT|BACKDOOR_DETECTED",
  "technical_security_explanation": "1-2 sentences with findings", 
  "legal_regulatory": "COMPLIANT|UNCLEAR|UNREGISTERED|CEASE_AND_DESIST|CRIMINAL_CHARGES",
  "legal_regulatory_explanation": "1-2 sentences with findings",
  "financial_transparency": "TRANSPARENT|PARTIAL|CONCERNING|PONZI_STRUCTURE|RUG_PULL_RISK", 
  "financial_transparency_explanation": "1-2 sentences with findings",
  "community_marketing": "ORGANIC|SHILLED|FAKE_FOLLOWERS|PUMP_SCHEME|CULT_LIKE",
  "community_marketing_explanation": "1-2 sentences with findings",
  "product_delivery": "DELIVERED|DELAYED|VAPORWARE|PLAGIARIZED|IMPOSSIBLE",
  "product_delivery_explanation": "1-2 sentences with findings",
  "exchange_listings": ["string"],
  "scam_type_indicators": ["string"],
  "community_warnings": ["string"], 
  "red_flags": ["string"],
  "positive_signals": ["string"],
  "risk_summary": "1-2 sentence summary of primary risks",
  "sources_used": [{"name":"string","url":"string|null"}]
}`;

  let response;
  let apiResult;
  let apiSuccess = true;
  let apiError = null;

  try {
    // Send AI analysis progress update
    if (sessionId) {
      sendProgress(sessionId, '🧠 AI analyzing project...', 'in_progress');
    }

    console.log('🤖 Sending prompt to Gemini for analysis...');
    console.log('📊 Prompt length:', prompt.length, 'characters');

    apiResult = await model.generateContent(prompt);
    response = apiResult.response;

    console.log('✅ Gemini response received');
    console.log('📊 Response metadata:', {
      apiResultUsageMetadata: apiResult?.usageMetadata,
      responseUsageMetadata: response?.usageMetadata,
      candidates: response?.candidates?.length || 0,
      finishReason: response?.candidates?.[0]?.finishReason,
      safetyRatings: response?.candidates?.[0]?.safetyRatings
    });
  } catch (error) {
    apiSuccess = false;
    apiError = error.message;
    console.error('🚨 Error in Gemini API call:', error);
    console.log(`❌ Analysis failed for: ${userInput}`);
    throw error;
  }

  // Parse JSON response
  let result;
  try {
    // Get text content from Gemini response
    const allTextContent = response.text();

    console.log('📝 Response length:', allTextContent?.length || 0, 'characters');
    console.log("Gemini response:", allTextContent?.substring(0, 1000) + (allTextContent?.length > 1000 ? '...' : ''));

    // Parse Gemini's JSON response
    let geminiResult;
    try {
      geminiResult = JSON.parse(allTextContent.trim());
    } catch (parseError) {
      console.log("Initial JSON parse failed, trying to extract and clean JSON...");

      // First try to remove markdown code blocks
      let cleanedText = allTextContent;
      if (cleanedText.includes('```json')) {
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      }

      // Try parsing the cleaned text
      try {
        geminiResult = JSON.parse(cleanedText.trim());
      } catch (secondParseError) {
        // Look for JSON object in the response
        const jsonRegex = /\{[\s\S]*\}/;
        const match = cleanedText.match(jsonRegex);

        if (match) {
          try {
            // Try parsing the extracted JSON directly first
            geminiResult = JSON.parse(match[0]);
          } catch (thirdParseError) {
            // If that fails, clean up the JSON string values
            let cleanedJson = match[0];

            // Fix common JSON issues in string values
            cleanedJson = cleanedJson.replace(
              /"([^"]*?)"/g,
              (match, content) => {
                // Only clean content inside string values, not keys
                if (content.includes('\n') || content.includes('\r') || content.includes('\t')) {
                  const cleaned = content
                    .replace(/\n/g, ' ')  // Replace newlines with spaces
                    .replace(/\r/g, ' ')  // Replace carriage returns with spaces
                    .replace(/\t/g, ' ')  // Replace tabs with spaces
                    .replace(/\s+/g, ' ') // Collapse multiple spaces
                    .trim();
                  return `"${cleaned}"`;
                }
                return match;
              }
            );

            try {
              geminiResult = JSON.parse(cleanedJson);
            } catch (fourthParseError) {
              console.error("Failed to parse cleaned JSON:", fourthParseError);
              console.error("Raw response:", allTextContent);
              throw new Error("Could not parse JSON from Gemini response");
            }
          }
        } else {
          // Check if response was truncated due to MAX_TOKENS
          const finishReason = response?.candidates?.[0]?.finishReason;
          if (finishReason === 'MAX_TOKENS') {
            console.log("⚠️ Response truncated due to MAX_TOKENS, attempting to fix incomplete JSON...");

            // Try to fix truncated JSON by adding missing closing braces
            let truncatedJson = cleanedText.trim();

            // Count opening and closing braces
            const openBraces = (truncatedJson.match(/\{/g) || []).length;
            const closeBraces = (truncatedJson.match(/\}/g) || []).length;
            const missingBraces = openBraces - closeBraces;

            if (missingBraces > 0) {
              // Add missing closing braces
              truncatedJson += '}' + '}'.repeat(missingBraces - 1);
              console.log(`🔧 Added ${missingBraces} missing closing braces`);

              try {
                geminiResult = JSON.parse(truncatedJson);
                console.log("✅ Successfully parsed truncated JSON after fixing");
              } catch (fixError) {
                console.error("❌ Failed to fix truncated JSON:", fixError);
                throw new Error("Response truncated and could not be repaired");
              }
            } else {
              throw new Error("Response truncated but no missing braces found");
            }
          } else {
            console.error("No JSON found in Gemini response:", allTextContent);
            throw new Error("No JSON found in Gemini response");
          }
        }
      }
    }

    // Handle "not_applicable" status for non-crypto projects
    if (geminiResult.status === "not_applicable") {
      return {
        category: "UTILITY_TOOL",
        riskScore: 0,
        riskLevel: "low",
        confidence: 95,
        summary: "This website is not a cryptocurrency/blockchain investment project requiring scam analysis.",
        findings: ["Not a cryptocurrency investment project"],
        redFlags: [],
        positiveSignals: ["Outside scope of crypto scam detection"],
        riskBreakdown: {
          technical: 0,
          team: 0,
          marketing: 0,
          legal: 0
        }
      };
    }

    // Pass through the new detailed format directly to the frontend
    result = {
      // Keep the detailed format from Gemini but clean citation tags
      ...geminiResult,

      // Clean citation tags from ALL text fields and arrays
      risk_summary: cleanCitationTags(geminiResult.risk_summary || ''),
      project_name: cleanCitationTags(geminiResult.project_name || ''),
      positive_signals: cleanStringArray(geminiResult.positive_signals || []),
      red_flags: cleanStringArray(geminiResult.red_flags || []),
      scam_type_indicators: cleanStringArray(geminiResult.scam_type_indicators || []),
      community_warnings: cleanStringArray(geminiResult.community_warnings || []),
      sources_used: cleanSources(geminiResult.sources_used || []),

      // Add legacy fields for backward compatibility
      category: geminiResult.safety_level === 'DANGEROUS' ? 'SCAM' :
                geminiResult.safety_level === 'RISKY' ? 'POTENTIAL_SCAM' : 'LEGITIMATE_PROJECT',

      riskScore: geminiResult.safety_level === 'VERY_SAFE' ? 10 :
                 geminiResult.safety_level === 'SAFE' ? 25 :
                 geminiResult.safety_level === 'RISKY' ? 65 :
                 geminiResult.safety_level === 'DANGEROUS' ? 90 : 50,

      riskLevel: geminiResult.safety_level === 'VERY_SAFE' || geminiResult.safety_level === 'SAFE' ? 'low' :
                 geminiResult.safety_level === 'RISKY' ? 'medium' : 'high',

      confidence: geminiResult.confidence === 'HIGH' ? 90 :
                  geminiResult.confidence === 'MEDIUM' ? 70 : 50,

      summary: cleanCitationTags(geminiResult.risk_summary || "Analysis completed"),

      findings: cleanStringArray([
        ...(geminiResult.positive_signals || []),
        `Project Type: ${geminiResult.project_type || 'Unknown'}`,
        `Team Transparency: ${geminiResult.team_transparency || 'Unknown'}`,
        `Audit Status: ${geminiResult.technical_security || 'Unknown'}`,
        ...(geminiResult.exchange_listings?.length > 0 ? [`Listed on: ${geminiResult.exchange_listings.join(', ')}`] : [])
      ]),

      redFlags: cleanStringArray([
        ...(geminiResult.red_flags || []),
        ...(geminiResult.scam_type_indicators || []),
        ...(geminiResult.community_warnings || [])
      ]),

      positiveSignals: cleanStringArray(geminiResult.positive_signals || []),

      riskBreakdown: {
        technical: geminiResult.safety_level === 'DANGEROUS' ? 90 : 50,
        team: geminiResult.team_transparency === 'FAKE' || geminiResult.team_transparency === 'ANONYMOUS' ? 90 : 50,
        marketing: geminiResult.scam_type_indicators?.length > 0 ? 90 : 50,
        legal: geminiResult.community_warnings?.length > 0 ? 90 : 50
      }
    };

    // Validate response structure
    if (!result.summary) {
      throw new Error("Invalid response structure from Gemini");
    }

  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw response:", response?.text?.() || 'No response text');

    console.log(`❌ Analysis parsing failed for: ${userInput}`);

    // Fallback response
    result = {
      category: "LEGITIMATE_PROJECT",
      riskScore: 50,
      riskLevel: "medium",
      confidence: 30,
      summary: "Unable to analyze this project due to a technical issue. Please try again later.",
      findings: ["Analysis temporarily unavailable"],
      redFlags: [],
      positiveSignals: [],
      riskBreakdown: {
        technical: 50,
        team: 50,
        marketing: 50,
        legal: 50
      }
    };
  }

  // Cache the analysis result in Supabase
  await setCachedAnalysis(userInput, result, 'full');

  // Calculate cost using official Gemini 2.5 Flash Lite pricing
  // Try both response and apiResult objects for usageMetadata
  const inputTokens = response?.usageMetadata?.promptTokenCount ||
                     apiResult?.usageMetadata?.promptTokenCount || 0;
  const outputTokens = response?.usageMetadata?.candidatesTokenCount ||
                      apiResult?.usageMetadata?.candidatesTokenCount || 0;

  // Official pricing: $0.10 per 1M input tokens, $0.40 per 1M output tokens
  let calculatedCost = null;
  if (inputTokens > 0 || outputTokens > 0) {
    const inputCost = (inputTokens / 1000000) * 0.10;
    const outputCost = (outputTokens / 1000000) * 0.40;
    calculatedCost = inputCost + outputCost;

    console.log(`💰 Cost calculation:`, {
      inputTokens,
      outputTokens,
      inputCost: inputCost.toFixed(6),
      outputCost: outputCost.toFixed(6),
      totalCost: calculatedCost.toFixed(6)
    });
  }

  // Track API usage with calculated cost
  await trackApiUsage({
    project: userInput,
    model: "gemini-2.5-flash-lite-preview-06-17",
    inputTokens: inputTokens,
    outputTokens: outputTokens,
    realCostUSD: calculatedCost, // Use calculated cost based on official pricing
    responseTime: Date.now() - startTime,
    cached: cached,
    success: apiSuccess,
    error: apiError,
    scanType: 'full',
    analysisResult: apiSuccess ? result : null // Store analysis result for caching
  }, request);

  console.log(`✅ Analysis completed for: ${userInput}`);

  // Send completion progress updates
  if (sessionId) {
    sendProgress(sessionId, '✅ Analysis complete!', 'complete');
  }

  return result;
};
