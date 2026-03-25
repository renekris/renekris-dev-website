(function () {
  const STORAGE_KEY = 'theme-preference';
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');

  if (themeButtons.length === 0) {
    return;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('theme-loaded');

    themeButtons.forEach((button) => {
      const showLightIcon = theme === 'light';
      button.querySelector('[data-theme-icon="light"]')?.classList.toggle('hidden', !showLightIcon);
      button.querySelector('[data-theme-icon="dark"]')?.classList.toggle('hidden', showLightIcon);
      button.setAttribute('aria-label', `Current theme: ${theme}. Click to toggle.`);
      button.setAttribute('title', `Theme: ${theme} (click to toggle)`);
    });
  }

  applyTheme(getStoredTheme() ?? getSystemTheme());

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = getCurrentTheme() === 'light' ? 'dark' : 'light';
      setStoredTheme(nextTheme);
      applyTheme(nextTheme);
    });
  });
})();
