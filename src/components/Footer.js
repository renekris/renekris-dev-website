import React, { useState } from 'react';
import SystemInfoModal from './SystemInfoModal';
import { FaChartBar, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="mt-auto text-center pt-8 border-t border-bg-tertiary text-text-tertiary">
      <p className="mb-6">&copy; 2025 Renekris. Test deployment changes!</p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-3">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="minecraft-button-square" 
          title="System Architecture"
        >
          <FaChartBar />
        </button>
        <a 
          href="https://github.com/renekris/renekris-dev-website" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="minecraft-button-square no-underline"
          title="Source Code"
        >
          <FaGithub />
        </a>
      </div>
      
      <SystemInfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;