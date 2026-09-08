import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  HeroContent,
  AboutContent,
  MarqueeContent,
  PhilosophyContent,
  ContactCTA,
  FooterContent,
  ProfileContent,
  ExperienceItem,
  EducationItem,
  ToolItem,
  PortfolioCategory,
  WebsiteData,
} from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

// In-memory cache to ensure state persistence across sessions/transitions even if Supabase is offline/unconfigured
const memoryStore: {
  profile: ProfileContent;
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

export const websiteService = {
  /**
   * Fetch complete website data with fallback to memory/defaults
   */
  async getWebsiteData(): Promise<Partial<WebsiteData>> {
    if (!isSupabaseConfigured) {
      return {
        profile: memoryStore.profile,
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
        experience: memoryStore.experience,
        education: memoryStore.education,
        tools: memoryStore.tools,
      };
    }

    try {
      const { data, error } = await supabase.from('website_content').select('*');
      if (error || !data || data.length === 0) {
        return {
          profile: memoryStore.profile,
          hero: memoryStore.hero,
          about: memoryStore.about,
          marquee: memoryStore.marquee,
          philosophy: memoryStore.philosophy,
          contact: memoryStore.contact,
          footer: memoryStore.footer,
          experience: memoryStore.experience,
          education: memoryStore.education,
          tools: memoryStore.tools,
        };
      }

      const map: Record<string, any> = {};
      data.forEach((row: { section: string; content: any }) => {
        map[row.section] = row.content;
      });

      if (map.profile) memoryStore.profile = map.profile;
      if (map.hero) memoryStore.hero = map.hero;
      if (map.about) memoryStore.about = map.about;
      if (map.marquee) memoryStore.marquee = map.marquee;
      if (map.philosophy) memoryStore.philosophy = map.philosophy;
      if (map.contact) memoryStore.contact = map.contact;
      if (map.footer) memoryStore.footer = map.footer;
      if (map.experience) memoryStore.experience = map.experience;
      if (map.education) memoryStore.education = map.education;
      if (map.tools) memoryStore.tools = map.tools;

      return {
        profile: map.profile || memoryStore.profile,
        hero: map.hero || memoryStore.hero,
        about: map.about || memoryStore.about,
        marquee: map.marquee || memoryStore.marquee,
        philosophy: map.philosophy || memoryStore.philosophy,
        contact: map.contact || memoryStore.contact,
        footer: map.footer || memoryStore.footer,
        experience: map.experience || memoryStore.experience,
        education: map.education || memoryStore.education,
        tools: map.tools || memoryStore.tools,
      };
    } catch {
      return {
        profile: memoryStore.profile,
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
        experience: memoryStore.experience,
        education: memoryStore.education,
        tools: memoryStore.tools,
      };
    }
  },

  /**
   * Profile
   */
  async getProfileContent(): Promise<ProfileContent> {
    if (!isSupabaseConfigured) return memoryStore.profile;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'profile').single();
      if (error || !data?.content) return memoryStore.profile;
      memoryStore.profile = data.content as ProfileContent;
      return memoryStore.profile;
    } catch {
      return memoryStore.profile;
    }
  },

  async updateProfileContent(content: ProfileContent): Promise<boolean> {
    memoryStore.profile = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'profile', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Experience
   */
  async getExperience(): Promise<ExperienceItem[]> {
    if (!isSupabaseConfigured) return memoryStore.experience;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'experience').single();
      if (error || !data?.content) return memoryStore.experience;
      memoryStore.experience = data.content as ExperienceItem[];
      return memoryStore.experience;
    } catch {
      return memoryStore.experience;
    }
  },

  async updateExperience(content: ExperienceItem[]): Promise<boolean> {
    memoryStore.experience = [...content];
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'experience', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Education
   */
  async getEducation(): Promise<EducationItem[]> {
    if (!isSupabaseConfigured) return memoryStore.education;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'education').single();
      if (error || !data?.content) return memoryStore.education;
      memoryStore.education = data.content as EducationItem[];
      return memoryStore.education;
    } catch {
      return memoryStore.education;
    }
  },

  async updateEducation(content: EducationItem[]): Promise<boolean> {
    memoryStore.education = [...content];
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'education', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Tools
   */
  async getTools(): Promise<ToolItem[]> {
    if (!isSupabaseConfigured) return memoryStore.tools;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'tools').single();
      if (error || !data?.content) return memoryStore.tools;
      memoryStore.tools = data.content as ToolItem[];
      return memoryStore.tools;
    } catch {
      return memoryStore.tools;
    }
  },

  async updateTools(content: ToolItem[]): Promise<boolean> {
    memoryStore.tools = [...content];
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'tools', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Portfolio Categories
   */
  async getCategories(): Promise<PortfolioCategory[]> {
    if (!isSupabaseConfigured) return memoryStore.categories;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'categories').single();
      if (error || !data?.content) return memoryStore.categories;
      memoryStore.categories = data.content as PortfolioCategory[];
      return memoryStore.categories;
    } catch {
      return memoryStore.categories;
    }
  },

  async updateCategories(content: PortfolioCategory[]): Promise<boolean> {
    memoryStore.categories = [...content];
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'categories', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Hero
   */
  async getHeroContent(): Promise<HeroContent> {
    if (!isSupabaseConfigured) return memoryStore.hero;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'hero').single();
      if (error || !data?.content) return memoryStore.hero;
      memoryStore.hero = data.content as HeroContent;
      return memoryStore.hero;
    } catch {
      return memoryStore.hero;
    }
  },

  async updateHeroContent(content: HeroContent): Promise<boolean> {
    memoryStore.hero = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'hero', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * About
   */
  async getAboutContent(): Promise<AboutContent> {
    if (!isSupabaseConfigured) return memoryStore.about;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'about').single();
      if (error || !data?.content) return memoryStore.about;
      memoryStore.about = data.content as AboutContent;
      return memoryStore.about;
    } catch {
      return memoryStore.about;
    }
  },

  async updateAboutContent(content: AboutContent): Promise<boolean> {
    memoryStore.about = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'about', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Marquee
   */
  async getMarqueeContent(): Promise<MarqueeContent> {
    if (!isSupabaseConfigured) return memoryStore.marquee;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'marquee').single();
      if (error || !data?.content) return memoryStore.marquee;
      memoryStore.marquee = data.content as MarqueeContent;
      return memoryStore.marquee;
    } catch {
      return memoryStore.marquee;
    }
  },

  async updateMarqueeContent(content: MarqueeContent): Promise<boolean> {
    memoryStore.marquee = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'marquee', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Philosophy
   */
  async getPhilosophyContent(): Promise<PhilosophyContent> {
    if (!isSupabaseConfigured) return memoryStore.philosophy;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'philosophy').single();
      if (error || !data?.content) return memoryStore.philosophy;
      memoryStore.philosophy = data.content as PhilosophyContent;
      return memoryStore.philosophy;
    } catch {
      return memoryStore.philosophy;
    }
  },

  async updatePhilosophyContent(content: PhilosophyContent): Promise<boolean> {
    memoryStore.philosophy = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'philosophy', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Contact CTA
   */
  async getContactCTAContent(): Promise<ContactCTA> {
    if (!isSupabaseConfigured) return memoryStore.contact;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'contact').single();
      if (error || !data?.content) return memoryStore.contact;
      memoryStore.contact = data.content as ContactCTA;
      return memoryStore.contact;
    } catch {
      return memoryStore.contact;
    }
  },

  async updateContactCTAContent(content: ContactCTA): Promise<boolean> {
    memoryStore.contact = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'contact', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },

  async getStatementContent(): Promise<AboutContent> {
    return this.getAboutContent();
  },

  async getFooterContent(): Promise<FooterContent> {
    if (!isSupabaseConfigured) return memoryStore.footer;
    try {
      const { data, error } = await supabase.from('website_content').select('content').eq('section', 'footer').single();
      if (error || !data?.content) return memoryStore.footer;
      memoryStore.footer = data.content as FooterContent;
      return memoryStore.footer;
    } catch {
      return memoryStore.footer;
    }
  },

  async updateFooterContent(content: FooterContent): Promise<boolean> {
    memoryStore.footer = { ...content };
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({ section: 'footer', content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
      return !error;
    } catch {
      return false;
    }
  },
};

export default websiteService;
