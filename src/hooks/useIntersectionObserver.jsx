import { useState, useEffect } from 'react';

// Helper to check if we're in browser environment
const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const useIntersectionObserver = (sectionIds, options = {}) => {
  const [activeSection, setActiveSection] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run in browser environment
    if (!isClient || !isBrowser() || !sectionIds.length) return;

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver is not supported in this environment');
      return;
    }

    const defaultOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is 20% from top
      threshold: 0,
    };

    const observerOptions = { ...defaultOptions, ...options };

    let observer;

    try {
      observer = new IntersectionObserver(entries => {
        // Find the entry with the largest intersection ratio
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      }, observerOptions);

      // Observe all sections with error handling
      sectionIds.forEach(id => {
        try {
          const element = document.getElementById(id);
          if (element) {
            observer.observe(element);
          }
        } catch (error) {
          console.warn(`Failed to observe element with id "${id}":`, error);
        }
      });
    } catch (error) {
      console.warn('Failed to create IntersectionObserver:', error);
      return;
    }

    return () => {
      if (observer) {
        try {
          sectionIds.forEach(id => {
            try {
              const element = document.getElementById(id);
              if (element) {
                observer.unobserve(element);
              }
            } catch (error) {
              // Silently fail on cleanup
            }
          });
          observer.disconnect();
        } catch (error) {
          // Silently fail on cleanup
        }
      }
    };
  }, [sectionIds, options, isClient]);

  return activeSection;
};

export default useIntersectionObserver;
