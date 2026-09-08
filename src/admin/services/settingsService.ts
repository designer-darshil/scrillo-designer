import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WebsiteSettings } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { activityService } from './activityService';

export const defaultSettings: WebsiteSettings = defaultWebsiteData.settings;

let memorySettingsStore: WebsiteSettings = { ...defaultWebsiteData.settings };

export const settingsService = {
  /**
   * Fetch website settings
   */
  async getSettings(): Promise<WebsiteSettings> {
    if (!isSupabaseConfigured) return { ...memorySettingsStore };
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error || !data?.settings) return { ...memorySettingsStore };
      memorySettingsStore = {
        ...defaultSettings,
        ...data.settings,
        colors: {
          dark: { ...defaultSettings.colors.dark, ...(data.settings.colors?.dark || {}) },
          light: { ...defaultSettings.colors.light, ...(data.settings.colors?.light || {}) },
        },
        animations: {
          ...defaultSettings.animations,
          ...(data.settings.animations || {}),
        },
      };
      return { ...memorySettingsStore };
    } catch {
      return { ...memorySettingsStore };
    }
  },

  /**
   * Save website settings
   */
  async updateSettings(settings: WebsiteSettings): Promise<boolean> {
    memorySettingsStore = { ...settings };

    activityService.logActivity({
      action: 'Settings changed',
      item: 'Theme, Colors & System Configuration',
      section: 'Settings',
      user: 'admin@scrillo.design',
      status: 'Updated',
    }).catch(() => {});

    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, settings, updated_at: new Date().toISOString() });
      return !error;
    } catch {
      return false;
    }
  },
};

export default settingsService;
