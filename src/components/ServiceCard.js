import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ServiceCard = ({ title, status, statusColor, children, connectionInfo }) => {
  const getStatusClass = () => {
    switch(statusColor) {
      case 'active':
        return 'status-operational';
      case 'private':
        return 'status-private';
      case 'coming-soon':
        return 'status-development';
      default:
        return 'status-operational';
    }
  };

  const getStatusIcon = () => {
    switch(statusColor) {
      case 'active':
        return '✅';
      case 'private':
        return '🔒';
      case 'coming-soon':
        return '🚧';
      default:
        return '✅';
    }
  };

  return (
    <div 
      className="minecraft-panel rounded-lg p-4 h-full flex flex-col"
      tabIndex="0"
      role="region"
      aria-label={`Service: ${typeof title === 'string' ? title : 'Service Details'}`}
    >
      {/* Minecraft-style header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="minecraft-title text-white text-xl">
          {title}
        </h3>
        <div className={`minecraft-text text-sm font-bold ${
          statusColor === 'active' ? 'text-green-300' : 
          statusColor === 'coming-soon' ? 'text-yellow-300' : 'text-purple-300'
        }`} style={{ textShadow: '0 0 8px currentColor' }}>
          {status}
        </div>
      </div>
      
      {/* Connection info in nostalgic style */}
      {connectionInfo && (
        <div className="connection-display mb-3">
          <div className="text-gray-400 minecraft-text text-sm mb-1">{connectionInfo.label}:</div>
          <div className="text-white minecraft-text text-sm font-bold break-all">
            {connectionInfo.value}
          </div>
        </div>
      )}
      
      {/* Service details in nostalgic info section */}
      <div className="nostalgic-info-section flex-1">
        {children}
      </div>
    </div>
  );
};

export default ServiceCard;