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
    <section id="skills" className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-lg text-gray-800 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Languages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="text-gray-800">
                <span className="text-2xl font-bold text-blue-600 block mb-2">EST</span>
                <p className="text-base font-medium">Estonian (Native)</p>
              </div>
              <div className="text-gray-800">
                <span className="text-2xl font-bold text-blue-600 block mb-2">ENG</span>
                <p className="text-base font-medium">English (Proficient)</p>
              </div>
              <div className="text-gray-800">
                <span className="text-2xl font-bold text-blue-600 block mb-2">JPN</span>
                <p className="text-base font-medium">Japanese (Upper-Intermediate)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;