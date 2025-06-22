'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme] = useState('dark'); // Always dark mode
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Always apply dark theme
    document.documentElement.classList.add('dark');
    setIsLoaded(true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
