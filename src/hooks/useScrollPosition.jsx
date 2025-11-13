import { useState, useEffect } from 'react';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollProgress: 0,
    scrollDirection: null
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0;
      
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      setScrollPosition({
        scrollY: currentScrollY,
        scrollProgress: Math.min(100, Math.max(0, scrollProgress)),
        scrollDirection: currentScrollY !== lastScrollY ? scrollDirection : null
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollPosition(); // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return scrollPosition;
};

export default useScrollPosition;