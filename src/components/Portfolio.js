import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaStar, 
  FaCodeBranch, 
  FaEye, 
  FaCalendarAlt,
  FaCode,
  FaExternalLinkAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { githubService } from '../services/githubService';
import { debounce, performanceMonitor } from '../utils/performanceOptimizations';

const Portfolio = () => {
  const [repositories, setRepositories] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [error, setError] = useState(null);

  // Fetch GitHub repositories with performance monitoring
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        performanceMonitor.markStart('github-api-fetch');
        
        const repositories = await githubService.getFeaturedRepositories(20);
        
        performanceMonitor.markEnd('github-api-fetch');
        
        setRepositories(repositories);
        setFilteredRepos(repositories);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch repositories:', err);
        setError(err.message);
        // Fallback to demo data
        const fallbackData = githubService.constructor.createFallbackData();
        setRepositories(fallbackData);
        setFilteredRepos(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);


  // Optimized repository filtering with useMemo
  const filteredRepositories = useMemo(() => {
    performanceMonitor.markStart('repository-filtering');
    
    let filtered = repositories;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

    performanceMonitor.markEnd('repository-filtering');
    return filtered;
  }, [repositories, searchTerm, selectedLanguage]);

  // Update filtered repos when the memoized value changes
  useEffect(() => {
    setFilteredRepos(filteredRepositories);
  }, [filteredRepositories]);

  // Get unique languages with memoization
  const languages = useMemo(() => {
    return ['all', ...new Set(repositories.map(repo => repo.language).filter(Boolean))];
  }, [repositories]);

  // Debounced search function for better performance
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Language color mapping using service
  const getLanguageColor = (language) => {
    return githubService.constructor.getLanguageColor(language);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="cyber-panel">
        <div className="flex items-center justify-center h-64">
          <div className="cyber-terminal">
            <div className="flex items-center gap-2">
              <div className="terminal-prompt">$</div>
              <div className="text-neon-green">Loading repositories</div>
              <div className="terminal-cursor w-2 h-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="cyber-panel"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 neon-glow-cyan glitch-text" data-text="Portfolio">
            Portfolio
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Showcasing my latest projects and open-source contributions
          </p>
          <div className="hud-element inline-block">
            <FaGithub className="inline mr-2" />
            {repositories.length} Repositories • {repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)} Stars
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="cyber-panel"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
            <input
              type="text"
              placeholder="Search repositories..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black bg-opacity-50 border border-neon-blue rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan
                         focus:ring-2 focus:ring-neon-cyan focus:ring-opacity-50 focus-visible"
            />
          </div>

          {/* Language Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-purple" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="pl-10 pr-8 py-3 bg-black bg-opacity-50 border border-neon-purple rounded-lg 
                         text-white focus:outline-none focus:border-neon-pink cursor-pointer min-w-[150px]"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="bg-black">
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-center text-gray-400">
          Showing {filteredRepos.length} of {repositories.length} repositories
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-panel border-red-500"
        >
          <div className="text-center text-red-400">
            <p>⚠️ Failed to load live GitHub data</p>
            <p className="text-sm text-gray-400 mt-2">Showing demo projects instead</p>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: Math.min(index * 0.1, 1), // Cap delay at 1 second for performance
              ease: "easeOut"
            }}
            className="cyber-card group gpu-accelerated will-change-transform"
            whileHover={{ 
              y: -5, 
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >
            {/* Repository Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-neon-cyan truncate group-hover:text-neon-pink transition-colors">
                  {repo.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {repo.description || "No description provided"}
                </p>
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-2 rounded-lg bg-black bg-opacity-30 text-neon-blue 
                           hover:text-neon-cyan hover:bg-opacity-50 transition-all"
                title="View on GitHub"
              >
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>

            {/* Language and Topics */}
            <div className="mb-4">
              {repo.language && (
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  ></div>
                  <span className="text-sm text-gray-300">{repo.language}</span>
                </div>
              )}

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {repo.topics.slice(0, 3).map(topic => (
                    <span 
                      key={topic}
                      className="px-2 py-1 text-xs bg-neon-purple bg-opacity-20 text-neon-purple 
                                 border border-neon-purple border-opacity-30 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 3 && (
                    <span className="text-xs text-gray-500">+{repo.topics.length - 3}</span>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FaStar className="text-neon-yellow" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCodeBranch className="text-neon-green" />
                  <span>{repo.forks_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye className="text-neon-blue" />
                  <span>{repo.watchers_count}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-700 pt-3">
              <FaCalendarAlt />
              <span>Updated {formatDate(repo.updated_at)}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredRepos.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cyber-panel text-center"
        >
          <FaCode className="text-4xl text-gray-600 mb-4 mx-auto" />
          <h3 className="text-xl text-gray-400 mb-2">No repositories found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="cyber-panel text-center"
      >
        <h3 className="text-2xl font-bold text-neon-cyan mb-4">
          Interested in collaboration?
        </h3>
        <p className="text-gray-300 mb-6">
          I'm always open to discussing new projects and opportunities
        </p>
        <a
          href="https://github.com/renekris"
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button inline-flex items-center gap-2"
        >
          <FaGithub />
          View More on GitHub
        </a>
      </motion.div>
    </div>
  );
};

export default Portfolio;