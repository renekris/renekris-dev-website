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
    <div className="service-card">
      <h3>⛏️ Minecraft Server</h3>
      <div className="service-status" style={{ 
        background: statusData.online ? '#1a4a3a' : '#4a1a1a',
        color: statusData.online ? '#00ff88' : '#ff4444'
      }}>
        <span 
          className="status-dot" 
          style={{ 
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            marginRight: '8px',
            background: statusData.online ? '#00ff88' : '#ff4444',
            animation: statusData.online ? 'pulse 2s infinite' : 'none'
          }}
        ></span>
        {statusData.status}
      </div>
      
      <div className="connection-box">
        <div className="label">Server Address:</div>
        <div className="value">renekris.dev</div>
      </div>
      
      <div className="service-details">
        <strong>Players Online:</strong> {statusData.players.online}/{statusData.players.max}<br/>
        {statusData.motd && (
          <>
            <strong>Server:</strong> {statusData.motd}<br/>
          </>
        )}
        <strong>Modpack:</strong> Life in the Village 3<br/>
        <strong>Version:</strong> 1.19.2 + Forge<br/>
        <strong>Features:</strong> Create mod, magic, exploration
      </div>
    </div>
  );
};

export default StatusOverview;