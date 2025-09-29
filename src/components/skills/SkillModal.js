import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaClock, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { skillCategories, getRelatedSkills } from '../../data/skillsData';

const SkillModal = ({ skill, isOpen, onClose, onSkillClick }) => {
  const category = skillCategories[skill?.category];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!skill) return null;

  const relatedSkills = getRelatedSkills(skill.id);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -100,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(135deg, 
                rgba(15, 23, 42, 0.98) 0%, 
                rgba(30, 41, 59, 0.95) 50%, 
                rgba(15, 23, 42, 0.98) 100%
              )`,
              border: `1px solid ${category?.color.border}`,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 0 1px ${category?.color.border},
                0 0 30px ${category?.color.glow}
              `
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Category accent overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `linear-gradient(135deg, ${category?.color.secondary}, transparent)`
              }}
            />

            {/* Scrollable Content */}
            <div className="relative z-10 overflow-y-auto max-h-[90vh] custom-scrollbar">
              {/* Header */}
              <motion.div 
                className="sticky top-0 z-20 p-6 border-b"
                style={{
                  background: `rgba(15, 23, 42, 0.95)`,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                variants={contentVariants}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="text-3xl"
                      role="img"
                      aria-label={`${category?.title} icon`}
                    >
                      {category?.icon}
                    </div>
                    <div>
                      <h2 
                        className="text-3xl font-bold text-white"
                        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
                      >
                        {skill.name}
                      </h2>
                      <p 
                        className="text-lg"
                        style={{ color: category?.color.primary }}
                      >
                        {category?.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </motion.div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  variants={contentVariants}
                >
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <FaClock 
                      className="mx-auto mb-2" 
                      style={{ color: category?.color.primary }}
                      size={24}
                    />
                    <div className="font-semibold text-white">{skill.yearsExperience}</div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Experience
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div
                      className="w-6 h-6 mx-auto mb-2 rounded-full"
                      style={{ backgroundColor: category?.color.primary }}
                    />
                    <div className="font-semibold text-white">{skill.experienceLevel}</div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Level
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <FaTrophy 
                      className="mx-auto mb-2" 
                      style={{ color: category?.color.primary }}
                      size={24}
                    />
                    <div className="font-semibold text-white">Key Project</div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Achievement
                    </div>
                  </div>
                </motion.div>

                {/* Key Achievement */}
                <motion.div variants={contentVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <FaTrophy style={{ color: category?.color.primary }} />
                    <h3 className="text-xl font-bold text-white">Key Achievement</h3>
                  </div>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {skill.keyAchievement}
                  </p>
                </motion.div>

                {/* Experience Story */}
                <motion.div variants={contentVariants}>
                  <h3 className="text-xl font-bold text-white mb-4">My Experience</h3>
                  <div 
                    className="prose prose-lg max-w-none"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {skill.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* Fun Fact */}
                {skill.funFact && (
                  <motion.div 
                    className="p-4 rounded-lg"
                    style={{
                      background: `rgba(${category?.color.primary.match(/\d+/g)?.join(', ')}, 0.1)`,
                      border: `1px solid ${category?.color.border}`
                    }}
                    variants={contentVariants}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FaLightbulb style={{ color: category?.color.primary }} />
                      <h4 className="font-semibold text-white">Fun Fact</h4>
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {skill.funFact}
                    </p>
                  </motion.div>
                )}

                {/* Tags */}
                {skill.tags && skill.tags.length > 0 && (
                  <motion.div variants={contentVariants}>
                    <h4 className="text-lg font-semibold text-white mb-3">Technologies & Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-sm font-medium"
                          style={{
                            background: category?.color.secondary,
                            color: category?.color.primary,
                            border: `1px solid ${category?.color.border}`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Related Skills */}
                {relatedSkills.length > 0 && (
                  <motion.div variants={contentVariants}>
                    <h4 className="text-lg font-semibold text-white mb-3">Related Skills</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {relatedSkills.map((relatedSkill, index) => {
                        const relatedCategory = skillCategories[relatedSkill.category];
                        return (
                          <button
                            key={index}
                            onClick={() => onSkillClick(relatedSkill)}
                            className="p-3 rounded-lg text-left hover:scale-105 transition-all duration-200"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span>{relatedCategory?.icon}</span>
                              <span className="font-medium text-white text-sm">
                                {relatedSkill.name}
                              </span>
                            </div>
                            <div 
                              className="text-xs"
                              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                              {relatedSkill.experienceLevel}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Projects Link */}
                {skill.projects && skill.projects.length > 0 && (
                  <motion.div variants={contentVariants}>
                    <div className="flex items-center justify-between p-4 rounded-lg"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div>
                        <h4 className="font-semibold text-white">See this skill in action</h4>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Check out related projects in my portfolio
                        </p>
                      </div>
                      <FaExternalLinkAlt 
                        style={{ color: category?.color.primary }}
                        className="flex-shrink-0"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SkillModal;