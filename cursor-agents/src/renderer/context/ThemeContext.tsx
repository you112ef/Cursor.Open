import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  // Detect system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // Update actual theme based on theme setting
  useEffect(() => {
    let newActualTheme: 'light' | 'dark';
    
    if (theme === 'auto') {
      newActualTheme = getSystemTheme();
    } else {
      newActualTheme = theme;
    }

    setActualTheme(newActualTheme);

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newActualTheme);

    // Store theme preference
    localStorage.setItem('cursor-agents-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        const newActualTheme = getSystemTheme();
        setActualTheme(newActualTheme);
        
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newActualTheme);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [theme]);

  // Load theme preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('cursor-agents-theme') as Theme;
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      setThemeState(stored);
    } else {
      // Default to system preference
      setThemeState('auto');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}