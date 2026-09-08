import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ProjectItem } from '../types';
import { projectsData } from '../../data/projects';

export const projectService = {
  async getProjects(): Promise<ProjectItem[]> {
    if (!isSupabaseConfigured) {
      return projectsData.map((p, idx) => ({
        ...p,
        order: idx + 1,
      }));
    }
    try {
      const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
      if (error || !data || data.length === 0) {
        return projectsData.map((p, idx) => ({ ...p, order: idx + 1 }));
      }
      return data as ProjectItem[];
    } catch {
      return projectsData.map((p, idx) => ({ ...p, order: idx + 1 }));
    }
  },

  async createProject(project: Omit<ProjectItem, 'id'>): Promise<ProjectItem | null> {
    if (!isSupabaseConfigured) {
      return { id: `proj-${Date.now()}`, ...project };
    }
    try {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (error) return null;
      return data as ProjectItem;
    } catch {
      return null;
    }
  },

  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};

export default projectService;
