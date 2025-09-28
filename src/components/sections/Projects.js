import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "Docker Swarm Infrastructure",
      description: "Automated deployment pipeline with 99.9% uptime and monitoring.",
      tech: ["Docker", "Node.js", "Monitoring"],
      github: "https://github.com/renekris/proxmox-manage",
      demo: "#",
      image: "/api/placeholder/320/180"
    },
    {
      title: "Modern Web Portfolio",
      description: "Mobile-first responsive design with performance optimization.",
      tech: ["React", "TypeScript", "Tailwind"],
      github: "https://github.com/renekris/renekris-dev-website",
      demo: "https://renekris.dev",
      image: "/api/placeholder/320/180"
    },
    {
      title: "Minecraft Server Management",
      description: "Automated backup and monitoring system reducing maintenance by 80%.",
      tech: ["Python", "Docker", "RCON"],
      github: "#",
      demo: "#",
      image: "/api/placeholder/320/180"
    },
    {
      title: "JavaScript Calculator",
      description: "Clean UI with advanced operations demonstrating core programming skills.",
      tech: ["JavaScript", "CSS Grid", "Vanilla JS"],
      github: "#",
      demo: "#",
      image: "/api/placeholder/320/180"
    }
  ];

  return (
    <section id="projects" className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-gray-600">
            Infrastructure and development projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Project Image */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Project Preview</span>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a 
                    href={project.github}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Code
                  </a>
                  {project.demo !== "#" && (
                    <a 
                      href={project.demo}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;