import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ size = 'default', className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = `
    relative inline-flex items-center justify-center
    bg-gray-200 dark:bg-gray-700
    border-2 border-gray-300 dark:border-gray-600
    rounded-full cursor-pointer
    transition-all duration-300 ease-in-out
    hover:border-blue-400 dark:hover:border-blue-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    focus:ring-offset-white dark:focus:ring-offset-gray-900
    active:scale-95
    group
  `;

  const iconClasses = `
    transition-all duration-300 ease-in-out
    group-hover:scale-110
  `;

  return (
    <button
      onClick={toggleTheme}
      className={`${baseClasses} ${getSizeClasses(size)} ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background circle that slides */}
      <div 
        className={`
          absolute w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md
          transition-transform duration-300 ease-in-out
          ${theme === 'dark' ? 'transform translate-x-6' : 'transform translate-x-0'}
        `}
      />
      
      {/* Sun icon */}
      <FiSun 
        className={`
          ${iconClasses}
          w-4 h-4 text-yellow-500 absolute left-1
          ${theme === 'dark' ? 'opacity-50 scale-90' : 'opacity-100 scale-100'}
        `}
      />
      
      {/* Moon icon */}
      <FiMoon 
        className={`
          ${iconClasses}
          w-4 h-4 text-blue-400 absolute right-1
          ${theme === 'light' ? 'opacity-50 scale-90' : 'opacity-100 scale-100'}
        `}
      />
    </button>
  );
};

// Size variants
const getSizeClasses = (size) => {
  switch (size) {
    case 'small':
      return 'w-10 h-6 p-0.5';
    case 'large':
      return 'w-16 h-8 p-1';
    default:
      return 'w-12 h-6 p-0.5';
  }
};

// Alternative minimal version for tight spaces
export const ThemeToggleMinimal = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-md
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-300
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-900
        active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon className="w-4 h-4" />
      ) : (
        <FiSun className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;