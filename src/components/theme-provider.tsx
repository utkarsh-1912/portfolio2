'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({ theme: 'light', setTheme: () => null });

/**
 * The initial theme is applied before paint by the inline script in the root layout
 * (saved choice, else the OS setting), so there's no light/dark flash. This provider
 * picks that up, follows OS changes until the visitor chooses, and saves explicit choices.
 */
export function ThemeProvider({ children, storageKey = 'ui-theme' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const root = document.documentElement;
    setThemeState(root.classList.contains('dark') ? 'dark' : 'light');

    // Follow the OS setting live, unless the visitor has picked a theme
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(storageKey); } catch { /* storage unavailable */ }
      if (saved) return;
      const next: Theme = e.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      setThemeState(next);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [storageKey]);

  const setTheme = (next: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next);
    try { localStorage.setItem(storageKey, next); } catch { /* storage unavailable */ }
    setThemeState(next);
  };

  return <ThemeProviderContext.Provider value={{ theme, setTheme }}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => useContext(ThemeProviderContext);
