import React from 'react';

const ServiceCard = ({ title, status, statusColor, children, connectionInfo }) => {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <div className="service-status" style={{ 
        background: statusColor === 'active' ? '#1a4a3a' : 
                   statusColor === 'private' ? '#1a1a4a' :
                   statusColor === 'coming-soon' ? '#4a3a1a' : '#1a4a3a',
        color: statusColor === 'active' ? '#00ff88' :
               statusColor === 'private' ? '#6666ff' :
               statusColor === 'coming-soon' ? '#ffaa00' : '#00ff88'
      }}>
        {status}
      </div>
      {connectionInfo && (
        <div className="connection-box">
          <div className="label">{connectionInfo.label}:</div>
          <div className="value">{connectionInfo.value}</div>
        </div>
      )}
      <div className="service-details">
        {children}
      </div>
    </div>
  );
};

export default ServiceCard;