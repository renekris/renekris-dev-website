/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        'primary-dark': '#00a8cc',
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#2a2a2a',
        'bg-tertiary': '#333333',
        'text-secondary': '#888888',
        'text-tertiary': '#666666',
        'accent-green': '#00ff88',
        'accent-purple': '#6666ff',
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
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.2)',
        'card': '0 10px 25px rgba(0, 212, 255, 0.1), 0 0 20px rgba(0, 212, 255, 0.05)',
        'card-purple': '0 8px 20px rgba(102, 102, 255, 0.1), 0 0 15px rgba(102, 102, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}