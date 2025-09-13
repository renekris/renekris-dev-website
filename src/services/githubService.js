// GitHub API Service for fetching repository data
const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_USERNAME = 'renekris';

class GitHubService {
  constructor(username = DEFAULT_USERNAME) {
    this.username = username;
  }

  /**
   * Fetch user repositories with optional parameters
   * @param {Object} options - Query options
   * @param {string} options.sort - Sort by: created, updated, pushed, full_name
   * @param {string} options.direction - Sort direction: asc, desc
   * @param {number} options.per_page - Results per page (max 100)
   * @param {number} options.page - Page number
   * @param {string} options.type - Repository type: all, owner, member
   * @returns {Promise<Array>} Array of repository objects
   */
  async getRepositories(options = {}) {
    const defaultOptions = {
      sort: 'updated',
      direction: 'desc',
      per_page: 20,
      type: 'owner'
    };

    const queryParams = { ...defaultOptions, ...options };
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${GITHUB_API_BASE}/users/${this.username}/repos?${queryString}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repositories = await response.json();

      // Filter out forks by default and enhance data
      return repositories
        .filter(repo => !repo.fork)
        .map(repo => this.enhanceRepositoryData(repo));
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      throw error;
    }
  }

  /**
   * Get featured repositories (highest starred, most recently updated)
   * @param {number} limit - Number of repositories to return
   * @returns {Promise<Array>} Array of featured repository objects
   */
  async getFeaturedRepositories(limit = 6) {
    try {
      const repositories = await this.getRepositories({ per_page: 30 });
      
      // Sort by stars first, then by recent activity
      return repositories
        .sort((a, b) => {
          // Primary sort: stars
          if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count;
          }
          // Secondary sort: recent updates
          return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch featured repositories:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   * @returns {Promise<Object>} User profile object
   */
  async getUserProfile() {
    const url = `${GITHUB_API_BASE}/users/${this.username}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub user profile:', error);
      throw error;
    }
  }

  /**
   * Search repositories by query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of matching repositories
   */
  async searchRepositories(query, options = {}) {
    const defaultOptions = {
      sort: 'stars',
      order: 'desc',
      per_page: 20
    };

    const searchOptions = { ...defaultOptions, ...options };
    const searchQuery = `user:${this.username} ${query}`;
    const queryParams = new URLSearchParams({
      q: searchQuery,
      ...searchOptions
    }).toString();

    const url = `${GITHUB_API_BASE}/search/repositories?${queryParams}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.items.map(repo => this.enhanceRepositoryData(repo));
    } catch (error) {
      console.error('Failed to search GitHub repositories:', error);
      throw error;
    }
  }

  /**
   * Get repository languages
   * @param {string} repoName - Repository name
   * @returns {Promise<Object>} Languages object with byte counts
   */
  async getRepositoryLanguages(repoName) {
    const url = `${GITHUB_API_BASE}/repos/${this.username}/${repoName}/languages`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch languages for ${repoName}:`, error);
      throw error;
    }
  }

  /**
   * Enhance repository data with additional computed properties
   * @private
   * @param {Object} repo - Raw repository object from GitHub API
   * @returns {Object} Enhanced repository object
   */
  enhanceRepositoryData(repo) {
    return {
      ...repo,
      // Computed properties
      isPopular: repo.stargazers_count > 10,
      isActive: this.isRecentlyActive(repo.updated_at),
      displayLanguage: repo.language || 'Unknown',
      
      // Formatted dates
      createdDate: this.formatDate(repo.created_at),
      updatedDate: this.formatDate(repo.updated_at),
      
      // Social proof metrics
      totalEngagement: repo.stargazers_count + repo.forks_count + repo.watchers_count,
      
      // Safe topic handling
      topics: repo.topics || [],
      
      // Description fallback
      displayDescription: repo.description || 'No description provided'
    };
  }

  /**
   * Check if repository was updated recently (within 3 months)
   * @private
   * @param {string} updatedAt - ISO date string
   * @returns {boolean} True if recently active
   */
  isRecentlyActive(updatedAt) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(updatedAt) > threeMonthsAgo;
  }

  /**
   * Format date for display
   * @private
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get language color mapping for visual representation
   * @param {string} language - Programming language name
   * @returns {string} Hex color code
   */
  static getLanguageColor(language) {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      Java: '#ed8b00',
      React: '#61dafb',
      HTML: '#e34f26',
      CSS: '#1572b6',
      SCSS: '#cf649a',
      PHP: '#777bb4',
      Go: '#00add8',
      Rust: '#dea584',
      C: '#a8b9cc',
      'C++': '#f34b7d',
      'C#': '#239120',
      Ruby: '#cc342d',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      Dart: '#0175c2',
      Shell: '#89e051',
      Vue: '#4fc08d',
      Svelte: '#ff3e00',
      Angular: '#dd0031'
    };
    return colors[language] || '#ffffff';
  }

  /**
   * Create fallback demo data when API is unavailable
   * @returns {Array} Array of demo repository objects
   */
  static createFallbackData() {
    return [
      {
        id: 1,
        name: "renekris-dev-website",
        description: "Personal portfolio website with real-time server monitoring and cyberpunk design",
        language: "JavaScript",
        stargazers_count: 12,
        forks_count: 3,
        watchers_count: 8,
        html_url: "https://github.com/renekris/renekris-dev-website",
        updated_at: new Date().toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        topics: ["react", "portfolio", "cyberpunk", "real-time"],
        fork: false,
        isPopular: true,
        isActive: true,
        displayLanguage: "JavaScript",
        totalEngagement: 23,
        displayDescription: "Personal portfolio website with real-time server monitoring and cyberpunk design"
      },
      {
        id: 2,
        name: "minecraft-server-manager",
        description: "Advanced Minecraft server management system with Docker and monitoring",
        language: "Python",
        stargazers_count: 25,
        forks_count: 7,
        watchers_count: 15,
        html_url: "https://github.com/renekris/minecraft-server-manager",
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        created_at: "2023-06-15T00:00:00Z",
        topics: ["minecraft", "docker", "python", "monitoring"],
        fork: false,
        isPopular: true,
        isActive: true,
        displayLanguage: "Python",
        totalEngagement: 47,
        displayDescription: "Advanced Minecraft server management system with Docker and monitoring"
      },
      {
        id: 3,
        name: "cyberpunk-ui-components",
        description: "Reusable cyberpunk-themed React components with neon effects",
        language: "TypeScript",
        stargazers_count: 18,
        forks_count: 5,
        watchers_count: 12,
        html_url: "https://github.com/renekris/cyberpunk-ui-components",
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        created_at: "2023-09-20T00:00:00Z",
        topics: ["react", "typescript", "ui", "cyberpunk"],
        fork: false,
        isPopular: true,
        isActive: true,
        displayLanguage: "TypeScript",
        totalEngagement: 35,
        displayDescription: "Reusable cyberpunk-themed React components with neon effects"
      }
    ].map(repo => ({
      ...repo,
      createdDate: new Date(repo.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      updatedDate: new Date(repo.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));
  }
}

// Export singleton instance and class
export const githubService = new GitHubService();
export default GitHubService;