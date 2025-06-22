import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '../../lib/blog-data';
import BlogPost from './BlogPost';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | CryptoSafeCheck Blog'
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      url: `https://cryptosafecheck.io/blog/${post.slug}`,
      images: [{
        url: `/blog-images/${post.slug}-og.png`,
        width: 1200,
        height: 630,
        alt: post.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.description,
      images: [`/blog-images/${post.slug}-og.png`]
    }
  };
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug);

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
          <Link href="/blog" className="text-sm text-cyber-300 hover:text-cyber-100 transition-colors px-3 py-1 rounded-md">
            Blog
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-cyber-400">
          <Link href="/" className="hover:text-cyber-200 transition-colors">Home</Link>
          <span>→</span>
          <Link href="/blog" className="hover:text-cyber-200 transition-colors">Blog</Link>
          <span>→</span>
          <span className="text-cyber-200">{post.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 pb-16">
        <BlogPost post={post} />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-16 border-t border-void-700">
          <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.slug} className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 hover:border-cyber-400/40 transition-colors">
                <h4 className="text-lg font-bold text-white mb-3 line-clamp-2">
                  <Link href={`/blog/${relatedPost.slug}`} className="hover:text-cyber-300 transition-colors">
                    {relatedPost.title}
                  </Link>
                </h4>
                <p className="text-cyber-200 mb-4 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                <Link 
                  href={`/blog/${relatedPost.slug}`}
                  className="text-neon-400 hover:text-neon-300 transition-colors text-sm font-medium"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-16">
        <div className="text-center bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
          <h3 className="text-xl font-bold text-white mb-4">Protect Your Crypto Investments</h3>
          <p className="text-cyber-200 mb-6">Use our free AI-powered scam detector to analyze any cryptocurrency project</p>
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