import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUsers,
  FaCube,
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

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  });

  const [commandText, setCommandText] = useState('');
  const fullCommand = 'renekris.dev';

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


  // Minecraft-style connection bars component
  const ConnectionBars = ({ online, loading, ping }) => {
    const getPingLevel = (ping) => {
      if (!online || loading || ping === null || ping === undefined || typeof ping !== 'number') return 0;
      // Minecraft ping ranges: 0-99=5bars, 100-299=4bars, 300-599=3bars, 600-999=2bars, 1000+=1bar
      if (ping <= 99) return 5;      // Excellent - all 5 bars
      if (ping <= 299) return 4;     // Good - 4 bars
      if (ping <= 599) return 3;     // Fair - 3 bars  
      if (ping <= 999) return 2;     // Poor - 2 bars
      return 1;                      // Very poor - 1 bar
    };

    const getBarColor = (barIndex, pingLevel, loading, online) => {
      if (loading) return 'bg-gray-500 animate-pulse';
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

    const handleMouseEnter = useCallback((e) => {
      let tooltipText;
      if (loading) {
        tooltipText = 'Connecting to server...';
      } else if (!online) {
        tooltipText = 'Server is offline - unable to connect';
      } else if (ping === null || ping === undefined || typeof ping !== 'number') {
        tooltipText = 'Ping measurement unavailable';
      } else {
        tooltipText = `Ping: ${ping}ms (round-trip to server)`;
      }
      
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        text: tooltipText
      });
    }, [loading, online, ping]);

    const handleMouseMove = useCallback((e) => {
      setTooltip(prev => ({
        ...prev,
        visible: true,
        x: e.clientX,
        y: e.clientY
      }));
    }, []);

    const handleMouseLeave = useCallback(() => {
      setTooltip(prev => ({
        ...prev,
        visible: false
      }));
    }, []);

    return (
      <div 
        className="flex items-end gap-px h-3 cursor-pointer relative"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-1 transition-colors duration-200 ${getBarColor(index, pingLevel, loading, online)} relative`}
            style={{ height: `${barHeights[index]}px` }}
          >
            {!online && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-400 text-xs leading-none" style={{ fontSize: '6px' }}>×</div>
              </div>
            )}
          </div>
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
      className="minecraft-panel"
      tabIndex="0"
      role="region"
      aria-label="Minecraft Server Status"
      aria-live="polite"
    >
      {/* Minecraft-style header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="minecraft-title text-white text-2xl flex items-center gap-2">
          <FaCube className="text-green-400" />
          <span>Minecraft Server</span>
        </h3>
        <div className="flex items-center gap-3">
          {/* Player count with minecraft font */}
          <div className="flex items-center gap-1">
            <FaUsers className="text-green-400 text-xs" />
            <span className="minecraft-text text-green-300">{statusData.players.online}/{statusData.players.max}</span>
          </div>
          {statusData.loading && (
            <div className="minecraft-text text-sm font-bold text-gray-300" style={{ textShadow: '0 0 8px currentColor' }}>
              Connecting...
            </div>
          )}
          <ConnectionBars 
            online={statusData.online}
            loading={statusData.loading}
            ping={statusData.ping}
          />
        </div>
      </div>

      {/* Server connection display - Command line style */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-semibold">Server IP Address</span>
        </div>
        <div 
          className="connection-display flex justify-between items-center cursor-pointer"
          onClick={() => navigator.clipboard?.writeText('renekris.dev')}
          title="Click to copy server address"
        >
          <div className="flex items-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <span className="server-address text-green-400 text-lg font-bold" style={{ whiteSpace: 'nowrap' }}>{commandText}</span>
            <span className="cursor-blink">_</span>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* MOTD Section */}
      <div className="text-center py-3 border-t border-gray-700">
        <p className="text-gray-400 text-sm font-mono italic">
          {statusData.motd || "Welcome to renekris.dev Minecraft server"}
        </p>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div 
          className="minecraft-tooltip fixed px-3 py-2 z-50 pointer-events-none"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y - 35}px`
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default StatusOverview;