import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaGamepad, 
  FaUsers, 
  FaComments, 
  FaCube, 
  FaCog,
  FaBuilding,
  FaServer,
  FaCopy,
  FaTools
} from 'react-icons/fa';

const StatusOverview = () => {
  const [statusData, setStatusData] = useState({
    online: false,
    players: { online: 0, max: 20 },
    motd: null,
    status: 'Checking...',
    loading: true,
    ping: null
  });

  // Minecraft-style connection bars component
  const ConnectionBars = ({ online, loading, ping }) => {
    const getPingLevel = (ping) => {
      if (!online || loading || ping === null) return 0;
      if (ping <= 50) return 5;      // Excellent - all bars green
      if (ping <= 100) return 4;     // Good - 4 bars
      if (ping <= 150) return 3;     // Fair - 3 bars  
      if (ping <= 250) return 2;     // Poor - 2 bars
      if (ping <= 500) return 1;     // Very poor - 1 bar
      return 0;                      // No connection
    };

    const getBarColor = (barIndex, pingLevel, loading, online) => {
      if (loading) return 'bg-gray-500';
      if (!online) return 'bg-red-500';
      
      if (barIndex < pingLevel) {
        if (pingLevel >= 4) return 'bg-green-500';      // Excellent/Good
        if (pingLevel >= 2) return 'bg-yellow-500';     // Fair/Poor
        return 'bg-red-500';                             // Very poor
      }
      return 'bg-gray-700';
    };

    const pingLevel = getPingLevel(ping);

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-1 transition-colors duration-300 ${getBarColor(index, pingLevel, loading, online)}`}
            style={{ height: `${8 + index * 2}px` }}
          />
        ))}
      </div>
    );
  };

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
        status: 'Offline',
        loading: false,
        ping: null
      };
    }
  };

  const updateStatus = useCallback(async () => {
    const data = await fetchMinecraftStatus();
    setStatusData({
      ...data,
      status: data.online ? 'Online' : 'Offline',
      loading: false
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
    <div 
      className="minecraft-panel rounded-lg p-6 h-full flex flex-col"
      tabIndex="0"
      role="region"
      aria-label="Minecraft Server Status"
      aria-live="polite"
    >
      {/* Minecraft-style header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="minecraft-text text-white text-2xl flex items-center gap-3">
          <FaGamepad className="text-green-400 text-2xl" />
          <span>Minecraft Server</span>
        </h3>
        <div 
          className="flex items-center gap-3"
          title={
            statusData.loading ? 'Connecting...' : 
            statusData.online ? `Ping: ${statusData.ping || '?'}ms` : 'Server Offline'
          }
        >
          <div className={`minecraft-text text-sm ${
            statusData.loading ? 'text-gray-400' : 
            statusData.online ? 'text-green-400' : 'text-red-400'
          }`}>
            {statusData.loading ? 'Connecting...' : statusData.status}
          </div>
          <ConnectionBars 
            online={statusData.online}
            loading={statusData.loading}
            ping={statusData.ping}
          />
        </div>
      </div>
      
      {/* Server connection display - Minecraft server selection style */}
      <div className="connection-display mb-4">
        <div className="minecraft-text text-green-400 text-xl font-bold">renekris.dev</div>
        <div className="text-gray-300 text-sm minecraft-text">
          {statusData.players.online}/{statusData.players.max} players online
        </div>
      </div>
      
      {/* Players section with Minecraft styling */}
      <div className="mb-4">
        <div className="minecraft-text text-white text-base flex items-center gap-2 mb-2">
          <FaUsers className="text-blue-400" />
          <span>Players Online: <span className="text-green-400">{statusData.players.online}/{statusData.players.max}</span></span>
        </div>
        {statusData.motd && (
          <div className="minecraft-text text-gray-300 text-sm flex items-center gap-2">
            <FaComments className="text-yellow-400" />
            <span>MOTD: {statusData.motd}</span>
          </div>
        )}
      </div>
      
      {/* Server info in Minecraft style */}
      <div className="space-y-2 minecraft-text text-sm text-gray-200 mb-6">
        <div className="flex items-center gap-2">
          <FaCube className="text-yellow-400" />
          <span><strong className="text-white">Modpack:</strong> Life in the Village 3 (LitV3)</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCog className="text-blue-400" />
          <span><strong className="text-white">Version:</strong> Minecraft 1.19.2</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBuilding className="text-purple-400" />
          <span><strong className="text-white">Focus:</strong> MineColonies, building, exploration</span>
        </div>
        <div className="flex items-center gap-2">
          <FaServer className="text-red-400" />
          <span><strong className="text-white">Hardware:</strong> Intel i7 7700K, 12GB RAM, SSD storage</span>
        </div>
      </div>
      
      {/* Minecraft-style action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          className="minecraft-button flex items-center justify-center gap-2 px-4 py-2 text-sm"
          onClick={() => navigator.clipboard?.writeText('renekris.dev')}
          title="Click to copy server address"
        >
          <FaCopy />
          Copy Server Address
        </button>
        <a 
          href="https://192.168.1.232:8443" 
          target="_blank" 
          rel="noopener noreferrer"
          className="minecraft-button flex items-center justify-center gap-2 px-4 py-2 text-sm no-underline"
        >
          <FaTools />
          Control Panel
        </a>
      </div>
    </div>
  );
};

export default StatusOverview;