import React from 'react';
import { FaCode, FaServer, FaArrowRight, FaCircle } from 'react-icons/fa';

const TerminalServices = () => {
  const services = [
    {
      title: 'Portfolio',
      icon: FaCode,
      status: 'In Development',
      statusColor: 'text-yellow-400',
      description: 'Personal website and project showcase'
    },
    {
      title: 'Infrastructure',
      icon: FaServer,
      status: 'Operational', 
      statusColor: 'text-green-400',
      description: 'Docker Swarm hosting environment'
    }
  ];

  return (
    <div className="services-grid">
      {services.map((service, index) => (
        <div key={index} className="minecraft-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <service.icon className="text-cyan-400 text-xl" />
              <h3 className="minecraft-title text-white text-xl font-bold">{service.title}</h3>
            </div>
            <div className={`minecraft-text text-sm font-bold ${service.statusColor}`} 
                 style={{ textShadow: '0 0 8px currentColor' }}>
              {service.status}
            </div>
          </div>
          
          <p className="text-gray-300 text-base leading-relaxed">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TerminalServices;