// Resume data structure for PDF generation
export const resumeData = {
  personalInfo: {
    name: "René Kristensen",
    title: "Full-Stack Developer & Infrastructure Engineer",
    email: "contact@renekris.dev",
    website: "https://renekris.dev",
    github: "https://github.com/renekris",
    location: "Denmark"
  },

  summary: "Full-stack developer with expertise in modern web technologies and infrastructure automation. Passionate about clean code, test-driven development, and building scalable solutions without AI assistance. Experienced in Python, C#, JavaScript, and DevOps practices.",

  technicalSkills: {
    "Programming Languages": ["Python", "C#", "JavaScript", "TypeScript", "HTML5", "CSS3"],
    "Frontend Technologies": ["React", "Angular", "Tailwind CSS", "Responsive Design", "Progressive Web Apps"],
    "Backend Technologies": ["ASP.NET Core", "Node.js", "RESTful APIs", "WebSockets"],
    "Database Technologies": ["SQL Server", "SQLite", "Database Design"],
    "DevOps & Infrastructure": ["Docker", "Docker Swarm", "CI/CD", "GitHub Actions", "Linux Administration"],
    "Development Practices": ["Test-Driven Development", "Clean Architecture", "Code Reviews", "Version Control (Git)"],
    "Tools & Platforms": ["Visual Studio", "VS Code", "Proxmox", "Cloudflare", "Nginx", "Traefik"]
  },

  featuredProjects: [
    {
      title: "Claude-Joplin Bridge",
      technologies: ["Python", "TDD", "API Integration"],
      description: "4000+ line Python application with comprehensive test coverage. Implements bidirectional synchronization between Claude AI and Joplin note-taking application.",
      highlights: [
        "Test-driven development with 95%+ coverage",
        "Clean architecture with separation of concerns",
        "Robust error handling and logging",
        "RESTful API integration"
      ]
    },
    {
      title: "Full-Stack Web Application",
      technologies: ["C# ASP.NET Core", "Angular", "SQL Server"],
      description: "Enterprise-level web application with modern architecture and responsive design.",
      highlights: [
        "Clean layered architecture",
        "Entity Framework Core integration",
        "JWT authentication implementation",
        "Responsive Angular frontend"
      ]
    },
    {
      title: "Desktop Applications Suite",
      technologies: ["C# Windows Forms", "SQLite", "Object-Oriented Design"],
      description: "Multiple desktop applications demonstrating Windows Forms expertise and database integration.",
      highlights: [
        "Modern Windows Forms UI design",
        "Local database integration",
        "Event-driven architecture",
        "User-friendly interface design"
      ]
    },
    {
      title: "JavaScript Projects Portfolio",
      technologies: ["Vanilla JavaScript", "DOM Manipulation", "Local Storage"],
      description: "Collection of interactive web applications including Battleship game, weather app, and todo system.",
      highlights: [
        "Pure JavaScript implementations",
        "Interactive game development",
        "Weather API integration",
        "Local storage management"
      ]
    },
    {
      title: "Infrastructure & DevOps Platform",
      technologies: ["Docker Swarm", "CI/CD", "Linux", "Monitoring"],
      description: "Personal infrastructure platform with automated deployment and monitoring systems.",
      highlights: [
        "Container orchestration with Docker Swarm",
        "Automated CI/CD pipelines",
        "Real-time monitoring and alerting",
        "High availability configuration"
      ]
    }
  ],

  developmentApproach: {
    title: "Development Philosophy",
    principles: [
      "Test-Driven Development for reliable, maintainable code",
      "Clean architecture with clear separation of concerns",
      "Human-written code without AI assistance",
      "Continuous learning and skill improvement",
      "Performance optimization and best practices",
      "Security-first development approach"
    ]
  },

  additionalInfo: {
    languages: ["Danish (Native)", "English (Fluent)"],
    interests: ["Open Source Contribution", "System Architecture", "Performance Optimization", "Gaming Technology"]
  }
};

// Project categories for portfolio organization
export const projectCategories = {
  backend: ["Claude-Joplin Bridge", "Full-Stack Web Application"],
  frontend: ["JavaScript Projects Portfolio", "Full-Stack Web Application"],
  desktop: ["Desktop Applications Suite"],
  infrastructure: ["Infrastructure & DevOps Platform"]
};

// Skills organized by proficiency level
export const skillLevels = {
  expert: ["Python", "C#", "JavaScript", "React", "TDD"],
  advanced: ["ASP.NET Core", "Angular", "Docker", "SQL Server", "Git"],
  intermediate: ["TypeScript", "Node.js", "Linux", "CI/CD", "Tailwind CSS"]
};