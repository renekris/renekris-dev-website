import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  let mockMatchMedia;
  let localStorageMock;

  beforeEach(() => {
    mockMatchMedia = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    window.matchMedia = jest.fn(() => mockMatchMedia);

    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.documentElement.className = '';
  });

  describe('Initial Theme', () => {
    it('defaults to light theme when no preference is set', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('uses stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('uses system preference when no stored theme', () => {
      localStorageMock.getItem.mockReturnValue(null);
      mockMatchMedia.matches = true;

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('Theme Toggle', () => {
    it('toggles from light to dark', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Toggle');
      fireEvent.click(button);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('toggles from dark to light', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Toggle');
      fireEvent.click(button);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('saves theme to localStorage on toggle', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Toggle');
      fireEvent.click(button);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('DOM Updates', () => {
    it('adds dark class to document element when theme is dark', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class when theme is light', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('adds theme-loaded class to body', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.body.classList.contains('theme-loaded')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('throws error when useTheme is used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('System Preference Changes', () => {
    it('listens for system preference changes', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('cleans up listener on unmount', () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      unmount();

      expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });
});
