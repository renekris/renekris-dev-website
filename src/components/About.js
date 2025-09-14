import React from 'react';
import { FaUser, FaCode, FaServer, FaBriefcase, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const About = () => {
  const aboutCards = [
    {
      title: 'Personal Info',
      icon: FaUser,
      status: 'Based in Estonia',
      statusColor: 'text-cyan-400',
      description: 'Renekris - Full-Stack Developer & Infrastructure Engineer with 5+ years experience. Passionate about creating scalable web applications and robust infrastructure solutions.'
    },
    {
      title: 'Skills & Technologies',
      icon: FaCode,
      status: 'Always Learning',
      statusColor: 'text-green-400',
      description: 'Frontend: React, TypeScript, JavaScript • Backend: Node.js, Python, Express.js • DevOps: Docker, AWS, Linux • Database: MongoDB, PostgreSQL'
    },
    {
      title: 'Experience',
      icon: FaBriefcase,
      status: '5+ Years Professional',
      statusColor: 'text-yellow-400',
      description: 'Senior Full-Stack Developer specializing in modern web applications, DevOps engineering, and cloud infrastructure. Building scalable solutions from concept to deployment.'
    },
    {
      title: 'Interests & Passions',
      icon: FaServer,
      status: 'Gaming & Tech',
      statusColor: 'text-purple-400',
      description: 'Gaming Server Administration • Cloud Architecture • Open Source Projects • Cyberpunk Aesthetics • Creating memorable user experiences through innovative technology.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-light mb-2 text-primary glow-text">About Renekris</h1>
        <p className="text-xl text-text-secondary mb-8">Get to know the developer behind the code</p>
      </header>

      <div className="space-y-16">
        <div className="services-grid">
          {aboutCards.map((card, index) => (
            <div key={index} className="minecraft-panel">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <card.icon className="text-cyan-400 text-xl" />
                  <h3 className="minecraft-title text-white text-xl font-bold">{card.title}</h3>
                </div>
                <div className={`minecraft-text text-sm font-bold ${card.statusColor}`}
                     style={{ textShadow: '0 0 8px currentColor' }}>
                  {card.status}
                </div>
              </div>

              <p className="text-gray-300 text-base leading-relaxed">
                {card.description}
              </p>

              {card.title === 'Personal Info' && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">Estonia</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <FaEnvelope className="text-sm" />
                    <a href="mailto:contact@renekris.dev"
                       className="text-sm hover:text-white transition-colors">
                      contact@renekris.dev
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;