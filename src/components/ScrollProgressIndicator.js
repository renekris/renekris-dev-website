import React from 'react';
import useScrollPosition from '../hooks/useScrollPosition';

const ScrollProgressIndicator = () => {
  const { scrollProgress } = useScrollPosition();

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[60] h-1 transition-colors duration-200"
      style={{ backgroundColor: 'var(--border-secondary)' }}
    >
      <div 
        className="h-full transition-all duration-100 ease-out"
        style={{ 
          width: `${scrollProgress}%`,
          transformOrigin: 'left center',
          background: 'linear-gradient(90deg, var(--primary), var(--accent))'
        }}
      />
    </div>
  );
};

export default ScrollProgressIndicator;