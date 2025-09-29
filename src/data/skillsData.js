// Skills Database
export const skillCategories = {
  programming: {
    title: "Programming Languages",
    color: {
      primary: "rgba(59, 130, 246, 0.8)",
      secondary: "rgba(59, 130, 246, 0.2)",
      glow: "rgba(59, 130, 246, 0.4)",
      border: "rgba(59, 130, 246, 0.6)"
    },
    description: "Programming languages and development"
  },
  infrastructure: {
    title: "Infrastructure & DevOps",
    color: {
      primary: "rgba(34, 197, 94, 0.8)",
      secondary: "rgba(34, 197, 94, 0.2)",
      glow: "rgba(34, 197, 94, 0.4)",
      border: "rgba(34, 197, 94, 0.6)"
    },
    description: "Server management and deployment"
  },
  aiTools: {
    title: "AI/ML & Creative Tools",
    color: {
      primary: "rgba(245, 158, 11, 0.8)",
      secondary: "rgba(245, 158, 11, 0.2)",
      glow: "rgba(245, 158, 11, 0.4)",
      border: "rgba(245, 158, 11, 0.6)"
    },
    description: "AI tools and creative automation"
  },
  gaming: {
    title: "Gaming & Community",
    color: {
      primary: "rgba(147, 51, 234, 0.8)",
      secondary: "rgba(147, 51, 234, 0.2)",
      glow: "rgba(147, 51, 234, 0.4)",
      border: "rgba(147, 51, 234, 0.6)"
    },
    description: "Game development and community management"
  },
  webTech: {
    title: "Web Technologies",
    color: {
      primary: "rgba(239, 68, 68, 0.8)",
      secondary: "rgba(239, 68, 68, 0.2)",
      glow: "rgba(239, 68, 68, 0.4)",
      border: "rgba(239, 68, 68, 0.6)"
    },
    description: "Frontend, backend, and full-stack web development"
  }
};

export const skills = [
  // Programming Languages
  {
    id: "csharp",
    name: "C#",
    category: "programming",
    experienceLevel: "Advanced",
    yearsExperience: "4+",
    size: "large",
    keyAchievement: "Built desktop applications with Windows Forms",
    story: `Built an RPG game with save/load system, character progression, and inventory management. Also developed a YouTube downloader with Python integration.`,
    relatedSkills: ["windows-forms", "unity", "dotnet"],
    projects: ["desktop-apps"],
    tags: ["OOP", "Windows Forms", "Game Development", ".NET Framework"]
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "programming",
    experienceLevel: "Advanced",
    yearsExperience: "3+",
    size: "large",
    keyAchievement: "Built interactive web applications",
    story: `Developed a calculator with DOM manipulation, a Battleship game with drag-and-drop and AI logic, and a weather app integrating multiple APIs.`,
    relatedSkills: ["react", "nodejs", "typescript"],
    projects: ["calculator", "battleship", "weather"],
    tags: ["ES6+", "DOM Manipulation", "API Integration", "Async Programming"]
  },
  {
    id: "python",
    name: "Python",
    category: "programming",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Built file synchronization tool",
    story: `Created claude-joplin-bridge, a file synchronization tool with bidirectional sync and error handling. Used TDD approach with extensive test coverage.`,
    relatedSkills: ["tdd", "cli", "file-systems"],
    projects: ["filesync"],
    tags: ["TDD", "File Systems", "CLI Development", "Automation"]
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "programming",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Added type safety to JavaScript projects",
    story: `Used TypeScript in React projects to add static typing and improve code quality. Worked with generics, union types, and type guards.`,
    relatedSkills: ["javascript", "react", "nodejs"],
    projects: ["portfolio"],
    tags: ["Static Typing", "Modern JavaScript", "Type Safety", "IDE Support"]
  },

  // Infrastructure & DevOps
  {
    id: "proxmox",
    name: "Proxmox",
    category: "infrastructure",
    experienceLevel: "Advanced",
    yearsExperience: "3+",
    size: "large",
    keyAchievement: "Built homelab infrastructure with multiple VMs",
    story: `Set up Proxmox server running multiple Ubuntu VMs for web hosting, Minecraft server, and development environments. Configured ZFS storage and automated backups.`,
    relatedSkills: ["linux", "docker", "networking"],
    projects: ["infrastructure"],
    tags: ["Virtualization", "VM Management", "Storage", "Networking"]
  },
  {
    id: "docker",
    name: "Docker",
    category: "infrastructure",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Containerized application stack with CI/CD",
    story: `Containerized portfolio website with Docker Compose and set up automated deployments using GitHub Actions and GitHub Container Registry.`,
    relatedSkills: ["proxmox", "cicd", "linux"],
    projects: ["portfolio"],
    tags: ["Containerization", "Docker Compose", "CI/CD", "Deployment"]
  },
  {
    id: "linux",
    name: "Linux",
    category: "infrastructure",
    experienceLevel: "Advanced",
    yearsExperience: "4+",
    size: "large",
    keyAchievement: "Command line administration and system management",
    story: `Use Linux for development and server management tasks. Manage file permissions, configure services, automate tasks with shell scripts, and handle package management.`,
    relatedSkills: ["proxmox", "docker", "bash"],
    projects: ["infrastructure"],
    tags: ["System Administration", "Command Line", "Server Management", "Shell Scripting"]
  },
  {
    id: "networking",
    name: "Networking",
    category: "infrastructure",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Configured home network with VLANs and services",
    story: `Configured home network with subnets, VLANs, DNS, and reverse proxy setups using Traefik. Set up internal DNS resolution and SSL certificates for local services.`,
    relatedSkills: ["proxmox", "security", "ssl"],
    projects: ["infrastructure"],
    tags: ["Network Configuration", "DNS", "SSL/TLS", "Security"]
  },

  // AI/ML & Creative Tools
  {
    id: "comfyui",
    name: "ComfyUI",
    category: "aiTools",
    experienceLevel: "Advanced",
    yearsExperience: "1+",
    size: "large",
    keyAchievement: "Created automated image generation workflows",
    story: `Built custom workflows for AI image generation using node-based programming. Implemented ControlNet and IPAdapter integrations for batch processing and consistent artistic styles.`,
    relatedSkills: ["automatic1111", "ai-image", "workflows"],
    projects: [],
    tags: ["AI Image Generation", "Workflow Automation", "Creative AI", "Node-based Programming"]
  },
  {
    id: "automatic1111",
    name: "Automatic1111",
    category: "aiTools",
    experienceLevel: "Intermediate",
    yearsExperience: "1+",
    size: "medium",
    keyAchievement: "Used Stable Diffusion for AI image generation",
    story: `Used Automatic1111 for AI image generation with Stable Diffusion. Experimented with different checkpoints, LoRA models, and prompt engineering techniques.`,
    relatedSkills: ["comfyui", "ai-image", "machine-learning"],
    projects: [],
    tags: ["Stable Diffusion", "Prompt Engineering", "Model Training", "AI Art"]
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "aiTools",
    experienceLevel: "Beginner",
    yearsExperience: "1",
    size: "small",
    keyAchievement: "Built basic neural networks",
    story: `Learning PyTorch for neural network development. Worked with tensor operations, image classification, and basic deep learning concepts.`,
    relatedSkills: ["python", "machine-learning", "tensorflow"],
    projects: [],
    tags: ["Deep Learning", "Neural Networks", "Machine Learning", "Research"]
  },

  // Gaming & Community
  {
    id: "minecraft-servers",
    name: "Minecraft Server Management",
    category: "gaming",
    experienceLevel: "Expert",
    yearsExperience: "5+",
    size: "large",
    keyAchievement: "Managed community servers with custom plugins",
    story: `Managed Minecraft servers with 100+ players. Developed custom plugins for economy systems and grief prevention, handled performance optimization and community moderation.`,
    relatedSkills: ["java", "database", "community"],
    projects: [],
    tags: ["Server Administration", "Community Management", "Plugin Development", "Performance Optimization"]
  },
  {
    id: "unity",
    name: "Unity Game Development",
    category: "gaming",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Created complete game prototypes with custom mechanics",
    story: `Unity development bridged my programming skills with creative game design when I wanted to move beyond simple desktop applications. Learning the Unity editor, C# scripting for game objects, and understanding game development patterns opened up new possibilities for interactive applications.

Building game prototypes taught me about real-time systems, physics simulation, and user interface design in interactive contexts. From implementing character controllers and camera systems to creating custom shaders and particle effects, Unity provided a comprehensive introduction to graphics programming.

The experience highlighted the importance of optimization and performance in real-time applications, teaching me about frame rate considerations, memory management, and the unique challenges of interactive software compared to traditional applications.`,
    funFact: "My Unity projects include both 2D puzzle games and 3D exploration experiences!",
    relatedSkills: ["csharp", "game-design", "graphics"],
    projects: [],
    tags: ["Game Development", "Real-time Systems", "Graphics Programming", "Interactive Design"]
  },

  // Web Technologies
  {
    id: "react",
    name: "React",
    category: "webTech",
    experienceLevel: "Advanced",
    yearsExperience: "2+",
    size: "large",
    keyAchievement: "Built production portfolio with modern React patterns",
    story: `React transformed my approach to frontend development when I needed to build dynamic, interactive user interfaces. Starting with basic component concepts, I progressed to understanding hooks, state management, and modern React patterns.

My portfolio website showcases advanced React techniques: custom hooks for animation controls, context for theme management, and optimized rendering with proper state structure. Learning Framer Motion integration taught me how to create smooth, performant animations in React applications.

The journey from class components to functional components with hooks illustrated React's evolution and the importance of staying current with framework development. Each project reinforced concepts like component composition, prop drilling solutions, and performance optimization strategies.`,
    funFact: "My React portfolio uses zero class components - all modern functional patterns!",
    relatedSkills: ["javascript", "typescript", "css"],
    projects: ["portfolio"],
    tags: ["Component Architecture", "Hooks", "State Management", "Modern Patterns"]
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "webTech",
    experienceLevel: "Intermediate",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Built backend APIs and development tools",
    story: `Node.js enabled me to use JavaScript across the full stack, starting with simple development tools and progressing to building complete backend APIs. Understanding event-driven programming and asynchronous operations in server contexts expanded my programming perspective.

Building development proxy servers, API endpoints, and integration tools taught me about server architecture, middleware patterns, and handling concurrent requests. Working with npm ecosystem and managing dependencies provided insight into modern JavaScript development workflows.

The experience of debugging server-side JavaScript and understanding performance characteristics in backend contexts highlighted the differences between frontend and backend development while leveraging familiar language syntax.`,
    funFact: "I built a development proxy server that automatically handles API routing!",
    relatedSkills: ["javascript", "express", "apis"],
    projects: ["portfolio"],
    tags: ["Backend Development", "APIs", "Server-side JavaScript", "Development Tools"]
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "webTech",
    experienceLevel: "Advanced",
    yearsExperience: "2+",
    size: "medium",
    keyAchievement: "Created comprehensive design system with custom components",
    story: `Tailwind CSS revolutionized my approach to styling when I discovered utility-first CSS methodology. Moving from traditional CSS and component libraries to Tailwind's atomic approach initially felt backwards but quickly proved its power for rapid development.

Building my portfolio's design system with Tailwind taught me about consistency, maintainability, and the benefits of constraint-based design. Creating responsive layouts, dark mode support, and custom animations entirely with utility classes demonstrated the framework's flexibility.

The experience of customizing Tailwind's configuration, creating design tokens, and building reusable component patterns showed how utility-first CSS can scale from small projects to comprehensive design systems without sacrificing customization.`,
    funFact: "My entire portfolio uses Tailwind with zero custom CSS files!",
    relatedSkills: ["css", "design-systems", "react"],
    projects: ["portfolio"],
    tags: ["Utility-first CSS", "Design Systems", "Responsive Design", "Modern Styling"]
  }
];

// Helper functions for filtering and searching
export const getSkillsByCategory = (category) => {
  return skills.filter(skill => skill.category === category);
};

export const getSkillById = (id) => {
  return skills.find(skill => skill.id === id);
};

export const searchSkills = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return skills.filter(skill => 
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    skill.story.toLowerCase().includes(lowercaseQuery)
  );
};

export const getRelatedSkills = (skillId) => {
  const skill = getSkillById(skillId);
  if (!skill || !skill.relatedSkills) return [];
  
  return skill.relatedSkills.map(id => getSkillById(id)).filter(Boolean);
};