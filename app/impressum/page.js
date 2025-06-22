import Link from 'next/link';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Impressum | CryptoSafeCheck',
  description: 'Impressum und rechtliche Angaben für CryptoSafeCheck - coinacc GmbH',
  robots: 'index, follow',
  openGraph: {
    title: 'Impressum | CryptoSafeCheck',
    description: 'Impressum und rechtliche Angaben für CryptoSafeCheck',
    type: 'website',
    url: 'https://cryptosafecheck.io/impressum'
  }
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {/* Header */}
      <Navigation currentPage="impressum" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-6 md:px-8 py-8 md:py-12">
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Impressum</h1>
            <p className="text-xl text-cyber-200 leading-relaxed">
              Angaben gemäß § 5 TMG (Telemediengesetz)
            </p>
          </header>

          <div className="space-y-8">
            {/* Company Information */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Firmeninformationen</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Anbieter</h3>
                  <p>coinacc GmbH</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Anschrift</h3>
                  <p>
                    Pasinger Str. 16<br />
                    82166 Gräfelfing<br />
                    Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Geschäftsführer</h3>
                  <p>Abdullah Cetinbag-Hutter</p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Kontakt</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">E-Mail</h3>
                  <p>
                    <a href="mailto:support@coinacc.de" className="text-neon-400 hover:text-neon-300 transition-colors">
                      support@coinacc.de
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Legal Information */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Registereintrag</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Registergericht</h3>
                  <p>Amtsgericht München</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Handelsregisternummer</h3>
                  <p>HRB 285385</p>
                </div>
              </div>
            </section>

            {/* Tax Information */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Steuerliche Angaben</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Umsatzsteuer-Identifikationsnummer</h3>
                  <p>gem. § 27a UStG: DE362454583</p>
                </div>
              </div>
            </section>

            {/* Media Responsibility */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Medienverantwortung</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Verantwortlich gemäß § 18 MStV</h3>
                  <p>Abdullah Cetinbag-Hutter</p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-void-800/30 rounded-lg border border-cyber-400/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Haftungsausschluss</h2>
              <div className="space-y-4 text-cyber-200">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Haftung für Inhalte</h3>
                  <p className="mb-3">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                    fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                    rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Haftung für AI-Analysen</h3>
                  <p className="mb-3">
                    Die auf dieser Website bereitgestellten AI-Analysen von Kryptowährungsprojekten 
                    dienen ausschließlich Informationszwecken. Sie stellen keine Anlageberatung oder 
                    Empfehlung zum Kauf oder Verkauf von Kryptowährungen dar. Alle Investitionen 
                    erfolgen auf eigenes Risiko.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir 
                    keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine 
                    Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
                    Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}