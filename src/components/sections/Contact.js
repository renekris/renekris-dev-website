import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiCheck } from 'react-icons/fi';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer, 
  staggerItem, 
  fadeInUp
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
            className="text-xl mb-3 transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
          >
            Open to opportunities in Tallinn and remote work
          </p>
          <p 
            className="text-lg transition-colors duration-200"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Let's build something great together
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

        {/* Location & Status */}
        <AnimatedSection variant="fadeInUp" delay={0.4} className="text-center space-y-4">
          <motion.div 
            className="flex items-center justify-center space-x-3 transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
          >
            <FiMapPin className="w-5 h-5" />
            <span className="text-lg">Based in <strong style={{ color: 'var(--text-primary)' }}>Tallinn, Estonia</strong></span>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center space-x-3 font-semibold transition-colors duration-200"
            style={{ color: 'var(--success)' }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.4 }}
          >
            <FiCheck className="w-5 h-5" />
            <span className="text-lg">Available for new opportunities</span>
          </motion.div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection variant="fadeInUp" delay={0.6}>
          <div 
            className="mt-20 pt-8 border-t text-center transition-colors duration-200"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <p 
              className="text-base transition-colors duration-200"
              style={{ color: 'var(--text-tertiary)' }}
            >
              © 2025 Rene Kristofer Pohlak. Built with React & Tailwind CSS.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Contact;