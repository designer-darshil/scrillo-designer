import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WebsiteSettings, SectionId, SectionSettings } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { activityService } from './activityService';

export const defaultSettings: WebsiteSettings = defaultWebsiteData.settings;

export const ALL_CANONICAL_SECTION_IDS: SectionId[] = [
  'hero',
  'marquee',
  'projects',
  'statement',
  'experience',
  'skills',
  'philosophy',
  'services',
  'image',
  'contact',
  'footer',
];

/**
 * Normalizes section settings to strictly enforce:
 * 1. sectionKey (id) is canonical and unique.
 * 2. order is strictly an integer with normalized sequential values (1..N).
 * 3. visible is strictly boolean.
 * 4. Pinned footer section is always placed at the end.
 * 5. Section content is completely decoupled from section settings.
 */
export function normalizeSectionSettings(rawSections?: Partial<SectionSettings>): SectionSettings {
  const mainSectionList: { id: SectionId; name: string; visible: boolean; rawOrder: number }[] = [];
  let footerName = defaultSettings.sections.footer?.name || 'Footer';
  let footerVisible = true;

  for (const id of ALL_CANONICAL_SECTION_IDS) {
    const raw = rawSections?.[id] || defaultSettings.sections[id];
    const visible = typeof raw?.visible === 'boolean' ? raw.visible : true;
    const rawOrder =
      typeof raw?.order === 'number' && Number.isFinite(raw.order)
        ? Math.round(raw.order)
        : defaultSettings.sections[id]?.order ?? 99;
    const name =
      raw?.name && typeof raw.name === 'string' ? raw.name : defaultSettings.sections[id]?.name || id;

    if (id === 'footer') {
      footerName = name;
      footerVisible = visible;
    } else {
      mainSectionList.push({ id, name, visible, rawOrder });
    }
  }

  // Sort main sections by their assigned order
  mainSectionList.sort((a, b) => a.rawOrder - b.rawOrder);

  const normalized = {} as SectionSettings;
  mainSectionList.forEach((item, index) => {
    normalized[item.id] = {
      id: item.id,
      name: item.name,
      visible: Boolean(item.visible),
      order: index + 1, // Normalized sequential integer: 1, 2, 3...
    };
  });

  // Footer is always pinned at the end
  normalized.footer = {
    id: 'footer',
    name: footerName,
    visible: Boolean(footerVisible),
    order: mainSectionList.length + 1,
  };

  return normalized;
}

let memorySettingsStore: WebsiteSettings = {
  ...defaultWebsiteData.settings,
  sections: normalizeSectionSettings(defaultWebsiteData.settings.sections),
};

export const settingsService = {
  /**
   * Fetch website settings from Supabase database
   */
  async getSettings(): Promise<WebsiteSettings> {
    if (!isSupabaseConfigured) {
      console.info('[CMS] Supabase not configured. Using local memory settings.');
      return { ...memorySettingsStore };
    }

    try {
      console.info('[CMS] Fetching settings from Supabase (public.site_settings)...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data?.settings) {
        console.info('[CMS] Successfully loaded settings from Supabase database.');
        const mergedSections = normalizeSectionSettings(data.settings.sections);
        memorySettingsStore = {
          ...defaultSettings,
          ...data.settings,
          sections: mergedSections,
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
      }

      // Check section_settings companion table as fallback
      const { data: sectionRows, error: secError } = await supabase
        .from('section_settings')
        .select('*');

      if (!secError && sectionRows && sectionRows.length > 0) {
        console.info('[CMS] Loaded section layout from section_settings table.');
        const sectionMap: Partial<SectionSettings> = {};
        sectionRows.forEach((r: any) => {
          if (r.section_key) {
            sectionMap[r.section_key as SectionId] = {
              id: r.section_key,
              name: r.name || r.section_key,
              visible: r.visible !== false,
              order: r.order || 1,
            };
          }
        });
        memorySettingsStore.sections = normalizeSectionSettings(sectionMap);
      }

      return { ...memorySettingsStore };
    } catch (err) {
      console.error('[CMS] Error fetching settings:', err);
      return { ...memorySettingsStore };
    }
  },

  /**
   * Save website settings to Supabase database
   */
  async updateSettings(settings: WebsiteSettings): Promise<boolean> {
    const normalizedSections = normalizeSectionSettings(settings.sections);
    const normalizedSettings: WebsiteSettings = {
      ...settings,
      sections: normalizedSections,
    };

    memorySettingsStore = { ...normalizedSettings };

    activityService
      .logActivity({
        action: 'Settings changed',
        item: 'Theme, Colors & System Configuration',
        section: 'Settings',
        user: 'admin@scrillo.design',
        status: 'Updated',
      })
      .catch(() => {});

    if (!isSupabaseConfigured) return true;

    try {
      console.info('[CMS] Saving settings and section layout to Supabase database...');
      // 1. Save to site_settings table
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert({ id: 1, settings: normalizedSettings, updated_at: new Date().toISOString() });

      if (settingsError) {
        console.warn('[CMS] site_settings upsert note:', settingsError.message);
      }

      // 2. Also keep section_settings relational table in sync
      try {
        const sectionRows = ALL_CANONICAL_SECTION_IDS.map((id) => ({
          section_key: id,
          name: normalizedSections[id]?.name || id,
          visible: normalizedSections[id]?.visible !== false,
          order: normalizedSections[id]?.order ?? 1,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('section_settings').upsert(sectionRows, { onConflict: 'section_key' });
      } catch (secErr) {
        console.warn('[CMS] section_settings sync note:', secErr);
      }

      console.info('[CMS] Successfully saved settings and section layout to Supabase.');
      return !settingsError;
    } catch (err) {
      console.error('[CMS] Failed to save settings to Supabase:', err);
      return false;
    }
  },
};

export default settingsService;
