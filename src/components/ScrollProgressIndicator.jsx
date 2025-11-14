import React from 'react';
import useScrollPosition from '../hooks/useScrollPosition';

const ScrollProgressIndicator = () => {
  const { scrollProgress } = useScrollPosition();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1"
      style={{ backgroundColor: 'var(--border-secondary)' }}
    >
      <div
        className="h-full"
        style={{
          width: `${scrollProgress}%`,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'width',
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
        }}
      />
    </div>
  );
};

export default ScrollProgressIndicator;
