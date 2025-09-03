import React from 'react';
import ServiceCard from './ServiceCard';

const Services = () => {
  return (
    <div className="services">
      <ServiceCard
        title="🌐 Portfolio Website"
        status="Coming Soon"
        statusColor="coming-soon"
      >
        Professional portfolio showcasing development projects and technical expertise.
      </ServiceCard>
      
      <ServiceCard
        title="📊 System Monitoring"
        status="✅ Active"
        statusColor="active"
        connectionInfo={{
          label: "Public Dashboard",
          value: "status.renekris.dev"
        }}
      >
        Real-time uptime monitoring and service health tracking.
      </ServiceCard>
      
      <ServiceCard
        title="⛏️ Minecraft Server"
        status="✅ Online"
        statusColor="active"
        connectionInfo={{
          label: "Server Address",
          value: "renekris.dev"
        }}
      >
        <strong>Modpack:</strong> Life in the Village 3<br/>
        <strong>Version:</strong> 1.19.2 + Forge<br/>
        <strong>Features:</strong> Create mod, magic, exploration
      </ServiceCard>
      
      <ServiceCard
        title="🎯 Tarkov SPT"
        status="✅ Online"
        statusColor="active"
        connectionInfo={{
          label: "Server URL",
          value: "https://tarkov.renekris.dev"
        }}
      >
        <strong>Mode:</strong> Single Player Tarkov<br/>
        <strong>Features:</strong> Offline gameplay with mods
      </ServiceCard>
      
      <ServiceCard
        title="🛠️ Management"
        status="🔒 Private"
        statusColor="private"
        connectionInfo={{
          label: "Crafty Controller",
          value: "crafty.renekris.dev"
        }}
      >
        Web-based server management and administration.
      </ServiceCard>
      
      <ServiceCard
        title="📈 Infrastructure"
        status="⚡ Optimized"
        statusColor="active"
      >
        <strong>Platform:</strong> Proxmox VMs<br/>
        <strong>Containers:</strong> Docker + Caddy<br/>
        <strong>Security:</strong> UFW + Fail2ban<br/>
        <strong>SSL:</strong> Automatic HTTPS
      </ServiceCard>
    </div>
  );
};

export default Services;