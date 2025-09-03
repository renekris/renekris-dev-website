import React, { useState, useEffect, useCallback } from 'react';

const StatusOverview = () => {
  const [statusData, setStatusData] = useState({
    website: { online: true, status: 'Online' },
    minecraft: { online: true, status: 'Online' },
    tarkov: { online: true, status: 'Online' },
    monitoring: { online: true, status: 'Online' }
  });

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
    
    if (uptimeData) {
      console.log('Using Uptime Kuma data for status checks');
      
      // Dynamic monitor mapping by name instead of hardcoded IDs
      const monitorNameMapping = {
        'Website': 'website',
        'Minecraft Server': 'minecraft', 
        'Tarkov SPT Server': 'tarkov',
        'Crafty Controller': 'monitoring'
      };
      
      const newStatusData = { ...statusData };
      
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
                uptime: uptimePercent
              };
            } else {
              newStatusData[serviceKey] = {
                online: false,
                status: 'No Data',
                uptime: null
              };
            }
          }
        });
      }
      
      setStatusData(newStatusData);
    } else {
      console.log('Uptime Kuma data unavailable, using fallback status');
      // Website is always online if React app loads
      setStatusData({
        website: { online: true, status: 'Online' },
        minecraft: { online: false, status: 'Monitoring Unavailable' },
        tarkov: { online: false, status: 'Monitoring Unavailable' },
        monitoring: { online: false, status: 'Service Unavailable' }
      });
    }
  }, [statusData]);

  useEffect(() => {
    // Initial status check after delay
    setTimeout(updateStatus, 2000);
    
    // Refresh status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, [updateStatus]);

  const StatusItem = ({ service, label, index }) => (
    <div className="status-item">
      <div>
        <span 
          className="status-dot" 
          style={{ 
            background: service.online ? '#00ff88' : '#ff4444',
            animation: service.online ? 'pulse 2s infinite' : 'none',
            animationDelay: `${index * 0.2}s`
          }}
        ></span>
        {label}
      </div>
      <div style={{ 
        fontSize: '0.9rem', 
        color: service.online ? '#888' : '#ff4444' 
      }}>
        {service.status}
      </div>
    </div>
  );

  return (
    <div className="status-overview">
      <h2 style={{ color: '#00d4ff', textAlign: 'center', marginBottom: '1rem' }}>
        System Status
      </h2>
      <div className="status-grid">
        <StatusItem service={statusData.website} label="Website" index={0} />
        <StatusItem service={statusData.minecraft} label="Minecraft" index={1} />
        <StatusItem service={statusData.tarkov} label="Tarkov SPT" index={2} />
        <StatusItem service={statusData.monitoring} label="Monitoring" index={3} />
      </div>
      <div className="status-link">
        <a href="https://status.renekris.dev/status/services" target="_blank" rel="noopener noreferrer">
          View Detailed Status
        </a>
      </div>
    </div>
  );
};

export default StatusOverview;