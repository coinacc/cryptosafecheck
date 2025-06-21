import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './lib/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Crypto Check - Crypto Scam Detector',
  description: 'Analyze cryptocurrency projects for potential scam indicators using AI. Check tokens, DeFi protocols, and crypto investments for safety.',
  keywords: 'cryptocurrency, scam detection, blockchain, security, AI analysis, crypto check, token analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('aiCryptoCheck_theme');
                  if (savedTheme) {
                    if (savedTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  } else {
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (systemPrefersDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-trust-900 transition-colors duration-300">
            <main className="container mx-auto px-6 py-12">
              {children}
            </main>

            <footer className="bg-trust-50 dark:bg-trust-800 border-t border-trust-200 dark:border-trust-700 mt-20">
              <div className="container mx-auto px-6 py-8">
                <div className="text-center text-sm text-trust-500 dark:text-trust-400 space-y-2">
                  <p>
                    This tool is for educational purposes only. Always do your own research before making investment decisions.
                  </p>
                  <p>
                    AI Crypto Check - Built with Next.js, Google Gemini, and Vercel
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
