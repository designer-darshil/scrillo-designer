import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { HeroContent, AboutContent, PhilosophyContent, ContactCTA, FooterContent } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

export const defaultHeroContent: HeroContent = defaultWebsiteData.hero;
export const defaultStatementContent: AboutContent = defaultWebsiteData.about;
export const defaultPhilosophyContent: PhilosophyContent = defaultWebsiteData.philosophy;
export const defaultContactCTAContent: ContactCTA = defaultWebsiteData.contact;
export const defaultFooterContent: FooterContent = defaultWebsiteData.footer;

export const websiteService = {
  async getHeroContent(): Promise<HeroContent> {
    if (!isSupabaseConfigured) return defaultHeroContent;
    try {
      const { data, error } = await supabase.from('website_content').select('*').eq('section', 'hero').single();
      if (error || !data) return defaultHeroContent;
      return data.content as HeroContent;
    } catch {
      return defaultHeroContent;
    }
  },

  async updateHeroContent(content: HeroContent): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('website_content').upsert({ section: 'hero', content });
      return !error;
    } catch {
      return false;
    }
  },

  async getStatementContent(): Promise<AboutContent> {
    return defaultStatementContent;
  },

  async getPhilosophyContent(): Promise<PhilosophyContent> {
    return defaultPhilosophyContent;
  },

  async getContactCTAContent(): Promise<ContactCTA> {
    return defaultContactCTAContent;
  },

  async getFooterContent(): Promise<FooterContent> {
    return defaultFooterContent;
  },
};

export default websiteService;

