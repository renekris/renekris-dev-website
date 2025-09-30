import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AnimatedSection = ({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const variants = {
    fadeInUp: {
      hidden: { 
        opacity: 0, 
        y: 50,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
        }
      }
    },
    fadeInDown: {
      hidden: { 
        opacity: 0, 
        y: -50,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    fadeInLeft: {
      hidden: { 
        opacity: 0, 
        x: -50,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    fadeInRight: {
      hidden: { 
        opacity: 0, 
        x: 50,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    scaleIn: {
      hidden: { 
        opacity: 0, 
        scale: 0.8,
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    },
    staggerItem: {
      hidden: { 
        opacity: 0, 
        y: 20 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    }
  };

  // Enhanced reduced motion variants
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  };

  // If user prefers reduced motion, use simplified animations
  const motionProps = prefersReducedMotion 
    ? {
        initial: "hidden",
        whileInView: "visible",
        variants: reducedMotionVariants,
        viewport: { 
          once: true, 
          margin: "-50px 0px",
          amount: 0.1
        }
      }
    : {
        initial: "hidden",
        whileInView: "visible",
        variants: variants[variant],
        viewport: { 
          once: true, 
          margin: "-100px 0px",
          amount: 0.3
        }
      };

  return (
    <motion.div
      className={className}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;