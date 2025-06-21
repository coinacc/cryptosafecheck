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
export const analyzeUrl = async (userInput, sessionId = null) => {
  const startTime = Date.now();
  let cached = false;

  // Check KV cache first
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
    });
    return cachedResult;
  }

  console.log(`🚀 Starting fresh analysis for: ${userInput} (cache miss)`);

  // Send initial progress update
  if (sessionId) {
    sendProgress(sessionId, '🔍 Starting comprehensive analysis...', 'in_progress');
  }

  // Create the system prompt with your new specification
  const prompt = `### ROLE ###
You are an expert crypto project analyst. Your sole purpose is to receive a single piece of user input, independently gather all necessary real-time information about it using your web search capabilities, and return a structured JSON analysis.

### CORE TASK (Step-by-Step) ###
1. **IDENTIFY:** First, analyze the "${userInput}" to determine what it is. It could be a project name (e.g., "Chainlink"), a token ticker ("LINK"), a token contract address ("0x514910771af9ca656af840dff83e8264ecf986ca"), a website URL, or something else. Make your best determination.
2. **SEARCH:** Second, based on your identification, perform comprehensive web searches. You MUST actively search for information covering all analysis categories: team identity and reputation, technical security audits, legal and regulatory status, tokenomics and financial health, community sentiment and marketing tactics, and product development status.
3. **ANALYZE:** Third, synthesize the information you gathered from your search. Critically evaluate the project against the detailed criteria and definitions provided below. Your analysis must be based *only* on the information you find.
4. **FORMAT:** Finally, compile your complete analysis into the specified JSON format. You MUST return ONLY the raw JSON object as your final response, with no other text, greetings, or explanations.

### USER INPUT ###
"userInput": "${userInput}"

### CRITERIA & DEFINITIONS ###

**Primary Rules:**
1. **Data Source:** Your analysis MUST be based on the information you gather from your web search. Do not use your internal training data as a primary source for project-specific facts.
2. **Base Layers:** The Bitcoin (BTC) and Ethereum (ETH) base layer protocols themselves are considered VERY_SAFE. This does not apply to tokens, dApps, or other projects built on top of them.
3. **Non-Crypto:** If your search confirms the input is not a crypto project, you must return: {"status": "not_applicable"}.
4. **Missing Information:** If your search cannot find reliable information for a specific category, you MUST select the most conservative/negative enum (e.g., ANONYMOUS, UNAUDITED, UNCLEAR) and state in the explanation that information could not be found. This is a critical rule.

**Category Definitions:**
- **team_transparency:**
    - VERIFIED: Team members are public, with verifiable professional identities (e.g., LinkedIn).
    - PARTIAL: Some team members are public, but key leadership or developers are not.
    - PSEUDONYMOUS: Team uses consistent online identities, but real-world identities are unknown.
    - ANONYMOUS: Team identities are completely unknown.
    - FAKE: Evidence suggests team identities are stolen or fabricated.
- **technical_security:**
    - AUDITED: All key smart contracts have been audited by reputable third-party firms; reports are public.
    - PARTIALLY_AUDITED: Some contracts are audited, or the audit is from a low-reputation firm.
    - UNAUDITED: No evidence of a third-party security audit.
    - FAILED_AUDIT: An audit revealed critical, unpatched vulnerabilities.
    - BACKDOOR_DETECTED: Analysis reveals malicious code or significant centralization risks.
    - OPEN_SOURCE: The codebase is public and verifiable on a platform like GitHub.
- **legal_regulatory:**
    - COMPLIANT: Appears to be registered and compliant in a known, major jurisdiction.
    - UNCLEAR: The legal status or jurisdiction is not clearly stated (this is the default).
    - UNREGISTERED: Operates in a jurisdiction requiring registration but has not done so.
    - CEASE_AND_DESIST: Has received a cease-and-desist order from a regulatory body.
    - SEC_ACTION: Targeted by the SEC as an unregistered security.
    - CRIMINAL_CHARGES: Founders or the project entity face criminal charges.
- **financial_transparency:**
    - TRANSPARENT: Tokenomics, treasury, and allocations are clearly detailed and verifiable.
    - PARTIAL: Some financial details are provided, but significant information is opaque.
    - CONCERNING: Tokenomics show high whale concentration or large, unlocked team/VC allocations.
    - PONZI_STRUCTURE: Value proposition relies on new investors paying earlier investors.
    - RUG_PULL_RISK: High-risk indicators like unlocked liquidity or malicious token contract.
    - WASH_TRADING: Evidence of fake trading volume on exchanges.
- **community_marketing:**
    - ORGANIC: Community growth appears genuine with healthy discussion.
    - SHILLED: Marketing relies heavily on paid influencers, bots, or hype.
    - FAKE_FOLLOWERS: Social media shows clear signs of purchased followers/engagement.
    - PUMP_SCHEME: Community is focused on coordinated price manipulation.
    - CULT_LIKE: Community is hostile to any criticism or questioning.
    - DEAD: No significant community activity for an extended period.
- **product_delivery:**
    - DELIVERED: The main product is live and functional on a mainnet.
    - DELAYED: A history of significantly missing roadmap deadlines.
    - VAPORWARE: No functional product exists despite extensive marketing.
    - PLAGIARIZED: The project's code or whitepaper is a direct copy of another project.
    - IMPOSSIBLE: The stated goals are technically or theoretically impossible.

**Safety Level & Confidence Definitions:**
- **Safety Level:**
    - VERY_SAFE: Established, regulated, fully verified team, and fully audited.
    - SAFE: Good transparency, has security audits, and minimal red flags.
    - RISKY: Several concerning elements like an anonymous team, no audit, or is highly speculative.
    - DANGEROUS: Clear scam indicators, regulatory action, or malicious intent.
- **Confidence Score:**
    - HIGH: Your search returned ample, high-quality, and consistent data across most categories.
    - MEDIUM: Your search returned data for some categories but it was sparse, low-quality, or contradictory in others.
    - LOW: Your search returned very little or no reliable data. The analysis is based on weak signals.

### OUTPUT FORMAT ###
Return ONLY the raw JSON object below. Do not add any text before or after the JSON. Ensure the JSON is perfectly structured and valid.

{
  "status": "analyzed",
  "project_name": "string",
  "project_type": "string (e.g., Layer 1, DeFi, Meme Coin, NFT Project)",
  "blockchain_network": "string (e.g., Ethereum, Solana, Native)",
  "token_symbol": "string|null",
  "safety_level": "VERY_SAFE|SAFE|RISKY|DANGEROUS",
  "confidence": "HIGH|MEDIUM|LOW",
  "team_transparency": "enum",
  "team_transparency_explanation": "Brief explanation based on the criteria.",
  "technical_security": "enum",
  "technical_security_explanation": "Brief explanation based on the criteria.",
  "legal_regulatory": "enum",
  "legal_regulatory_explanation": "Brief explanation based on the criteria.",
  "financial_transparency": "enum",
  "financial_transparency_explanation": "Brief explanation based on the criteria.",
  "community_marketing": "enum",
  "community_marketing_explanation": "Brief explanation based on the criteria.",
  "product_delivery": "enum",
  "product_delivery_explanation": "Brief explanation based on the criteria.",
  "exchange_listings": ["string"],
  "scam_type_indicators": ["string (e.g., Ponzi Structure, Rug Pull Risk, Plagiarized Whitepaper)"],
  "community_warnings": ["string (Direct quotes or summaries of warnings found during search)"],
  "red_flags": ["string (e.g., Anonymous team, No security audit, High whale concentration)"],
  "positive_signals": ["string (e.g., Doxxed team with strong background, Top-tier VC funding, CertiK audit)"],
  "risk_summary": "A concise, 1-2 sentence summary of the primary risks associated with this project.",
  "sources_used": [{"name":"string (e.g., Etherscan Contract Page, CoinGecko, Project's Official Blog)","url":"string|null"}]
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

  // Cache the analysis result in KV
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
    scanType: 'full'
  });

  console.log(`✅ Analysis completed for: ${userInput}`);

  // Send completion progress updates
  if (sessionId) {
    sendProgress(sessionId, '✅ Analysis complete!', 'complete');
  }

  return result;
};
