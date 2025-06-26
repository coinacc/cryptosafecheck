import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './lib/theme-context'
import CookieConsent from './components/CookieConsent'

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
    google: 'google6670885e29916006'
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
        
        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Ie Ts Ms Ee Es Rs capture Ge calculateEventProperties Os register register_once register_for_session unregister unregister_for_session js getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Ds Fs createPersonProfile Ls Ps opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Cs debug I As getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_TzopsiBbGsvLRbMxUSY1n9HaRt2FVmjGwkCI884jhEF', {
                api_host: 'https://us.i.posthog.com',
                person_profiles: 'never',
                persistence: 'localStorage'
              })
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
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-center md:text-left text-sm text-trust-400">
                    <p className="mb-2">
                      This tool is for educational purposes only. Always do your own research before making investment decisions.
                    </p>
                    <p>
                      CryptoSafeCheck - Built with Next.js, Google Gemini, and Vercel
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
                    <a href="/impressum" className="text-trust-300 hover:text-white transition-colors">
                      Impressum
                    </a>
                    <a href="/privacy" className="text-trust-300 hover:text-white transition-colors">
                      Datenschutz
                    </a>
                    <a href="/terms" className="text-trust-300 hover:text-white transition-colors">
                      AGB
                    </a>
                    <a href="/cookies" className="text-trust-300 hover:text-white transition-colors font-medium">
                      🍪 Cookie Settings
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            <CookieConsent />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
