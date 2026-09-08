// ==================================================
// CENTRAL DATA MODELS FOR SCRiLLO PORTFOLIO & CMS
// ==================================================

export interface ThemeColorPalette {
  background: string;
  text: string;
  muted: string;
  border: string;
  surface?: string;
}

export interface ThemeColorSettings {
  dark: ThemeColorPalette;
  light: ThemeColorPalette;
}

export interface AnimationSettings {
  animationsEnabled: boolean;
  smoothScrollEnabled: boolean;
  cursorEnabled: boolean;
  marqueeEnabled: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  favicon?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export type SectionId =
  | 'hero'
  | 'marquee'
  | 'projects'
  | 'statement'
  | 'experience'
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
  darkModeEnabled: boolean;
  lightModeEnabled: boolean;
  colors: ThemeColorSettings;
  animations: AnimationSettings;
  // Aliases for compatibility
  enableCustomCursor?: boolean;
  enableSmoothScroll?: boolean;
  enableMarqueeVelocity?: boolean;
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
  placeholder?: boolean;
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
  placeholder?: boolean;
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
  placeholder?: boolean;
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
  placeholder?: boolean;
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
  placeholder?: boolean;
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

export interface ProfileContent {
  name: string;
  title: string;
  primaryDescription: string;
  objective: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  coverImage?: string;
  linkedinUrl?: string;
  dribbbleUrl?: string;
  behanceUrl?: string;
  instagramUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  period: string;
  description: string;
  order: number;
  visible: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  educationType?: string;
  degree?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  period: string;
  description: string;
  order: number;
  visible: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'Design' | 'Design Tools' | 'Technical' | string;
  order: number;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  visible: boolean;
}

export interface WebsiteData {
  settings: WebsiteSettings;
  profile?: ProfileContent;
  hero: HeroContent;
  marquee: MarqueeContent;
  about: AboutContent;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  categories?: PortfolioCategory[];
  projects: Project[];
  skills: SkillCategory[];
  tools?: ToolItem[];
  philosophy: PhilosophyContent;
  services: Service[];
  image: FullBleedImageContent;
  contact: ContactCTA;
  footer: FooterContent;
}

export interface ContentDiffItem {
  id: string;
  category: 'Projects' | 'Content' | 'Skills' | 'Services' | 'Sections' | 'Settings' | 'Media' | 'Experience' | 'Categories';
  title: string;
  description: string;
  type: 'added' | 'modified' | 'deleted' | 'reordered';
}

export interface ContentDiffSummary {
  hasChanges: boolean;
  totalChanges: number;
  items: ContentDiffItem[];
  lastPublishedAt?: string;
  draftUpdatedAt?: string;
}

