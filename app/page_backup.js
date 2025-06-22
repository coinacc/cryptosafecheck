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

  return (
    <div className="min-h-screen bg-gradient-to-br from-void-950 via-void-900 to-void-800 matrix-bg">
      {/* Header */}
      <div className="relative">
        <div className="glass-dark rounded-b-2xl border-0 border-b border-neon-500/20">
          <div className="flex items-center justify-between px-4 xs:px-6 md:px-8 py-4 md:py-6">
            <div className="flex items-center space-x-2 xs:space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover-glow transition-all duration-300 group">
                <span className="text-base xs:text-xl font-bold text-gradient-cyber group-hover:scale-105 transition-transform">
                  CryptoSafeCheck
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {!isAnalyzing && !result && (
        <div className="relative">
          <div className="max-w-6xl mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl xs:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient-cyber">Detect Crypto</span>
                <br />
                <span className="text-gradient-neon">Scams Instantly</span>
              </h1>
            </div>
            
            <div className="max-w-4xl mx-auto glass-strong neon-border-cyber rounded-2xl p-8 hover-glow">
              <form onSubmit={() => {}}>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter crypto project URL, contract address, or name..."
                    className="w-full p-5 pr-14 bg-void-900/50 border border-cyber-500/30 text-white rounded-xl focus:border-neon-500 focus:ring-2 focus:ring-neon-500/20 focus:outline-none transition-all duration-300 text-lg placeholder-void-400 hover:border-cyber-400/50"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div>Results here</div>
        </div>
      )}
    </div>
  );
}