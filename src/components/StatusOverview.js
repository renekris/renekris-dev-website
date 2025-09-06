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
  FaTools,
  FaChevronDown,
  FaChevronUp
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

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  });

  const [commandText, setCommandText] = useState('');
  const fullCommand = 'connect renekris.dev';
  
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Typewriter effect with human-like entropy
  useEffect(() => {
    let index = 0;
    let timeoutId;
    
    const getRandomDelay = () => {
      // Base typing speed: 80-150ms
      // Occasional hesitation: 300-600ms (10% chance)
      // Space after words: 150-250ms
      const currentChar = fullCommand[index - 1];
      const nextChar = fullCommand[index];
      
      if (Math.random() < 0.1) {
        return 300 + Math.random() * 300; // Hesitation
      } else if (currentChar === ' ' || nextChar === ' ') {
        return 150 + Math.random() * 100; // Pause around spaces
      } else {
        return 80 + Math.random() * 70; // Normal typing
      }
    };
    
    const typeNextChar = () => {
      setCommandText(fullCommand.slice(0, index));
      index++;
      
      if (index <= fullCommand.length) {
        timeoutId = setTimeout(typeNextChar, getRandomDelay());
      }
    };
    
    timeoutId = setTimeout(typeNextChar, 500); // Initial delay
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Minecraft-style tooltip component
  const MinecraftTooltip = () => {
    if (!tooltip.visible) return null;

    return (
      <div
        className="fixed z-50 pointer-events-none transition-opacity duration-100"
        style={{
          left: `${tooltip.x - 50}px`, // Center horizontally
          top: `${tooltip.y - 40}px`,  // Position above cursor
        }}
      >
        <div className="minecraft-tooltip minecraft-text text-white text-sm px-2 py-1 rounded shadow-lg">
          {tooltip.text}
        </div>
      </div>
    );
  };

  // Minecraft-style connection bars component
  const ConnectionBars = ({ online, loading, ping }) => {
    const getPingLevel = (ping) => {
      if (!online || loading || ping === null) return 0;
      // Minecraft ping ranges: 0-99=5bars, 100-299=4bars, 300-599=3bars, 600-999=2bars, 1000+=1bar
      if (ping <= 99) return 5;      // Excellent - all 5 bars
      if (ping <= 299) return 4;     // Good - 4 bars
      if (ping <= 599) return 3;     // Fair - 3 bars  
      if (ping <= 999) return 2;     // Poor - 2 bars
      return 1;                      // Very poor - 1 bar
    };

    const getBarColor = (barIndex, pingLevel, loading, online) => {
      if (loading) return 'bg-gray-500';
      if (!online) return 'bg-red-600';
      
      if (barIndex < pingLevel) {
        // Color based on overall connection quality
        if (pingLevel >= 4) return 'bg-green-500';      // Green for good connection
        if (pingLevel >= 2) return 'bg-yellow-500';     // Yellow for fair connection
        return 'bg-red-500';                             // Red for poor connection
      }
      return 'bg-gray-800';  // Darker background for empty bars
    };

    const pingLevel = getPingLevel(ping);
    
    // Minecraft-style bar heights: 2px, 4px, 6px, 8px, 10px
    const barHeights = [2, 4, 6, 8, 10];

    const handleMouseEnter = (e) => {
      const tooltipText = loading ? 'Connecting...' : 
                          !online ? 'Server Offline' :
                          `${ping}ms`;
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        text: tooltipText
      });
    };

    const handleMouseMove = (e) => {
      setTooltip(prev => ({
        ...prev,
        visible: true,
        x: e.clientX,
        y: e.clientY
      }));
    };

    const handleMouseLeave = () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };

    return (
      <div 
        className="flex items-end gap-px h-3 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-1 transition-colors duration-200 ${getBarColor(index, pingLevel, loading, online)}`}
            style={{ height: `${barHeights[index]}px` }}
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
      className="minecraft-panel rounded-lg p-4 h-full flex flex-col"
      tabIndex="0"
      role="region"
      aria-label="Minecraft Server Status"
      aria-live="polite"
    >
      {/* Minecraft-style header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="minecraft-text text-white text-2xl">
          <span>Minecraft Server</span>
        </h3>
        <div className="flex items-center gap-3">
          <div className={`minecraft-text text-sm font-bold ${
            statusData.loading ? 'text-gray-300' : 
            statusData.online ? 'text-green-300' : 'text-red-300'
          }`} style={{ textShadow: '0 0 8px currentColor' }}>
            {statusData.loading ? 'Connecting...' : statusData.status}
          </div>
          <ConnectionBars 
            online={statusData.online}
            loading={statusData.loading}
            ping={statusData.ping}
          />
        </div>
      </div>
      
      {/* Server connection display - Command line style */}
      <div 
        className="connection-display mb-3 flex justify-between items-center"
        onClick={() => navigator.clipboard?.writeText('renekris.dev')}
        title="Click to copy server address"
      >
        <div className="flex items-center">
          <span className="command-prompt">minecraft@server:~$ </span>
          <span className="server-address">{commandText}</span>
          <span className="cursor-blink">_</span>
        </div>
        <a 
          href="https://192.168.1.232:8443" 
          target="_blank" 
          rel="noopener noreferrer"
          className="minecraft-button-square no-underline"
          onClick={(e) => e.stopPropagation()}
          title="Open Control Panel"
        >
          <FaTools />
        </a>
      </div>
      
      {/* Player info section */}
      <div className="nostalgic-info-section">
        <div className="info-line">
          <div className="info-icon"><FaUsers /></div>
          <span className="info-label">Players:</span>
          <span className="info-value">{statusData.players.online}/{statusData.players.max} online</span>
        </div>
        {statusData.motd && (
          <div className="info-line">
            <div className="info-icon"><FaComments /></div>
            <span className="info-label">MOTD:</span>
            <span className="info-value">{statusData.motd}</span>
          </div>
        )}
        
        {/* Dropdown toggle button */}
        <div className="info-line">
          <button
            className="dropdown-toggle"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            aria-expanded={isDetailsExpanded}
            aria-controls="server-details"
          >
            <div className="info-icon">
              {isDetailsExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <span className="info-label">Server Details</span>
          </button>
        </div>
      </div>

      {/* Collapsible server details section */}
      <div 
        className={`nostalgic-info-section collapsible-section ${isDetailsExpanded ? 'expanded' : 'collapsed'}`}
        id="server-details"
      >
        <div className="info-line">
          <div className="info-icon"><FaCube /></div>
          <span className="info-label">Modpack:</span>
          <span className="info-value">Life in the Village 3 (LitV3)</span>
        </div>
        <div className="info-line">
          <div className="info-icon"><FaCog /></div>
          <span className="info-label">Version:</span>
          <span className="info-value">Minecraft 1.19.2</span>
        </div>
        <div className="info-line">
          <div className="info-icon"><FaBuilding /></div>
          <span className="info-label">Focus:</span>
          <span className="info-value">MineColonies, building, exploration</span>
        </div>
        <div className="info-line">
          <div className="info-icon"><FaServer /></div>
          <span className="info-label">Hardware:</span>
          <span className="info-value">Intel i7 7700K, 12GB RAM, SSD storage</span>
        </div>
      </div>
      
      
      {/* Minecraft-style tooltip overlay */}
      <MinecraftTooltip />
    </div>
  );
};

export default StatusOverview;