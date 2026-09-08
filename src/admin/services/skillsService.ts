import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SkillCategory } from '../../types';
import { skillCategories } from '../../data/skills';

export const skillsService = {
  async getCategories(): Promise<SkillCategory[]> {
    if (!isSupabaseConfigured) return skillCategories;
    try {
      const { data, error } = await supabase.from('skills').select('*');
      if (error || !data || data.length === 0) return skillCategories;
      return data as SkillCategory[];
    } catch {
      return skillCategories;
    }
  },

  async updateCategory(id: string, updates: Partial<SkillCategory>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('skills').update(updates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};

export default skillsService;

