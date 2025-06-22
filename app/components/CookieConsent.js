'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cryptosafecheck_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }

    // Listen for custom event to open settings
    const handleOpenSettings = () => {
      // Load current preferences before opening settings
      const currentConsent = localStorage.getItem('cryptosafecheck_cookie_consent');
      if (currentConsent) {
        const currentPreferences = JSON.parse(currentConsent);
        console.log('Loading current preferences:', currentPreferences);
        setPreferences(currentPreferences);
      }
      setShowSettings(true);
      setShowBanner(false);
    };

    window.addEventListener('openCookieSettings', handleOpenSettings);
    
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenSettings);
    };
  }, []);

  const savePreferences = (prefs) => {
    localStorage.setItem('cryptosafecheck_cookie_consent', JSON.stringify({
      ...prefs,
      timestamp: Date.now(),
      version: '1.0'
    }));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Here you would typically initialize analytics/marketing tools based on preferences
    console.log('Cookie preferences saved:', prefs);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
  };

  const acceptNecessaryOnly = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false
    });
  };

  const handleCustomSave = () => {
    savePreferences(preferences);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  // Check if user has given consent (show floating button)
  const hasConsent = !showBanner && !showSettings;
  const shouldShowFloatingButton = hasConsent && localStorage.getItem('cryptosafecheck_cookie_consent');

  if (!showBanner && !showSettings && !shouldShowFloatingButton) {
    return null;
  }

  return (
    <>
      {/* Floating Cookie Settings Button */}
      {shouldShowFloatingButton && (
        <button
          onClick={openSettings}
          className="fixed bottom-6 right-6 z-40 bg-void-800/90 backdrop-blur-sm border border-cyber-400/30 text-white p-3 rounded-full hover:bg-void-700/90 transition-all duration-300 hover:scale-110 shadow-lg"
          title="Cookie-Einstellungen"
          aria-label="Cookie-Einstellungen öffnen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}

      {/* Cookie Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-void-900/95 backdrop-blur-sm border-t border-cyber-400/30 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-neon-600/20 rounded-lg flex items-center justify-center">
                    🍪
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cookie-Einstellungen</h3>
                </div>
                <p className="text-cyber-200 text-sm leading-relaxed">
                  Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu optimieren. 
                  Technisch notwendige Cookies sind für die Grundfunktionen erforderlich. 
                  Sie können Ihre Präferenzen anpassen oder allen Cookies zustimmen.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                <button
                  onClick={openSettings}
                  className="px-4 py-2 text-sm border border-cyber-400/30 text-cyber-300 hover:text-white hover:border-cyber-300 rounded-lg transition-colors"
                >
                  Einstellungen
                </button>
                <button
                  onClick={acceptNecessaryOnly}
                  className="px-4 py-2 text-sm bg-void-800 text-white hover:bg-void-700 rounded-lg transition-colors border border-void-600"
                >
                  Nur Notwendige
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm bg-neon-600 text-white hover:bg-neon-500 rounded-lg transition-colors font-medium"
                >
                  Alle Akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-void-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-void-900 border border-cyber-400/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Cookie-Einstellungen</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-cyber-300 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-cyber-400/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">🔒 Technisch Notwendige Cookies</h3>
                      <p className="text-sm text-cyber-300">Erforderlich für die Grundfunktionen</p>
                    </div>
                    <div className="text-sm text-cyber-400">Immer aktiv</div>
                  </div>
                  <p className="text-sm text-cyber-200">
                    Diese Cookies sind für die Funktionsweise der Website erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-cyber-400/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">📊 Analyse-Cookies</h3>
                      <p className="text-sm text-cyber-300">Website-Nutzungsstatistiken</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-cyber-200">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren (Google Analytics, Vercel Analytics).
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-cyber-400/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">🎯 Marketing-Cookies</h3>
                      <p className="text-sm text-cyber-300">Personalisierte Werbung</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-cyber-200">
                    Ermöglichen personalisierte Anzeigen basierend auf Ihren Interessen (Google AdSense, geplant).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-cyber-400/20">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm border border-cyber-400/30 text-cyber-300 hover:text-white hover:border-cyber-300 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={acceptNecessaryOnly}
                  className="px-4 py-2 text-sm bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 hover:text-white rounded-lg transition-colors"
                >
                  Alle Widerrufen
                </button>
                <button
                  onClick={handleCustomSave}
                  className="px-6 py-2 text-sm bg-neon-600 text-white hover:bg-neon-500 rounded-lg transition-colors font-medium flex-1 sm:flex-none"
                >
                  Einstellungen Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}