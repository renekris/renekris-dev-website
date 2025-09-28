import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["React", "TypeScript", "Tailwind CSS", "Responsive Design", "Modern CSS"]
    },
    {
      title: "Backend & Infrastructure", 
      skills: ["Node.js", "Python", "Docker", "Linux", "Networking", "Proxmox"]
    },
    {
      title: "Development Practices",
      skills: ["Git", "CI/CD", "Testing", "Problem-solving", "Documentation"]
    },
    {
      title: "Currently Learning",
      skills: ["PyTorch", "TensorFlow", "Machine Learning", "AI Development"]
    }
  ];

  return (
    <section id="skills" className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-gray-600">
            Technologies and tools I work with
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {category.title}
              </h3>
              
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Languages
            </h3>
            <div className="flex justify-center space-x-8 text-gray-600">
              <span>🇪🇪 Estonian (Native)</span>
              <span>🇬🇧 English (Proficient)</span>
              <span>🇯🇵 Japanese (Upper-Intermediate)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;