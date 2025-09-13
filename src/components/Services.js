import React from 'react';
import GamingHub from './GamingHub';
import TerminalServices from './TerminalServices';

const Services = () => {

  return (
    <div className="space-y-16">
      {/* Gaming Services Hub - Featured Section */}
      <GamingHub />
      
      {/* Terminal Services - Minecraft-themed terminals */}
      <TerminalServices />
    </div>
  );
};

export default Services;