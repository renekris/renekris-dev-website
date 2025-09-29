import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../animations/motionUtils';
import SkillGrid from '../skills/SkillGrid';

const Skills = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="py-20 px-6 transition-colors duration-200 relative overflow-hidden"
      style={{ 
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse 60% 50% at 50% 120%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
          var(--bg-secondary)
        `
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite reverse'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-200"
            style={{ 
              color: 'var(--text-primary)',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            variants={fadeInUp}
            whileInView={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              transition: { duration: 3, repeat: Infinity }
            }}
          >
            <span 
              style={{
                background: 'linear-gradient(45deg, var(--text-primary), rgba(147, 51, 234, 0.8), var(--text-primary))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Technical Skills
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl max-w-3xl mx-auto transition-colors duration-200 mb-8"
            style={{ 
              color: 'var(--text-secondary)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            variants={fadeInUp}
          >
            Click any skill to discover my personal experience and journey with that technology
          </motion.p>

          <motion.div 
            className="flex justify-center items-center"
            variants={fadeInUp}
          >
            <div 
              className="px-6 py-3 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Interactive • Story-driven • Personal experiences
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <SkillGrid />
        </motion.div>

        {/* Languages Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div 
            className="rounded-xl p-8 mx-auto max-w-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              className="text-2xl font-bold mb-6 transition-colors duration-200"
              style={{ color: 'var(--text-primary)' }}
            >
              Languages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div 
                className="transition-colors duration-200" 
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span 
                  className="text-2xl font-bold block mb-2 transition-colors duration-200"
                  style={{ color: 'var(--primary)' }}
                >🇪🇪 EST</span>
                <p 
                  className="text-base font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >Estonian (Native)</p>
              </motion.div>
              <motion.div 
                className="transition-colors duration-200" 
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span 
                  className="text-2xl font-bold block mb-2 transition-colors duration-200"
                  style={{ color: 'var(--primary)' }}
                >🇺🇸 ENG</span>
                <p 
                  className="text-base font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >English (Proficient)</p>
              </motion.div>
              <motion.div 
                className="transition-colors duration-200" 
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span 
                  className="text-2xl font-bold block mb-2 transition-colors duration-200"
                  style={{ color: 'var(--primary)' }}
                >🇯🇵 JPN</span>
                <p 
                  className="text-base font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >Japanese (Upper-Intermediate)</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </section>
  );
};

export default Skills;