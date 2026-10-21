import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sonicshift_theme') as ThemeMode;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('sonicshift_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const darkActive = mode === 'dark' || (mode === 'system' && mediaQuery.matches);
      setIsDark(darkActive);

      if (darkActive) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('sonicshift_theme', mode);

    const listener = () => {
      if (mode === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mode]);

  return { mode, setMode, isDark };
}
