import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteData, HeroContent, AboutContent, MarqueeContent, Project } from '../types';
import { defaultWebsiteData } from '../data/defaultWebsiteData';
import { websiteService } from '../admin/services/websiteService';
import { projectService } from '../admin/services/projectService';

interface WebsiteDataContextType {
  data: WebsiteData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateHero: (hero: HeroContent) => Promise<boolean>;
  updateAbout: (about: AboutContent) => Promise<boolean>;
  updateMarquee: (marquee: MarqueeContent) => Promise<boolean>;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
  createProject: (project: Omit<Project, 'id'> & { id?: string }) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  duplicateProject: (id: string) => Promise<Project | null>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;
  togglePublishProject: (id: string) => Promise<boolean>;
  toggleFeaturedProject: (id: string) => Promise<boolean>;
}

const WebsiteDataContext = createContext<WebsiteDataContextType>({
  data: defaultWebsiteData,
  loading: false,
  error: null,
  refreshData: async () => {},
  updateHero: async () => true,
  updateAbout: async () => true,
  updateMarquee: async () => true,
  updateSectionVisibility: () => {},
  createProject: async () => null,
  updateProject: async () => true,
  deleteProject: async () => true,
  duplicateProject: async () => null,
  reorderProjects: async () => true,
  togglePublishProject: async () => true,
  toggleFeaturedProject: async () => true,
});

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData>(defaultWebsiteData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [remoteData, projects] = await Promise.all([
        websiteService.getWebsiteData(),
        projectService.getProjects(),
      ]);

      setData((prev) => ({
        ...prev,
        hero: remoteData.hero || prev.hero,
        about: remoteData.about || prev.about,
        marquee: remoteData.marquee || prev.marquee,
        projects: projects && projects.length > 0 ? projects : prev.projects,
      }));
    } catch (err: any) {
      setError(err?.message || 'Failed to load website data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateHero = async (hero: HeroContent): Promise<boolean> => {
    try {
      const success = await websiteService.updateHeroContent(hero);
      if (success) {
        setData((prev) => ({ ...prev, hero }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateAbout = async (about: AboutContent): Promise<boolean> => {
    try {
      const success = await websiteService.updateAboutContent(about);
      if (success) {
        setData((prev) => ({ ...prev, about }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateMarquee = async (marquee: MarqueeContent): Promise<boolean> => {
    try {
      const success = await websiteService.updateMarqueeContent(marquee);
      if (success) {
        setData((prev) => ({ ...prev, marquee }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    setData((prev) => {
      const section = prev.settings.sections[sectionId as keyof typeof prev.settings.sections];
      if (!section) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          sections: {
            ...prev.settings.sections,
            [sectionId]: {
              ...section,
              visible,
            },
          },
        },
      };
    });
  };

  const createProject = async (projectData: Omit<Project, 'id'> & { id?: string }): Promise<Project | null> => {
    try {
      const created = await projectService.createProject(projectData);
      if (created) {
        setData((prev) => ({
          ...prev,
          projects: [...prev.projects, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return created;
    } catch {
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<boolean> => {
    try {
      const success = await projectService.updateProject(id, updates);
      if (success) {
        setData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const success = await projectService.deleteProject(id);
      if (success) {
        setData((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== id),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const duplicateProject = async (id: string): Promise<Project | null> => {
    try {
      const cloned = await projectService.duplicateProject(id);
      if (cloned) {
        setData((prev) => ({
          ...prev,
          projects: [...prev.projects, cloned].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return cloned;
    } catch {
      return null;
    }
  };

  const reorderProjects = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const success = await projectService.reorderProjects(orderedIds);
      if (success) {
        setData((prev) => {
          const map = new Map(prev.projects.map((p) => [p.id, p]));
          const reordered: Project[] = [];
          orderedIds.forEach((id, index) => {
            const item = map.get(id);
            if (item) {
              reordered.push({ ...item, order: index + 1, number: String(index + 1).padStart(2, '0') });
            }
          });
          return {
            ...prev,
            projects: reordered,
          };
        });
      }
      return success;
    } catch {
      return false;
    }
  };

  const togglePublishProject = async (id: string): Promise<boolean> => {
    try {
      const target = data.projects.find((p) => p.id === id);
      if (!target) return false;
      const nextPublished = !target.published;
      return updateProject(id, { published: nextPublished });
    } catch {
      return false;
    }
  };

  const toggleFeaturedProject = async (id: string): Promise<boolean> => {
    try {
      const target = data.projects.find((p) => p.id === id);
      if (!target) return false;
      const nextFeatured = !target.featured;
      return updateProject(id, { featured: nextFeatured });
    } catch {
      return false;
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        data,
        loading,
        error,
        refreshData,
        updateHero,
        updateAbout,
        updateMarquee,
        updateSectionVisibility,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        reorderProjects,
        togglePublishProject,
        toggleFeaturedProject,
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    return {
      data: defaultWebsiteData,
      loading: false,
      error: null,
      refreshData: async () => {},
      updateHero: async () => true,
      updateAbout: async () => true,
      updateMarquee: async () => true,
      updateSectionVisibility: () => {},
      createProject: async () => null,
      updateProject: async () => true,
      deleteProject: async () => true,
      duplicateProject: async () => null,
      reorderProjects: async () => true,
      togglePublishProject: async () => true,
      toggleFeaturedProject: async () => true,
    };
  }
  return context;
};

export default WebsiteDataContext;
