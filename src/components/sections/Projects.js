import React, { useState, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaPlay, FaInfoCircle, FaGithub, FaExternalLinkAlt, FaCode, FaStar } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../animations/motionUtils';

import {
  CalculatorDemo,
  BattleshipDemo,
  WeatherDemo,
  TodoDemo,
  FileSyncDemo
} from '../demos';
import { InlineResumeButton } from '../resume/ResumeDownloader';

const Projects = () => {
  const [activeDemos, setActiveDemos] = useState(new Set());
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });



  const toggleDemo = (projectId) => {
    const newActiveDemos = new Set(activeDemos);
    if (newActiveDemos.has(projectId)) {
      newActiveDemos.delete(projectId);
    } else {
      newActiveDemos.add(projectId);
    }
    setActiveDemos(newActiveDemos);
  };

  const featuredProjects = [
    {
      id: 'filesync',
      title: "claude-joplin-bridge",
      description: "Enterprise-grade file synchronization tool with bidirectional sync algorithms, comprehensive test suite, and production CLI. Built with TDD approach and 4,000+ lines of Python code.",
      tech: ["Python", "TDD", "File Systems", "CLI", "Testing"],
      github: "https://github.com/renekris/claude-joplin-bridge",
      demo: null,
      type: "featured",
      hasDemo: true,
      demoComponent: FileSyncDemo,
      category: "backend",
      status: "production",
      gridArea: "span 2"
    },
    {
      id: 'webapp',
      title: "Full-Stack Web Application",
      description: "Complete enterprise web application with C# ASP.NET Core REST API, Entity Framework database, and Angular frontend. Features CRUD operations and proper architectural separation.",
      tech: ["C#", "ASP.NET Core", "Angular", "Entity Framework", "TypeScript"],
      github: "https://github.com/renekris/WebApp-Assignment-Backend",
      demo: null,
      type: "featured",
      hasDemo: false,
      category: "fullstack",
      status: "production",
      gridArea: "span 1"
    },
    {
      id: 'desktop',
      title: "Desktop Application Suite",
      description: "Collection of C# Windows Forms applications including RPG game with save systems, YouTube downloader with Python integration, and idle clicker with complex mechanics.",
      tech: ["C#", "Windows Forms", "Game Development", "External Process Integration"],
      github: "https://github.com/renekris/CSharp",
      demo: null,
      type: "featured",
      hasDemo: false,
      category: "desktop",
      status: "production",
      gridArea: "span 1"
    }
  ];

  const developmentProjects = [
    {
      id: 'battleship',
      title: "Battleship Game",
      description: "JavaScript implementation with drag-and-drop ship placement, AI opponent targeting, and Jest testing suite. Demonstrates game logic and testing practices.",
      tech: ["JavaScript", "Jest", "Game Logic", "DOM Manipulation"],
      github: "https://github.com/renekris/battleship",
      demo: "https://renekris.github.io/battleship/",
      type: "development",
      hasDemo: true,
      demoComponent: BattleshipDemo,
      category: "frontend",
      status: "live"
    },
    {
      id: 'calculator',
      title: "JavaScript Calculator",
      description: "Feature-rich calculator with keyboard support, dark mode, and sound effects. Built with vanilla JavaScript and modern CSS.",
      tech: ["JavaScript", "CSS3", "DOM API"],
      github: "https://github.com/renekris/calculator",
      demo: "https://renekris.github.io/calculator/",
      type: "development",
      hasDemo: true,
      demoComponent: CalculatorDemo,
      category: "frontend",
      status: "live"
    },
    {
      id: 'weather',
      title: "Weather Application",
      description: "Multi-API integration with OpenWeatherMap, Google Maps, and Geolocation. Features timezone-aware data handling and responsive design.",
      tech: ["JavaScript", "API Integration", "Geolocation", "Webpack"],
      github: "https://github.com/renekris/weather",
      demo: "https://renekris.github.io/weather/",
      type: "development",
      hasDemo: true,
      demoComponent: WeatherDemo,
      category: "frontend",
      status: "live"
    },
    {
      id: 'todo',
      title: "Task Management System",
      description: "Hierarchical todo application with priority classification, localStorage persistence, and modular ES6 architecture.",
      tech: ["JavaScript", "Local Storage", "ES6 Classes", "UUID"],
      github: "https://github.com/renekris/todo-list",
      demo: "https://renekris.github.io/todo-list/",
      type: "development",
      hasDemo: true,
      demoComponent: TodoDemo,
      category: "frontend",
      status: "live"
    },
    {
      id: 'portfolio',
      title: "Portfolio Website",
      description: "Current production website with Docker deployment, GitHub Actions CI/CD, and mobile-first responsive design.",
      tech: ["React", "Docker", "CI/CD", "Tailwind CSS"],
      github: "https://github.com/renekris/renekris-dev-website",
      demo: "https://renekris.dev",
      type: "development",
      hasDemo: false,
      category: "fullstack",
      status: "live"
    }
  ];

  const getCategoryColors = (category) => {
    const colors = {
      backend: {
        primary: 'rgba(34, 197, 94, 0.8)',
        secondary: 'rgba(34, 197, 94, 0.2)',
        glow: 'rgba(34, 197, 94, 0.4)',
        border: 'rgba(34, 197, 94, 0.6)'
      },
      frontend: {
        primary: 'rgba(59, 130, 246, 0.8)',
        secondary: 'rgba(59, 130, 246, 0.2)',
        glow: 'rgba(59, 130, 246, 0.4)',
        border: 'rgba(59, 130, 246, 0.6)'
      },
      fullstack: {
        primary: 'rgba(147, 51, 234, 0.8)',
        secondary: 'rgba(147, 51, 234, 0.2)',
        glow: 'rgba(147, 51, 234, 0.4)',
        border: 'rgba(147, 51, 234, 0.6)'
      },
      desktop: {
        primary: 'rgba(245, 158, 11, 0.8)',
        secondary: 'rgba(245, 158, 11, 0.2)',
        glow: 'rgba(245, 158, 11, 0.4)',
        border: 'rgba(245, 158, 11, 0.6)'
      }
    };
    return colors[category] || colors.frontend;
  };

  const getStatusBadge = (status) => {
    const badges = {
      production: { label: 'Production', color: 'rgba(34, 197, 94, 0.8)', icon: FaStar },
      live: { label: 'Live Demo', color: 'rgba(59, 130, 246, 0.8)', icon: FaExternalLinkAlt }
    };
    return badges[status] || badges.live;
  };

  const ProjectCard = ({ project, isFeatured = false, gridArea = "span 1", index = 0 }) => {
    const cardRef = useRef(null);
    const colors = getCategoryColors(project.category);
    const statusBadge = getStatusBadge(project.status);
    
    // Memoized card animations to prevent recreation
    const cardAnimations = useMemo(() => ({
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      hover: {
        y: -8,
        scale: isFeatured ? 1.02 : 1.03,
        transition: { duration: 0.3, ease: "easeOut" }
      }
    }), [index, isFeatured]);


    // Optimized card styles without complex transforms
    const cardStyle = {
      gridColumn: isFeatured ? gridArea : 'span 1',
      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))`,
      border: `1px solid rgba(255, 255, 255, 0.2)`,
      borderRadius: isFeatured ? '24px' : '16px',
      position: 'relative',
      overflow: 'hidden'
    };

    return (
      <motion.div
        ref={cardRef}
        className="relative group"
        style={cardStyle}
        variants={cardAnimations}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        whileHover="hover"
      >
        {/* Hover gradient overlay - CSS only for performance */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.primary} 0%, transparent 60%)`
          }}
        />

        {/* Category accent overlay */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}, transparent)`
          }}
        />

        {/* Enhanced border on hover */}
        <div 
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `
              0 0 0 1px ${colors.border},
              0 20px 40px -12px rgba(0, 0, 0, 0.4),
              0 0 20px ${colors.glow}
            `
          }}
        />

        {/* Content */}
        <div className={`relative z-10 ${isFeatured ? 'p-8' : 'p-6'}`}>
          {/* Status and Category */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
              style={{
                background: colors.secondary,
                color: colors.primary,
                border: `1px solid ${colors.border}`
              }}
            >
              {project.category}
            </div>
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: statusBadge.color,
                color: 'white'
              }}
            >
              <statusBadge.icon size={10} />
              {statusBadge.label}
            </div>
          </div>

          {/* Title */}
          <h3 
            className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold mb-3 transition-colors duration-200`}
            style={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p 
            className={`${isFeatured ? 'text-lg' : 'text-base'} mb-6 leading-relaxed`}
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <motion.a
              href={project.github}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub />
              View Code
            </motion.a>
            
            {project.demo && (
              <motion.a
                href={project.demo}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm"
                style={{
                  background: colors.primary,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 20px ${colors.glow}`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaExternalLinkAlt />
                Live Demo
              </motion.a>
            )}
            
            {project.hasDemo && (
              <motion.button
                onClick={() => toggleDemo(project.id)}
                className="py-3 px-4 rounded-lg font-semibold text-sm flex items-center gap-2 backdrop-blur-sm"
                style={{
                  background: activeDemos.has(project.id) 
                    ? colors.secondary 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: activeDemos.has(project.id) 
                    ? colors.primary 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${activeDemos.has(project.id) ? colors.border : 'rgba(255, 255, 255, 0.2)'}`,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
                title={activeDemos.has(project.id) ? 'Hide Demo' : 'Show Interactive Demo'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeDemos.has(project.id) ? <FaInfoCircle /> : <FaPlay />}
                {activeDemos.has(project.id) ? 'Hide Demo' : 'Try Demo'}
              </motion.button>
            )}
          </div>

          {/* Interactive Demo with AnimatePresence */}
          <AnimatePresence mode="wait">
            {project.hasDemo && activeDemos.has(project.id) && (
              <motion.div
                key={`demo-${project.id}`}
                className="mt-4 p-6 rounded-lg backdrop-blur-sm"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto', 
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeIn" }
                }}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <FaCode style={{ color: colors.primary }} />
                  <span 
                    className="font-semibold"
                    style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                  >
                    Interactive Demo
                  </span>
                  <div 
                    className="flex-1 h-px"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <project.demoComponent />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle accent line */}
        <div 
          className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-80 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
          }}
        />
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="py-20 px-6 transition-colors duration-200 relative overflow-hidden"
      style={{ 
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse 60% 50% at 50% 120%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          var(--bg-secondary)
        `
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite reverse'
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
            whileInView={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              transition: { duration: 3, repeat: Infinity }
            }}
          >
            <span 
              style={{
                background: 'linear-gradient(45deg, var(--text-primary), rgba(59, 130, 246, 0.8), var(--text-primary))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Projects
            </span>
          </motion.h2>
          
          <p 
            className="text-xl max-w-3xl mx-auto transition-colors duration-200 mb-8"
            style={{ 
              color: 'var(--text-secondary)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            Full-stack development, desktop applications, and JavaScript projects built without AI assistance
          </p>
          
          <div className="flex justify-center items-center">
            <motion.div 
              className="flex items-center gap-4 px-8 py-4 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>View detailed experience:</span>
              <InlineResumeButton />
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Projects - Bento Grid */}
        <motion.div 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 
            className="text-2xl font-bold mb-8 text-center transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
            variants={fadeInUp}
          >
            Featured Projects
          </motion.h3>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
            style={{ minHeight: '400px' }}
            variants={staggerContainer}
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isFeatured={true}
                gridArea={project.gridArea}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Development Projects - Standard Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 
            className="text-2xl font-bold mb-8 text-center transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
            variants={fadeInUp}
          >
            Development Projects
          </motion.h3>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {developmentProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isFeatured={false}
                index={index + featuredProjects.length}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        

        
        .rounded-inherit {
          border-radius: inherit;
        }
      `}</style>
    </section>
  );
};

export default Projects;