import { useState, useEffect } from 'react';

// Helper to check if we're in browser environment
const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollProgress: 0,
    scrollDirection: null,
  });

  useEffect(() => {
    // Only run scroll tracking in browser environment
    if (!isBrowser()) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollPosition = () => {
      try {
        const currentScrollY = window.scrollY;
        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0;

        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

        setScrollPosition({
          scrollY: currentScrollY,
          scrollProgress: Math.min(100, Math.max(0, scrollProgress)),
          scrollDirection:
            currentScrollY !== lastScrollY ? scrollDirection : null,
        });

        lastScrollY = currentScrollY;
      } catch (error) {
        // Silently fail if any DOM access fails
        console.warn('Scroll position update failed:', error);
      } finally {
        ticking = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    // Add scroll listener with error handling
    try {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateScrollPosition(); // Initial call
    } catch (error) {
      console.warn('Failed to set up scroll listener:', error);
    }

    return () => {
      try {
        window.removeEventListener('scroll', onScroll);
      } catch (error) {
        // Silently fail on cleanup
      }
    };
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
