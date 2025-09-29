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
  FaGithub,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash
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

const WorkSection = () => {
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
      statusColor: 'emerald',
      description: 'Personal website with modern React architecture, Docker deployment, and CI/CD pipeline. Built with performance optimization and responsive design principles.',
      hasDemo: false,
      category: 'production',
      tech: ['React', 'Docker', 'CI/CD', 'Modern CSS'],
      githubUrl: 'https://github.com/renekris/renekris-dev-website',
      liveUrl: 'https://renekris.dev'
    },
    {
      id: 'filesync',
      title: 'Claude-Joplin Bridge',
      icon: FaServer,
      status: 'Production Ready',
      statusColor: 'emerald',
      description: 'Enterprise-grade Python file synchronization tool with 4000+ lines of code. Features bidirectional sync, conflict resolution, and comprehensive progress tracking.',
      hasDemo: true,
      demoComponent: FileSyncDemo,
      category: 'production',
      tech: ['Python', 'TDD', 'File Systems', 'CLI'],
      githubUrl: '#',
      liveUrl: null
    },
    {
      id: 'calculator',
      title: 'JavaScript Calculator',
      icon: FaTerminal,
      status: 'Interactive Demo',
      statusColor: 'cyan',
      description: 'Feature-rich calculator with keyboard support, dark mode, and sound effects. Built with vanilla JavaScript and modern CSS.',
      hasDemo: true,
      demoComponent: CalculatorDemo,
      category: 'development',
      tech: ['JavaScript', 'CSS3', 'DOM API'],
      githubUrl: '#',
      liveUrl: '#'
    },
    {
      id: 'battleship',
      title: 'Battleship Game',
      icon: FaGamepad,
      status: 'Interactive Demo',
      statusColor: 'cyan',
      description: 'Strategic battleship game with AI opponent, drag-and-drop ship placement, and intelligent targeting algorithms.',
      hasDemo: true,
      demoComponent: BattleshipDemo,
      category: 'development',
      tech: ['JavaScript', 'Game Logic', 'AI Algorithms'],
      githubUrl: '#',
      liveUrl: '#'
    },
    {
      id: 'weather',
      title: 'Weather Application',
      icon: FaChartLine,
      status: 'Interactive Demo',
      statusColor: 'cyan',
      description: 'Multi-API weather integration with geolocation, timezone handling, and real-time data visualization.',
      hasDemo: true,
      demoComponent: WeatherDemo,
      category: 'development',
      tech: ['JavaScript', 'API Integration', 'Geolocation'],
      githubUrl: '#',
      liveUrl: '#'
    },
    {
      id: 'todo',
      title: 'Todo Manager',
      icon: FaDocker,
      status: 'Interactive Demo',
      statusColor: 'cyan',
      description: 'Advanced task management with localStorage persistence, priority levels, and modular ES6 architecture.',
      hasDemo: true,
      demoComponent: TodoDemo,
      category: 'development',
      tech: ['JavaScript', 'Local Storage', 'ES6 Classes'],
      githubUrl: '#',
      liveUrl: '#'
    }
  ];

  const productionProjects = projects.filter(p => p.category === 'production');
  const developmentProjects = projects.filter(p => p.category === 'development');

  const StatusBadge = ({ status, statusColor }) => {
    const colorVariants = {
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    };

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorVariants[statusColor] || colorVariants.cyan}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${statusColor === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse`} />
        {status}
      </div>
    );
  };

  const TechBadge = ({ tech }) => (
    <span className="px-2 py-1 text-xs font-medium rounded bg-slate-800/50 text-slate-300 border border-slate-700/50">
      {tech}
    </span>
  );

  const ProjectCard = ({ project }) => (
    <motion.div
      className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-6 hover:border-slate-700/70 transition-all duration-300 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <project.icon className="text-lg text-slate-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg leading-tight mb-1">
              {project.title}
            </h3>
            <StatusBadge status={project.status} statusColor={project.statusColor} />
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.map((tech, index) => (
          <TechBadge key={index} tech={tech} />
        ))}
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {project.description}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {project.githubUrl && (
          <button
            onClick={() => window.open(project.githubUrl, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200 border border-slate-700/50 hover:border-slate-600/50"
          >
            <FaGithub className="text-sm" />
            Code
          </button>
        )}

        {project.liveUrl && (
          <button
            onClick={() => window.open(project.liveUrl, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200 border border-slate-700/50 hover:border-slate-600/50"
          >
            <FaExternalLinkAlt className="text-sm" />
            Live
          </button>
        )}

        {project.hasDemo && (
          <button
            onClick={() => toggleDemo(project.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border ${
              activeDemos.has(project.id)
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border-slate-700/50 hover:border-slate-600/50'
            }`}
          >
            {activeDemos.has(project.id) ? (
              <>
                <FaEyeSlash className="text-sm" />
                Hide Demo
              </>
            ) : (
              <>
                <FaEye className="text-sm" />
                Demo
              </>
            )}
          </button>
        )}
      </div>

      {/* Interactive Demo */}
      {project.hasDemo && activeDemos.has(project.id) && (
        <motion.div
          className="mt-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FaPlay className="text-cyan-400 text-sm" />
            <span className="text-white font-medium text-sm">Interactive Demo</span>
          </div>
          <project.demoComponent />
        </motion.div>
      )}
    </motion.div>
  );

  const SectionHeader = ({ title, description }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Work & Projects
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            A collection of production systems and development projects showcasing technical progression from learning to enterprise-grade solutions.
          </p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-800/50">
              <span className="text-slate-400">Download full experience:</span>
              <InlineResumeButton />
            </div>
          </div>
        </motion.header>

        {/* Production Projects Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionHeader
            title="Production Projects"
            description="Live systems and production-ready infrastructure solutions"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productionProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.section>

        {/* Development Projects Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SectionHeader
            title="Development Projects"
            description="Interactive demonstrations and learning projects with hands-on features"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developmentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default WorkSection;