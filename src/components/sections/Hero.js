import React from 'react';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  fadeInScale
} from '../animations/motionUtils';
import { HeroResumeButton } from '../resume/ResumeDownloader';

const Hero = () => {
  const name = "Rene Kristofer Pohlak";

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center px-6 py-12 transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-accent) 100%)'
      }}
    >
      <div className="text-center max-w-2xl">
        {/* Name - Simple fade in animation */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {name}
        </motion.h1>
        
        {/* Role */}
        <motion.p 
          className="text-xl md:text-2xl font-medium mb-2 transition-colors duration-200"
          style={{ color: 'var(--primary)' }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          Full-Stack Developer
        </motion.p>
        
        {/* Location */}
        <motion.p 
          className="text-base mb-8 transition-colors duration-200"
          style={{ color: 'var(--text-tertiary)' }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
        >
          Tallinn, Estonia
        </motion.p>
        
        {/* Tagline */}
        <motion.p 
          className="text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
        >
          Building scalable web solutions and infrastructure
        </motion.p>
        
        {/* CTA Button */}
        <div className="flex justify-center">
          <motion.div
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
          >
            <HeroResumeButton />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;