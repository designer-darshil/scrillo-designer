export interface HeroContent {
  label: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  supportingText: string;
  ctaText: string;
  yearMeta: string;
}

export interface StatementContent {
  label: string;
  phrase1: string;
  phrase2: string;
  phrase3: string;
  subtext: string;
}

export interface PhilosophyContent {
  label: string;
  line1: string;
  line2: string;
  line3: string;
  yearMeta: string;
}

export interface ContactCTAContent {
  label: string;
  headlineLine1: string;
  headlineLine2: string;
  secondaryLine: string;
  ctaText: string;
  email: string;
  location: string;
}

export interface FooterContent {
  locationTitle: string;
  locationStatus: string;
  coordinates: string;
  contactEmail: string;
  responseWindow: string;
  brandName: string;
  copyrightText: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  link?: string;
  featured?: boolean;
  order?: number;
}

export interface SkillItem {
  index: string;
  name: string;
  image?: string;
}

export interface SkillCategory {
  id: string;
  number: string;
  title: string;
  count: string;
  skills: SkillItem[];
}

export interface ServiceScope {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  defaultTheme: 'dark' | 'light' | 'system';
  enableCustomCursor: boolean;
  enableSmoothScroll: boolean;
  enableMarqueeVelocity: boolean;
  sectionVisibility: {
    hero: boolean;
    marquee: boolean;
    works: boolean;
    statement: boolean;
    skills: boolean;
    philosophy: boolean;
    services: boolean;
    experimentalImage: boolean;
    contactCTA: boolean;
    footer: boolean;
  };
}
