export const metadata = {
  title: 'Crypto Scam Detection Blog - Expert Analysis & Security Tips',
  description: 'Learn about cryptocurrency scams, security best practices, and expert analysis from CryptoSafeCheck. Stay protected with the latest fraud detection insights.',
  keywords: 'crypto scam blog, cryptocurrency security, blockchain fraud detection, crypto safety tips, scam analysis',
  openGraph: {
    title: 'Crypto Scam Detection Blog - Expert Analysis & Security Tips',
    description: 'Learn about cryptocurrency scams, security best practices, and expert analysis from CryptoSafeCheck.',
    type: 'website',
    url: 'https://cryptosafecheck.io/blog'
  }
};

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 to-void-900">
      {children}
    </div>
  );
}