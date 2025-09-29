/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        'primary-dark': '#0284C7',
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#2a2a2a',
        'bg-tertiary': '#333333',
        'text-secondary': '#888888',
        'text-tertiary': '#666666',
        'accent-green': '#059669',
        'accent-purple': '#7C3AED',
        // New subtle neon colors
        'neon-blue': '#0EA5E9',
        'neon-purple': '#7C3AED',
        'neon-pink': '#DB2777',
        'neon-cyan': '#0891B2',
        'neon-green': '#059669',
        'neon-orange': '#EA580C',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease both',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '50%': { backgroundPosition: '-200% 0' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'glow': '0 0 12px rgba(14, 165, 233, 0.2)',
        'glow-sm': '0 0 6px rgba(14, 165, 233, 0.15)',
        'card': '0 8px 20px rgba(14, 165, 233, 0.08), 0 0 12px rgba(14, 165, 233, 0.04)',
        'card-purple': '0 6px 16px rgba(124, 58, 237, 0.08), 0 0 12px rgba(124, 58, 237, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}