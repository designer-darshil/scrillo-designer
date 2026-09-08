import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WebsiteSettings } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

export const defaultSettings: WebsiteSettings = defaultWebsiteData.settings;

export const settingsService = {
  async getSettings(): Promise<WebsiteSettings> {
    if (!isSupabaseConfigured) return defaultSettings;
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error || !data) return defaultSettings;
      return data.settings as WebsiteSettings;
    } catch {
      return defaultSettings;
    }
  },

  async updateSettings(settings: WebsiteSettings): Promise<boolean> {
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

