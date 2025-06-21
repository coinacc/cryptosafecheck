'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import CryptoScannerResults from './components/CryptoScannerResults';
import ThemeToggle from './components/theme-toggle';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisStartTime, setAnalysisStartTime] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [scanType, setScanType] = useState('full'); // Only full analysis now
  const [isResettingLimit, setIsResettingLimit] = useState(false);
  const [progressInterval, setProgressInterval] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Ref to track current request for cancellation
  const currentRequestRef = useRef(null);

  // Client-side detection to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smooth progress animation for comprehensive analysis
  useEffect(() => {
    let interval = null;

    if (isAnalyzing && analysisStartTime) {
      // Use 60 seconds for comprehensive analysis
      const maxDuration = 60000; // 60s for comprehensive analysis
      const startTime = analysisStartTime;

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / maxDuration) * 90, 90); // Cap at 90% until completion
        setProgressPercentage(Math.round(progress));
      }, 100); // Update every 100ms for smooth animation

      setProgressInterval(interval);
    } else {
      // Clear interval when not analyzing
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAnalyzing, analysisStartTime]); // Removed scanType dependency

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('cryptoSafeCheck_recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);



  // Save to recent searches with safety assessment
  const saveToRecentSearches = (searchUrl, safetyLevel = null) => {
    const searchItem = typeof searchUrl === 'string' ? { url: searchUrl, safetyLevel } : searchUrl;
    const updated = [searchItem, ...recentSearches.filter(item => {
      const itemUrl = typeof item === 'string' ? item : item.url;
      const searchItemUrl = typeof searchItem === 'string' ? searchItem : searchItem.url;
      return itemUrl !== searchItemUrl;
    })].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cryptoSafeCheck_recentSearches', JSON.stringify(updated));
  };

  // Refresh analysis (force new analysis by bypassing cache)
  const handleRefreshAnalysis = async () => {
    if (!result || !result._input) return;

    try {
      // Re-run the analysis with cache bypass
      setIsAnalyzing(true);
      setError(null);
      setAnalysisProgress('Refreshing analysis...');

      const data = await performAnalysis(result._input, 1, true); // bypassCache = true
      setResult(data);
    } catch (err) {
      setError('Failed to refresh analysis. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // Simplified analysis function - only comprehensive analysis
  const performAnalysis = useCallback(async (processedUrl, attempt = 1, bypassCache = false) => {
    const maxRetries = 3;
    const requestId = Date.now();
    currentRequestRef.current = requestId;

    // Reset progress
    setProgressPercentage(0);

    try {
      // Progressive loading messages (progress percentage handled by useEffect)
      const updateProgress = (message) => {
        setAnalysisProgress(message);
      };

      // Comprehensive analysis with detailed progress
      updateProgress(attempt > 1 ? `Retrying analysis (${attempt}/${maxRetries})...` : 'Starting comprehensive analysis...');
      await new Promise(resolve => setTimeout(resolve, 300));
      if (currentRequestRef.current !== requestId) throw new Error('Request cancelled');

      updateProgress('Identifying project type...');
      await new Promise(resolve => setTimeout(resolve, 200));
      if (currentRequestRef.current !== requestId) throw new Error('Request cancelled');

      updateProgress('Searching for project information...');
      await new Promise(resolve => setTimeout(resolve, 300));
      if (currentRequestRef.current !== requestId) throw new Error('Request cancelled');

      updateProgress('Analyzing with AI...');

      // Start the actual AI analysis via API route
      const response = await fetch('/api/analyze-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: processedUrl,
          sessionId: requestId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();

      if (currentRequestRef.current !== requestId) throw new Error('Request cancelled');

      // Show completion
      updateProgress('Analysis complete!');
      setProgressPercentage(100); // Set to 100% on completion
      setRetryCount(0);

      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      return data;

    } catch (error) {
      if (error.message === 'Request cancelled') {
        throw error;
      }

      if (attempt < maxRetries) {
        setRetryCount(attempt);
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
        setAnalysisProgress(`Retrying in ${delay/1000}s...`);

        await new Promise(resolve => setTimeout(resolve, delay));
        if (currentRequestRef.current !== requestId) throw new Error('Request cancelled');

        return performAnalysis(processedUrl, attempt + 1, bypassCache);
      }

      throw error;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle both project names and URLs
    let processedInput = url.trim();

    // Only auto-prepend https:// if it looks like a domain (contains a dot and no spaces)
    if (processedInput &&
        !processedInput.startsWith('http://') &&
        !processedInput.startsWith('https://') &&
        processedInput.includes('.') &&
        !processedInput.includes(' ')) {
      processedInput = 'https://' + processedInput;
    }

    // Start comprehensive analysis
    try {
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      // Cancel any existing request
      if (currentRequestRef.current) {
        currentRequestRef.current = null;
      }

      setAnalysisProgress('');
      setRetryCount(0);
      setProgressPercentage(0);
      setEstimatedTime(null);

      // Set start time for progress animation
      setAnalysisStartTime(Date.now());

      const data = await performAnalysis(processedInput, 1, false);
      console.log('Analysis completed, setting result:', data);

      // Force immediate state update to avoid React 18 batching delays
      setResult(data);
      setIsAnalyzing(false);
      setAnalysisProgress('');

      saveToRecentSearches(processedInput, data.safety_level);
    } catch (err) {
      if (err.message !== 'Request cancelled') {
        // Show the actual error message from the API, or fallback to generic message
        const errorMessage = err.message || `Failed to analyze URL after ${retryCount + 1} attempt${retryCount > 0 ? 's' : ''}. Please try again.`;
        setError(errorMessage);
        console.error(err);
      }
    } finally {
      // Only update state if there was an error (successful case already handled above)
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setAnalysisProgress('');
    setProgressPercentage(0);
    setEstimatedTime(null);
    setAnalysisStartTime(null);
    // Focus the input after clearing
    document.querySelector('input[type="text"]')?.focus();
  };

  const handleAnalyzeAnother = () => {
    // Clear all state
    setUrl('');
    setResult(null);
    setError(null);
    setAnalysisProgress('');
    setRetryCount(0);
    setProgressPercentage(0);
    setEstimatedTime(null);
    setAnalysisStartTime(null);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus the input field after a brief delay to ensure scroll completes
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.focus();
      }
    }, 300);
  };

  const handleCancel = () => {
    if (currentRequestRef.current) {
      currentRequestRef.current = null;
      setIsAnalyzing(false);
      setAnalysisProgress('');
      setProgressPercentage(0);
      setAnalysisStartTime(null);
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setError('Analysis cancelled by user.');
    }
  };



  // Dev-only function to reset rate limit
  const handleResetRateLimit = async () => {
    if (!isClient || window.location.hostname !== 'localhost') return;

    setIsResettingLimit(true);
    try {
      const response = await fetch('/api/dev/reset-rate-limit', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Rate limit reset:', data);
        // Clear any existing error that might be about rate limits
        if (error && (error.includes('rate limit') || error.includes('maximum'))) {
          setError(null);
        }
      } else {
        console.error('Failed to reset rate limit');
      }
    } catch (err) {
      console.error('Error resetting rate limit:', err);
    } finally {
      setIsResettingLimit(false);
    }
  };


  return (
    <div className="min-h-screen bg-trust-50 dark:bg-trust-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 xs:px-6 md:px-8 py-4 md:py-6">
        <div className="flex items-center space-x-2 xs:space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-trust-900"></div>
            </div>
            <span className="text-base xs:text-lg font-semibold text-trust-900 dark:text-white">CryptoSafeCheck</span>
          </Link>
        </div>
        <div className="flex items-center space-x-3 xs:space-x-4 md:space-x-6">
          <Link href="/" className="text-sm text-trust-700 dark:text-trust-300 font-medium hover:text-trust-900 dark:hover:text-trust-100 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-trust-500 dark:text-trust-400 hover:text-trust-700 dark:hover:text-trust-300 transition-colors">
            Blog
          </Link>
          <ThemeToggle />
          {isClient && window.location.hostname === 'localhost' && (
            <div className="flex gap-2">
              <button
                onClick={handleResetRateLimit}
                disabled={isResettingLimit}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
                title="Reset rate limit for your IP (Dev only)"
              >
                {isResettingLimit ? 'Resetting...' : 'Reset Limit'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card - Hide when analyzing or results are shown */}
      {!isAnalyzing && !result && (
        <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
          <div className="bg-white dark:bg-trust-800 rounded-lg shadow-sm border border-trust-200 dark:border-trust-700 p-6 xs:p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-2xl xs:text-3xl font-semibold text-trust-900 dark:text-white mb-4">Analyze Crypto Projects</h1>
              <p className="text-trust-600 dark:text-trust-400 text-base xs:text-lg">Enter a project name, symbol, website, or contract address to check for potential scam indicators</p>
            </div>
      
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Input field */}
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="SafeMoon, bitcoin.org, or contract address"
                  required
                  autoFocus
                  className="w-full p-4 pr-12 border border-trust-300 dark:border-trust-600 bg-white dark:bg-trust-700 text-trust-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-base shadow-sm hover:border-trust-400 dark:hover:border-trust-500"
                />
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-trust-400 hover:text-trust-600 transition-colors"
                    aria-label="Clear input"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Single Analysis Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isAnalyzing || !url.trim()}
                  className="w-full max-w-md bg-primary-600 text-white px-8 py-4 rounded-md hover:bg-primary-700 disabled:bg-trust-400 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analyze Project
                    </>
                  )}
                </button>
              </div>

              {/* Analysis Features */}
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="font-semibold text-primary-700 dark:text-primary-300">Comprehensive Analysis</span>
                  <span className="text-sm text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded">Free</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <ul className="text-trust-600 dark:text-trust-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Team transparency verification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Technical security audits</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Legal & regulatory status</span>
                    </li>
                  </ul>
                  <ul className="text-trust-600 dark:text-trust-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Financial transparency</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Community & marketing analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Product delivery assessment</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Analysis time:</strong> Up to 1 minute • <strong>No limits</strong> • Powered by AI
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Examples and Recent Searches */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-sm text-trust-600 dark:text-trust-400 mr-4">Try these examples:</span>
              <div className="inline-flex flex-wrap gap-2 justify-center">
                {['SafeMoon', 'DOGE', 'Uniswap', 'coinbase.com', 'hyperliquid.xyz'].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setUrl(example)}
                    className="px-3 py-1 bg-trust-100 dark:bg-trust-700 text-trust-600 dark:text-trust-300 rounded text-sm hover:bg-trust-200 dark:hover:bg-trust-600 transition-colors duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="text-center">
                <span className="text-sm text-trust-600 dark:text-trust-400 mr-4">Recent searches:</span>
                <div className="inline-flex flex-wrap gap-2 justify-center">
                  {recentSearches.map((recent, index) => {
                    // Handle both old string format and new object format
                    const recentUrl = typeof recent === 'string' ? recent : recent.url;
                    const safetyLevel = typeof recent === 'string' ? null : recent.safetyLevel;

                    // Get color based on safety level
                    const getSafetyColor = (level) => {
                      switch(level) {
                        case 'VERY_SAFE': return 'bg-green-500';
                        case 'SAFE': return 'bg-green-500';
                        case 'RISKY': return 'bg-yellow-500';
                        case 'DANGEROUS': return 'bg-red-500';
                        default: return 'bg-gray-400'; // For old entries without safety level
                      }
                    };

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setUrl(recentUrl)}
                        className="flex items-center gap-2 px-3 py-1 bg-trust-100 dark:bg-trust-700 text-trust-600 dark:text-trust-300 rounded text-sm hover:bg-trust-200 dark:hover:bg-trust-600 transition-colors duration-200"
                        title={recentUrl}
                      >
                        <div className={`w-2 h-2 rounded-full ${getSafetyColor(safetyLevel)}`}></div>
                        {recentUrl.replace(/^https?:\/\//, '').substring(0, 15)}
                        {recentUrl.replace(/^https?:\/\//, '').length > 15 ? '...' : ''}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('cryptoSafeCheck_recentSearches');
                    }}
                    className="px-3 py-1 text-trust-500 dark:text-trust-400 text-sm hover:text-trust-700 dark:hover:text-trust-300 transition-colors duration-200"
                    title="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Enhanced Progress Indicator */}
      {isAnalyzing && analysisProgress && (
        <div className="max-w-4xl mx-auto px-8 py-12 mb-8" data-progress-section>
          <div className="bg-white dark:bg-trust-800 border border-trust-200 dark:border-trust-700 rounded-lg shadow-sm p-8">
            <div className="text-center">
              {/* Main loading animation */}
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p className="text-trust-800 dark:text-trust-200 font-medium text-lg">{analysisProgress}</p>
                  <p className="text-trust-500 dark:text-trust-400 text-sm mt-1">
                    Estimated time: up to 1 minute
                  </p>
                  {retryCount > 0 && (
                    <p className="text-trust-600 dark:text-trust-400 text-sm mt-1">Attempt {retryCount + 1} of 3</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Progress percentage */}
              <div className="text-xs text-gray-500 mb-2">
                Progress: {progressPercentage}%
              </div>

              {/* Cancel button */}
              <button
                onClick={handleCancel}
                className="text-sm text-trust-500 dark:text-trust-400 hover:text-trust-700 dark:hover:text-trust-300 transition-colors duration-200"
              >
                Cancel Analysis
              </button>

              {/* Helpful tips while waiting */}
              <div className="mt-6 p-4 bg-trust-50 dark:bg-trust-700 rounded-md">
                <p className="text-sm text-trust-600 dark:text-trust-300">
                  <strong>💡 Tip:</strong> Our AI analyzes multiple data sources including project websites, social media, blockchain data, and community feedback to provide comprehensive scam detection across 6 key trust indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto px-8 mb-8">
          <div className="bg-white dark:bg-trust-800 border border-red-200 dark:border-red-700 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center text-red-700 dark:text-red-400">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}



      {result && (
        <div className="max-w-4xl mx-auto px-8 py-12" data-results-section>
          {result.status === 'not_applicable' ? (
            // Simple message for non-crypto projects
            <div className="bg-white dark:bg-trust-800 rounded-lg shadow-sm border border-trust-200 dark:border-trust-700 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-trust-900 dark:text-white mb-2">Not a Crypto Project</h2>
                  <p className="text-trust-600 dark:text-trust-300 leading-relaxed">
                    {result.message || "This appears to be outside our crypto scam detection scope."}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-trust-50 dark:bg-trust-700 rounded-md border border-trust-200 dark:border-trust-600 mb-6">
                <p className="text-sm text-trust-600 dark:text-trust-300 leading-relaxed">
                  <strong className="text-trust-700 dark:text-trust-200">About AI Crypto Check:</strong> This tool is designed specifically to identify fraudulent crypto investment projects,
                  fake tokens, and Ponzi schemes. Legitimate services like exchanges, tax calculators, and portfolio trackers are outside our scope.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleAnalyzeAnother}
                  disabled={isAnalyzing}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  Analyze Another Project
                </button>
              </div>
            </div>
          ) : result.category === 'UTILITY_TOOL' ? (
            // Legacy utility tool message
            <div className="bg-white dark:bg-trust-800 rounded-lg shadow-sm border border-trust-200 dark:border-trust-700 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-trust-900 dark:text-white mb-2">Not a Scam Detection Target</h2>
                  <p className="text-trust-600 dark:text-trust-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleAnalyzeAnother}
                  disabled={isAnalyzing}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  Analyze Another Project
                </button>
              </div>
            </div>
          ) : (
            // Full analysis results
            <CryptoScannerResults
              result={result}
              onAnalyzeAgain={handleAnalyzeAnother}
              onRefreshAnalysis={handleRefreshAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}
        </div>
      )}
    </div>
  );
}