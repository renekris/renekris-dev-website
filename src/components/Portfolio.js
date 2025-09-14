import React from 'react';
import {
  FaCode,
  FaServer,
  FaGamepad,
  FaDocker,
  FaChartLine,
  FaTerminal
} from 'react-icons/fa';
import Footer from './Footer';

const Portfolio = () => {
  const projects = [
    {
      title: 'Renekris.dev Infrastructure',
      icon: FaCode,
      status: 'Operational',
      statusColor: 'text-green-400',
      description: 'Personal website with cyberpunk design and modern React architecture. Built with performance optimization and responsive design principles.'
    },
    {
      title: 'Dev Control Panel',
      icon: FaTerminal,
      status: 'Operational',
      statusColor: 'text-green-400',
      description: 'CLI workflow tool for development automation. Streamlines deployment, testing, and project management with bash scripting.'
    },
    {
      title: 'Minecraft Server Management',
      icon: FaGamepad,
      status: 'Operational',
      statusColor: 'text-green-400',
      description: 'RCON monitoring and automation system. Real-time server status tracking with automated health checks and performance metrics.'
    },
    {
      title: 'Docker Swarm Infrastructure',
      icon: FaDocker,
      status: 'Operational',
      statusColor: 'text-green-400',
      description: 'Container orchestration setup with automated deployment pipelines. Multi-node cluster management with load balancing and scaling.'
    },
    {
      title: 'Monitoring Systems',
      icon: FaChartLine,
      status: 'In Development',
      statusColor: 'text-yellow-400',
      description: 'Server health and performance tracking dashboard. Real-time metrics collection with alerting and historical data analysis.'
    },
    {
      title: 'Gaming Hub Platform',
      icon: FaServer,
      status: 'Completed',
      statusColor: 'text-blue-400',
      description: 'Minecraft server hosting platform with user management. Community-focused gaming environment with custom plugins and mods.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-light mb-2 text-primary glow-text">Portfolio</h1>
        <p className="text-xl text-text-secondary mb-8">Infrastructure & Development Projects</p>
      </header>

      <div className="space-y-16">
        <div className="services-grid">
          {projects.map((project, index) => (
            <div key={index} className="minecraft-panel">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <project.icon className="text-cyan-400 text-xl" />
                  <h3 className="minecraft-title text-white text-xl font-bold">{project.title}</h3>
                </div>
                <div className={`minecraft-text text-sm font-bold ${project.statusColor}`}
                     style={{ textShadow: '0 0 8px currentColor' }}>
                  {project.status}
                </div>
              </div>

              <p className="text-gray-300 text-base leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Portfolio;