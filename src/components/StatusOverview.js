import React, { useState, useEffect, useCallback } from 'react';

const StatusOverview = () => {
  const [statusData, setStatusData] = useState({
    online: false,
    players: { online: 0, max: 20 },
    motd: null,
    status: 'Checking...'
  });

  // Fetch Minecraft server status from our backend
  const fetchMinecraftStatus = async () => {
    try {
      console.log('Fetching Minecraft server status...');
      
      const response = await fetch('/api/minecraft-status', {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Minecraft server data received:', data);
      
      return data;
    } catch (error) {
      console.error('Failed to fetch Minecraft status:', error);
      return {
        online: false,
        players: { online: 0, max: 20 },
        motd: null,
        status: 'Offline'
      };
    }
  };

  const updateStatus = useCallback(async () => {
    const data = await fetchMinecraftStatus();
    setStatusData({
      ...data,
      status: data.online ? 'Online' : 'Offline'
    });
  }, []);

  useEffect(() => {
    // Initial status check
    updateStatus();
    
    // Refresh status every 10 seconds (backend updates every 5s)
    const interval = setInterval(updateStatus, 10000);
    
    return () => clearInterval(interval);
  }, [updateStatus]);

  return (
    <div className="minecraft-status-card">
      <div className="status-header">
        <span 
          className="status-dot" 
          style={{ 
            background: statusData.online ? '#00ff88' : '#ff4444',
            animation: statusData.online ? 'pulse 2s infinite' : 'none'
          }}
        ></span>
        <h3>Minecraft Server</h3>
      </div>
      
      <div className="status-details">
        <div className="status-main">
          <span className="status-text" style={{ 
            color: statusData.online ? '#00ff88' : '#ff4444',
            fontWeight: '600'
          }}>
            {statusData.status}
          </span>
          
          {!statusData.online && statusData.status !== 'Checking...' && (
            <span className="offline-note" style={{ 
              color: '#ff7777', 
              fontSize: '0.8rem', 
              fontStyle: 'italic' 
            }}>
              Server is currently offline
            </span>
          )}
        </div>
        
        <div className="connection-info">
          <div className="connection-item">
            <span className="connection-label">Server Address:</span>
            <span className="connection-value">renekris.dev</span>
          </div>
          
          <div className="connection-item">
            <span className="connection-label">Players Online:</span>
            <span className="connection-value">{statusData.players.online}/{statusData.players.max}</span>
          </div>
          
          {statusData.motd && (
            <div className="connection-item">
              <span className="connection-label">Server:</span>
              <span className="connection-value">{statusData.motd}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;