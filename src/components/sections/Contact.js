import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';
import AnimatedSection from '../animations/AnimatedSection';
import {
  staggerContainer,
  staggerItem
} from '../animations/motionUtils';

const Contact = () => {
  return (
    <section 
      id="contact" 
      className="py-20 px-6 transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <AnimatedSection variant="fadeInUp" className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            Get In Touch
          </h2>
          <p
            className="text-lg md:text-xl mb-2 transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
          >
            Open to remote & hybrid opportunities
          </p>
        </AnimatedSection>

        {/* Contact Options */}
        <motion.div 
          className="space-y-5 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px 0px", amount: 0.3 }}
        >
          {/* Email Button */}
          <motion.a 
            href="mailto:renekrispohlak@gmail.com"
            className="w-full py-5 px-8 rounded-xl font-semibold flex items-center justify-center space-x-3 min-h-[56px] shadow-lg hover:shadow-xl transition-shadow duration-200"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--text-inverse)',
              boxShadow: '0 4px 6px -1px var(--shadow-medium)'
            }}
            variants={staggerItem}
          >
            <FiMail className="w-6 h-6" />
            <span className="text-lg">renekrispohlak@gmail.com</span>
          </motion.a>

          {/* LinkedIn Button */}
          <motion.a 
            href="https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 px-8 rounded-xl font-semibold flex items-center justify-center space-x-3 min-h-[56px] shadow-lg hover:shadow-xl transition-shadow duration-200"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
              boxShadow: '0 4px 6px -1px var(--shadow-medium)'
            }}
            variants={staggerItem}
          >
            <FiLinkedin className="w-6 h-6" />
            <span className="text-lg">LinkedIn Profile</span>
          </motion.a>

          {/* GitHub Button */}
          <motion.a 
            href="https://github.com/renekris"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 px-8 rounded-xl font-semibold flex items-center justify-center space-x-3 min-h-[56px] shadow-lg hover:shadow-xl transition-shadow duration-200"
            style={{
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              boxShadow: '0 4px 6px -1px var(--shadow-medium)'
            }}
            variants={staggerItem}
          >
            <FiGithub className="w-6 h-6" />
            <span className="text-lg">GitHub Portfolio</span>
          </motion.a>
        </motion.div>


        {/* Footer */}
        <div className="mt-20 pt-8 border-t text-center" style={{ borderColor: 'var(--border-primary)' }}>
          <p className="text-base mb-2" style={{ color: 'var(--text-secondary)' }}>
            Built with React, Framer Motion & Tailwind CSS
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            © 2025 renekris.dev
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;