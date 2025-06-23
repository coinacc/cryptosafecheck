import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCachedAnalysis, setCachedAnalysis } from './cache.js';
import { trackApiUsage } from './analytics.js';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite-preview-06-17",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

// Debug logging (development only)
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';
const debugLogPath = path.join(process.cwd(), 'debug.log');

function debugLog(type, data) {
  if (!isDevelopment) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    ...data
  };
  
  const logLine = `[${timestamp}] ${type}: ${JSON.stringify(logEntry, null, 2)}\n`;
  
  try {
    fs.appendFileSync(debugLogPath, logLine);
  } catch (error) {
    console.error('Failed to write debug log:', error);
  }
}

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


// Main analysis function - comprehensive crypto project analysis
export const analyzeUrl = async (userInput, sessionId = null, request = null) => {
  const startTime = Date.now();
  let cached = false;

  // Debug log the analysis start
  debugLog('ANALYSIS_START', {
    userInput,
    sessionId,
    timestamp: startTime
  });

  // Check Supabase cache first
  const cachedResult = await getCachedAnalysis(userInput, 'full');
  if (cachedResult) {
    cached = true;
    console.log(`🎯 Cache HIT for analysis: ${userInput}`);
    
    debugLog('CACHE_HIT', {
      userInput,
      result: cachedResult
    });
    
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
  const prompt = `Analyze "${userInput}" as a crypto project analyst. You have web search enabled - use it immediately. Return only JSON analysis.

**CRITICAL**: Do NOT return "searching" status or ask for permission. Execute web searches NOW and provide analysis.

### ANALYSIS PROCESS ###
1. **CONTRACT ADDRESS CHECK**: If input matches EXACT contract address patterns, return not_supported:
   
   - **Ethereum/BSC/Polygon**: EXACTLY "0x" followed by EXACTLY 40 hexadecimal characters
   - **Solana**: 32-44 character base58 string using ONLY: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
   - **Bitcoin**: Starts with "1", "3", or "bc1" followed by specific patterns
   
   If contract address, return: {"status": "contract_address_not_supported", "message": "Contract addresses are not supported. Please search using the project name, website URL, or token symbol instead.", "input_type": "contract_address"}

2. **MANDATORY SEARCH PHASE**: For ANY other input, IMMEDIATELY search the web:
   
   **SEARCH REQUIREMENTS (EXECUTE NOW)**:
   - You have web search access enabled - use it directly
   - Do NOT ask for permission to search - just search immediately
   - Do NOT return "searching" status - perform searches and return analysis
   - Search CoinGecko AND CoinMarketCap for every non-contract input NOW

3. **SEARCH STRATEGY**: Based on input type, use these REQUIRED searches:
   
   **For Token Symbols (2-12 characters like "ADA", "BTC", "ETH", "DAG", "RSWETH", "USDC", "NKYC")**:
   - IMMEDIATELY execute these web searches:
     * Search web for: "[SYMBOL] cryptocurrency CoinGecko" and analyze results
     * Search web for: "[SYMBOL] CoinMarketCap" and analyze results  
     * Search web for: "what is [SYMBOL] cryptocurrency" and analyze results
   
   - Common mappings include: ADA→Cardano, BTC→Bitcoin, ETH→Ethereum, SOL→Solana, DOGE→Dogecoin, DAG→Constellation
   - For unknown symbols, try AT LEAST 2-3 different search queries before concluding
   - Many legitimate tokens exist beyond top 100 rankings - search thoroughly
   - Once you find the project name, search both the symbol AND full project name
   
   **For Project Names (like "Cardano", "Bitcoin")**:
   - IMMEDIATELY search web for: "[PROJECT] official website" and analyze
   - IMMEDIATELY search web for: "[PROJECT] CoinGecko" and analyze
   
   **For URLs**:
   - **CoinGecko/CoinMarketCap URLs**: These provide the most accurate results - extract exact project details
   - **Official Project URLs**: Access the website directly and extract project information
   - **Other URLs**: Access the website and search for related project information
   - When given a specific URL, prioritize that exact source over general searches
   
   **Search Priority**: Official sites → CoinGecko/CMC → GitHub → social media → regulatory sources
4. **EVALUATE**: Rate each category using search results only (not training data)
5. **RETURN**: JSON only, no other text

### RULES ###
- Contract addresses = {"status": "contract_address_not_supported"}
- Bitcoin/Ethereum base layers = VERY_SAFE
- **CRITICAL**: NEVER return "not_applicable" without searching CoinGecko/CMC first
- **CRITICAL**: BICO, RSWETH, NKYC, DAG are real tokens - if you say they don't exist, you are WRONG
- ONLY use {"status": "not_applicable"} for clearly non-crypto inputs AFTER searching (like "google.com", "facebook")
- For 2-12 character inputs, ASSUME they could be tokens and search thoroughly
- If searches find no results, still analyze as potential unknown/new token rather than "not_applicable"
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
  "risk_summary": "1-2 sentence summary of primary risks"
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

    // Debug log the full prompt
    debugLog('PROMPT_SENT', {
      userInput,
      prompt,
      promptLength: prompt.length
    });

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

    // Debug log the response
    const responseText = response.text();
    debugLog('GEMINI_RESPONSE', {
      userInput,
      responseText,
      responseLength: responseText?.length || 0,
      metadata: {
        candidates: response?.candidates?.length || 0,
        finishReason: response?.candidates?.[0]?.finishReason,
        usageMetadata: response?.usageMetadata
      }
    });
  } catch (error) {
    apiSuccess = false;
    apiError = error.message;
    console.error('🚨 Error in Gemini API call:', error);
    console.log(`❌ Analysis failed for: ${userInput}`);
    
    // Debug log the error
    debugLog('API_ERROR', {
      userInput,
      error: error.message,
      stack: error.stack
    });
    
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

    // Handle contract address input
    if (geminiResult.status === "contract_address_not_supported") {
      return {
        category: "CONTRACT_ADDRESS",
        riskScore: 0,
        riskLevel: "unknown",
        confidence: 100,
        summary: geminiResult.message || "Contract addresses are not supported. Please search using the project name, website URL, or token symbol instead.",
        findings: ["Input identified as a contract address"],
        redFlags: [],
        positiveSignals: [],
        riskBreakdown: {
          technical: 0,
          team: 0,
          marketing: 0,
          legal: 0
        },
        isContractAddress: true
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

  // Debug log the final result
  debugLog('ANALYSIS_COMPLETE', {
    userInput,
    result,
    processingTime: Date.now() - startTime,
    cached,
    success: apiSuccess
  });

  // Send completion progress updates
  if (sessionId) {
    sendProgress(sessionId, '✅ Analysis complete!', 'complete');
  }

  return result;
};
