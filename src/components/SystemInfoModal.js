import React from 'react';
import { 
  FaTimes, 
  FaServer, 
  FaDocker, 
  FaShieldAlt, 
  FaNetworkWired,
  FaReact,
  FaNodeJs,
  FaGithub
} from 'react-icons/fa';
import { SiCloudflare } from 'react-icons/si';

const SystemInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const techStack = [
    { name: "React 18", category: "Frontend", icon: FaReact, color: "text-cyan-400" },
    { name: "Node.js", category: "Backend", icon: FaNodeJs, color: "text-green-500" },
    { name: "Docker Swarm", category: "Infrastructure", icon: FaDocker, color: "text-blue-400" },
    { name: "Traefik", category: "Proxy", icon: FaNetworkWired, color: "text-orange-400" },
    { name: "Let's Encrypt", category: "Security", icon: FaShieldAlt, color: "text-blue-500" },
    { name: "GitHub Actions", category: "CI/CD", icon: FaGithub, color: "text-gray-300" },
    { name: "Cloudflare", category: "CDN", icon: SiCloudflare, color: "text-orange-500" }
  ];


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="minecraft-panel max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="minecraft-title text-white text-lg">Tech Stack</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close modal"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content - Tech Stack and Self-Hosted Info */}
        <div className="p-4">
          {/* Self-hosted highlight */}
          <div className="mb-4 p-3 rounded-lg bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50">
            <div className="flex items-center gap-2">
              <FaServer className="text-blue-400 text-lg" />
              <span className="text-blue-300 font-medium">Self-hosted on Proxmox</span>
              <span className="text-gray-400 text-xs">(Infrastructure)</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black bg-opacity-30">
                <tech.icon className={`${tech.color} text-lg`} />
                <span className="text-white font-medium">{tech.name}</span>
                <span className="text-gray-500 text-xs">({tech.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoModal;