export type ProjectCategory = 
  | 'all'
  | 'ui-ux'
  | 'web-design'
  | 'product'
  | 'frontend'
  | 'landing-pages'
  | 'experiments';

export interface ProjectMedia {
  type: 'image' | 'video' | 'interactive';
  url: string;
  caption?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | '9/16';
  alt: string;
}

export interface CaseStudySectionData {
  title: string;
  subtitle?: string;
  tag?: string;
  description: string[];
  bulletPoints?: string[];
  visual?: {
    type: 'browser' | 'mobile' | 'code' | 'tokens' | 'split' | 'grid' | 'wireframe';
    image?: string;
    secondaryImage?: string;
    caption?: string;
    codeSnippet?: {
      language: string;
      code: string;
      filename?: string;
    };
    tokens?: Array<{
      name: string;
      value: string;
      type: 'color' | 'typography' | 'spacing' | 'radius';
    }>;
    wireframePoints?: Array<{
      step: string;
      label: string;
      detail: string;
    }>;
  };
}

export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  client: string;
  subtitle: string;
  tagline: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: number;
  featured: boolean;
  heroImage: string;
  mockupImage: string;
  roles: string[];
  services: string[];
  technologies: string[];
  timeline: string;
  liveUrl?: string;
  githubUrl?: string;
  description: string;
  challenge: string;
  solution: string;
  impactStatements: string[];
  layoutType: 'large-hero' | 'split-editorial' | 'horizontal-banner' | 'asymmetric-stack';
  sections: CaseStudySectionData[];
  gallery: ProjectMedia[];
  nextProjectId?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  whatYouGet: string[];
  problemSolved: string;
  technologies: string[];
  deliverables: string[];
  category: 'design' | 'engineering' | 'strategy';
}

export interface ExperienceItem {
  id: string;
  period: string;
  year: number;
  role: string;
  companyOrContext: string;
  type: 'Full-time' | 'Contract' | 'Independent Craft' | 'Open Source';
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  isCurrent?: boolean;
}

export interface ExperimentItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: number;
  description: string;
  tags: string[];
  demoType: 'spring-toggle' | 'variable-font' | 'matrix-grid' | 'color-mixer' | 'code-preview' | 'cursor-trail';
  codeSnippet?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  context: string;
  year: number;
  avatar?: string;
}
