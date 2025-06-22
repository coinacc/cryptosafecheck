import Link from 'next/link';
import CookieButton from './CookieButton';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Cookie-Richtlinie | CryptoSafeCheck',
  description: 'Cookie-Richtlinie für CryptoSafeCheck - Informationen über verwendete Cookies',
  robots: 'index, follow',
  openGraph: {
    title: 'Cookie-Richtlinie | CryptoSafeCheck',
    description: 'Cookie-Richtlinie für CryptoSafeCheck',
    type: 'website',
    url: 'https://cryptosafecheck.io/cookies'
  }
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <Navigation currentPage="cookies" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Cookie-Richtlinie</h1>
            <p className="text-xl text-cyber-200 leading-relaxed">
              Informationen über die Verwendung von Cookies auf CryptoSafeCheck
            </p>
          </header>

          <div className="space-y-8">
            {/* What are Cookies */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">1. Was sind Cookies?</h2>
              <div className="text-cyber-200 space-y-4">
                <p>
                  Cookies sind kleine Textdateien, die auf Ihrem Endgerät (Computer, Tablet, Smartphone) 
                  gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen es der Website, 
                  Ihr Gerät zu erkennen und bestimmte Informationen über Ihre Nutzung zu speichern.
                </p>
                <p>
                  Cookies können von der besuchten Website selbst (First-Party-Cookies) oder von 
                  Drittanbietern (Third-Party-Cookies) gesetzt werden.
                </p>
              </div>
            </section>

            {/* Cookie Categories */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">2. Cookie-Kategorien</h2>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-void-900/50 p-6 rounded-lg border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    🔒 Technisch notwendige Cookies (Immer aktiv)
                  </h3>
                  <div className="text-cyber-200 space-y-3">
                    <p className="mb-3">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und 
                      können nicht deaktiviert werden.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-void-800/50 rounded-lg">
                        <thead>
                          <tr className="border-b border-cyber-400/20">
                            <th className="text-left p-3 text-white font-semibold">Cookie-Name</th>
                            <th className="text-left p-3 text-white font-semibold">Zweck</th>
                            <th className="text-left p-3 text-white font-semibold">Laufzeit</th>
                          </tr>
                        </thead>
                        <tbody className="text-cyber-200">
                          <tr className="border-b border-cyber-400/10">
                            <td className="p-3 font-mono text-sm">__session</td>
                            <td className="p-3">Session-Management</td>
                            <td className="p-3">Browser-Session</td>
                          </tr>
                          <tr className="border-b border-cyber-400/10">
                            <td className="p-3 font-mono text-sm">csrf_token</td>
                            <td className="p-3">Sicherheit gegen CSRF-Angriffe</td>
                            <td className="p-3">24 Stunden</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono text-sm">cookie_consent</td>
                            <td className="p-3">Speichert Cookie-Präferenzen</td>
                            <td className="p-3">1 Jahr</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-void-900/50 p-6 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">
                    📊 Analyse-Cookies (Optional)
                  </h3>
                  <div className="text-cyber-200 space-y-3">
                    <p className="mb-3">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
                      indem sie Informationen anonym sammeln und darüber berichten.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-void-800/50 rounded-lg">
                        <thead>
                          <tr className="border-b border-cyber-400/20">
                            <th className="text-left p-3 text-white font-semibold">Service</th>
                            <th className="text-left p-3 text-white font-semibold">Zweck</th>
                            <th className="text-left p-3 text-white font-semibold">Laufzeit</th>
                          </tr>
                        </thead>
                        <tbody className="text-cyber-200">
                          <tr className="border-b border-cyber-400/10">
                            <td className="p-3">Google Analytics*</td>
                            <td className="p-3">Website-Nutzungsstatistiken</td>
                            <td className="p-3">2 Jahre</td>
                          </tr>
                          <tr>
                            <td className="p-3">Vercel Analytics</td>
                            <td className="p-3">Performance-Monitoring</td>
                            <td className="p-3">30 Tage</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-sm mt-3">
                      <em>* Wird nur bei expliziter Einwilligung aktiviert</em>
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-void-900/50 p-6 rounded-lg border border-yellow-500/30">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                    🎯 Marketing-Cookies (Optional)
                  </h3>
                  <div className="text-cyber-200 space-y-3">
                    <p className="mb-3">
                      Diese Cookies werden für zukünftige Werbemaßnahmen verwendet und ermöglichen 
                      personalisierte Anzeigen.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-void-800/50 rounded-lg">
                        <thead>
                          <tr className="border-b border-cyber-400/20">
                            <th className="text-left p-3 text-white font-semibold">Service</th>
                            <th className="text-left p-3 text-white font-semibold">Zweck</th>
                            <th className="text-left p-3 text-white font-semibold">Laufzeit</th>
                          </tr>
                        </thead>
                        <tbody className="text-cyber-200">
                          <tr className="border-b border-cyber-400/10">
                            <td className="p-3">Google AdSense*</td>
                            <td className="p-3">Personalisierte Werbung</td>
                            <td className="p-3">2 Jahre</td>
                          </tr>
                          <tr>
                            <td className="p-3">Google Ad Manager*</td>
                            <td className="p-3">Anzeigenauslieferung</td>
                            <td className="p-3">1 Jahr</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-sm mt-3">
                      <em>* Geplant für zukünftige Implementierung</em>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">3. Cookie-Verwaltung</h2>
              
              <div className="space-y-6 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookie-Einstellungen ändern</h3>
                  <p className="mb-4">
                    Sie können Ihre Cookie-Präferenzen jederzeit ändern:
                  </p>
                  
                  <div className="bg-void-900/50 p-4 rounded-lg">
                    <CookieButton />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Browser-Einstellungen</h3>
                  <p className="mb-3">
                    Sie können Cookies auch direkt in Ihrem Browser verwalten:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong className="text-white">Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies</li>
                    <li><strong className="text-white">Firefox:</strong> Einstellungen → Datenschutz & Sicherheit → Cookies</li>
                    <li><strong className="text-white">Safari:</strong> Einstellungen → Datenschutz → Cookies verwalten</li>
                    <li><strong className="text-white">Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Opt-Out-Links</h3>
                  <p className="mb-3">Für externe Services können Sie sich hier abmelden:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong className="text-white">Google Analytics:</strong> 
                      <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                         className="text-neon-400 hover:text-neon-300 ml-2">
                        Browser Add-on zur Deaktivierung
                      </a>
                    </li>
                    <li>
                      <strong className="text-white">Google Ads:</strong> 
                      <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" 
                         className="text-neon-400 hover:text-neon-300 ml-2">
                        Anzeigeneinstellungen
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Processing */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">4. Datenverarbeitung durch Cookies</h2>
              
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Rechtsgrundlage</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong className="text-white">Technisch notwendige Cookies:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
                    <li><strong className="text-white">Analyse- und Marketing-Cookies:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Datenübertragung in Drittländer</h3>
                  <p className="mb-3">
                    Einige Cookie-Services übertragen Daten in die USA. Die Datenübertragung erfolgt 
                    auf Basis von Angemessenheitsbeschlüssen oder geeigneten Garantien (Standard-Vertragsklauseln).
                  </p>
                  <p>
                    Betroffene Services: Google Analytics, Google AdSense (falls aktiviert)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ihre Rechte</h3>
                  <p className="mb-3">
                    Sie haben das Recht, Ihre Einwilligung jederzeit zu widerrufen. Weitere Informationen 
                    zu Ihren Rechten finden Sie in unserer 
                    <Link href="/privacy" className="text-neon-400 hover:text-neon-300 ml-1">
                      Datenschutzerklärung
                    </Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* Technical Details */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">5. Technische Details</h2>
              
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookie-Arten</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Session-Cookies</h4>
                      <p>Werden gelöscht, wenn Sie den Browser schließen</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Persistente Cookies</h4>
                      <p>Bleiben für eine bestimmte Zeit gespeichert</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">First-Party-Cookies</h4>
                      <p>Direkt von CryptoSafeCheck gesetzt</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Third-Party-Cookies</h4>
                      <p>Von externen Diensten gesetzt</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Auswirkungen bei Deaktivierung</h3>
                  <p className="mb-3">
                    Wenn Sie bestimmte Cookies deaktivieren, kann dies die Funktionalität 
                    der Website beeinträchtigen:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Technisch notwendige Cookies: Website möglicherweise nicht voll funktionsfähig</li>
                    <li>Analyse-Cookies: Keine Auswirkung auf die Nutzung</li>
                    <li>Marketing-Cookies: Weniger relevante Werbung</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">6. Aktualisierungen</h2>
              <div className="text-cyber-200">
                <p className="mb-3">
                  Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um Änderungen 
                  in unserer Praxis oder aus anderen betrieblichen, rechtlichen oder regulatorischen 
                  Gründen zu berücksichtigen.
                </p>
                <p>
                  <strong className="text-white">Stand dieser Cookie-Richtlinie:</strong> {new Date().toLocaleDateString('de-DE')}
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">7. Kontakt</h2>
              <div className="text-cyber-200">
                <p className="mb-4">
                  Bei Fragen zu unserer Cookie-Verwendung kontaktieren Sie uns:
                </p>
                <div className="bg-void-900/50 p-4 rounded-lg">
                  <p className="font-semibold text-white">coinacc GmbH</p>
                  <p>E-Mail: <a href="mailto:support@coinacc.de" className="text-neon-400 hover:text-neon-300">support@coinacc.de</a></p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}