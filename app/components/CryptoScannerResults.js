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
          <div className="absolute z-10 w-64 p-3 bg-void-900/95 text-white text-sm rounded-lg shadow-xl border border-cyber-500/50 -top-2 left-6 transform -translate-y-full backdrop-blur-sm">
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
      case 'VERY_SAFE': return 'border-2 border-neon-400 bg-neon-900/20 shadow-lg shadow-neon-500/20';
      case 'SAFE': return 'border-2 border-emerald-400 bg-emerald-900/20 shadow-lg shadow-emerald-500/20';
      case 'RISKY': return 'border-2 border-bitcoin-400 bg-bitcoin-900/20 shadow-lg shadow-bitcoin-500/30';
      case 'DANGEROUS': return 'border-2 border-red-400 bg-red-900/20 shadow-lg shadow-red-500/40';
      default: return 'border-2 border-cyber-400 bg-cyber-900/20 shadow-lg shadow-cyber-500/20';
    }
  };

  const getSafetyIcon = (level) => {
    switch(level) {
      case 'VERY_SAFE': return <Shield className="w-6 h-6 text-neon-400 glow-neon" />;
      case 'SAFE': return <CheckCircle className="w-6 h-6 text-emerald-400 glow-neon" />;
      case 'RISKY': return <AlertTriangle className="w-6 h-6 text-bitcoin-400 glow-bitcoin" />;
      case 'DANGEROUS': return <XCircle className="w-6 h-6 text-red-400 glow-warning" />;
      default: return <Info className="w-6 h-6 text-cyber-400 glow-cyber" />;
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
              <span className="text-cyber-200">{formatText(item)}</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <button
            onClick={() => setExpanded(!isExpanded)}
            className="mt-3 flex items-center text-sm text-cyber-400 hover:text-cyber-200 transition-colors hover:glow-cyber"
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
      <div className={`glass-strong rounded-lg p-8 hover-glow ${getSafetyColor(safetyLevel)}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {getSafetyIcon(safetyLevel)}
            <div>
              <h1 className="text-xl font-bold mb-2 text-gradient-cyber">{projectName}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-cyber-200 opacity-75">
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
            <div className="text-lg font-bold text-gradient-neon">{formatText(safetyLevel)}</div>
            <div className="text-sm text-cyber-200 opacity-75">Confidence: {confidence}</div>
          </div>
        </div>
        <p className="text-base leading-relaxed mb-4 text-cyber-100">{riskSummary}</p>

        {/* Safety Level Explanation */}
        <div className="mt-4 p-3 glass rounded-md">
          <div className="flex items-start space-x-2">
            <HelpTooltip explanation={getSafetyLevelExplanation(safetyLevel)}>
              <HelpCircle className="w-4 h-4 mt-0.5 text-current opacity-60 hover:opacity-100 transition-opacity" />
            </HelpTooltip>
            <p className="text-sm text-cyber-100 opacity-80">
              {getSafetyLevelExplanation(safetyLevel)}
            </p>
          </div>
        </div>
      </div>



      {/* Trust Indicators */}
      <div className="glass-strong rounded-lg neon-border-cyber p-6 hover-glow">
        <h2 className="text-lg font-bold mb-6 flex items-center text-gradient-cyber">
          <Shield className="w-5 h-5 mr-3 text-cyber-400 glow-cyber" />
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
        <div className="glass-strong border border-warning-500/30 rounded-lg p-6 hover-glow">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-bitcoin">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning-400 glow-bitcoin" />
            Potential Scam Types Detected
          </h2>
          <div className="flex flex-wrap gap-2">
            {scamTypeIndicators.map((indicator, index) => (
              <span key={index} className="px-3 py-1 glass border border-warning-500/30 text-warning-300 rounded-full text-sm">
                {formatText(indicator)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div className="glass-strong rounded-lg neon-border-bitcoin p-6 hover-glow">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-bitcoin">
              <XCircle className="w-5 h-5 mr-2 text-warning-400 glow-bitcoin" />
              Red Flags ({redFlags.length})
            </h2>
            {renderExpandableList(redFlags, redFlagsExpanded, setRedFlagsExpanded, 3, 'bg-red-500')}
          </div>
        )}

        {/* Positive Signals */}
        {positiveSignals.length > 0 && (
          <div className="glass-strong rounded-lg neon-border-neon p-6 hover-glow">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-neon">
              <CheckCircle className="w-5 h-5 mr-2 text-neon-400 glow-neon" />
              Positive Signals ({positiveSignals.length})
            </h2>
            {renderExpandableList(positiveSignals, positiveSignalsExpanded, setPositiveSignalsExpanded, 3, 'bg-neon-500')}
          </div>
        )}
      </div>



      {/* Community Warnings */}
      {communityWarnings.length > 0 && (
        <div className="glass-strong border border-bitcoin-500/30 rounded-lg p-6 hover-glow">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-bitcoin">
            <Users className="w-5 h-5 mr-2 text-bitcoin-400 glow-bitcoin" />
            Community Warnings
          </h2>
          <ul className="space-y-2">
            {communityWarnings.map((warning, index) => {
              // Handle both old string format and new object format, but ignore links
              const warningText = typeof warning === 'string' ? warning : warning.text;

              return (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-bitcoin-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
          <div className="glass-strong rounded-lg neon-border-cyber p-6 hover-glow">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-cyber">
              <FileText className="w-5 h-5 mr-2 text-cyber-400 glow-cyber" />
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
          <div className="glass-strong rounded-lg neon-border-neon p-6 hover-glow">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gradient-neon">
              <CheckCircle className="w-5 h-5 mr-2 text-neon-400 glow-neon" />
              Research Areas
            </h2>
            <div className="space-y-2">
              {safeAlternatives.map((alternative, index) => (
                <div key={index} className="p-3 glass rounded-md border border-neon-500/30">
                  <span className="font-medium text-neon-200">{formatText(alternative)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exchange Listings - Moved to bottom as supplementary info */}
      {exchangeListings.length > 0 && (
        <div className="glass-strong rounded-lg neon-border p-6 hover-glow">
          <h2 className="text-lg font-bold mb-4 flex items-center text-gradient-cyber">
            <TrendingUp className="w-5 h-5 mr-2 text-cyber-400 glow-cyber" />
            Exchange Listings
          </h2>
          <div className="flex flex-wrap gap-2">
            {exchangeListings.map((exchange, index) => (
              <span key={index} className="px-3 py-1 glass text-cyber-200 rounded-full text-sm border border-cyber-500/30">
                {formatText(exchange)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources & Research */}
      <div className="glass-strong rounded-lg neon-border-cyber p-6 hover-glow">
        <h2 className="text-lg font-bold mb-4 flex items-center text-gradient-cyber">
          <Search className="w-5 h-5 mr-2 text-cyber-400 glow-cyber" />
          Sources & Research
          <HelpTooltip explanation="Our AI analyzes multiple data sources to provide comprehensive risk assessment: official project websites, social media accounts, blockchain explorers, community discussions, regulatory databases, security audit reports, and financial data. More diverse sources lead to more accurate and reliable scam detection results.">
            <HelpCircle className="w-4 h-4 ml-2 text-cyber-300 hover:text-cyber-100 transition-colors" />
          </HelpTooltip>
        </h2>
        <div className="text-sm text-cyber-300 mb-3">
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
                    className="px-3 py-1 glass text-neon-400 hover:text-neon-300 hover:glow-neon rounded-md text-sm neon-border transition-all duration-300 cursor-pointer"
                  >
                    {formatText(sourceName)}
                  </a>
                );
              } else {
                return (
                  <span key={index} className="px-3 py-1 glass text-cyber-200 rounded-md text-sm border border-cyber-500/30">
                    {formatText(sourceName)}
                  </span>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-sm text-cyber-400 italic">
            Sources information not available for this analysis.
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <div className="glass-strong rounded-lg neon-border p-6 text-center hover-glow">
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
          className="glass neon-border-cyber text-cyber-100 px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:glow-cyber hover-glow"
        >
          Analyze Another Project
        </button>
      </div>
    </div>
  );
};

export default CryptoScannerResults;
