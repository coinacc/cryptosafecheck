'use client';

export default function CookieButton() {
  const handleCookieSettings = () => {
    alert('Cookie-Einstellungen würden hier geöffnet. In der finalen Version wird hier ein Cookie-Consent-Banner implementiert.');
  };

  return (
    <button 
      onClick={handleCookieSettings}
      className="bg-neon-600/20 border border-neon-400/30 text-white px-6 py-3 rounded-lg hover:bg-neon-600/30 transition-colors"
    >
      🍪 Cookie-Einstellungen verwalten
    </button>
  );
}