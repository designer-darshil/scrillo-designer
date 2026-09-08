import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Service } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

export const defaultServicesList: Service[] = defaultWebsiteData.services;

export const servicesService = {
  async getServices(): Promise<Service[]> {
    if (!isSupabaseConfigured) return defaultServicesList;
    try {
      const { data, error } = await supabase.from('services').select('*').order('number', { ascending: true });
      if (error || !data || data.length === 0) return defaultServicesList;
      return data as Service[];
    } catch {
      return defaultServicesList;
    }
  },

  async updateService(number: string, updates: Partial<Service>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('services').update(updates).eq('number', number);
      return !error;
    } catch {
      return false;
    }
  },
};

export default servicesService;

