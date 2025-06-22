'use client';

import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen matrix-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 xs:px-6 md:px-8 py-4 md:py-6">
        <div className="flex items-center space-x-2 xs:space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 hover-glow">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-cyber-500 to-cyber-700 rounded-lg flex items-center justify-center shadow-sm glass animate-glow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-500 rounded-full border-2 border-void-950 animate-neon-pulse"></div>
            </div>
            <span className="text-base xs:text-lg font-semibold text-gradient-cyber">CryptoSafeCheck</span>
          </Link>
        </div>
        <div className="flex items-center space-x-3 xs:space-x-4 md:space-x-6">
          <Link href="/" className="text-sm text-cyber-300 hover:text-cyber-100 transition-all duration-300 hover:glow-cyber px-3 py-1 rounded-md">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-neon-300 font-medium hover:text-neon-100 transition-all duration-300 neon-border-cyber px-3 py-1 rounded-md glass">
            Blog
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <div className="glass-strong rounded-lg shadow-lg neon-border-cyber p-6 xs:p-8 md:p-12 hover-glow">
          <div className="text-center mb-12">
            <h1 className="text-2xl xs:text-3xl font-bold text-gradient-cyber mb-4">CryptoSafeCheck Blog</h1>
            <p className="text-cyber-200 text-base xs:text-lg">Learn about crypto security, scam detection, and blockchain safety</p>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-16">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-6 glow-cyber animate-float">
              <svg className="w-8 h-8 text-cyber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gradient-neon mb-4">Blog Coming Soon</h2>
            <p className="text-cyber-200 mb-8 max-w-2xl mx-auto">
              We're working on bringing you the latest insights about cryptocurrency security, scam detection techniques, 
              and blockchain safety best practices. Stay tuned for expert analysis and educational content.
            </p>
            
            {/* Planned Content Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 glass rounded-lg hover-glow neon-border">
                <div className="w-10 h-10 glass rounded-lg flex items-center justify-center mb-4 mx-auto glow-bitcoin animate-crypto-bounce">
                  <svg className="w-5 h-5 text-bitcoin-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gradient-bitcoin mb-2">Scam Patterns</h3>
                <p className="text-sm text-cyber-200">Learn to identify common crypto scam tactics and red flags</p>
              </div>
              
              <div className="p-6 glass rounded-lg hover-glow neon-border-cyber">
                <div className="w-10 h-10 glass rounded-lg flex items-center justify-center mb-4 mx-auto glow-neon animate-crypto-bounce">
                  <svg className="w-5 h-5 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gradient-neon mb-2">Safety Tips</h3>
                <p className="text-sm text-cyber-200">Best practices for evaluating crypto projects safely</p>
              </div>
              
              <div className="p-6 glass rounded-lg hover-glow neon-border-bitcoin">
                <div className="w-10 h-10 glass rounded-lg flex items-center justify-center mb-4 mx-auto glow-cyber animate-crypto-bounce">
                  <svg className="w-5 h-5 text-cyber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gradient-cyber mb-2">Analysis Insights</h3>
                <p className="text-sm text-cyber-200">Deep dives into our AI analysis methodology</p>
              </div>
            </div>

            <div className="mt-12">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 glass neon-border-cyber text-cyber-100 rounded-md hover:glow-cyber transition-all duration-300 font-medium shadow-sm hover:shadow-lg active:scale-95 hover-glow"
              >
                <svg className="w-4 h-4 mr-2 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-gradient-neon">Back to Analyzer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}