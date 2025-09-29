import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaServer,
  FaGamepad,
  FaDocker,
  FaChartLine,
  FaTerminal,
  FaPlay,
  FaInfoCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Footer from './Footer';
import {
  CalculatorDemo,
  BattleshipDemo,
  WeatherDemo,
  TodoDemo,
  FileSyncDemo
} from './demos';
import { InlineResumeButton } from './resume/ResumeDownloader';

const Portfolio = () => {
  const [activeDemos, setActiveDemos] = useState(new Set());

  const toggleDemo = (projectId) => {
    const newActiveDemos = new Set(activeDemos);
    if (newActiveDemos.has(projectId)) {
      newActiveDemos.delete(projectId);
    } else {
      newActiveDemos.add(projectId);
    }
    setActiveDemos(newActiveDemos);
  };

  const projects = [
    {
      id: 'infrastructure',
      title: 'Renekris.dev Infrastructure',
      icon: FaCode,
      status: 'Live Production',
      statusColor: 'text-emerald-400',
      description: 'Personal website with modern React architecture, Docker deployment, and CI/CD pipeline. Built with performance optimization and responsive design principles.',
      hasDemo: false,
      category: 'featured',
      tech: ['React', 'Docker', 'CI/CD', 'Modern CSS'],
      gradient: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: 'filesync',
      title: 'Claude-Joplin Bridge',
      icon: FaServer,
      status: 'Production Ready',
      statusColor: 'text-emerald-400',
      description: 'Enterprise-grade Python file synchronization tool with 4000+ lines of code. Features bidirectional sync, conflict resolution, and comprehensive progress tracking.',
      hasDemo: true,
      demoComponent: FileSyncDemo,
      category: 'featured',
      tech: ['Python', 'TDD', 'File Systems', 'CLI'],
      gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'calculator',
      title: 'JavaScript Calculator',
      icon: FaTerminal,
      status: 'Interactive',
      statusColor: 'text-cyan-400',
      description: 'Feature-rich calculator with keyboard support, dark mode, and sound effects. Built with vanilla JavaScript and modern CSS.',
      hasDemo: true,
      demoComponent: CalculatorDemo,
      category: 'demo',
      tech: ['JavaScript', 'CSS3', 'DOM API'],
      gradient: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      id: 'battleship',
      title: 'Battleship Game',
      icon: FaGamepad,
      status: 'Interactive',
      statusColor: 'text-cyan-400',
      description: 'Strategic battleship game with AI opponent, drag-and-drop ship placement, and intelligent targeting algorithms.',
      hasDemo: true,
      demoComponent: BattleshipDemo,
      category: 'demo',
      tech: ['JavaScript', 'Game Logic', 'AI Algorithms'],
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'weather',
      title: 'Weather Application',
      icon: FaChartLine,
      status: 'Interactive',
      statusColor: 'text-cyan-400',
      description: 'Multi-API weather integration with geolocation, timezone handling, and real-time data visualization.',
      hasDemo: true,
      demoComponent: WeatherDemo,
      category: 'demo',
      tech: ['JavaScript', 'API Integration', 'Geolocation'],
      gradient: 'from-orange-500/20 to-yellow-500/20'
    },
    {
      id: 'todo',
      title: 'Todo Manager',
      icon: FaDocker,
      status: 'Interactive',
      statusColor: 'text-cyan-400',
      description: 'Advanced task management with localStorage persistence, priority levels, and modular ES6 architecture.',
      hasDemo: true,
      demoComponent: TodoDemo,
      category: 'demo',
      tech: ['JavaScript', 'Local Storage', 'ES6 Classes'],
      gradient: 'from-indigo-500/20 to-purple-500/20'
    }
  ];

  const featuredProjects = projects.filter(p => p.category === 'featured');
  const demoProjects = projects.filter(p => p.category === 'demo');

  const ProjectCard = ({ project, isFeatured = false }) => (
    <motion.div
      className={`
        group relative overflow-hidden rounded-2xl border border-white/10
        ${isFeatured ? 'md:col-span-2 lg:col-span-3' : 'col-span-1'}
        ${isFeatured ? 'row-span-2' : 'row-span-1'}
      `}
      style={{
        background: `linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))`,
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className={`relative p-6 ${isFeatured ? 'lg:p-8' : 'p-6'} h-full flex flex-col`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <project.icon className={`${isFeatured ? 'text-2xl' : 'text-xl'} text-white`} />
            </div>
            <div>
              <h3 className={`font-bold text-white ${isFeatured ? 'text-2xl lg:text-3xl' : 'text-lg'} leading-tight`}>
                {project.title}
              </h3>
              <div className={`flex items-center gap-2 mt-1`}>
                <div className={`w-2 h-2 rounded-full ${project.statusColor.replace('text-', 'bg-')} animate-pulse`} />
                <span className={`${project.statusColor} text-sm font-medium`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          {project.hasDemo && (
            <button
              onClick={() => toggleDemo(project.id)}
              className={`
                p-3 rounded-xl backdrop-blur-sm border transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-white/30
                ${activeDemos.has(project.id)
                  ? 'bg-white/20 border-white/30 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }
              `}
              title={activeDemos.has(project.id) ? 'Hide Demo' : 'Show Interactive Demo'}
            >
              {activeDemos.has(project.id) ? <FaInfoCircle className="text-lg" /> : <FaPlay className="text-lg" />}
            </button>
          )}
        </div>

        {/* Description */}
        <p className={`text-white/80 leading-relaxed mb-6 ${isFeatured ? 'text-lg' : 'text-base'} flex-grow`}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Interactive Demo */}
        {project.hasDemo && activeDemos.has(project.id) && (
          <motion.div
            className="mt-4 p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaPlay className="text-white/80" />
              <span className="text-white font-semibold">Interactive Demo</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <project.demoComponent />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Modern Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 80px rgba(99, 102, 241, 0.3)',
              fontWeight: '800',
              letterSpacing: '-0.02em'
            }}
          >
            Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            Interactive development projects & infrastructure solutions
          </p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-white/70">View detailed experience:</span>
              <InlineResumeButton />
            </div>
          </div>
        </motion.header>

        {/* Featured Projects */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} isFeatured={true} />
            ))}
          </div>
        </motion.section>

        {/* Interactive Demos */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-white">Interactive Demos</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} isFeatured={false} />
            ))}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default Portfolio;