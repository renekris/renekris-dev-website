import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper to check if we're in browser environment
const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

// Helper to safely get cookie value
const getCookie = name => {
  if (!isBrowser()) return null;
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
    return cookie || null;
  } catch {
    return null;
  }
};

// Helper to safely set cookie
const setCookie = (name, value, maxAge = 31536000) => {
  if (!isBrowser()) return;
  try {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch {
    // Silently fail if cookies are disabled
  }
};

// Helper to get system theme preference
const getSystemTheme = () => {
  if (!isBrowser()) return 'light';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeProvider = ({ children }) => {
  // Initialize with safe defaults to prevent hydration mismatches
  const [theme, setTheme] = useState('system');
  const [isClient, setIsClient] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Apply immediate fallback theme for better UX
  useEffect(() => {
    if (isBrowser()) {
      const fallbackTheme = getSystemTheme();
      document.documentElement.setAttribute('data-theme', fallbackTheme);
      setResolvedTheme(fallbackTheme);
    }
  }, []);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);

    // Get initial theme from cookie or default to system
    const savedTheme = getCookie('theme') || 'system';
    console.log('ThemeContext: Initializing with theme:', savedTheme);
    setTheme(savedTheme);
  }, []);

  // Apply theme changes and handle system preference
  useEffect(() => {
    if (!isClient) return;

    console.log('ThemeContext: Applying theme:', theme, 'isClient:', isClient);

    const applyTheme = newTheme => {
      if (!isBrowser()) return;

      const root = document.documentElement;

      // Remove existing theme attribute
      root.removeAttribute('data-theme');

      let actualTheme;
      if (newTheme === 'system') {
        actualTheme = getSystemTheme();
      } else {
        actualTheme = newTheme;
      }

      // Apply the theme
      root.setAttribute('data-theme', actualTheme);
      setResolvedTheme(actualTheme);

      // Persist to cookie
      setCookie('theme', newTheme);
    };

    applyTheme(theme);

    // Listen for system preference changes only if using system theme
    if (theme === 'system' && isBrowser()) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } catch {
        // Silently fail if matchMedia is not supported
      }
    }
  }, [theme, isClient]);

  const toggleTheme = newTheme => {
    setTheme(newTheme);
  };

  // Computed values that are safe for SSR
  const isDark = isClient
    ? theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')
    : false;

  const isLight = isClient
    ? theme === 'light' || (theme === 'system' && resolvedTheme === 'light')
    : true;

  const value = {
    theme,
    toggleTheme,
    isDark,
    isLight,
    resolvedTheme,
    isClient,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
