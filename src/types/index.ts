// ==================================================
// CENTRAL DATA MODELS FOR SCRiLLO PORTFOLIO & CMS
// ==================================================

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export type SectionId =
  | 'hero'
  | 'marquee'
  | 'projects'
  | 'statement'
  | 'skills'
  | 'philosophy'
  | 'services'
  | 'image'
  | 'contact'
  | 'footer';

export interface SectionSetting {
  id: SectionId;
  name: string;
  visible: boolean;
  order: number;
}

export type SectionSettings = Record<SectionId, SectionSetting>;

export interface WebsiteSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl?: string;
  defaultTheme: 'dark' | 'light' | 'system';
  enableCustomCursor: boolean;
  enableSmoothScroll: boolean;
  enableMarqueeVelocity: boolean;
  seo: SEOSettings;
  sections: SectionSettings;
}

export interface HeroContent {
  eyebrow: string;
  subEyebrow?: string;
  title: string;
  headlineLines?: string[];
  description: string;
  year: string;
  yearLabel?: string;
  scrollLabel: string;
  ctaText: string;
  ctaLink: string;
  heroImage?: string;
}

export interface AboutContent {
  number?: string;
  label: string;
  phrases?: string[];
  line1?: string;
  line2?: string;
  line3?: string;
  subtext?: string;
  corePrinciples?: string;
  supportingText?: string;
  yearMeta?: string;
  visible?: boolean;
}

export interface MarqueeContent {
  items: string[];
  speed: number;
  separator: string;
  direction?: 'left' | 'right';
  enableVelocity?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  number?: string;
  year: string;
  category: string;
  description: string;
  client: string;
  role?: string;
  services?: string[];
  thumbnail: string;
  coverImage: string;
  image?: string; // alias for coverImage
  gallery?: string[];
  link?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  id?: string;
  index: string;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  visible?: boolean;
  order?: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  number: string;
  count?: string;
  description?: string;
  items: SkillItem[];
  skills?: SkillItem[]; // alias for items for backward compatibility
  visible: boolean;
  order: number;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables?: string[];
  icon?: string;
  visible: boolean;
  order: number;
}

export interface PhilosophyContent {
  number?: string;
  label: string;
  title?: string;
  mainStatement?: string;
  line1: string;
  line2: string;
  line3: string;
  supportingText?: string;
  subMeta?: string;
  author?: string;
  attribution?: string;
  yearMeta: string;
  visible?: boolean;
}

export interface FullBleedImageContent {
  image: string;
  alt: string;
  captionLeft: string;
  captionRight: string;
}

export interface ContactCTA {
  number?: string;
  label: string;
  heading?: string;
  headlineLine1: string;
  headlineLine2: string;
  secondaryText?: string;
  secondaryLine: string;
  buttonText?: string;
  ctaText: string;
  buttonLink?: string;
  ctaLink?: string;
  email: string;
  availabilityStatus?: string;
  coordinates?: string;
  visible?: boolean;
}

export interface SocialLink {
  id?: string;
  platform: 'LinkedIn' | 'Instagram' | 'Behance' | 'Dribbble' | 'X' | 'GitHub' | 'Other' | string;
  label: string;
  url?: string;
  href: string;
  icon?: string;
  visible?: boolean;
  order?: number;
}

export interface FooterContent {
  location: string;
  workingGlobally: string;
  brandText: string;
  copyright: string;
  coordinates?: string;
  email?: string;
  responseWindow?: string;
  socialLinks: SocialLink[];
  subCopyright?: string;
  editionMeta?: string;
}

export interface WebsiteData {
  settings: WebsiteSettings;
  hero: HeroContent;
  marquee: MarqueeContent;
  about: AboutContent;
  projects: Project[];
  skills: SkillCategory[];
  philosophy: PhilosophyContent;
  services: Service[];
  image: FullBleedImageContent;
  contact: ContactCTA;
  footer: FooterContent;
}
