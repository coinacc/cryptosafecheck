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

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
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