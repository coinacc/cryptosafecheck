import Link from 'next/link';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Allgemeine Geschäftsbedingungen | CryptoSafeCheck',
  description: 'Allgemeine Geschäftsbedingungen für die Nutzung von CryptoSafeCheck',
  robots: 'index, follow',
  openGraph: {
    title: 'Allgemeine Geschäftsbedingungen | CryptoSafeCheck',
    description: 'Allgemeine Geschäftsbedingungen für CryptoSafeCheck',
    type: 'website',
    url: 'https://cryptosafecheck.io/terms'
  }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <Navigation currentPage="terms" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Allgemeine Geschäftsbedingungen</h1>
            <p className="text-xl text-cyber-200 leading-relaxed">
              Nutzungsbedingungen für CryptoSafeCheck
            </p>
          </header>

          <div className="space-y-8">
            {/* Scope */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">1. Geltungsbereich</h2>
              <div className="text-cyber-200 space-y-4">
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Website 
                  CryptoSafeCheck (cryptosafecheck.io) und aller damit verbundenen Services der 
                  coinacc GmbH.
                </p>
                <p>
                  Mit der Nutzung unserer Website stimmen Sie diesen AGB zu. Sollten Sie mit den 
                  Bedingungen nicht einverstanden sein, unterlassen Sie bitte die Nutzung unserer Website.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">2. Leistungsbeschreibung</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">CryptoSafeCheck Service</h3>
                  <p className="mb-3">
                    CryptoSafeCheck ist ein kostenloser, AI-basierter Service zur Analyse von 
                    Kryptowährungsprojekten hinsichtlich potentieller Betrugsrisiken.
                  </p>
                  <p className="mb-3">Der Service umfasst:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Automatisierte Analyse von Kryptowährungsprojekten</li>
                    <li>Risikobewertung basierend auf AI-Algorithmen</li>
                    <li>Bereitstellung von Analyseergebnissen und Empfehlungen</li>
                    <li>Informative Blog-Artikel zu Kryptowährungssicherheit</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Kostenfreie Nutzung</h3>
                  <p>
                    Der Service wird derzeit kostenfrei angeboten. Wir behalten uns vor, in Zukunft 
                    Premium-Features einzuführen oder Werbung zu schalten.
                  </p>
                </div>
              </div>
            </section>

            {/* User Obligations */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">3. Nutzerpflichten</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Erlaubte Nutzung</h3>
                  <p className="mb-3">Sie verpflichten sich, unseren Service nur für folgende Zwecke zu nutzen:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Informative Analyse von Kryptowährungsprojekten</li>
                    <li>Bildungs- und Forschungszwecke</li>
                    <li>Persönliche Investitionsentscheidungen (auf eigene Verantwortung)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Verbotene Nutzung</h3>
                  <p className="mb-3">Folgende Nutzungen sind untersagt:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kommerzielle Nutzung ohne vorherige Genehmigung</li>
                    <li>Automatisierte Abfragen (Bots, Scraping) ohne Erlaubnis</li>
                    <li>Manipulation oder Reverse Engineering des Services</li>
                    <li>Nutzung für illegale Aktivitäten</li>
                    <li>Verbreitung von Malware oder schädlichen Inhalten</li>
                    <li>Verletzung von Rechten Dritter</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">4. Haftungsausschluss</h2>
              <div className="text-cyber-200 space-y-4">
                <div className="bg-void-900/50 p-4 rounded-lg border border-red-500/30">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Wichtiger Haftungsausschluss</h3>
                  <p className="mb-3">
                    <strong className="text-white">CryptoSafeCheck dient ausschließlich Informationszwecken und 
                    stellt keine Anlageberatung dar.</strong>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">AI-Analyse Limitationen</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>AI-Analysen sind nicht 100% fehlerfrei</li>
                    <li>Algorithmen können Marktentwicklungen nicht vorhersagen</li>
                    <li>Analyseergebnisse basieren auf verfügbaren Daten zum Zeitpunkt der Abfrage</li>
                    <li>Neue Betrugsmaschen können unerkannt bleiben</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Keine Gewährleistung</h3>
                  <p className="mb-3">Wir übernehmen keine Gewährleistung für:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Vollständigkeit und Richtigkeit der Analyseergebnisse</li>
                    <li>Verfügbarkeit des Services</li>
                    <li>Aktualität der verwendeten Daten</li>
                    <li>Eignung für spezifische Investitionsentscheidungen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Investitionsrisiko</h3>
                  <p>
                    <strong className="text-red-400">Alle Investitionen in Kryptowährungen erfolgen auf eigenes Risiko. 
                    Informieren Sie sich umfassend und konsultieren Sie bei Bedarf einen Finanzberater.</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Liability */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">5. Haftungsbeschränkung</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Haftungsausschluss</h3>
                  <p className="mb-3">
                    Die coinacc GmbH haftet nicht für Schäden, die durch die Nutzung von CryptoSafeCheck 
                    entstehen, insbesondere nicht für:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Finanzielle Verluste durch Investitionsentscheidungen</li>
                    <li>Schäden durch unerkannte Betrugsmaschen</li>
                    <li>Technische Ausfälle oder Datenverlust</li>
                    <li>Mittelbare oder Folgeschäden</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gesetzliche Haftung</h3>
                  <p>
                    Die Haftung für Vorsatz, grobe Fahrlässigkeit und Schäden aus der Verletzung 
                    des Lebens, des Körpers oder der Gesundheit bleibt unberührt.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">6. Urheberrecht und geistiges Eigentum</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Unsere Rechte</h3>
                  <p className="mb-3">
                    Alle Inhalte von CryptoSafeCheck (Texte, Bilder, Logos, Software, Algorithmen) 
                    sind urheberrechtlich geschützt und Eigentum der coinacc GmbH.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Nutzungsrechte</h3>
                  <p className="mb-3">Sie erhalten das Recht:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Den Service für private Zwecke zu nutzen</li>
                    <li>Analyseergebnisse für eigene Entscheidungen zu verwenden</li>
                    <li>Blog-Artikel zu teilen (mit Quellenangabe)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Verbote</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Reproduktion oder Vervielfältigung ohne Genehmigung</li>
                    <li>Verkauf oder kommerzielle Verwertung von Inhalten</li>
                    <li>Reverse Engineering der AI-Algorithmen</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">7. Beendigung der Nutzung</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Kündigung durch Nutzer</h3>
                  <p>
                    Sie können die Nutzung jederzeit ohne Einhaltung einer Frist beenden, 
                    indem Sie die Website nicht mehr aufrufen.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sperrung durch uns</h3>
                  <p className="mb-3">
                    Wir behalten uns vor, Nutzern den Zugang zu sperren bei:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Verstoß gegen diese AGB</li>
                    <li>Missbrauch des Services</li>
                    <li>Illegaler Nutzung</li>
                    <li>Technischen Sicherheitsgründen</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Changes */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">8. Änderungen der AGB</h2>
              <div className="text-cyber-200 space-y-4">
                <p>
                  Wir behalten uns vor, diese AGB bei Bedarf anzupassen. Änderungen werden 
                  auf der Website veröffentlicht und gelten ab dem Zeitpunkt der Veröffentlichung.
                </p>
                <p>
                  Bei wesentlichen Änderungen werden wir Sie über die Website oder per E-Mail 
                  informieren (sofern Sie Kontakt mit uns aufgenommen haben).
                </p>
              </div>
            </section>

            {/* Applicable Law */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">9. Anwendbares Recht</h2>
              <div className="text-cyber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Deutsches Recht</h3>
                  <p>
                    Für diese AGB und die Nutzung von CryptoSafeCheck gilt deutsches Recht 
                    unter Ausschluss des UN-Kaufrechts.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gerichtsstand</h3>
                  <p>
                    Ausschließlicher Gerichtsstand für alle Streitigkeiten ist München, 
                    sofern Sie Kaufmann, juristische Person des öffentlichen Rechts oder 
                    öffentlich-rechtliches Sondervermögen sind.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">10. Kontakt</h2>
              <div className="text-cyber-200">
                <p className="mb-4">
                  Bei Fragen zu diesen AGB wenden Sie sich an:
                </p>
                <div className="bg-void-900/50 p-4 rounded-lg">
                  <p className="font-semibold text-white">coinacc GmbH</p>
                  <p>E-Mail: <a href="mailto:support@coinacc.de" className="text-neon-400 hover:text-neon-300">support@coinacc.de</a></p>
                </div>
                <p className="mt-4">
                  <strong className="text-white">Stand der AGB:</strong> {new Date().toLocaleDateString('de-DE')}
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}