(function () {
  const STORAGE_KEY = 'theme-preference';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  const theme = getStoredTheme() ?? getSystemTheme();
  document.documentElement.setAttribute('data-theme', theme);
})();
