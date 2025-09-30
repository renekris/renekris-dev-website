import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useScrollPosition from '../hooks/useScrollPosition';
import { ThemeToggleMinimal } from './ui/ThemeToggle';

const SmoothScrollNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sections = ['hero', 'contact'];
  const activeSection = useIntersectionObserver(sections);
  const { scrollY, scrollDirection } = useScrollPosition();

  // Hide nav on scroll down, show on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (scrollY > lastScrollY && scrollY > 100 && scrollDirection === 'down') {
      setIsVisible(false);
    } else if (scrollDirection === 'up') {
      setIsVisible(true);
    }
    setLastScrollY(scrollY);
  }, [scrollY, scrollDirection, lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Height of the fixed nav
      const elementPosition = element.offsetTop - navHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { id: 'hero', label: 'Home' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-primary)',
        opacity: 0.95,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <button
            onClick={() => scrollToSection('hero')}
            className="text-2xl font-bold tracking-tight nav-brand"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.02em',
              textShadow: 'none'
            }}
          >
            renekris.dev
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold nav-item ${
                  activeSection === item.id ? 'nav-item-active' : ''
                }`}
                style={{
                  color: activeSection === item.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  backgroundColor: activeSection === item.id ? 'var(--primary)' : 'transparent',
                  border: activeSection === item.id ? 'none' : '1px solid transparent'
                }}
              >
                {item.label}
              </button>
            ))}

            {/* Theme Toggle */}
            <div className="ml-1">
              <ThemeToggleMinimal />
            </div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggleMinimal />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg nav-menu-toggle"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
              aria-label="Toggle navigation menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 border-t"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium nav-item-mobile ${
                    activeSection === item.id ? 'nav-item-active' : ''
                  }`}
                  style={{
                    color: activeSection === item.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    backgroundColor: activeSection === item.id ? 'var(--primary)' : 'transparent'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SmoothScrollNavigation;