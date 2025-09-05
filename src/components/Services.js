import React from 'react';
import ServiceCard from './ServiceCard';
import StatusOverview from './StatusOverview';

const Services = () => {
  return (
    <div className="services">
      {/* Live Minecraft Server Status - Real-time data */}
      <div className="service-card">
        <StatusOverview />
      </div>
      
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
        <strong>Platform:</strong> Proxmox VE hypervisor<br/>
        <strong>Web Server:</strong> Docker + Traefik reverse proxy<br/>
        <strong>Monitoring:</strong> Uptime Kuma + real-time status API<br/>
        <strong>Security:</strong> UFW firewall + automatic SSL certificates<br/>
        <strong>Network:</strong> Cloudflare DNS + DDoS protection
      </ServiceCard>
    </div>
  );
};

export default Services;