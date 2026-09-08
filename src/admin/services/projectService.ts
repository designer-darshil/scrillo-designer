import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Project } from '../../types';
import { projectsData } from '../../data/projects';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      return projectsData;
    }
    try {
      const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
      if (error || !data || data.length === 0) {
        return projectsData;
      }
      return data as Project[];
    } catch {
      return projectsData;
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project | null> {
    if (!isSupabaseConfigured) {
      return { id: `proj-${Date.now()}`, ...project };
    }
    try {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (error) return null;
      return data as Project;
    } catch {
      return null;
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
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

