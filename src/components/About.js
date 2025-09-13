import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCode, 
  FaServer, 
  FaDatabase,
  FaCloud,
  FaGamepad,
  FaBriefcase,
  FaHeart,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaDiscord,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCoffee,
  FaRocket
} from 'react-icons/fa';
import { 
  SiReact, 
  SiNodedotjs, 
  SiPython, 
  SiDocker, 
  SiKubernetes,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiAmazonwebservices,
  SiLinux,
  SiNginx,
  SiGit
} from 'react-icons/si';

const About = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [skillAnimations, setSkillAnimations] = useState({});

  // Animate skills on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setSkillAnimations({ animate: true });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Skills data with proficiency levels
  const skillCategories = [
    {
      category: "Frontend Development",
      icon: SiReact,
      color: "neon-cyan",
      skills: [
        { name: "React.js", level: 90, icon: SiReact },
        { name: "TypeScript", level: 85, icon: SiTypescript },
        { name: "JavaScript", level: 95, icon: SiJavascript },
        { name: "Next.js", level: 80, icon: SiReact },
        { name: "CSS/Tailwind", level: 88, icon: FaCode }
      ]
    },
    {
      category: "Backend Development",
      icon: SiNodedotjs,
      color: "neon-green",
      skills: [
        { name: "Node.js", level: 87, icon: SiNodedotjs },
        { name: "Python", level: 82, icon: SiPython },
        { name: "Express.js", level: 85, icon: SiNodedotjs },
        { name: "REST APIs", level: 90, icon: FaServer },
        { name: "GraphQL", level: 75, icon: FaCode }
      ]
    },
    {
      category: "Database & Storage",
      icon: FaDatabase,
      color: "neon-purple",
      skills: [
        { name: "MongoDB", level: 85, icon: SiMongodb },
        { name: "PostgreSQL", level: 80, icon: SiPostgresql },
        { name: "Redis", level: 75, icon: SiRedis },
        { name: "Database Design", level: 82, icon: FaDatabase }
      ]
    },
    {
      category: "DevOps & Cloud",
      icon: FaCloud,
      color: "neon-blue",
      skills: [
        { name: "Docker", level: 88, icon: SiDocker },
        { name: "Kubernetes", level: 70, icon: SiKubernetes },
        { name: "AWS", level: 75, icon: SiAmazonwebservices },
        { name: "Linux", level: 85, icon: SiLinux },
        { name: "Nginx", level: 80, icon: SiNginx },
        { name: "Git", level: 92, icon: SiGit }
      ]
    }
  ];

  // Personal information
  const personalInfo = {
    name: "Renekris",
    title: "Full-Stack Developer & Infrastructure Engineer",
    location: "Estonia",
    experience: "5+ years",
    email: "contact@renekris.dev",
    bio: "Passionate developer focused on creating scalable web applications and robust infrastructure solutions. I love combining modern technologies with creative design to build memorable user experiences.",
    interests: [
      { name: "Gaming Server Administration", icon: FaGamepad },
      { name: "Open Source Projects", icon: FaRocket },
      { name: "Cloud Architecture", icon: FaCloud },
      { name: "Cyberpunk Aesthetics", icon: FaCode }
    ]
  };

  // Experience timeline
  const timeline = [
    {
      period: "2024 - Present",
      title: "Senior Full-Stack Developer",
      company: "Self-Employed",
      description: "Building modern web applications and infrastructure solutions for various clients.",
      type: "work"
    },
    {
      period: "2022 - 2024",
      title: "DevOps Engineer",
      company: "Tech Startup",
      description: "Managed containerized applications and CI/CD pipelines in cloud environments.",
      type: "work"
    },
    {
      period: "2020 - 2022",
      title: "Frontend Developer",
      company: "Digital Agency",
      description: "Developed responsive web applications using React and modern JavaScript frameworks.",
      type: "work"
    },
    {
      period: "2019 - 2020",
      title: "Computer Science Studies",
      company: "University",
      description: "Focused on software engineering, algorithms, and system design principles.",
      type: "education"
    }
  ];

  // Social links
  const socialLinks = [
    { name: "GitHub", icon: FaGithub, url: "https://github.com/renekris", color: "text-gray-300" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com/in/renekris", color: "text-blue-400" },
    { name: "Discord", icon: FaDiscord, url: "https://discord.gg/renekris", color: "text-indigo-400" },
    { name: "Email", icon: FaEnvelope, url: "mailto:contact@renekris.dev", color: "text-neon-cyan" }
  ];

  // Section navigation
  const sections = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'contact', label: 'Contact', icon: FaEnvelope }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="cyber-panel"
      >
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold mb-4 neon-glow-purple glitch-text" 
            data-text="About Me"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About Me
          </motion.h1>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-neon-blue" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-neon-green" />
              <span>{personalInfo.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCoffee className="text-neon-yellow" />
              <span>Powered by caffeine</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="cyber-panel"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id 
                  ? 'bg-neon-blue bg-opacity-20 text-neon-blue border border-neon-blue' 
                  : 'bg-black bg-opacity-30 text-gray-400 hover:text-white border border-transparent hover:border-gray-600'
              }`}
            >
              <section.icon className="text-sm" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="cyber-panel">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar and basic info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple 
                                  flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    R
                  </div>
                  <h3 className="text-xl font-bold text-neon-cyan">{personalInfo.name}</h3>
                  <p className="text-gray-400 mb-4">{personalInfo.title}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {socialLinks.map(link => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg bg-black bg-opacity-30 ${link.color} 
                                   hover:bg-opacity-50 transition-all hover:scale-110`}
                        title={link.name}
                      >
                        <link.icon className="text-lg" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio and interests */}
              <div className="lg:col-span-2">
                <h4 className="text-lg font-bold text-neon-green mb-4">Bio</h4>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {personalInfo.bio}
                </p>

                <h4 className="text-lg font-bold text-neon-purple mb-4">Interests</h4>
                <div className="grid grid-cols-2 gap-3">
                  {personalInfo.interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-black bg-opacity-30">
                      <interest.icon className="text-neon-cyan" />
                      <span className="text-gray-300">{interest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Skills Section */}
      {activeSection === 'skills' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div 
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="cyber-panel"
            >
              <div className="flex items-center gap-3 mb-6">
                <category.icon className={`text-2xl text-${category.color}`} />
                <h3 className={`text-xl font-bold text-${category.color}`}>{category.category}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div 
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className={`text-${category.color}`} />
                        <span className="text-gray-300">{skill.name}</span>
                      </div>
                      <span className={`text-sm text-${category.color}`}>{skill.level}%</span>
                    </div>
                    
                    <div className="cyber-progress-bar">
                      <motion.div 
                        className="cyber-progress-fill"
                        initial={{ width: 0 }}
                        animate={skillAnimations.animate ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Experience Section */}
      {activeSection === 'experience' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="cyber-panel"
        >
          <h3 className="text-xl font-bold text-neon-orange mb-6 flex items-center gap-2">
            <FaCalendarAlt />
            Experience Timeline
          </h3>

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4"
              >
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    item.type === 'work' 
                      ? 'bg-neon-green border-neon-green' 
                      : 'bg-neon-blue border-neon-blue'
                  }`}></div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-600 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-neon-cyan font-bold">{item.period}</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.type === 'work' 
                        ? 'bg-neon-green bg-opacity-20 text-neon-green' 
                        : 'bg-neon-blue bg-opacity-20 text-neon-blue'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-neon-purple mb-2">{item.company}</p>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="cyber-panel text-center">
            <h3 className="text-2xl font-bold text-neon-pink mb-4 flex items-center justify-center gap-2">
              <FaHeart className="text-red-500" />
              Let's Connect
            </h3>
            <p className="text-gray-300 mb-6">
              I'm always excited to discuss new projects, collaborations, or just chat about technology!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Direct contact */}
              <div className="cyber-card">
                <h4 className="text-lg font-bold text-neon-cyan mb-4">Direct Contact</h4>
                <div className="space-y-3">
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-black bg-opacity-30 
                               hover:bg-opacity-50 transition-all text-neon-cyan hover:text-neon-pink"
                  >
                    <FaEnvelope />
                    <span>{personalInfo.email}</span>
                  </a>
                </div>
              </div>

              {/* Social platforms */}
              <div className="cyber-card">
                <h4 className="text-lg font-bold text-neon-green mb-4">Social Platforms</h4>
                <div className="space-y-3">
                  {socialLinks.slice(0, 3).map(link => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg bg-black bg-opacity-30 
                                 hover:bg-opacity-50 transition-all ${link.color} hover:scale-105`}
                    >
                      <link.icon />
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-8">
              <a
                href={`mailto:${personalInfo.email}`}
                className="neon-button inline-flex items-center gap-2"
              >
                <FaRocket />
                Start a Project Together
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default About;