import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { skills, skillCategories, searchSkills } from '../../data/skillsData';
import SkillCard from './SkillCard';
import SkillModal from './SkillModal';
import { staggerContainer } from '../animations/motionUtils';

const SkillGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and search logic
  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchSkills(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(skill => skill.category === selectedCategory);
      }
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSkill(null), 300);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <div className="relative">
            <FaSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16}
            />
            <input
              type="text"
              placeholder="Search skills, technologies, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                focusRingColor: 'rgba(59, 130, 246, 0.5)'
              }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            onClick={() => handleCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === 'all' ? 'scale-105' : 'hover:scale-105'
            }`}
            style={{
              background: selectedCategory === 'all' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: selectedCategory === 'all' 
                ? 'white' 
                : 'rgba(255, 255, 255, 0.7)',
              border: selectedCategory === 'all' 
                ? '1px solid rgba(255, 255, 255, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Skills ({skills.length})
          </motion.button>

          {Object.entries(skillCategories).map(([key, category]) => {
            const skillCount = skills.filter(skill => skill.category === key).length;
            const isSelected = selectedCategory === key;
            
            return (
              <motion.button
                key={key}
                onClick={() => handleCategoryFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isSelected ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{
                  background: isSelected 
                    ? category.color.secondary 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected 
                    ? category.color.primary 
                    : 'rgba(255, 255, 255, 0.7)',
                  border: isSelected 
                    ? `1px solid ${category.color.border}` 
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 20px ${category.color.glow}`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.icon}</span>
                <span>{category.title}</span>
                <span className="text-sm opacity-75">({skillCount})</span>
              </motion.button>
            );
          })}
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="text-center">
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Found {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} 
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-min"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={`${selectedCategory}-${searchQuery}`} // Re-trigger animations on filter change
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={handleSkillClick}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="text-6xl mb-4"
            role="img" 
            aria-label="No results"
          >
            🔍
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No skills found
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Try adjusting your search terms or selecting a different category
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: 'rgba(59, 130, 246, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}

      {/* Skill Modal */}
      <SkillModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSkillClick={handleSkillClick}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SkillGrid;