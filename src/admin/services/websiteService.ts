import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { HeroContent, AboutContent, MarqueeContent, PhilosophyContent, ContactCTA, FooterContent, WebsiteData } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

// In-memory cache to ensure state persistence across sessions/transitions even if Supabase is offline/unconfigured
const memoryStore: {
  hero: HeroContent;
  about: AboutContent;
  marquee: MarqueeContent;
  philosophy: PhilosophyContent;
  contact: ContactCTA;
  footer: FooterContent;
} = {
  hero: { ...defaultWebsiteData.hero },
  about: { ...defaultWebsiteData.about },
  marquee: { ...defaultWebsiteData.marquee },
  philosophy: { ...defaultWebsiteData.philosophy },
  contact: { ...defaultWebsiteData.contact },
  footer: { ...defaultWebsiteData.footer },
};

export const defaultHeroContent: HeroContent = defaultWebsiteData.hero;
export const defaultStatementContent: AboutContent = defaultWebsiteData.about;
export const defaultPhilosophyContent: PhilosophyContent = defaultWebsiteData.philosophy;
export const defaultContactCTAContent: ContactCTA = defaultWebsiteData.contact;
export const defaultFooterContent: FooterContent = defaultWebsiteData.footer;
export const defaultMarqueeContent: MarqueeContent = defaultWebsiteData.marquee;

export const websiteService = {
  /**
   * Fetch complete website data with fallback to memory/defaults
   */
  async getWebsiteData(): Promise<Partial<WebsiteData>> {
    if (!isSupabaseConfigured) {
      return {
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
        philosophy: memoryStore.philosophy,
        contact: memoryStore.contact,
        footer: memoryStore.footer,
      };
    }

    try {
      const { data, error } = await supabase.from('website_content').select('*');
      if (error || !data || data.length === 0) {
        return {
          hero: memoryStore.hero,
          about: memoryStore.about,
          marquee: memoryStore.marquee,
        };
      }

      const map: Record<string, any> = {};
      data.forEach((row: { section: string; content: any }) => {
        map[row.section] = row.content;
      });

      if (map.hero) memoryStore.hero = map.hero;
      if (map.about) memoryStore.about = map.about;
      if (map.marquee) memoryStore.marquee = map.marquee;

      return {
        hero: map.hero || memoryStore.hero,
        about: map.about || memoryStore.about,
        marquee: map.marquee || memoryStore.marquee,
      };
    } catch {
      return {
        hero: memoryStore.hero,
        about: memoryStore.about,
        marquee: memoryStore.marquee,
      };
    }
  },

  /**
   * Fetch Hero content
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

  /**
   * Update Hero content in Supabase and memory store
   */
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
   * Fetch About content
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

  /**
   * Update About content in Supabase and memory store
   */
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
   * Fetch Marquee content
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

  /**
   * Update Marquee content in Supabase and memory store
   */
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

  async getStatementContent(): Promise<AboutContent> {
    return this.getAboutContent();
  },

  async getPhilosophyContent(): Promise<PhilosophyContent> {
    return memoryStore.philosophy;
  },

  async getContactCTAContent(): Promise<ContactCTA> {
    return memoryStore.contact;
  },

  async getFooterContent(): Promise<FooterContent> {
    return memoryStore.footer;
  },
};

export default websiteService;


