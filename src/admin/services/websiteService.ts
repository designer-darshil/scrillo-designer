import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { HeroContent, StatementContent, PhilosophyContent, ContactCTAContent, FooterContent } from '../types';

export const defaultHeroContent: HeroContent = {
  label: '(About me)',
  headlineLine1: 'Building digital',
  headlineLine2: 'experiences that',
  headlineLine3: 'feel inevitable.',
  supportingText: 'Digital product designer & creative developer focused on thoughtful interfaces, products and interactive experiences.',
  ctaText: 'VIEW SELECTED WORKS',
  yearMeta: '2026 / FOLIO ARCHIVE',
};

export const defaultStatementContent: StatementContent = {
  label: 'CREATIVE MANIFESTO',
  phrase1: 'BE CURIOUS.*',
  phrase2: 'BE BOLD.+',
  phrase3: 'BE USEFUL.°™',
  subtext: 'FORM AS CONSEQUENCE OF FUNCTION AND RESTRAINT',
};

export const defaultPhilosophyContent: PhilosophyContent = {
  label: 'DESIGN PHILOSOPHY',
  line1: 'Great design',
  line2: 'should feel obvious',
  line3: 'after you see it.',
  yearMeta: '— 2026 / PHILOSOPHY STATEMENT',
};

export const defaultContactCTAContent: ContactCTAContent = {
  label: 'INITIATE COLLABORATION',
  headlineLine1: 'HAVE SOMETHING',
  headlineLine2: 'WORTH BUILDING?',
  secondaryLine: "Let's make it real.",
  ctaText: 'START A PROJECT',
  email: 'contact@darshilbhuva.com',
  location: '21.1702° N, 72.8311° E',
};

export const defaultFooterContent: FooterContent = {
  locationTitle: 'INDIA',
  locationStatus: 'WORKING GLOBALLY',
  coordinates: 'UTC +05:30 · 21.1702° N, 72.8311° E',
  contactEmail: 'hello@example.com',
  responseWindow: 'Response within 24–48 hours',
  brandName: 'DARSHIL BHUVA',
  copyrightText: '© 2026 ALL RIGHTS RESERVED',
};

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

  async getStatementContent(): Promise<StatementContent> {
    return defaultStatementContent;
  },

  async getPhilosophyContent(): Promise<PhilosophyContent> {
    return defaultPhilosophyContent;
  },

  async getContactCTAContent(): Promise<ContactCTAContent> {
    return defaultContactCTAContent;
  },

  async getFooterContent(): Promise<FooterContent> {
    return defaultFooterContent;
  },
};

export default websiteService;
