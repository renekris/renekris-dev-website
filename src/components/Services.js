import React from 'react';
import ServiceCard from './ServiceCard';
import GamingHub from './GamingHub';
import { 
  FaCode, 
  FaChartLine, 
  FaServer,
  FaTools,
  FaCheckCircle,
  FaBolt
} from 'react-icons/fa';

const Services = () => {
  const IconTitle = ({ icon, title }) => (
    <span style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span>{title}</span>
    </span>
  );

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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🎯</span>
              <span><strong className="text-white">Purpose:</strong> Interactive project showcase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">⚛️</span>
              <span><strong className="text-white">Stack:</strong> React 18, Node.js, Docker</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✨</span>
              <span><strong className="text-white">Features:</strong> Live demos, case studies</span>
            </div>
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span><strong className="text-white">Platform:</strong> Uptime Kuma</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">🔍</span>
              <span><strong className="text-white">Monitoring:</strong> HTTP/HTTPS endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🔒</span>
              <span><strong className="text-white">Security:</strong> SSL certificates, DNS</span>
            </div>
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🖥️</span>
              <span><strong className="text-white">Hypervisor:</strong> Proxmox VE 8.x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🌐</span>
              <span><strong className="text-white">Proxy:</strong> Traefik v3.5.1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">☁️</span>
              <span><strong className="text-white">CDN:</strong> Cloudflare DDoS protection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">🐳</span>
              <span><strong className="text-white">Containers:</strong> Docker Swarm</span>
            </div>
          </div>
        </ServiceCard>
      </div>
    </div>
  );
};

export default Services;