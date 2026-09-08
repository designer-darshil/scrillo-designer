import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SiteSettings } from '../types';

export const defaultSettings: SiteSettings = {
  siteTitle: 'Darshil S. Bhuva — UI/UX Designer · Web Designer',
  siteDescription: 'Personal portfolio of Darshil S. Bhuva — UI/UX Designer and Web Designer.',
  defaultTheme: 'dark',
  enableCustomCursor: true,
  enableSmoothScroll: true,
  enableMarqueeVelocity: true,
  sectionVisibility: {
    hero: true,
    marquee: true,
    works: true,
    statement: true,
    skills: true,
    philosophy: true,
    services: true,
    experimentalImage: true,
    contactCTA: true,
    footer: true,
  },
};

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured) return defaultSettings;
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error || !data) return defaultSettings;
      return data.settings as SiteSettings;
    } catch {
      return defaultSettings;
    }
  },

  async updateSettings(settings: SiteSettings): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, settings });
      return !error;
    } catch {
      return false;
    }
  },
};

export default settingsService;
