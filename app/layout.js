import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './lib/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Free AI Crypto Scam Checker - Detect Scams Instantly | CryptoSafeCheck',
  description: 'Check if any cryptocurrency is a scam with our free AI-powered tool. Instant analysis of crypto projects. Protect your investments from rug pulls and fraud.',
  keywords: 'crypto scam checker, cryptocurrency scam detector, check if crypto is scam, AI crypto fraud detection, free crypto safety tool, rug pull detector, crypto scam analysis',
  authors: [{ name: 'CryptoSafeCheck Team' }],
  creator: 'CryptoSafeCheck',
  publisher: 'CryptoSafeCheck',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cryptosafecheck.io',
    title: 'Free AI Crypto Scam Checker - Detect Scams Instantly',
    description: 'Check if any cryptocurrency is a scam with our free AI-powered tool. Instant analysis of crypto projects.',
    siteName: 'CryptoSafeCheck',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CryptoSafeCheck - AI Crypto Scam Detection Tool'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Crypto Scam Checker - Detect Scams Instantly',
    description: 'Check if any cryptocurrency is a scam with our free AI-powered tool.',
    images: ['/og-image.png']
  },
  verification: {
    google: 'your-google-verification-code'
  },
  metadataBase: new URL('https://cryptosafecheck.io')
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://cryptosafecheck.io" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CryptoSafeCheck",
              "url": "https://cryptosafecheck.io",
              "description": "AI-powered cryptocurrency scam detection tool",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "CryptoSafeCheck",
                "url": "https://cryptosafecheck.io"
              },
              "featureList": [
                "AI-powered scam detection",
                "Real-time crypto analysis",
                "Free safety checks",
                "Comprehensive risk assessment"
              ]
            })
          }}
        />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Always use dark mode
                  document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-trust-900 transition-colors duration-300">
            <main className="container mx-auto px-6 py-12">
              {children}
            </main>

            <footer className="bg-trust-800 border-t border-trust-700 mt-20">
              <div className="container mx-auto px-6 py-8">
                <div className="text-center text-sm text-trust-400 space-y-2">
                  <p>
                    This tool is for educational purposes only. Always do your own research before making investment decisions.
                  </p>
                  <p>
                    CryptoSafeCheck - Built with Next.js, Google Gemini, and Vercel
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
