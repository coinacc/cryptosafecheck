// Blog posts data structure
export const blogPosts = [
  {
    slug: 'how-to-check-if-cryptocurrency-is-scam-2025',
    title: 'How to Check if a Cryptocurrency is a Scam in 2025: Complete Guide with Rug Pull Checker',
    description: 'Learn to identify cryptocurrency scams with our comprehensive 2025 guide. Includes rug pull checker, honeypot detector, smart contract scanner, and free AI tool for instant scam detection.',
    excerpt: 'With crypto scams reaching $9.9 billion in 2024, learn the essential warning signs and verification steps to protect your investments from fraudulent projects.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-15',
    updatedAt: '2025-01-15',
    readingTime: '8 min read',
    tags: ['scam detection', 'cryptocurrency safety', 'investor protection'],
    category: 'Guide',
    featured: true,
    metaTitle: 'How to Check if Crypto is Scam 2025 - Complete Guide | CryptoSafeCheck',
    metaDescription: 'Learn to identify cryptocurrency scams in 2025 with rug pull checker & honeypot detector. Expert guide with warning signs, smart contract scanner & free AI tool.',
    keywords: 'how to check if crypto is scam, cryptocurrency scam detection, check if crypto legitimate, crypto scam warning signs, crypto rug pull checker, honeypot detector, smart contract scanner, free rug pull detector'
  },
  {
    slug: 'top-10-crypto-scams-2024-ai-detection',
    title: 'Top 10 Crypto Scams of 2024 and How AI Detection Could Have Prevented Losses',
    description: 'Analyze the biggest cryptocurrency scams of 2024 totaling $9.9 billion in losses. Learn how AI-powered detection tools, smart contract scanners, and liquidity checkers can protect investors from fraud.',
    excerpt: 'From rug pulls to pig butchering schemes, discover how $9.9 billion was lost to crypto scams in 2024 and how AI detection is fighting back.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-10',
    updatedAt: '2025-01-10',
    readingTime: '12 min read',
    tags: ['crypto scams 2024', 'AI detection', 'fraud prevention'],
    category: 'Analysis',
    featured: true,
    metaTitle: 'Top 10 Crypto Scams 2024 - AI Detection Analysis | CryptoSafeCheck',
    metaDescription: 'Discover the biggest crypto scams of 2024 ($9.9B lost) and how AI detection tools prevent fraud. Real case studies & protection strategies.',
    keywords: 'crypto scams 2024, biggest cryptocurrency scams, AI crypto fraud detection, crypto scam prevention, smart contract scanner, liquidity checker, blockchain security tools, defi scam detection'
  },
  {
    slug: 'free-crypto-scam-checker-vs-paid-tools',
    title: 'Free Crypto Scam Checker Comparison: Rug Pull Detectors, Honeypot Checkers & Smart Contract Scanners',
    description: 'Compare 15+ free and paid cryptocurrency scam detection tools including rug pull detectors, honeypot checkers, smart contract scanners, and liquidity checkers. Find the best protection for 2025.',
    excerpt: 'Not all crypto scam checkers are equal. Compare features, accuracy, and costs to find the best tool for protecting your investments.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-05',
    updatedAt: '2025-01-05',
    readingTime: '10 min read',
    tags: ['crypto tools', 'scam checker comparison', 'free tools'],
    category: 'Comparison',
    featured: false,
    metaTitle: 'Free vs Paid Crypto Scam Checkers 2025 - Tool Comparison | CryptoSafeCheck',
    metaDescription: 'Compare free vs paid crypto scam detection tools. Features, accuracy & cost analysis. Find the best crypto safety checker for 2025.',
    keywords: 'free crypto scam checker, crypto scam detection tools, cryptocurrency safety tools, crypto scam checker comparison, free rug pull detector, honeypot checker tools, smart contract scanner free, liquidity checker crypto, blockchain scanner comparison'
  },
  {
    slug: 'ultimate-crypto-safety-toolkit-2025',
    title: 'Ultimate Crypto Safety Toolkit: Free Scanners, Detectors & Checkers for 2025',
    description: 'Complete guide to free crypto safety tools including rug pull checkers, honeypot detectors, smart contract scanners, and liquidity analyzers. Protect your investments with this comprehensive toolkit.',
    excerpt: 'Master every essential crypto safety tool in one comprehensive guide. From rug pull detection to smart contract analysis, protect your investments with professional-grade free tools.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-20',
    updatedAt: '2025-01-20',
    readingTime: '15 min read',
    tags: ['crypto tools', 'safety toolkit', 'scam detection', 'defi security'],
    category: 'Ultimate Guide',
    featured: true,
    metaTitle: 'Ultimate Crypto Safety Toolkit 2025 - Free Rug Pull Checker & More | CryptoSafeCheck',
    metaDescription: 'Master crypto safety with our ultimate toolkit guide. Free rug pull checker, honeypot detector, smart contract scanner, liquidity checker & AI detection tools.',
    keywords: 'crypto rug pull checker, honeypot detector, smart contract scanner, liquidity checker, fake token detector, blockchain scanner tools, defi safety toolkit, crypto security tools 2025'
  },
  {
    slug: 'real-time-ai-crypto-scam-detection-2025',
    title: 'Real-Time Crypto Scam Alerts: How AI Detects Fraud Before You Invest',
    description: 'Discover how AI-powered real-time scam detection protects crypto investors. Learn about automated fraud detection, blockchain monitoring, and instant safety alerts for 2025.',
    excerpt: 'AI technology now detects crypto scams in real-time, protecting investors before they lose money. Learn how automated detection systems work and why they are essential for 2025.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-25',
    updatedAt: '2025-01-25',
    readingTime: '12 min read',
    tags: ['AI detection', 'real-time alerts', 'fraud prevention', 'blockchain monitoring'],
    category: 'Technology',
    featured: true,
    metaTitle: 'Real-Time AI Crypto Scam Detection 2025 - Instant Fraud Alerts | CryptoSafeCheck',
    metaDescription: 'How AI detects crypto scams in real-time before you invest. Automated fraud detection, instant alerts, blockchain monitoring & protection strategies for 2025.',
    keywords: 'AI crypto scam detection, real-time scam alerts crypto, automated fraud detection blockchain, instant crypto safety checker, AI blockchain monitoring, crypto fraud prevention 2025'
  }
];

// Get featured posts
export function getFeaturedPosts() {
  return blogPosts.filter(post => post.featured);
}

// Get all posts
export function getAllPosts() {
  return blogPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// Get post by slug
export function getPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

// Get posts by category
export function getPostsByCategory(category) {
  return blogPosts.filter(post => post.category === category);
}

// Get related posts
export function getRelatedPosts(currentSlug, limit = 3) {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  const related = blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
    
  return related;
}