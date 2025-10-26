import { createContext, useContext, useEffect, ReactNode } from 'react';

// Always use dark-pure theme - no other options
export type ThemeMode = 'dark-pure';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: 'dark-pure';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Apply pure dark theme to document
 */
function applyThemeClass() {
  const html = document.documentElement;

  // Remove all theme classes
  html.classList.remove('light', 'dark', 'dark-slate', 'dark-pure');

  // Always apply dark-pure theme
  html.classList.add('dark', 'dark-pure');

  // Update meta theme-color for PWA
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', '#0a0a0a');
  }
}

/**
 * Theme Provider Component
 * Always uses dark-pure theme
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: ThemeMode = 'dark-pure';
  const effectiveTheme: 'dark-pure' = 'dark-pure';

  // Apply theme on mount
  useEffect(() => {
    applyThemeClass();
  }, []);

  const setTheme = (_newTheme: ThemeMode) => {
    // No-op - theme is always dark-pure
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
