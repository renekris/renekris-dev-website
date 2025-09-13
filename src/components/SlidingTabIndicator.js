import React from 'react';
import { motion } from 'framer-motion';

const SlidingTabIndicator = ({ activeTab, tabPositions }) => {
  const currentPosition = tabPositions[activeTab] || { left: 0, width: 0 };

  return (
    <motion.div
      className="neon-tab-indicator"
      initial={false}
      animate={{
        left: currentPosition.left,
        width: currentPosition.width
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
      style={{
        position: 'absolute',
        bottom: 0,
        height: '3px',
        background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))',
        boxShadow: `
          0 0 10px var(--neon-blue),
          0 0 20px var(--neon-blue),
          0 0 30px var(--neon-cyan)
        `,
        borderRadius: '3px 3px 0 0',
        zIndex: 10
      }}
    />
  );
};

export default SlidingTabIndicator;