import React from 'react';
import { motion } from 'framer-motion';
import { skillCategories } from '../../data/skillsData';

const SkillCard = ({ skill, onClick, index = 0 }) => {
  const category = skillCategories[skill.category];
  
  // Smaller, uniform size styling
  const getSizeClasses = () => {
    return 'col-span-1 row-span-1 h-[80px]';
  };

  const getTextSize = () => {
    return 'text-sm';
  };

  const cardAnimations = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.05,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden
        ${getSizeClasses()}
      `}
      variants={cardAnimations}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onClick(skill)}
      style={{
        background: `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          rgba(30, 41, 59, 0.9) 50%, 
          rgba(15, 23, 42, 0.95) 100%
        )`,
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Category accent overlay */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${category.color.secondary}, transparent)`
        }}
      />

      {/* Hover gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${category.color.primary} 0%, transparent 60%)`
        }}
      />

      {/* Enhanced border on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `
            0 0 0 1px ${category.color.border},
            0 20px 40px -12px rgba(0, 0, 0, 0.4),
            0 0 20px ${category.color.glow}
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-3 h-full flex items-center justify-center">
        {/* Skill Name Only */}
        <h3
          className={`font-semibold text-white text-center leading-tight ${getTextSize()}`}
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          {skill.name}
        </h3>
      </div>

      {/* Subtle accent line */}
      <div 
        className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-80 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${category.color.primary}, transparent)`
        }}
      />

      {/* Click ripple effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 transition-opacity duration-150"
        style={{
          background: `radial-gradient(circle at center, ${category.color.primary} 0%, transparent 50%)`
        }}
      />
    </motion.div>
  );
};

export default SkillCard;