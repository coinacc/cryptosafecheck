'use client';

import Link from 'next/link';
import { getAllPosts, getFeaturedPosts } from '../lib/blog-data';

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 xs:px-6 md:px-8 py-4 md:py-6">
        <div className="flex items-center space-x-2 xs:space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-colors">
            <div className="relative">
              <div className="w-8 h-8 bg-cyber-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-500 rounded-full border-2 border-void-950"></div>
            </div>
            <span className="text-base xs:text-lg font-semibold text-white">CryptoSafeCheck</span>
          </Link>
        </div>
        <div className="flex items-center space-x-3 xs:space-x-4 md:space-x-6">
          <Link href="/" className="text-sm text-cyber-300 hover:text-cyber-100 transition-colors px-3 py-1 rounded-md">
            Home
          </Link>
          <Link href="/about" className="text-sm text-cyber-300 hover:text-cyber-100 transition-colors px-3 py-1 rounded-md">
            About
          </Link>
          <Link href="/blog" className="text-sm text-neon-300 font-medium hover:text-neon-100 transition-colors border border-cyber-400/30 px-3 py-1 rounded-md bg-void-800/30">
            Blog
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-6xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl xs:text-4xl font-bold text-white mb-4">Crypto Security Blog</h1>
          <p className="text-cyber-200 text-lg">Expert insights on cryptocurrency scam detection and blockchain safety</p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.slug} className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 hover:border-cyber-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-cyber-300 mb-3">
                    <span className="bg-cyber-600/20 px-2 py-1 rounded text-xs">{post.category}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                    <span>•</span>
                    <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-cyber-300 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-cyber-200 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-void-700/50 text-cyber-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-neon-400 hover:text-neon-300 transition-colors text-sm font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <article key={post.slug} className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 hover:border-cyber-400/40 transition-colors">
                <div className="flex items-center gap-2 text-sm text-cyber-300 mb-3">
                  <span className="bg-cyber-600/20 px-2 py-1 rounded text-xs">{post.category}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-cyber-300 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-cyber-200 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <time className="text-xs text-cyber-400">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-neon-400 hover:text-neon-300 transition-colors text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
          <h3 className="text-xl font-bold text-white mb-4">Try Our Free Crypto Scam Checker</h3>
          <p className="text-cyber-200 mb-6">Protect your investments with AI-powered scam detection</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-cyber-600/20 border border-cyber-400/30 text-cyber-100 rounded-md hover:bg-cyber-600/30 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Free Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}