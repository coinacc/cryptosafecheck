'use client';

export default function CookieButton() {
  const handleCookieSettings = () => {
    // Clear existing consent to trigger the banner/settings
    localStorage.removeItem('cryptosafecheck_cookie_consent');
    // Reload the page to show the banner
    window.location.reload();
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