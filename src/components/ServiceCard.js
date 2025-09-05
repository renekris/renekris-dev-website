import React from 'react';

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
      className="service-card h-full flex flex-col" 
      tabIndex="0"
      role="region"
      aria-label={`Service: ${typeof title === 'string' ? title : 'Service Details'}`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-primary text-xl font-semibold flex-1">{title}</h3>
      </div>
      
      {/* Status badge */}
      <div className={`status-badge ${getStatusClass()} mb-4`}>
        <span>{getStatusIcon()}</span>
        <span>{status}</span>
      </div>
      
      {/* Connection info */}
      {connectionInfo && (
        <div className="connection-display mb-4">
          <div className="text-gray-400 text-sm mb-1">{connectionInfo.label}:</div>
          <div className="text-primary font-mono text-sm font-bold break-all">
            {connectionInfo.value}
          </div>
        </div>
      )}
      
      {/* Service details */}
      <div className="text-gray-300 text-sm leading-relaxed space-y-2 flex-1">
        {children}
      </div>
    </div>
  );
};

export default ServiceCard;