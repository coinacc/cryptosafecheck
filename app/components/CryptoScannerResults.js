import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, ExternalLink, Clock, Users, FileText, TrendingUp, ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

const CryptoScannerResults = ({ result, onAnalyzeAgain, isAnalyzing, onRefreshAnalysis }) => {
  // State for expandable sections
  const [redFlagsExpanded, setRedFlagsExpanded] = useState(false);
  const [positiveSignalsExpanded, setPositiveSignalsExpanded] = useState(false);

  // Helper function to format text by replacing underscores with spaces and capitalizing
  const formatText = (text) => {
    if (!text) return text;
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Tooltip component for help icons
  const HelpTooltip = ({ children, explanation }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="cursor-help"
        >
          {children}
        </div>
        {showTooltip && (
          <div className="absolute z-10 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-2 left-6 transform -translate-y-full">
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            {explanation}
          </div>
        )}
      </div>
    );
  };

  // Get AI-generated explanations for trust indicators
  const getAIExplanation = (field) => {
    const explanationField = `${field}_explanation`;
    return result[explanationField] || null;
  };

  // Get explanation for safety levels
  const getSafetyLevelExplanation = (level) => {
    const explanations = {
      'VERY_SAFE': 'This project shows strong positive indicators across all trust categories with minimal risk factors.',
      'SAFE': 'This project appears legitimate with good trust indicators, though some minor concerns may exist.',
      'RISKY': 'This project has concerning elements that warrant caution. Proceed with extreme care and do your own research.',
      'DANGEROUS': 'This project shows multiple red flags indicating high scam risk. Strong recommendation to avoid.'
    };
    return explanations[level] || 'Overall risk assessment based on comprehensive analysis.';
  };
  const getSafetyColor = (level) => {
    switch(level) {
      case 'VERY_SAFE': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800';
      case 'SAFE': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800';
      case 'RISKY': return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800';
      case 'DANGEROUS': return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      default: return 'text-trust-600 bg-trust-50 border-trust-200 dark:text-trust-400 dark:bg-trust-800 dark:border-trust-700';
    }
  };

  const getSafetyIcon = (level) => {
    switch(level) {
      case 'VERY_SAFE': return <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'SAFE': return <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'RISKY': return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'DANGEROUS': return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      default: return <Info className="w-6 h-6 text-trust-600 dark:text-trust-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      // Green - Good/Safe
      case 'VERIFIED': case 'AUDITED': case 'COMPLIANT': case 'TRANSPARENT': case 'ORGANIC': case 'DELIVERED': case 'OPEN_SOURCE':
        return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30';

      // Yellow - Caution/Partial
      case 'PARTIAL': case 'PARTIALLY_AUDITED': case 'UNCLEAR': case 'CONCERNING': case 'SHILLED': case 'DELAYED': case 'UNAUDITED': case 'ANONYMOUS': case 'PSEUDONYMOUS':
        return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30';

      // Red - Dangerous/Bad
      case 'FAKE': case 'FAILED_AUDIT': case 'BACKDOOR_DETECTED': case 'UNREGISTERED': case 'CEASE_AND_DESIST': case 'CRIMINAL_CHARGES': case 'SEC_ACTION': case 'PONZI_STRUCTURE': case 'RUG_PULL_RISK': case 'WASH_TRADING': case 'FAKE_FOLLOWERS': case 'PUMP_SCHEME': case 'CULT_LIKE': case 'VAPORWARE': case 'PLAGIARIZED': case 'IMPOSSIBLE': case 'MISSING':
        return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';

      // Gray - Neutral/Unknown
      case 'DEAD':
        return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';

      default:
        return 'text-trust-600 bg-trust-100 dark:text-trust-300 dark:bg-trust-700';
    }
  };

  // Handle both new format and legacy format
  const safetyLevel = result.safety_level || (result.riskLevel === 'low' ? 'SAFE' : result.riskLevel === 'medium' ? 'RISKY' : 'DANGEROUS');
  const projectName = result.project_name || 'Unknown Project';
  const projectType = result.project_type || 'Unknown';
  const blockchainNetwork = result.blockchain_network || '';
  const riskSummary = result.risk_summary || result.summary || '';
  const recommendation = result.recommendation || 'UNKNOWN';
  const confidence = result.confidence || result.confidence || 'MEDIUM';
  const tokenSymbol = result.token_symbol;
  const currentPrice = result.current_price;
  const marketCap = result.market_cap;
  const launchDate = result.launch_date;
  const contractAddress = result.contract_address;
  const teamTransparency = result.team_transparency || 'MISSING';
  const technicalSecurity = result.technical_security || 'UNAUDITED';
  const legalRegulatory = result.legal_regulatory || 'UNCLEAR';
  const financialTransparency = result.financial_transparency || 'CONCERNING';
  const communityMarketing = result.community_marketing || 'DEAD';
  const productDelivery = result.product_delivery || 'VAPORWARE';

  // AI-generated explanations for trust indicators
  const teamTransparencyExplanation = getAIExplanation('team_transparency');
  const technicalSecurityExplanation = getAIExplanation('technical_security');
  const legalRegulatoryExplanation = getAIExplanation('legal_regulatory');
  const financialTransparencyExplanation = getAIExplanation('financial_transparency');
  const communityMarketingExplanation = getAIExplanation('community_marketing');
  const productDeliveryExplanation = getAIExplanation('product_delivery');
  const exchangeListings = result.exchange_listings || [];
  const redFlags = result.red_flags || result.redFlags || [];
  const positiveSignals = result.positive_signals || result.positiveSignals || [];
  const scamTypeIndicators = result.scam_type_indicators || [];
  const communityWarnings = result.community_warnings || [];


  const keyVerificationSteps = result.key_verification_steps || [];
  const safeAlternatives = result.safe_alternatives || [];
  const sourcesUsed = result.sources_used || [];
  const rateLimit = result.rateLimit;

  // Cache information (for internal use only - not displayed to paid users)

  // Helper function to render expandable list
  const renderExpandableList = (items, isExpanded, setExpanded, maxItems = 3, dotColor = 'bg-gray-500') => {
    const displayItems = isExpanded ? items : items.slice(0, maxItems);
    const hasMore = items.length > maxItems;

    return (
      <div>
        <ul className="space-y-2">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <div className={`w-2 h-2 ${dotColor} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
              <span className="text-gray-700 dark:text-gray-300">{formatText(item)}</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <button
            onClick={() => setExpanded(!isExpanded)}
            className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show {items.length - maxItems} More
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header Card */}
      <div className={`rounded-md border p-8 ${getSafetyColor(safetyLevel)}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {getSafetyIcon(safetyLevel)}
            <div>
              <h1 className="text-xl font-semibold mb-2">{projectName}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm opacity-75">
                <span>{projectType}</span>
                {blockchainNetwork && (
                  <>
                    <span>•</span>
                    <span>{blockchainNetwork}</span>
                  </>
                )}
                {tokenSymbol && (
                  <>
                    <span>•</span>
                    <span className="font-medium">${tokenSymbol}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">{formatText(safetyLevel)}</div>
            <div className="text-sm opacity-75">Confidence: {confidence}</div>
          </div>
        </div>
        <p className="text-base leading-relaxed mb-4">{riskSummary}</p>

        {/* Safety Level Explanation */}
        <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-md">
          <div className="flex items-start space-x-2">
            <HelpTooltip explanation={getSafetyLevelExplanation(safetyLevel)}>
              <HelpCircle className="w-4 h-4 mt-0.5 text-current opacity-60 hover:opacity-100 transition-opacity" />
            </HelpTooltip>
            <p className="text-sm opacity-80">
              {getSafetyLevelExplanation(safetyLevel)}
            </p>
          </div>
        </div>
      </div>



      {/* Trust Indicators */}
      <div className="bg-white dark:bg-trust-800 rounded-md border border-trust-200 dark:border-trust-700 p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center text-trust-900 dark:text-white">
          <Shield className="w-5 h-5 mr-3 text-trust-600 dark:text-trust-400" />
          Trust Indicators
          <HelpTooltip explanation="These 6 categories assess different aspects of project legitimacy. Hover over individual indicators for AI explanations specific to this project.">
            <HelpCircle className="w-4 h-4 ml-2 text-trust-500 hover:text-trust-700 transition-colors" />
          </HelpTooltip>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Team Transparency:</span>
              {teamTransparencyExplanation && (
                <HelpTooltip explanation={teamTransparencyExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(teamTransparency)}`}>
              {formatText(teamTransparency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Technical Security:</span>
              {technicalSecurityExplanation && (
                <HelpTooltip explanation={technicalSecurityExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(technicalSecurity)}`}>
              {formatText(technicalSecurity)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Legal & Regulatory:</span>
              {legalRegulatoryExplanation && (
                <HelpTooltip explanation={legalRegulatoryExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(legalRegulatory)}`}>
              {formatText(legalRegulatory)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Financial Transparency:</span>
              {financialTransparencyExplanation && (
                <HelpTooltip explanation={financialTransparencyExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(financialTransparency)}`}>
              {formatText(financialTransparency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Community & Marketing:</span>
              {communityMarketingExplanation && (
                <HelpTooltip explanation={communityMarketingExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(communityMarketing)}`}>
              {formatText(communityMarketing)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-trust-600 dark:text-trust-400">Product Delivery:</span>
              {productDeliveryExplanation && (
                <HelpTooltip explanation={productDeliveryExplanation}>
                  <HelpCircle className="w-3 h-3 ml-1 text-trust-400 hover:text-trust-600 transition-colors" />
                </HelpTooltip>
              )}
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(productDelivery)}`}>
              {formatText(productDelivery)}
            </span>
          </div>
        </div>

      </div>

      {/* Potential Scam Types - Moved up for priority */}
      {scamTypeIndicators.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-red-700">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Potential Scam Types Detected
          </h2>
          <div className="flex flex-wrap gap-2">
            {scamTypeIndicators.map((indicator, index) => (
              <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">
                {formatText(indicator)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div className="bg-white dark:bg-trust-800 rounded-lg border border-trust-200 dark:border-trust-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600 dark:text-red-400">
              <XCircle className="w-5 h-5 mr-2" />
              Red Flags ({redFlags.length})
            </h2>
            {renderExpandableList(redFlags, redFlagsExpanded, setRedFlagsExpanded, 3, 'bg-red-500')}
          </div>
        )}

        {/* Positive Signals */}
        {positiveSignals.length > 0 && (
          <div className="bg-white dark:bg-trust-800 rounded-lg border border-trust-200 dark:border-trust-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              Positive Signals ({positiveSignals.length})
            </h2>
            {renderExpandableList(positiveSignals, positiveSignalsExpanded, setPositiveSignalsExpanded, 3, 'bg-green-500')}
          </div>
        )}
      </div>



      {/* Community Warnings */}
      {communityWarnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-yellow-700 dark:text-yellow-400">
            <Users className="w-5 h-5 mr-2" />
            Community Warnings
          </h2>
          <ul className="space-y-2">
            {communityWarnings.map((warning, index) => {
              // Handle both old string format and new object format, but ignore links
              const warningText = typeof warning === 'string' ? warning : warning.text;

              return (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">{formatText(warningText)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Verification Steps */}
        {keyVerificationSteps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
              <FileText className="w-5 h-5 mr-2" />
              Verification Steps
            </h2>
            <ul className="space-y-2">
              {keyVerificationSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{formatText(step)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safe Alternatives */}
        {safeAlternatives.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Research Areas
            </h2>
            <div className="space-y-2">
              {safeAlternatives.map((alternative, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  <span className="font-medium">{formatText(alternative)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exchange Listings - Moved to bottom as supplementary info */}
      {exchangeListings.length > 0 && (
        <div className="bg-white dark:bg-trust-800 rounded-lg border border-trust-200 dark:border-trust-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-trust-900 dark:text-white">
            <TrendingUp className="w-5 h-5 mr-2 text-trust-600 dark:text-trust-400" />
            Exchange Listings
          </h2>
          <div className="flex flex-wrap gap-2">
            {exchangeListings.map((exchange, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {formatText(exchange)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources & Research */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <Search className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
          Sources & Research
          <HelpTooltip explanation="These are the data sources our AI analyzed to generate this assessment. More sources generally mean more comprehensive analysis.">
            <HelpCircle className="w-4 h-4 ml-2 text-gray-500 hover:text-gray-700 transition-colors" />
          </HelpTooltip>
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Our AI analyzed the following sources to provide this comprehensive assessment:
        </div>
        {sourcesUsed.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sourcesUsed.map((source, index) => {
              // Handle both old string format and new object format
              const sourceName = typeof source === 'string' ? source : source.name;
              const sourceUrl = typeof source === 'object' ? source.url : null;

              if (sourceUrl) {
                return (
                  <a
                    key={index}
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-sm border border-gray-200 dark:border-gray-600 transition-colors cursor-pointer"
                  >
                    {formatText(sourceName)}
                  </a>
                );
              } else {
                return (
                  <span key={index} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-600">
                    {formatText(sourceName)}
                  </span>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            Sources information not available for this analysis.
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <div className="bg-trust-50 dark:bg-trust-800 rounded-lg p-6 text-center">
        {/* Status Info */}
        <div className="flex items-center justify-center text-sm text-trust-600 dark:text-trust-400 mb-6 flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Analysis completed</span>
          </div>
          <div className="w-px h-4 bg-trust-300 dark:bg-trust-600 hidden sm:block"></div>
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Confidence: {confidence}%</span>
          </div>
          <div className="w-px h-4 bg-trust-300 dark:bg-trust-600 hidden sm:block"></div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>For informational purposes only</span>
          </div>
        </div>

        {/* Rate Limit Info */}
        {rateLimit && (
          <div className="flex items-center justify-center text-xs text-trust-500 dark:text-trust-400 mb-6">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>Full analyses remaining: <span className="font-medium">{rateLimit.remaining}</span></span>
            <span className="mx-2">•</span>
            <span>Resets in {Math.ceil((rateLimit.resetTime - Date.now()) / (60 * 60 * 1000))} hours</span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onAnalyzeAgain}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:bg-trust-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Analyze Another Project
        </button>
      </div>
    </div>
  );
};

export default CryptoScannerResults;
