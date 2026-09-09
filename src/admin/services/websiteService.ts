import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  HeroContent,
  AboutContent,
  MarqueeContent,
  PhilosophyContent,
  ContactCTA,
  FooterContent,
  ProfileContent,
  HeaderSettings,
  ExperienceItem,
  EducationItem,
  ToolItem,
  PortfolioCategory,
  WebsiteData,
} from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

// In-memory cache to ensure state persistence across sessions/transitions
const memoryStore: {
  profile: ProfileContent;
  header: HeaderSettings;
  hero: HeroContent;
  about: AboutContent;
  marquee: MarqueeContent;
  philosophy: PhilosophyContent;
  contact: ContactCTA;
  footer: FooterContent;
  experience: ExperienceItem[];
  education: EducationItem[];
  tools: ToolItem[];
  categories: PortfolioCategory[];
} = {
  profile: { ...defaultWebsiteData.profile! },
  header: { ...defaultWebsiteData.header! },
  hero: { ...defaultWebsiteData.hero },
  about: { ...defaultWebsiteData.about },
  marquee: { ...defaultWebsiteData.marquee },
  philosophy: { ...defaultWebsiteData.philosophy },
  contact: { ...defaultWebsiteData.contact },
  footer: { ...defaultWebsiteData.footer },
  experience: [...(defaultWebsiteData.experience || [])],
  education: [...(defaultWebsiteData.education || [])],
  tools: [...(defaultWebsiteData.tools || [])],
  categories: [...(defaultWebsiteData.categories || [])],
};

export const defaultHeroContent: HeroContent = defaultWebsiteData.hero;
export const defaultStatementContent: AboutContent = defaultWebsiteData.about;
export const defaultPhilosophyContent: PhilosophyContent = defaultWebsiteData.philosophy;
export const defaultContactCTAContent: ContactCTA = defaultWebsiteData.contact;
export const defaultFooterContent: FooterContent = defaultWebsiteData.footer;
export const defaultMarqueeContent: MarqueeContent = defaultWebsiteData.marquee;
export const defaultProfileContent: ProfileContent = defaultWebsiteData.profile!;
export const defaultHeaderSettings: HeaderSettings = defaultWebsiteData.header!;

export const websiteService = {
  /**
   * Fetch complete website data from Supabase (public.website_content)
   */
  async getWebsiteData(): Promise<Partial<WebsiteData>> {
    if (!isSupabaseConfigured) {
      console.info('[CMS] Supabase not configured. Using local memory store.');
      return {
        profile: memoryStore.profile,
        header: memoryStore.header,
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
        experience: memoryStore.experience,
        education: memoryStore.education,
        tools: memoryStore.tools,
        categories: memoryStore.categories,
      };
    }

    try {
      console.info('[CMS] Loading website content from Supabase (public.website_content)...');
      const { data, error } = await supabase.from('website_content').select('*');
      if (error) {
        console.warn(`[CMS] website_content query note: ${error.message} (${error.code})`);
        return {
          profile: memoryStore.profile,
          header: memoryStore.header,
          hero: memoryStore.hero,
          about: memoryStore.about,
          marquee: memoryStore.marquee,
          philosophy: memoryStore.philosophy,
          contact: memoryStore.contact,
          footer: memoryStore.footer,
          experience: memoryStore.experience,
          education: memoryStore.education,
          tools: memoryStore.tools,
          categories: memoryStore.categories,
        };
      }

      if (data && data.length > 0) {
        console.info(`[CMS] Successfully loaded ${data.length} content sections from Supabase.`);
        const map: Record<string, any> = {};
        data.forEach((row: { section: string; content: any }) => {
          map[row.section] = row.content;
        });

        if (map.profile) memoryStore.profile = map.profile;
        if (map.header) memoryStore.header = map.header;
        if (map.hero) memoryStore.hero = map.hero;
        if (map.about) memoryStore.about = map.about;
        if (map.marquee) memoryStore.marquee = map.marquee;
        if (map.philosophy) memoryStore.philosophy = map.philosophy;
        if (map.contact) memoryStore.contact = map.contact;
        if (map.footer) memoryStore.footer = map.footer;
        if (map.experience) memoryStore.experience = map.experience;
        if (map.education) memoryStore.education = map.education;
        if (map.tools) memoryStore.tools = map.tools;
        if (map.categories) memoryStore.categories = map.categories;

        return {
          profile: map.profile || memoryStore.profile,
          header: map.header || memoryStore.header,
          hero: map.hero || memoryStore.hero,
          about: map.about || memoryStore.about,
          marquee: map.marquee || memoryStore.marquee,
          philosophy: map.philosophy || memoryStore.philosophy,
          contact: map.contact || memoryStore.contact,
          footer: map.footer || memoryStore.footer,
          experience: map.experience || memoryStore.experience,
          education: map.education || memoryStore.education,
          tools: map.tools || memoryStore.tools,
          categories: map.categories || memoryStore.categories,
        };
      }

      return {
        profile: memoryStore.profile,
        header: memoryStore.header,
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
        experience: memoryStore.experience,
        education: memoryStore.education,
        tools: memoryStore.tools,
        categories: memoryStore.categories,
      };
    } catch (err) {
      console.error('[CMS] Error fetching website content:', err);
      return {
        profile: memoryStore.profile,
        header: memoryStore.header,
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
        experience: memoryStore.experience,
        education: memoryStore.education,
        tools: memoryStore.tools,
        categories: memoryStore.categories,
      };
    }
  },

  /**
   * Helper to persist a specific section to Supabase
   */
  async persistSection(section: string, content: any): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      console.info(`[CMS] Persisting section "${section}" to Supabase...`);
      const { error } = await supabase
        .from('website_content')
        .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: 'section' });

      if (error) {
        console.warn(`[CMS] Failed to persist section "${section}":`, error.message);
        return false;
      }
      console.info(`[CMS] Successfully persisted section "${section}" to database.`);
      return true;
    } catch (err) {
      console.error(`[CMS] Error persisting section "${section}":`, err);
      return false;
    }
  },

  /**
   * Header Settings
   */
  async getHeaderSettings(): Promise<HeaderSettings> {
    if (!isSupabaseConfigured) return memoryStore.header;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'header').maybeSingle();
      if (error || !data?.content) return memoryStore.header;
      memoryStore.header = data.content as HeaderSettings;
      return memoryStore.header;
    } catch {
      return memoryStore.header;
    }
  },

  async updateHeaderSettings(content: HeaderSettings): Promise<boolean> {
    memoryStore.header = { ...content };
    return this.persistSection('header', content);
  },

  /**
   * Profile
   */
  async getProfileContent(): Promise<ProfileContent> {
    if (!isSupabaseConfigured) return memoryStore.profile;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'profile').maybeSingle();
      if (error || !data?.content) return memoryStore.profile;
      memoryStore.profile = data.content as ProfileContent;
      return memoryStore.profile;
    } catch {
      return memoryStore.profile;
    }
  },

  async updateProfileContent(content: ProfileContent): Promise<boolean> {
    memoryStore.profile = { ...content };
    return this.persistSection('profile', content);
  },

  /**
   * Experience
   */
  async getExperience(): Promise<ExperienceItem[]> {
    if (!isSupabaseConfigured) return memoryStore.experience;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'experience').maybeSingle();
      if (error || !data?.content) return memoryStore.experience;
      memoryStore.experience = data.content as ExperienceItem[];
      return memoryStore.experience;
    } catch {
      return memoryStore.experience;
    }
  },

  async updateExperience(content: ExperienceItem[]): Promise<boolean> {
    memoryStore.experience = [...content];
    return this.persistSection('experience', content);
  },

  /**
   * Education
   */
  async getEducation(): Promise<EducationItem[]> {
    if (!isSupabaseConfigured) return memoryStore.education;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'education').maybeSingle();
      if (error || !data?.content) return memoryStore.education;
      memoryStore.education = data.content as EducationItem[];
      return memoryStore.education;
    } catch {
      return memoryStore.education;
    }
  },

  async updateEducation(content: EducationItem[]): Promise<boolean> {
    memoryStore.education = [...content];
    return this.persistSection('education', content);
  },

  /**
   * Tools
   */
  async getTools(): Promise<ToolItem[]> {
    if (!isSupabaseConfigured) return memoryStore.tools;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'tools').maybeSingle();
      if (error || !data?.content) return memoryStore.tools;
      memoryStore.tools = data.content as ToolItem[];
      return memoryStore.tools;
    } catch {
      return memoryStore.tools;
    }
  },

  async updateTools(content: ToolItem[]): Promise<boolean> {
    memoryStore.tools = [...content];
    return this.persistSection('tools', content);
  },

  /**
   * Portfolio Categories
   */
  async getCategories(): Promise<PortfolioCategory[]> {
    if (!isSupabaseConfigured) return memoryStore.categories;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'categories').maybeSingle();
      if (error || !data?.content) return memoryStore.categories;
      memoryStore.categories = data.content as PortfolioCategory[];
      return memoryStore.categories;
    } catch {
      return memoryStore.categories;
    }
  },

  async updateCategories(content: PortfolioCategory[]): Promise<boolean> {
    memoryStore.categories = [...content];
    return this.persistSection('categories', content);
  },

  /**
   * Hero
   */
  async getHeroContent(): Promise<HeroContent> {
    if (!isSupabaseConfigured) return memoryStore.hero;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'hero').maybeSingle();
      if (error || !data?.content) return memoryStore.hero;
      memoryStore.hero = data.content as HeroContent;
      return memoryStore.hero;
    } catch {
      return memoryStore.hero;
    }
  },

  async updateHeroContent(content: HeroContent): Promise<boolean> {
    memoryStore.hero = { ...content };
    return this.persistSection('hero', content);
  },

  /**
   * About
   */
  async getAboutContent(): Promise<AboutContent> {
    if (!isSupabaseConfigured) return memoryStore.about;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'about').maybeSingle();
      if (error || !data?.content) return memoryStore.about;
      memoryStore.about = data.content as AboutContent;
      return memoryStore.about;
    } catch {
      return memoryStore.about;
    }
  },

  async updateAboutContent(content: AboutContent): Promise<boolean> {
    memoryStore.about = { ...content };
    return this.persistSection('about', content);
  },

  /**
   * Marquee
   */
  async getMarqueeContent(): Promise<MarqueeContent> {
    if (!isSupabaseConfigured) return memoryStore.marquee;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'marquee').maybeSingle();
      if (error || !data?.content) return memoryStore.marquee;
      memoryStore.marquee = data.content as MarqueeContent;
      return memoryStore.marquee;
    } catch {
      return memoryStore.marquee;
    }
  },

  async updateMarqueeContent(content: MarqueeContent): Promise<boolean> {
    memoryStore.marquee = { ...content };
    return this.persistSection('marquee', content);
  },

  /**
   * Philosophy
   */
  async getPhilosophyContent(): Promise<PhilosophyContent> {
    if (!isSupabaseConfigured) return memoryStore.philosophy;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'philosophy').maybeSingle();
      if (error || !data?.content) return memoryStore.philosophy;
      memoryStore.philosophy = data.content as PhilosophyContent;
      return memoryStore.philosophy;
    } catch {
      return memoryStore.philosophy;
    }
  },

  async updatePhilosophyContent(content: PhilosophyContent): Promise<boolean> {
    memoryStore.philosophy = { ...content };
    return this.persistSection('philosophy', content);
  },

  /**
   * Contact CTA
   */
  async getContactCTAContent(): Promise<ContactCTA> {
    if (!isSupabaseConfigured) return memoryStore.contact;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'contact').maybeSingle();
      if (error || !data?.content) return memoryStore.contact;
      memoryStore.contact = data.content as ContactCTA;
      return memoryStore.contact;
    } catch {
      return memoryStore.contact;
    }
  },

  async updateContactCTAContent(content: ContactCTA): Promise<boolean> {
    memoryStore.contact = { ...content };
    return this.persistSection('contact', content);
  },

  async getStatementContent(): Promise<AboutContent> {
    return this.getAboutContent();
  },

  async getFooterContent(): Promise<FooterContent> {
    if (!isSupabaseConfigured) return memoryStore.footer;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'footer').maybeSingle();
      if (error || !data?.content) return memoryStore.footer;
      memoryStore.footer = data.content as FooterContent;
      return memoryStore.footer;
    } catch {
      return memoryStore.footer;
    }
  },

  async updateFooterContent(content: FooterContent): Promise<boolean> {
    memoryStore.footer = { ...content };
    return this.persistSection('footer', content);
  },
};

export default websiteService;
