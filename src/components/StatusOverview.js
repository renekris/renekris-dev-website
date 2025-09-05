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
    loading: true
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
        status: 'Offline',
        loading: false
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
        <div className={`minecraft-text text-sm px-3 py-1 rounded ${
          statusData.loading ? 'text-gray-400' : 
          statusData.online ? 'server-status-online' : 'server-status-offline'
        }`}>
          ● {statusData.loading ? 'Connecting...' : statusData.status}
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
          <span><strong className="text-white">Version:</strong> Minecraft 1.19.2 + Forge 43.3.0</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBuilding className="text-purple-400" />
          <span><strong className="text-white">Focus:</strong> MineColonies, building, exploration</span>
        </div>
        <div className="flex items-center gap-2">
          <FaServer className="text-red-400" />
          <span><strong className="text-white">Hardware:</strong> VM 103 - 16GB RAM, SSD storage</span>
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