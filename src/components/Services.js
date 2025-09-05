import React from 'react';
import ServiceCard from './ServiceCard';
import StatusOverview from './StatusOverview';

const Services = () => {
  return (
    <div className="services">
      {/* Live Minecraft Server Status - Real-time data */}
      <StatusOverview />
      
      <ServiceCard
        title="🌐 Development Portfolio"
        status="🚧 In Progress"
        statusColor="coming-soon"
        connectionInfo={{
          label: "Preview",
          value: "renekris.dev/portfolio"
        }}
      >
        <strong>Purpose:</strong> Showcase full-stack development projects<br/>
        <strong>Tech Stack:</strong> React, Node.js, PostgreSQL<br/>
        <strong>Features:</strong> Interactive demos, case studies, GitHub integration<br/>
        <strong>Timeline:</strong> Launch Q1 2025
      </ServiceCard>
      
      <ServiceCard
        title="📊 Infrastructure Monitoring"
        status="🟢 Healthy"
        statusColor="active"
        connectionInfo={{
          label: "Public Status",
          value: "status.renekris.dev"
        }}
      >
        <strong>Coverage:</strong> 24/7 uptime monitoring across all services<br/>
        <strong>Metrics:</strong> Response time, availability, SSL certificate expiry<br/>
        <strong>Alerts:</strong> Discord notifications + email alerts<br/>
        <strong>Retention:</strong> 90-day historical data with trend analysis
      </ServiceCard>
      
      <ServiceCard
        title="🎮 Game Server Management"
        status="🔐 Admin Only"
        statusColor="private"
        connectionInfo={{
          label: "Control Panel",
          value: "192.168.1.232:8443"
        }}
      >
        <strong>Platform:</strong> Crafty Controller with 2FA authentication<br/>
        <strong>Features:</strong> Real-time console, file manager, backup scheduling<br/>
        <strong>Monitoring:</strong> CPU/RAM usage, player activity, crash detection<br/>
        <strong>Access:</strong> Private network only (192.168.1.x subnet)
      </ServiceCard>
      
      <ServiceCard
        title="🏗️ Infrastructure Stack"
        status="⚡ Production Ready"
        statusColor="active"
        connectionInfo={{
          label: "Architecture",
          value: "Hybrid Cloud + On-Premises"
        }}
      >
        <strong>Compute:</strong> Proxmox VE hypervisor with VM orchestration<br/>
        <strong>Web Layer:</strong> Traefik reverse proxy with automatic SSL<br/>
        <strong>Networking:</strong> Cloudflare CDN + DDoS protection<br/>
        <strong>Security:</strong> UFW firewall, fail2ban intrusion detection<br/>
        <strong>Deployment:</strong> GitHub Actions CI/CD with blue-green strategy
      </ServiceCard>
    </div>
  );
};

export default Services;