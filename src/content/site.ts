/**
 * Site Content Contract
 * Single source of truth for all copy, links, metadata, and asset paths.
 */

const currentYear = new Date().getFullYear()

// Type Definitions

export interface HeroContent {
  /** Full professional name */
  readonly name: string
  /** Primary job title/role */
  readonly role: string
  /** Brief value proposition statement */
  readonly tagline: string
  /** Geographic location */
  readonly location: string
  /** Key technologies for display badges */
  readonly techStack: readonly string[]
}

export interface ContactContent {
  /** Professional email address */
  readonly email: string
  /** LinkedIn profile URL */
  readonly linkedin: string
  /** GitHub profile URL */
  readonly github: string
  /** Availability status text */
  readonly availabilityText: string
}

export interface SEOContent {
  /** Meta title (50-60 chars ideal) */
  readonly title: string
  /** Meta description (150-160 chars ideal) */
  readonly description: string
  /** Comma-separated keywords for search engines */
  readonly keywords: string
  /** Canonical URL for this page */
  readonly canonical: string
  /** Open Graph image path (relative or absolute URL) */
  readonly ogImage: string | null
  /** Twitter card type */
  readonly twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player'
  /** Site author name */
  readonly author: string
  /** HTML lang attribute value */
  readonly language: string
}

export interface ResumeContent {
  /** Display text for the resume button */
  readonly buttonText: string
  /** Filename of the resume PDF */
  readonly filename: string
  /** Path to the resume file (relative to public/) */
  readonly path: string
}

export interface FooterContent {
  /** URL to the source code repository */
  readonly sourceUrl: string
  /** Copyright notice text */
  readonly copyright: string
  /** Technology stack description */
  readonly builtWithText: string
}

export interface SocialLink {
  /** Display name for the link */
  readonly label: string
  /** URL to the profile */
  readonly url: string
  /** Icon identifier (for component mapping) */
  readonly icon: 'linkedin' | 'github' | 'mail'
}

export interface SocialLinksContent {
  /** LinkedIn profile link */
  readonly linkedin: SocialLink
  /** GitHub profile link */
  readonly github: SocialLink
}

export interface StructuredDataContent {
  /** Job titles for schema.org Person */
  readonly jobTitles: readonly string[]
  /** Current employer organization */
  readonly employer: {
    readonly name: string
  }
  /** Educational institutions and courses */
  readonly education: readonly string[]
  /** Languages spoken */
  readonly languages: readonly { readonly name: string; readonly code: string }[]
  /** Technical and professional skills */
  readonly skills: readonly string[]
}

export interface SiteContent {
  /** Hero section content */
  readonly hero: HeroContent
  /** Contact section content */
  readonly contact: ContactContent
  /** SEO metadata */
  readonly seo: SEOContent
  /** Resume download configuration */
  readonly resume: ResumeContent
  /** Footer content */
  readonly footer: FooterContent
  /** Social media links */
  readonly socialLinks: SocialLinksContent
  /** Schema.org structured data */
  readonly structuredData: StructuredDataContent
}

// Site Content
export const site: SiteContent = {
  hero: {
    name: 'Rene Kristofer Pohlak',
    role: 'AI-focused Full-stack Developer',
    tagline:
      'Building production AI features across TypeScript and Python, from RAG pipelines and vector-database retrieval to backend systems, automation, and observability.',
    location: 'Tallinn, Estonia',
    techStack: ['TypeScript', 'Python', 'RAG', 'Vector DBs', 'n8n'],
  },

  contact: {
    email: 'renekrispohlak@gmail.com',
    linkedin: 'https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/',
    github: 'https://github.com/renekris',
    availabilityText: 'Open to AI-focused remote & hybrid opportunities',
  },

  seo: {
    title: 'Rene Kristofer Pohlak - AI-focused Full-stack Developer',
    description:
      'AI-focused full-stack developer building production systems with TypeScript and Python, including RAG workflows, vector databases, automation, APIs, and observability.',
    keywords:
      'Rene Kristofer Pohlak, AI full-stack developer, TypeScript developer, Python developer, RAG, vector databases, LLM pipelines, workflow automation, API development, n8n, PostgreSQL, observability, Tallinn, Estonia, Amperly',
    canonical: 'https://renekris.dev',
    ogImage: null,
    twitterCard: 'summary',
    author: 'Rene Kristofer Pohlak',
    language: 'en',
  },

  resume: {
    buttonText: 'View Resume',
    filename: 'rene-kristofer-pohlak-cv.pdf',
    path: '/resume/rene-kristofer-pohlak-cv.pdf',
  },

  footer: {
    sourceUrl: 'https://github.com/renekris/renekris-dev-website',
    copyright: `© ${currentYear} renekris.dev`,
    builtWithText: 'Built with Astro, React & Tailwind CSS',
  },

  socialLinks: {
    linkedin: {
      label: 'LinkedIn Profile',
      url: 'https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/',
      icon: 'linkedin',
    },
    github: {
      label: 'GitHub Portfolio',
      url: 'https://github.com/renekris',
      icon: 'github',
    },
  },

  structuredData: {
    jobTitles: ['AI-focused Full-Stack Developer', 'Full-Stack Developer', 'Python Developer'],
    employer: {
      name: 'Amperly',
    },
    education: ['Tallinna Tööstushariduskeskus', 'The Odin Project'],
    languages: [
      { name: 'Estonian', code: 'et' },
      { name: 'English', code: 'en' },
      { name: 'Japanese', code: 'ja' },
    ],
    skills: [
      'TypeScript',
      'Python',
      'RAG',
      'Vector Databases',
      'LLM Pipelines',
      'Workflow Automation',
      'API Development',
      'Backend Systems',
      'n8n',
      'Langfuse',
      'PostgreSQL',
      'Docker',
      'Proxmox',
      'CI/CD',
      'Observability',
      'SQL',
      'Jira',
    ],
  },
} as const

export type Site = typeof site
export type Hero = Site['hero']
export type Contact = Site['contact']
export type SEO = Site['seo']
export type Resume = Site['resume']
export type Footer = Site['footer']
export type SocialLinks = Site['socialLinks']
export type StructuredData = Site['structuredData']

export default site
