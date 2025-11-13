import React from 'react';
import { motion } from 'framer-motion';
import { HeroResumeButton } from '../resume/ResumeDownloader';

const Hero = () => {
  const name = "Rene Kristofer Pohlak";

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 py-20 transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-accent) 100%)'
      }}
    >
      <div className="text-center max-w-4xl w-full">
        {/* Name */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {name}
        </motion.h1>

        {/* Role */}
        <motion.p
          className="text-2xl md:text-3xl font-medium mb-8 transition-colors duration-200"
          style={{ color: 'var(--primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Developer & Infrastructure Engineer
        </motion.p>

        {/* Key Tech Stack - Inline */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {['JavaScript', 'Python', 'C#', 'React', 'Node.js'].map((tech, index) => (
            <motion.span
              key={tech}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-xl mb-6 leading-relaxed max-w-3xl mx-auto transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Building modern web applications and managing IT infrastructure
        </motion.p>

        {/* Location */}
        <motion.p
          className="text-base mb-12 transition-colors duration-200"
          style={{ color: 'var(--text-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          Tallinn, Estonia
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <HeroResumeButton />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;