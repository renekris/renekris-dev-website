import React, { useState, useEffect, useCallback } from 'react';

const StatusOverview = () => {
  const [statusData, setStatusData] = useState({
    minecraft: { 
      online: false, 
      status: 'Checking...',
      playerCount: null,
      uptime: null
    }
  });

  // Fetch Minecraft server details
  const fetchMinecraftStatus = async () => {
    try {
      console.log('Fetching Minecraft server status...');
      
      // Use mcsrvstat.us API to get Minecraft server info
      const response = await fetch('https://api.mcsrvstat.us/3/renekris.dev:25565', {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Minecraft API failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Minecraft server data received:', data);
      
      return {
        online: data.online || false,
        players: data.players || { online: 0, max: 20 },
        motd: data.motd?.clean?.[0] || 'Minecraft Server',
        version: data.version || 'Unknown'
      };
    } catch (error) {
      console.error('Failed to fetch Minecraft status:', error);
      return null;
    }
  };

  // Fetch status from Uptime Kuma
  const fetchUptimeKumaStatus = async () => {
    try {
      console.log('Fetching status from Uptime Kuma API...');
      
      const configResponse = await fetch('/api/status-page/services', {
        cache: 'no-cache'
      });
      
      if (!configResponse.ok) {
        throw new Error(`Config API failed: ${configResponse.status}`);
      }
      
      const config = await configResponse.json();
      
      const heartbeatResponse = await fetch('/api/status-page/heartbeat/services', {
        cache: 'no-cache'
      });
      
      if (!heartbeatResponse.ok) {
        throw new Error(`Heartbeat API failed: ${heartbeatResponse.status}`);
      }
      
      const heartbeatData = await heartbeatResponse.json();
      
      console.log('Status data received from Uptime Kuma API');
      
      return {
        monitors: config.publicGroupList[0].monitorList,
        heartbeats: heartbeatData.heartbeatList,
        uptimes: heartbeatData.uptimeList
      };
    } catch (error) {
      console.error('Failed to fetch status from Uptime Kuma:', error);
      return null;
    }
  };

  const updateStatus = useCallback(async () => {
    const uptimeData = await fetchUptimeKumaStatus();
    const minecraftData = await fetchMinecraftStatus();
    
    let newStatusData = {
      minecraft: { 
        online: false, 
        status: 'Checking...', 
        playerCount: null,
        uptime: null
      }
    };
    
    // Start with Uptime Kuma monitoring data
    if (uptimeData) {
      console.log('Using Uptime Kuma data for uptime monitoring');
      
      // Only monitor Minecraft Server
      const monitorNameMapping = {
        'Minecraft Server': 'minecraft'
      };
      
      // Find monitors by name from the monitor list
      if (uptimeData.monitors) {
        uptimeData.monitors.forEach(monitor => {
          const serviceKey = monitorNameMapping[monitor.name];
          if (serviceKey) {
            const heartbeats = uptimeData.heartbeats[monitor.id];
            const uptime24h = uptimeData.uptimes[`${monitor.id}_24`];
            
            if (heartbeats && heartbeats.length > 0) {
              const isOnline = heartbeats[0].status === 1;
              const uptimePercent = uptime24h ? uptime24h * 100 : null;
              
              newStatusData[serviceKey] = {
                online: isOnline,
                status: isOnline ? 'Online' : 'Offline',
                uptime: uptimePercent,
                playerCount: null
              };
            }
          }
        });
      }
    }
    
    // Enhance with Minecraft-specific data (prioritize over Uptime Kuma for accuracy)
    if (minecraftData) {
      console.log('Enhancing with Minecraft server data');
      newStatusData.minecraft = {
        ...newStatusData.minecraft,
        online: minecraftData.online,
        status: minecraftData.online ? 'Online' : 'Offline',
        playerCount: minecraftData.players.online,
        maxPlayers: minecraftData.players.max,
        version: minecraftData.version,
        motd: minecraftData.motd
      };
    } else if (!uptimeData) {
      // If neither source is available, explicitly set to monitoring unavailable
      newStatusData.minecraft = {
        online: false,
        status: 'Server Offline',
        playerCount: null,
        maxPlayers: null,
        version: null,
        motd: null,
        uptime: null
      };
    }
    
    // Fallback if both sources fail
    if (!uptimeData && !minecraftData) {
      console.log('All monitoring unavailable, using fallback status');
      newStatusData = {
        minecraft: { 
          online: false, 
          status: 'Monitoring Unavailable',
          uptime: null,
          playerCount: null
        }
      };
    }
    
    setStatusData(newStatusData);
  }, []);

  useEffect(() => {
    // Initial status check after delay
    setTimeout(updateStatus, 2000);
    
    // Refresh status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, [updateStatus]);

  const MinecraftStatusCard = ({ service }) => (
    <div className="minecraft-status-card">
      <div className="status-header">
        <span 
          className="status-dot" 
          style={{ 
            background: service.online ? '#00ff88' : '#ff4444',
            animation: service.online ? 'pulse 2s infinite' : 'none'
          }}
        ></span>
        <h3>Minecraft Server</h3>
      </div>
      
      <div className="status-details">
        <div className="status-main">
          <span className="status-text" style={{ 
            color: service.online ? '#00ff88' : '#ff4444',
            fontWeight: '600'
          }}>
            {service.status}
          </span>
          {service.uptime && (
            <span className="uptime-text">
              {service.uptime.toFixed(1)}% uptime (24h)
            </span>
          )}
          {!service.online && service.status !== 'Checking...' && (
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
            <span className="connection-value">renekris.dev:25565</span>
          </div>
          {service.playerCount !== null && (
            <div className="connection-item">
              <span className="connection-label">Players Online:</span>
              <span className="connection-value">{service.playerCount}/{service.maxPlayers || 20}</span>
            </div>
          )}
          {service.version && (
            <div className="connection-item">
              <span className="connection-label">Version:</span>
              <span className="connection-value">{service.version}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="status-overview">
      <h2 style={{ color: '#00d4ff', textAlign: 'center', marginBottom: '1.5rem' }}>
        Server Status
      </h2>
      <div className="minecraft-status-container">
        <MinecraftStatusCard service={statusData.minecraft} />
      </div>
    </div>
  );
};

export default StatusOverview;