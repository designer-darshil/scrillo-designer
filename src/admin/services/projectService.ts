import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Project } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { activityService } from './activityService';

// In-memory store for projects initialized from defaultWebsiteData
const memoryProjectsStore: Project[] = JSON.parse(JSON.stringify(defaultWebsiteData.projects));

export const projectService = {
  /**
   * Fetch all projects ordered by order ASC
   */
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      return [...memoryProjectsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    try {
      const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
      if (error || !data || data.length === 0) {
        return [...memoryProjectsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
      
      // Update memory store with remote records
      memoryProjectsStore.length = 0;
      data.forEach((item) => memoryProjectsStore.push(item as Project));
      return data as Project[];
    } catch {
      return [...memoryProjectsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  },

  /**
   * Get single project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    const localMatch = memoryProjectsStore.find((p) => p.id === id);
    if (!isSupabaseConfigured) {
      return localMatch ? { ...localMatch } : null;
    }
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error || !data) {
        return localMatch ? { ...localMatch } : null;
      }
      return data as Project;
    } catch {
      return localMatch ? { ...localMatch } : null;
    }
  },

  /**
   * Create a new project
   */
  async createProject(projectData: Omit<Project, 'id'> & { id?: string }): Promise<Project | null> {
    const nextOrder =
      memoryProjectsStore.length > 0
        ? Math.max(...memoryProjectsStore.map((p) => p.order ?? 0)) + 1
        : 1;

    const newProject: Project = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: projectData.order ?? nextOrder,
      number: projectData.number || String(nextOrder).padStart(2, '0'),
      gallery: projectData.gallery || [],
      services: projectData.services || [],
      published: projectData.published ?? true,
      featured: projectData.featured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryProjectsStore.push(newProject);

    // Track activity event
    activityService.logActivity({
      action: newProject.published ? 'Project published' : 'Project created',
      item: newProject.title || 'Untitled Project',
      section: 'Projects',
      user: 'admin@scrillo.design',
      status: newProject.published ? 'Published' : 'Draft',
    }).catch(() => {});

    if (!isSupabaseConfigured) {
      return newProject;
    }

    try {
      const { data, error } = await supabase.from('projects').insert([newProject]).select().single();
      if (error) {
        console.warn('Supabase project insert failed, fallback to memory store:', error);
        return newProject;
      }
      return data as Project;
    } catch (err) {
      console.warn('Supabase project insert error:', err);
      return newProject;
    }
  },

  /**
   * Update an existing project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    const index = memoryProjectsStore.findIndex((p) => p.id === id);
    let targetTitle = 'Project';
    if (index !== -1) {
      targetTitle = updates.title || memoryProjectsStore[index].title || 'Project';
      memoryProjectsStore[index] = {
        ...memoryProjectsStore[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }

    // Track activity
    const isPublishToggle = updates.published !== undefined;
    const actionName = isPublishToggle
      ? (updates.published ? 'Project published' : 'Project updated')
      : 'Project updated';

    activityService.logActivity({
      action: actionName,
      item: targetTitle,
      section: 'Projects',
      user: 'admin@scrillo.design',
      status: updates.published === false ? 'Draft' : 'Updated',
    }).catch(() => {});

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.warn('Supabase project update warning, applied to memory:', error);
        return true;
      }
      return true;
    } catch (err) {
      console.warn('Supabase update error:', err);
      return true;
    }
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    const index = memoryProjectsStore.findIndex((p) => p.id === id);
    let deletedTitle = `Project (${id})`;
    if (index !== -1) {
      deletedTitle = memoryProjectsStore[index].title || deletedTitle;
      memoryProjectsStore.splice(index, 1);
    }

    // Track activity
    activityService.logActivity({
      action: 'Project deleted',
      item: deletedTitle,
      section: 'Projects',
      user: 'admin@scrillo.design',
      status: 'Deleted',
    }).catch(() => {});

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      return !error;
    } catch {
      return true;
    }
  },

  /**
   * Duplicate an existing project
   */
  async duplicateProject(id: string): Promise<Project | null> {
    const source = memoryProjectsStore.find((p) => p.id === id);
    if (!source) return null;

    const maxOrder =
      memoryProjectsStore.length > 0
        ? Math.max(...memoryProjectsStore.map((p) => p.order ?? 0)) + 1
        : 1;

    const duplicatedData: Omit<Project, 'id'> = {
      ...source,
      title: `${source.title} (Copy)`,
      shortTitle: source.shortTitle ? `${source.shortTitle} (Copy)` : undefined,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      order: maxOrder,
      number: String(maxOrder).padStart(2, '0'),
      published: false, // Default to draft on duplicate for safety
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createProject(duplicatedData);
  },

  /**
   * Reorder projects batch
   */
  async reorderProjects(orderedIds: string[]): Promise<boolean> {
    orderedIds.forEach((id, index) => {
      const project = memoryProjectsStore.find((p) => p.id === id);
      if (project) {
        project.order = index + 1;
        project.number = String(index + 1).padStart(2, '0');
        project.updatedAt = new Date().toISOString();
      }
    });

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('projects')
          .update({ order: index + 1, number: String(index + 1).padStart(2, '0'), updated_at: new Date().toISOString() })
          .eq('id', id)
      );

      await Promise.all(updates);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Quick toggle published status
   */
  async togglePublish(id: string): Promise<boolean> {
    const project = memoryProjectsStore.find((p) => p.id === id);
    if (!project) return false;
    const nextPublished = !project.published;
    return this.updateProject(id, { published: nextPublished });
  },

  /**
   * Quick toggle featured status
   */
  async toggleFeatured(id: string): Promise<boolean> {
    const project = memoryProjectsStore.find((p) => p.id === id);
    if (!project) return false;
    const nextFeatured = !project.featured;
    return this.updateProject(id, { featured: nextFeatured });
  },
};

export default projectService;
