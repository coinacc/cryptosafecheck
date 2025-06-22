// Blog posts data structure
export const blogPosts = [
  {
    slug: 'how-to-check-if-cryptocurrency-is-scam-2025',
    title: 'How to Check if a Cryptocurrency is a Scam in 2025: Complete Guide',
    description: 'Learn to identify cryptocurrency scams with our comprehensive 2025 guide. Discover warning signs, verification steps, and use our AI tool for instant scam detection.',
    excerpt: 'With crypto scams reaching $9.9 billion in 2024, learn the essential warning signs and verification steps to protect your investments from fraudulent projects.',
    author: 'CryptoSafeCheck Team',
    publishedAt: '2025-01-15',
    updatedAt: '2025-01-15',
    readingTime: '8 min read',
    tags: ['scam detection', 'cryptocurrency safety', 'investor protection'],
    category: 'Guide',
    featured: true,
    metaTitle: 'How to Check if Crypto is Scam 2025 - Complete Guide | CryptoSafeCheck',
    metaDescription: 'Learn to identify cryptocurrency scams in 2025. Expert guide with warning signs, verification steps & free AI scam checker. Protect your crypto investments.',
    keywords: 'how to check if crypto is scam, cryptocurrency scam detection, check if crypto legitimate, crypto scam warning signs'
  },
  {
    slug: 'top-10-crypto-scams-2024-ai-detection',
    title: 'Top 10 Crypto Scams of 2024 and How AI Detection Could Have Prevented Losses',
    description: 'Analyze the biggest cryptocurrency scams of 2024 totaling $9.9 billion in losses. Learn how AI-powered detection tools can protect investors from fraud.',
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
    keywords: 'crypto scams 2024, biggest cryptocurrency scams, AI crypto fraud detection, crypto scam prevention'
  },
  {
    slug: 'free-crypto-scam-checker-vs-paid-tools',
    title: 'Free vs Paid Crypto Scam Checkers: Which Tools Actually Work in 2025?',
    description: 'Compare free and paid cryptocurrency scam detection tools. Discover which features matter most and why CryptoSafeCheck leads in accuracy and accessibility.',
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
    keywords: 'free crypto scam checker, crypto scam detection tools, cryptocurrency safety tools, crypto scam checker comparison'
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