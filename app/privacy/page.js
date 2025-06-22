import Link from 'next/link';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Datenschutzerklärung | CryptoSafeCheck',
  description: 'Datenschutzerklärung für CryptoSafeCheck - Informationen zum Umgang mit personenbezogenen Daten',
  robots: 'index, follow',
  openGraph: {
    title: 'Datenschutzerklärung | CryptoSafeCheck',
    description: 'Datenschutzerklärung für CryptoSafeCheck',
    type: 'website',
    url: 'https://cryptosafecheck.io/privacy'
  }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <Navigation currentPage="privacy" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Datenschutzerklärung</h1>
            <p className="text-xl text-cyber-200 leading-relaxed">
              Informationen zum Umgang mit personenbezogenen Daten gemäß Art. 13, 14 DSGVO
            </p>
          </header>

          <div className="space-y-8">
            {/* Responsible Party */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">1. Verantwortlicher</h2>
              <div className="text-cyber-200 space-y-3">
                <p>Verantwortlicher im Sinne der DSGVO ist:</p>
                <div className="bg-void-900/50 p-4 rounded-lg">
                  <p className="font-semibold text-white">coinacc GmbH</p>
                  <p>Pasinger Str. 16</p>
                  <p>82166 Gräfelfing</p>
                  <p>Deutschland</p>
                  <p>E-Mail: <a href="mailto:support@coinacc.de" className="text-neon-400 hover:text-neon-300">support@coinacc.de</a></p>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">2. Datenerfassung auf unserer Website</h2>
              
              <div className="space-y-6 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Automatische Datenerfassung</h3>
                  <p className="mb-3">
                    Beim Aufrufen unserer Website werden automatisch Informationen allgemeiner Natur erfasst. 
                    Diese Informationen (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete 
                    Betriebssystem, den Domainnamen Ihres Internet-Service-Providers und ähnliches.
                  </p>
                  <p className="mb-3">Erfasste Daten:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP-Adresse</li>
                    <li>Datum und Uhrzeit der Serveranfrage</li>
                    <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
                    <li>Inhalt der Anforderung (konkrete Seite)</li>
                    <li>Zugriffsstatus/HTTP-Statuscode</li>
                    <li>Browser-Typ und -Version</li>
                    <li>Betriebssystem</li>
                    <li>Referrer URL</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Crypto-Analyse-Service</h3>
                  <p className="mb-3">
                    Bei der Nutzung unseres AI-basierten Crypto-Analyse-Services erfassen wir:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Eingegebene Kryptowährungsbezeichnungen oder Projekt-URLs</li>
                    <li>Analyse-Ergebnisse (anonymisiert)</li>
                    <li>Nutzungszeitpunkt</li>
                    <li>Technische Parameter der Anfrage</li>
                  </ul>
                  <p className="mt-3">
                    Diese Daten werden ausschließlich zur Verbesserung unseres Services und zur 
                    statistischen Auswertung verwendet.
                  </p>
                </div>
              </div>
            </section>

            {/* Purpose and Legal Basis */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">3. Zweck der Datenverarbeitung</h2>
              
              <div className="space-y-6 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Rechtsgrundlagen</h3>
                  <ul className="space-y-2">
                    <li><strong className="text-white">Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigtes Interesse an der ordnungsgemäßen Funktion der Website</li>
                    <li><strong className="text-white">Art. 6 Abs. 1 lit. b DSGVO:</strong> Bereitstellung des Analyse-Services</li>
                    <li><strong className="text-white">Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (bei Cookie-Nutzung)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Zwecke</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Bereitstellung und Optimierung unserer Website</li>
                    <li>Durchführung von Crypto-Sicherheitsanalysen</li>
                    <li>Technische Administration und Sicherheit</li>
                    <li>Statistische Auswertung zur Service-Verbesserung</li>
                    <li>Rechtsverfolgung bei Missbrauch</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third Party Services */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">4. Drittanbieter-Services</h2>
              
              <div className="space-y-6 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Google AI Services</h3>
                  <p className="mb-3">
                    Für unsere AI-basierten Analysen nutzen wir Google AI Services. Dabei werden 
                    Ihre Anfragen an Google-Server übertragen.
                  </p>
                  <p className="mb-3">
                    <strong className="text-white">Datenschutzerklärung:</strong> 
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-neon-400 hover:text-neon-300 ml-2">
                      https://policies.google.com/privacy
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Vercel (Hosting)</h3>
                  <p className="mb-3">
                    Unsere Website wird auf Servern von Vercel Inc. gehostet.
                  </p>
                  <p className="mb-3">
                    <strong className="text-white">Datenschutzerklärung:</strong> 
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" 
                       className="text-neon-400 hover:text-neon-300 ml-2">
                      https://vercel.com/legal/privacy-policy
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Supabase (Datenbank)</h3>
                  <p className="mb-3">
                    Analyse-Daten werden in einer Supabase-Datenbank gespeichert.
                  </p>
                  <p className="mb-3">
                    <strong className="text-white">Datenschutzerklärung:</strong> 
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-neon-400 hover:text-neon-300 ml-2">
                      https://supabase.com/privacy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">5. Speicherdauer</h2>
              
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Automatische Löschung</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong className="text-white">Server-Logfiles:</strong> 30 Tage</li>
                    <li><strong className="text-white">Analyse-Daten:</strong> 24 Monate (anonymisiert nach 6 Monaten)</li>
                    <li><strong className="text-white">Cookies:</strong> Je nach Typ zwischen Session und 2 Jahren</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gesetzliche Aufbewahrungsfristen</h3>
                  <p>
                    Soweit gesetzliche Aufbewahrungsfristen bestehen, werden Daten bis zum Ablauf 
                    dieser Fristen gespeichert.
                  </p>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">6. Ihre Rechte</h2>
              
              <div className="text-cyber-200 space-y-4">
                <p className="mb-4">Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Grundrechte</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                      <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                      <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                      <li>Recht auf Einschränkung (Art. 18 DSGVO)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Weitere Rechte</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                      <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
                      <li>Recht auf Beschwerde bei Aufsichtsbehörde</li>
                      <li>Recht auf Widerruf der Einwilligung</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-void-900/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Kontakt für Datenschutzanfragen</h3>
                  <p>
                    Für Anfragen bezüglich Ihrer Rechte wenden Sie sich an: 
                    <a href="mailto:support@coinacc.de" className="text-neon-400 hover:text-neon-300 ml-2">
                      support@coinacc.de
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">7. Cookies</h2>
              
              <div className="text-cyber-200 space-y-4">
                <p className="mb-4">
                  Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem 
                  Endgerät gespeichert werden.
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookie-Kategorien</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-white">Technisch notwendige Cookies</h4>
                      <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white">Analyse-Cookies</h4>
                      <p>Zur statistischen Auswertung der Website-Nutzung (nur mit Einwilligung).</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white">Marketing-Cookies</h4>
                      <p>Für zukünftige Werbemaßnahmen (nur mit Einwilligung).</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-void-900/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Cookie-Verwaltung</h3>
                  <p>
                    Sie können Ihre Cookie-Einstellungen jederzeit in Ihrem Browser anpassen oder 
                    über unser Cookie-Banner verwalten.
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">8. Änderungen der Datenschutzerklärung</h2>
              <div className="text-cyber-200">
                <p className="mb-3">
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                  aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer 
                  Leistungen in der Datenschutzerklärung umzusetzen.
                </p>
                <p>
                  <strong className="text-white">Stand dieser Datenschutzerklärung:</strong> {new Date().toLocaleDateString('de-DE')}
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}