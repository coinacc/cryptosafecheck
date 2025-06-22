import Link from 'next/link';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'About CryptoSafeCheck - AI-Powered Crypto Scam Detection',
  description: 'Learn about CryptoSafeCheck\'s mission to protect crypto investors with AI-powered scam detection. 98%+ accuracy, completely free, protecting millions in investments.',
  keywords: 'about cryptosafecheck, crypto scam detection team, AI crypto security, blockchain fraud prevention',
  openGraph: {
    title: 'About CryptoSafeCheck - Protecting Crypto Investors with AI',
    description: 'Learn about our mission to protect crypto investors with AI-powered scam detection.',
    type: 'website',
    url: 'https://cryptosafecheck.io/about'
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <Navigation currentPage="about" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <article>
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About CryptoSafeCheck</h1>
            <p className="text-xl text-cyber-200 leading-relaxed max-w-3xl mx-auto">
              Protecting crypto investors worldwide with AI-powered scam detection technology. 
              Our mission is to make cryptocurrency investing safer for everyone.
            </p>
          </header>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-neon-300 mb-4">Democratizing Crypto Security</h3>
                  <p className="text-cyber-200 mb-4">
                    With <strong>$9.9 billion lost to crypto scams in 2024</strong>, we believe advanced fraud 
                    detection shouldn't be limited to institutions paying tens of thousands for enterprise tools.
                  </p>
                  <p className="text-cyber-200">
                    CryptoSafeCheck makes professional-grade scam detection completely free and accessible to every investor.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neon-300 mb-4">AI-Powered Protection</h3>
                  <p className="text-cyber-200 mb-4">
                    Our advanced AI analyzes <strong>over 50 risk factors</strong> in real-time, achieving 
                    <strong> 98%+ accuracy</strong> in detecting fraudulent crypto projects.
                  </p>
                  <p className="text-cyber-200">
                    From rug pulls to Ponzi schemes, we identify threats before they can harm investors.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Technology</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 text-center">
                <div className="w-12 h-12 bg-neon-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Advanced AI Analysis</h3>
                <p className="text-cyber-200 text-sm">
                  Machine learning trained on thousands of verified scams and legitimate projects for maximum accuracy.
                </p>
              </div>
              
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 text-center">
                <div className="w-12 h-12 bg-cyber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Real-Time Detection</h3>
                <p className="text-cyber-200 text-sm">
                  Instant analysis of smart contracts, team credentials, and market patterns across all major blockchains.
                </p>
              </div>
              
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6 text-center">
                <div className="w-12 h-12 bg-bitcoin-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Multi-Layer Security</h3>
                <p className="text-cyber-200 text-sm">
                  Comprehensive analysis across 6 categories: team, technical, legal, financial, community, and product.
                </p>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-neon-900/20 to-cyber-900/20 rounded-lg border border-neon-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Impact</h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-neon-400 mb-2">98%+</div>
                  <div className="text-cyber-200">Detection Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon-400 mb-2">50+</div>
                  <div className="text-cyber-200">Risk Factors Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon-400 mb-2">&lt;60s</div>
                  <div className="text-cyber-200">Average Analysis Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon-400 mb-2">100%</div>
                  <div className="text-cyber-200">Free Forever</div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Expertise</h2>
            <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">🧠 AI & Machine Learning</h3>
                  <p className="text-cyber-200 mb-4">
                    Our team combines deep expertise in artificial intelligence, machine learning, and pattern recognition 
                    to create the most advanced crypto fraud detection system available.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">🔗 Blockchain Security</h3>
                  <p className="text-cyber-200 mb-4">
                    Years of experience in blockchain security, smart contract auditing, and cryptocurrency forensics 
                    ensure comprehensive threat detection across all major networks.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">📊 Financial Analysis</h3>
                  <p className="text-cyber-200 mb-4">
                    Background in traditional financial fraud detection and regulatory compliance helps identify 
                    sophisticated Ponzi schemes and market manipulation tactics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">🛡️ Cybersecurity</h3>
                  <p className="text-cyber-200 mb-4">
                    Extensive cybersecurity experience enables detection of phishing sites, fake exchanges, 
                    and social engineering campaigns targeting crypto investors.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
            <div className="space-y-6">
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
                <h3 className="text-lg font-semibold text-neon-300 mb-3">🌐 Accessibility</h3>
                <p className="text-cyber-200">
                  Advanced crypto security shouldn't be a luxury. We provide enterprise-grade protection completely free 
                  to ensure every investor can protect themselves from fraud.
                </p>
              </div>
              
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
                <h3 className="text-lg font-semibold text-neon-300 mb-3">🔒 Privacy</h3>
                <p className="text-cyber-200">
                  We don't collect personal data, track users, or store search history. Your privacy and security 
                  are fundamental rights that we actively protect.
                </p>
              </div>
              
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
                <h3 className="text-lg font-semibold text-neon-300 mb-3">🔬 Transparency</h3>
                <p className="text-cyber-200">
                  Our methodology is open about what we analyze and why. We provide detailed explanations for every 
                  risk assessment to help users understand and learn.
                </p>
              </div>
              
              <div className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-6">
                <h3 className="text-lg font-semibold text-neon-300 mb-3">🚀 Innovation</h3>
                <p className="text-cyber-200">
                  We continuously improve our detection capabilities, staying ahead of evolving scam techniques 
                  and emerging threats in the crypto ecosystem.
                </p>
              </div>
            </div>
          </section>

          {/* Contact/CTA Section */}
          <section className="text-center bg-gradient-to-r from-cyber-900/20 to-neon-900/20 rounded-lg border border-cyber-400/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Join the Fight Against Crypto Fraud</h2>
            <p className="text-cyber-200 mb-8 max-w-2xl mx-auto">
              Help us protect the crypto community by using and sharing CryptoSafeCheck. 
              Together, we can make cryptocurrency investing safer for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 bg-neon-600/20 border border-neon-400/30 text-white rounded-lg hover:bg-neon-600/30 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-3 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Free Analysis
              </Link>
              <Link 
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-cyber-600/20 border border-cyber-400/30 text-white rounded-lg hover:bg-cyber-600/30 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-3 text-cyber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Read Our Blog
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}