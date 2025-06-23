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
        {showTooltip && explanation && (
          <div className="absolute z-10 w-64 p-3 bg-void-900/95 text-white text-sm rounded-lg shadow-md border border-cyber-500/20 -top-2 left-6 transform -translate-y-full">
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-void-900"></div>
            {explanation || 'No explanation available'}
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

  // Get explanation with fallback for trust indicators
  const getExplanationWithFallback = (field, aiExplanation) => {
    if (aiExplanation) return aiExplanation;
    
    const fallbacks = {
      'team_transparency': 'Assessment of how publicly known and verifiable the project team is. Anonymous teams increase risk.',
      'technical_security': 'Evaluation of smart contract audits, code quality, and technical security measures implemented.',
      'legal_regulatory': 'Analysis of regulatory compliance, legal registrations, and adherence to financial regulations.',
      'financial_transparency': 'Review of token economics, fund allocation, treasury transparency, and financial reporting.',
      'community_marketing': 'Assessment of genuine community engagement vs artificial promotion and marketing tactics.',
      'product_delivery': 'Evaluation of actual product delivery, development progress, and promised vs delivered features.'
    };
    
    return fallbacks[field] || 'Analysis of this trust indicator based on available data and industry best practices.';
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
      case 'VERY_SAFE': return 'border border-neon-400/50 bg-neon-900/10';
      case 'SAFE': return 'border border-emerald-400/50 bg-emerald-900/10';
      case 'RISKY': return 'border border-bitcoin-400/50 bg-bitcoin-900/10';
      case 'DANGEROUS': return 'border border-red-400/50 bg-red-900/10';
      default: return 'border border-cyber-400/50 bg-cyber-900/10';
    }
  };

  // Get text colors based on safety level
  const getTextColorPrimary = (level) => {
    switch(level) {
      case 'VERY_SAFE': return 'text-neon-300';
      case 'SAFE': return 'text-emerald-300';
      case 'RISKY': return 'text-bitcoin-300';
      case 'DANGEROUS': return 'text-red-300';
      default: return 'text-white';
    }
  };

  const getTextColorSecondary = (level) => {
    switch(level) {
      case 'VERY_SAFE': return 'text-neon-200';
      case 'SAFE': return 'text-emerald-200';
      case 'RISKY': return 'text-bitcoin-200';
      case 'DANGEROUS': return 'text-red-200';
      default: return 'text-cyber-200';
    }
  };

  const getTextColorTertiary = (level) => {
    switch(level) {
      case 'VERY_SAFE': return 'text-neon-200/80';
      case 'SAFE': return 'text-emerald-200/80';
      case 'RISKY': return 'text-bitcoin-200/80';
      case 'DANGEROUS': return 'text-red-200/80';
      default: return 'text-cyber-200/80';
    }
  };

  const getSafetyIcon = (level) => {
    switch(level) {
      case 'VERY_SAFE': return <Shield className="w-6 h-6 text-neon-400" />;
      case 'SAFE': return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'RISKY': return <AlertTriangle className="w-6 h-6 text-bitcoin-400" />;
      case 'DANGEROUS': return <XCircle className="w-6 h-6 text-red-400" />;
      default: return <Info className="w-6 h-6 text-cyber-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      // Green - Good/Safe
      case 'VERIFIED': case 'AUDITED': case 'COMPLIANT': case 'TRANSPARENT': case 'ORGANIC': case 'DELIVERED': case 'OPEN_SOURCE':
        return 'text-neon-200 bg-neon-900/30 border border-neon-500/30';

      // Yellow - Caution/Partial
      case 'PARTIAL': case 'PARTIALLY_AUDITED': case 'UNCLEAR': case 'CONCERNING': case 'SHILLED': case 'DELAYED': case 'UNAUDITED': case 'ANONYMOUS': case 'PSEUDONYMOUS':
        return 'text-bitcoin-200 bg-bitcoin-900/30 border border-bitcoin-500/30';

      // Red - Dangerous/Bad
      case 'FAKE': case 'FAILED_AUDIT': case 'BACKDOOR_DETECTED': case 'UNREGISTERED': case 'CEASE_AND_DESIST': case 'CRIMINAL_CHARGES': case 'SEC_ACTION': case 'PONZI_STRUCTURE': case 'RUG_PULL_RISK': case 'WASH_TRADING': case 'FAKE_FOLLOWERS': case 'PUMP_SCHEME': case 'CULT_LIKE': case 'VAPORWARE': case 'PLAGIARIZED': case 'IMPOSSIBLE': case 'MISSING':
        return 'text-red-200 bg-red-900/30 border border-red-500/30';

      // Gray - Neutral/Unknown
      case 'DEAD':
        return 'text-void-200 bg-void-900/30 border border-void-500/30';

      default:
        return 'text-cyber-200 bg-cyber-900/30 border border-cyber-500/30';
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
              <span className="text-cyber-200">{formatText(item)}</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <button
            onClick={() => setExpanded(!isExpanded)}
            className="mt-3 flex items-center text-sm text-cyber-400 hover:text-cyber-200 transition-colors"
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

  // Handle contract address case
  if (result.isContractAddress || result.category === 'CONTRACT_ADDRESS') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-lg p-6 bg-cyber-900/20 border border-cyber-500/30">
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 text-cyber-400 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cyber-200 mb-3">Contract Address Detected</h2>
              <p className="text-cyber-200/90 mb-4">
                {result.summary || "Contract addresses are not supported. Please search using the project name, website URL, or token symbol instead."}
              </p>
              <div className="bg-void-900/50 rounded-md p-4 border border-cyber-500/20">
                <h3 className="text-sm font-semibold text-cyber-300 mb-2">How to search for this project:</h3>
                <ul className="space-y-2 text-sm text-cyber-200/80">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-cyber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Copy the contract address and search for it on a blockchain explorer</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-cyber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Look for the project name or token symbol on the explorer</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-cyber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Search again using the project name or official website</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onAnalyzeAgain}
                className="mt-6 bg-cyber-500 text-void-900 px-6 py-2 rounded-md font-semibold hover:bg-cyber-400 transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Try Another Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className={`rounded-lg p-6 ${getSafetyColor(safetyLevel)}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {getSafetyIcon(safetyLevel)}
            <div>
              <h1 className={`text-xl font-bold mb-2 ${getTextColorPrimary(safetyLevel)}`}>{projectName}</h1>
              {result._input && (
                <div className="text-xs text-cyber-400 mb-2">
                  ✓ Analyzed: {result._input}
                </div>
              )}
              <div className={`flex flex-wrap items-center gap-2 text-sm ${getTextColorTertiary(safetyLevel)}`}>
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
            <div className={`text-lg font-bold ${getTextColorPrimary(safetyLevel)}`}>{formatText(safetyLevel)}</div>
            <div className={`text-sm ${getTextColorTertiary(safetyLevel)}`}>Confidence: {confidence}</div>
          </div>
        </div>
        <p className={`text-base leading-relaxed mb-4 ${getTextColorSecondary(safetyLevel)}`}>{riskSummary}</p>

        {/* Safety Level Explanation */}
        <div className="mt-4 p-3 bg-void-900/30 rounded-md border border-white/5">
          <div className="flex items-start space-x-2">
            <HelpTooltip explanation={getSafetyLevelExplanation(safetyLevel)}>
              <HelpCircle className={`w-4 h-4 mt-0.5 ${getTextColorTertiary(safetyLevel)} hover:opacity-100 transition-opacity`} />
            </HelpTooltip>
            <p className={`text-sm ${getTextColorTertiary(safetyLevel)}`}>
              {getSafetyLevelExplanation(safetyLevel)}
            </p>
          </div>
        </div>
      </div>



      {/* Trust Indicators */}
      <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center text-white">
          <Shield className="w-5 h-5 mr-3 text-cyber-400" />
          Trust Indicators
          <HelpTooltip explanation="These 6 categories evaluate different aspects of crypto project safety: Team Transparency (identity verification), Technical Security (audits & code quality), Legal & Regulatory (compliance status), Financial Transparency (tokenomics & funding), Community & Marketing (genuine vs artificial growth), and Product Delivery (actual vs promised features).">
            <HelpCircle className="w-4 h-4 ml-2 text-cyber-300 hover:text-cyber-100 transition-colors" />
          </HelpTooltip>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Team Transparency:</span>
              <HelpTooltip explanation={getExplanationWithFallback('team_transparency', teamTransparencyExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(teamTransparency)}`}>
              {formatText(teamTransparency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Technical Security:</span>
              <HelpTooltip explanation={getExplanationWithFallback('technical_security', technicalSecurityExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(technicalSecurity)}`}>
              {formatText(technicalSecurity)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Legal & Regulatory:</span>
              <HelpTooltip explanation={getExplanationWithFallback('legal_regulatory', legalRegulatoryExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(legalRegulatory)}`}>
              {formatText(legalRegulatory)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Financial Transparency:</span>
              <HelpTooltip explanation={getExplanationWithFallback('financial_transparency', financialTransparencyExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(financialTransparency)}`}>
              {formatText(financialTransparency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Community & Marketing:</span>
              <HelpTooltip explanation={getExplanationWithFallback('community_marketing', communityMarketingExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(communityMarketing)}`}>
              {formatText(communityMarketing)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-cyber-300">Product Delivery:</span>
              <HelpTooltip explanation={getExplanationWithFallback('product_delivery', productDeliveryExplanation)}>
                <HelpCircle className="w-3 h-3 ml-1 text-cyber-400 hover:text-cyber-200 transition-colors" />
              </HelpTooltip>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(productDelivery)}`}>
              {formatText(productDelivery)}
            </span>
          </div>
        </div>

      </div>

      {/* Potential Scam Types - Moved up for priority */}
      {scamTypeIndicators.length > 0 && (
        <div className="bg-void-800/30 border border-warning-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-warning-300">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning-400" />
            Potential Scam Types Detected
          </h2>
          <div className="flex flex-wrap gap-2">
            {scamTypeIndicators.map((indicator, index) => (
              <span key={index} className="px-3 py-1 bg-warning-900/20 border border-warning-500/30 text-warning-300 rounded-full text-sm">
                {formatText(indicator)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div className="bg-void-800/30 rounded-lg border border-red-400/30 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-red-300">
              <XCircle className="w-5 h-5 mr-2 text-red-400" />
              Red Flags ({redFlags.length})
            </h2>
            {renderExpandableList(redFlags, redFlagsExpanded, setRedFlagsExpanded, 3, 'bg-red-400')}
          </div>
        )}

        {/* Positive Signals */}
        {positiveSignals.length > 0 && (
          <div className="bg-void-800/30 rounded-lg border border-neon-400/30 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-neon-300">
              <CheckCircle className="w-5 h-5 mr-2 text-neon-400" />
              Positive Signals ({positiveSignals.length})
            </h2>
            {renderExpandableList(positiveSignals, positiveSignalsExpanded, setPositiveSignalsExpanded, 3, 'bg-neon-400')}
          </div>
        )}
      </div>



      {/* Community Warnings */}
      {communityWarnings.length > 0 && (
        <div className="bg-void-800/30 border border-bitcoin-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-bitcoin-300">
            <Users className="w-5 h-5 mr-2 text-bitcoin-400" />
            Community Warnings
          </h2>
          <ul className="space-y-2">
            {communityWarnings.map((warning, index) => {
              // Handle both old string format and new object format, but ignore links
              const warningText = typeof warning === 'string' ? warning : warning.text;

              return (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-bitcoin-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-cyber-200">{formatText(warningText)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Verification Steps */}
        {keyVerificationSteps.length > 0 && (
          <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white">
              <FileText className="w-5 h-5 mr-2 text-cyber-400" />
              Verification Steps
            </h2>
            <ul className="space-y-2">
              {keyVerificationSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-cyber-500/30 text-cyber-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0 border border-cyber-400/30">
                    {index + 1}
                  </div>
                  <span className="text-cyber-200">{formatText(step)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safe Alternatives */}
        {safeAlternatives.length > 0 && (
          <div className="bg-void-800/30 rounded-lg border border-neon-400/30 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-neon-300">
              <CheckCircle className="w-5 h-5 mr-2 text-neon-400" />
              Research Areas
            </h2>
            <div className="space-y-2">
              {safeAlternatives.map((alternative, index) => (
                <div key={index} className="p-3 bg-neon-900/10 rounded-md border border-neon-500/30">
                  <span className="font-medium text-neon-200">{formatText(alternative)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exchange Listings - Moved to bottom as supplementary info */}
      {exchangeListings.length > 0 && (
        <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center text-white">
            <TrendingUp className="w-5 h-5 mr-2 text-cyber-400" />
            Exchange Listings
          </h2>
          <div className="flex flex-wrap gap-2">
            {exchangeListings.map((exchange, index) => (
              <span key={index} className="px-3 py-1 bg-cyber-900/20 text-cyber-200 rounded-full text-sm border border-cyber-500/30">
                {formatText(exchange)}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Clean Footer */}
      <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 text-center">
        {/* Status Info */}
        <div className="flex items-center justify-center text-sm text-cyber-300 mb-6 flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-neon-400" />
            <span>Analysis completed</span>
          </div>
          <div className="w-px h-4 bg-cyber-500/30 hidden sm:block"></div>
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4 text-cyber-400" />
            <span>Confidence: {confidence}%</span>
          </div>
          <div className="w-px h-4 bg-cyber-500/30 hidden sm:block"></div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-bitcoin-400" />
            <span>For informational purposes only</span>
          </div>
        </div>

        {/* Rate Limit Info */}
        {rateLimit && (
          <div className="flex items-center justify-center text-xs text-cyber-400 mb-6">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-cyber-400" />
            <span>Full analyses remaining: <span className="font-medium">{rateLimit.remaining}</span></span>
            <span className="mx-2">•</span>
            <span>Resets in {Math.ceil((rateLimit.resetTime - Date.now()) / (60 * 60 * 1000))} hours</span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onAnalyzeAgain}
          disabled={isAnalyzing}
          className="bg-cyber-600/20 border border-cyber-400/30 text-cyber-100 px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-cyber-600/30"
        >
          Analyze Another Project
        </button>
      </div>
    </div>
  );
};

export default CryptoScannerResults;
