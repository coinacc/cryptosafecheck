'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation({ currentPage = '', onHomeClick = null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="glass-dark rounded-b-2xl border-0 border-b border-neon-500/20">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onHomeClick ? (
              <button onClick={handleHomeClick} className="flex items-center space-x-2 sm:space-x-3 transition-colors group">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyber-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-neon-500 rounded-full border-2 border-void-900"></div>
                </div>
                <span className="text-sm sm:text-base md:text-xl font-bold text-white">
                  <span className="hidden xs:inline">CryptoSafeCheck</span>
                  <span className="xs:hidden">CSC</span>
                </span>
              </button>
            ) : (
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyber-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-neon-500 rounded-full border-2 border-void-950"></div>
                </div>
                <span className="text-sm sm:text-base md:text-xl font-bold text-white">
                  <span className="hidden xs:inline">CryptoSafeCheck</span>
                  <span className="xs:hidden">CSC</span>
                </span>
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-cyber-300 hover:text-cyber-100 transition-colors rounded-md min-h-[44px] min-w-[44px]"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentPage !== 'home' && (
              <Link 
                href="/" 
                className="text-sm text-cyber-300 hover:text-cyber-100 transition-colors px-3 py-2 rounded-md min-h-[44px]"
              >
                Home
              </Link>
            )}
            <Link 
              href="/about" 
              className={`text-sm transition-colors px-3 py-2 rounded-md min-h-[44px] ${
                currentPage === 'about' 
                  ? 'text-neon-300 font-medium hover:text-neon-100 border border-cyber-400/30 bg-void-800/30' 
                  : 'text-cyber-300 hover:text-cyber-100'
              }`}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className={`text-sm transition-colors px-3 py-2 rounded-md min-h-[44px] ${
                currentPage === 'blog' 
                  ? 'text-neon-300 font-medium hover:text-neon-100 border border-cyber-400/30 bg-void-800/30' 
                  : 'text-cyber-300 hover:text-cyber-100'
              }`}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-void-900/95 backdrop-blur-sm border-t border-cyber-400/20">
          <div className="px-3 py-4 space-y-1">
            {currentPage !== 'home' && (
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-cyber-300 hover:text-cyber-100 hover:bg-cyber-900/30 transition-colors px-3 py-3 rounded-md min-h-[44px]"
              >
                Home
              </Link>
            )}
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition-colors px-3 py-3 rounded-md min-h-[44px] ${
                currentPage === 'about' 
                  ? 'text-neon-300 bg-cyber-900/30' 
                  : 'text-cyber-300 hover:text-cyber-100 hover:bg-cyber-900/30'
              }`}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition-colors px-3 py-3 rounded-md min-h-[44px] ${
                currentPage === 'blog' 
                  ? 'text-neon-300 bg-cyber-900/30' 
                  : 'text-cyber-300 hover:text-cyber-100 hover:bg-cyber-900/30'
              }`}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}