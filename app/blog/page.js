'use client';

import Link from 'next/link';
import ThemeToggle from '../components/theme-toggle';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-trust-50 dark:bg-trust-900">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-trust-900"></div>
            </div>
            <span className="text-lg font-semibold text-trust-900 dark:text-white">CryptoSafeCheck</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-sm text-trust-500 dark:text-trust-400 hover:text-trust-700 dark:hover:text-trust-300 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-trust-700 dark:text-trust-300 font-medium hover:text-trust-900 dark:hover:text-trust-100 transition-colors">
            Blog
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white dark:bg-trust-800 rounded-lg shadow-sm border border-trust-200 dark:border-trust-700 p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-trust-900 dark:text-white mb-4">CryptoSafeCheck Blog</h1>
            <p className="text-trust-600 dark:text-trust-400 text-lg">Learn about crypto security, scam detection, and blockchain safety</p>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-trust-900 dark:text-white mb-4">Blog Coming Soon</h2>
            <p className="text-trust-600 dark:text-trust-400 mb-8 max-w-2xl mx-auto">
              We're working on bringing you the latest insights about cryptocurrency security, scam detection techniques, 
              and blockchain safety best practices. Stay tuned for expert analysis and educational content.
            </p>
            
            {/* Planned Content Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-trust-50 dark:bg-trust-700 rounded-lg">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-trust-900 dark:text-white mb-2">Scam Patterns</h3>
                <p className="text-sm text-trust-600 dark:text-trust-400">Learn to identify common crypto scam tactics and red flags</p>
              </div>
              
              <div className="p-6 bg-trust-50 dark:bg-trust-700 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-trust-900 dark:text-white mb-2">Safety Tips</h3>
                <p className="text-sm text-trust-600 dark:text-trust-400">Best practices for evaluating crypto projects safely</p>
              </div>
              
              <div className="p-6 bg-trust-50 dark:bg-trust-700 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-trust-900 dark:text-white mb-2">Analysis Insights</h3>
                <p className="text-sm text-trust-600 dark:text-trust-400">Deep dives into our AI analysis methodology</p>
              </div>
            </div>

            <div className="mt-12">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Analyzer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}