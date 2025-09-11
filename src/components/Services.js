import React from 'react';
import ServiceCard from './ServiceCard';
import GamingHub from './GamingHub';
import { 
  FaCode, 
  FaChartLine, 
  FaServer
} from 'react-icons/fa';

const Services = () => {

  return (
    <div className="space-y-16">
      {/* Gaming Services Hub - Featured Section */}
      <GamingHub />
      
      {/* Supporting Services - Clean 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ServiceCard
          title={
            <div className="flex items-center gap-3">
              <FaCode className="text-xl" />
              <span>Development Portfolio</span>
            </div>
          }
          status="In Development"
          statusColor="coming-soon"
          connectionInfo={{
            label: "Preview URL",
            value: "renekris.dev/portfolio"
          }}
        >
          <div className="info-line">
            <div className="info-icon">🎯</div>
            <span className="info-label">Purpose:</span>
            <span className="info-value">Interactive project showcase</span>
          </div>
          <div className="info-line">
            <div className="info-icon">⚛️</div>
            <span className="info-label">Stack:</span>
            <span className="info-value">React 18, Node.js, Docker</span>
          </div>
          <div className="info-line">
            <div className="info-icon">✨</div>
            <span className="info-label">Features:</span>
            <span className="info-value">Live demos, case studies</span>
          </div>
        </ServiceCard>
        
        <ServiceCard
          title={
            <div className="flex items-center gap-3">
              <FaChartLine className="text-xl" />
              <span>Infrastructure Monitoring</span>
            </div>
          }
          status="Operational"
          statusColor="active"
          connectionInfo={{
            label: "Public Dashboard",
            value: "status.renekris.dev"
          }}
        >
          <div className="info-line">
            <div className="info-icon">📊</div>
            <span className="info-label">Platform:</span>
            <span className="info-value">Uptime Kuma</span>
          </div>
          <div className="info-line">
            <div className="info-icon">🔍</div>
            <span className="info-label">Monitoring:</span>
            <span className="info-value">HTTP/HTTPS endpoints</span>
          </div>
          <div className="info-line">
            <div className="info-icon">🔒</div>
            <span className="info-label">Security:</span>
            <span className="info-value">SSL certificates, DNS</span>
          </div>
        </ServiceCard>
        
        <ServiceCard
          title={
            <div className="flex items-center gap-3">
              <FaServer className="text-xl" />
              <span>Infrastructure Stack</span>
            </div>
          }
          status="Production Grade"
          statusColor="active"
          connectionInfo={{
            label: "Architecture",
            value: "Hybrid Cloud + Self-Hosted"
          }}
        >
          <div className="info-line">
            <div className="info-icon">🖥️</div>
            <span className="info-label">Hypervisor:</span>
            <span className="info-value">Proxmox VE 8.x</span>
          </div>
          <div className="info-line">
            <div className="info-icon">🌐</div>
            <span className="info-label">Proxy:</span>
            <span className="info-value">Traefik v3.5.1</span>
          </div>
          <div className="info-line">
            <div className="info-icon">☁️</div>
            <span className="info-label">CDN:</span>
            <span className="info-value">Cloudflare DDoS protection</span>
          </div>
          <div className="info-line">
            <div className="info-icon">🐳</div>
            <span className="info-label">Containers:</span>
            <span className="info-value">Docker Swarm</span>
          </div>
        </ServiceCard>
      </div>
    </div>
  );
};

export default Services;