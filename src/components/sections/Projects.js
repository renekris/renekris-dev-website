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
    <section id="projects" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Infrastructure and development projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Project Image */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Project Preview</span>
              </div>
              
              {/* Project Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <a 
                    href={project.github}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Code
                  </a>
                  {project.demo !== "#" && (
                    <a 
                      href={project.demo}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
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