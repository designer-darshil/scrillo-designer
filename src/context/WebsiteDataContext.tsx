import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WebsiteData,
  HeroContent,
  AboutContent,
  MarqueeContent,
  Project,
  SkillCategory,
  SkillItem,
  Service,
  PhilosophyContent,
  ContactCTA,
  FooterContent,
  WebsiteSettings,
} from '../types';
import { defaultWebsiteData } from '../data/defaultWebsiteData';
import { websiteService } from '../admin/services/websiteService';
import { settingsService } from '../admin/services/settingsService';
import { projectService } from '../admin/services/projectService';
import { skillService } from '../admin/services/skillService';
import { servicesService } from '../admin/services/servicesService';

interface WebsiteDataContextType {
  data: WebsiteData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateHero: (hero: HeroContent) => Promise<boolean>;
  updateAbout: (about: AboutContent) => Promise<boolean>;
  updateMarquee: (marquee: MarqueeContent) => Promise<boolean>;
  updatePhilosophy: (philosophy: PhilosophyContent) => Promise<boolean>;
  updateContactCTA: (contact: ContactCTA) => Promise<boolean>;
  updateFooter: (footer: FooterContent) => Promise<boolean>;
  updateSettings: (settings: WebsiteSettings) => Promise<boolean>;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
  // Project methods
  createProject: (project: Omit<Project, 'id'> & { id?: string }) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  duplicateProject: (id: string) => Promise<Project | null>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;
  togglePublishProject: (id: string) => Promise<boolean>;
  toggleFeaturedProject: (id: string) => Promise<boolean>;
  // Skill Category & Skill Item methods
  createSkillCategory: (category: Omit<SkillCategory, 'id'> & { id?: string }) => Promise<SkillCategory | null>;
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => Promise<boolean>;
  deleteSkillCategory: (id: string) => Promise<boolean>;
  duplicateSkillCategory: (id: string) => Promise<SkillCategory | null>;
  reorderSkillCategories: (orderedCategoryIds: string[]) => Promise<boolean>;
  toggleSkillCategoryVisibility: (id: string) => Promise<boolean>;
  addSkillItem: (categoryId: string, item: Omit<SkillItem, 'index'> & { index?: string }) => Promise<boolean>;
  updateSkillItem: (categoryId: string, skillIndex: number, updates: Partial<SkillItem>) => Promise<boolean>;
  deleteSkillItem: (categoryId: string, skillIndex: number) => Promise<boolean>;
  reorderSkillItems: (categoryId: string, newItems: SkillItem[]) => Promise<boolean>;
  toggleSkillVisibility: (categoryId: string, skillIndex: number) => Promise<boolean>;
  // Service methods
  createService: (service: Omit<Service, 'id'> & { id?: string }) => Promise<Service | null>;
  updateService: (id: string, updates: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  duplicateService: (id: string) => Promise<Service | null>;
  reorderServices: (orderedIds: string[]) => Promise<boolean>;
  toggleServiceVisibility: (id: string) => Promise<boolean>;
}

const WebsiteDataContext = createContext<WebsiteDataContextType>({
  data: defaultWebsiteData,
  loading: false,
  error: null,
  refreshData: async () => {},
  updateHero: async () => true,
  updateAbout: async () => true,
  updateMarquee: async () => true,
  updatePhilosophy: async () => true,
  updateContactCTA: async () => true,
  updateFooter: async () => true,
  updateSettings: async () => true,
  updateSectionVisibility: () => {},
  createProject: async () => null,
  updateProject: async () => true,
  deleteProject: async () => true,
  duplicateProject: async () => null,
  reorderProjects: async () => true,
  togglePublishProject: async () => true,
  toggleFeaturedProject: async () => true,
  createSkillCategory: async () => null,
  updateSkillCategory: async () => true,
  deleteSkillCategory: async () => true,
  duplicateSkillCategory: async () => null,
  reorderSkillCategories: async () => true,
  toggleSkillCategoryVisibility: async () => true,
  addSkillItem: async () => true,
  updateSkillItem: async () => true,
  deleteSkillItem: async () => true,
  reorderSkillItems: async () => true,
  toggleSkillVisibility: async () => true,
  createService: async () => null,
  updateService: async () => true,
  deleteService: async () => true,
  duplicateService: async () => null,
  reorderServices: async () => true,
  toggleServiceVisibility: async () => true,
});

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData>(defaultWebsiteData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [remoteData, projects, skills, services, settings] = await Promise.all([
        websiteService.getWebsiteData(),
        projectService.getProjects(),
        skillService.getSkillCategories(),
        servicesService.getServices(),
        settingsService.getSettings(),
      ]);

      setData((prev) => ({
        ...prev,
        settings: settings || prev.settings,
        hero: remoteData.hero || prev.hero,
        about: remoteData.about || prev.about,
        marquee: remoteData.marquee || prev.marquee,
        philosophy: remoteData.philosophy || prev.philosophy,
        contact: remoteData.contact || prev.contact,
        projects: projects && projects.length > 0 ? projects : prev.projects,
        skills: skills && skills.length > 0 ? skills : prev.skills,
        services: services && services.length > 0 ? services : prev.services,
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

  const updatePhilosophy = async (philosophy: PhilosophyContent): Promise<boolean> => {
    try {
      const success = await websiteService.updatePhilosophyContent(philosophy);
      if (success) {
        setData((prev) => ({ ...prev, philosophy }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateContactCTA = async (contact: ContactCTA): Promise<boolean> => {
    try {
      const success = await websiteService.updateContactCTAContent(contact);
      if (success) {
        setData((prev) => ({ ...prev, contact }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateFooter = async (footer: FooterContent): Promise<boolean> => {
    try {
      const success = await websiteService.updateFooterContent(footer);
      if (success) {
        setData((prev) => ({ ...prev, footer }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateSettings = async (settings: WebsiteSettings): Promise<boolean> => {
    try {
      const success = await settingsService.updateSettings(settings);
      if (success) {
        setData((prev) => ({ ...prev, settings }));
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

  // --- Project Methods ---
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

  // --- Skills Methods ---
  const createSkillCategory = async (
    categoryData: Omit<SkillCategory, 'id'> & { id?: string }
  ): Promise<SkillCategory | null> => {
    try {
      const created = await skillService.createSkillCategory(categoryData);
      if (created) {
        setData((prev) => ({
          ...prev,
          skills: [...prev.skills, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return created;
    } catch {
      return null;
    }
  };

  const updateSkillCategory = async (id: string, updates: Partial<SkillCategory>): Promise<boolean> => {
    try {
      const success = await skillService.updateSkillCategory(id, updates);
      if (success) {
        setData((prev) => ({
          ...prev,
          skills: prev.skills.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const deleteSkillCategory = async (id: string): Promise<boolean> => {
    try {
      const success = await skillService.deleteSkillCategory(id);
      if (success) {
        setData((prev) => ({
          ...prev,
          skills: prev.skills.filter((c) => c.id !== id),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const duplicateSkillCategory = async (id: string): Promise<SkillCategory | null> => {
    try {
      const cloned = await skillService.duplicateSkillCategory(id);
      if (cloned) {
        setData((prev) => ({
          ...prev,
          skills: [...prev.skills, cloned].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return cloned;
    } catch {
      return null;
    }
  };

  const reorderSkillCategories = async (orderedCategoryIds: string[]): Promise<boolean> => {
    try {
      const success = await skillService.reorderSkillCategories(orderedCategoryIds);
      if (success) {
        setData((prev) => {
          const map = new Map(prev.skills.map((c) => [c.id, c]));
          const reordered: SkillCategory[] = [];
          orderedCategoryIds.forEach((id, index) => {
            const item = map.get(id);
            if (item) {
              reordered.push({ ...item, order: index + 1, number: String(index + 1).padStart(2, '0') });
            }
          });
          return {
            ...prev,
            skills: reordered,
          };
        });
      }
      return success;
    } catch {
      return false;
    }
  };

  const toggleSkillCategoryVisibility = async (id: string): Promise<boolean> => {
    try {
      const target = data.skills.find((c) => c.id === id);
      if (!target) return false;
      const nextVisible = !target.visible;
      return updateSkillCategory(id, { visible: nextVisible });
    } catch {
      return false;
    }
  };

  const addSkillItem = async (
    categoryId: string,
    item: Omit<SkillItem, 'index'> & { index?: string }
  ): Promise<boolean> => {
    try {
      const success = await skillService.addSkillItem(categoryId, item);
      if (success) {
        const updatedSkills = await skillService.getSkillCategories();
        setData((prev) => ({ ...prev, skills: updatedSkills }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateSkillItem = async (
    categoryId: string,
    skillIndex: number,
    updates: Partial<SkillItem>
  ): Promise<boolean> => {
    try {
      const success = await skillService.updateSkillItem(categoryId, skillIndex, updates);
      if (success) {
        const updatedSkills = await skillService.getSkillCategories();
        setData((prev) => ({ ...prev, skills: updatedSkills }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const deleteSkillItem = async (categoryId: string, skillIndex: number): Promise<boolean> => {
    try {
      const success = await skillService.deleteSkillItem(categoryId, skillIndex);
      if (success) {
        const updatedSkills = await skillService.getSkillCategories();
        setData((prev) => ({ ...prev, skills: updatedSkills }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const reorderSkillItems = async (categoryId: string, newItems: SkillItem[]): Promise<boolean> => {
    try {
      const success = await skillService.reorderSkillItems(categoryId, newItems);
      if (success) {
        const updatedSkills = await skillService.getSkillCategories();
        setData((prev) => ({ ...prev, skills: updatedSkills }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const toggleSkillVisibility = async (categoryId: string, skillIndex: number): Promise<boolean> => {
    try {
      const success = await skillService.toggleSkillVisibility(categoryId, skillIndex);
      if (success) {
        const updatedSkills = await skillService.getSkillCategories();
        setData((prev) => ({ ...prev, skills: updatedSkills }));
      }
      return success;
    } catch {
      return false;
    }
  };

  // --- Services Methods ---
  const createService = async (serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service | null> => {
    try {
      const created = await servicesService.createService(serviceData);
      if (created) {
        setData((prev) => ({
          ...prev,
          services: [...prev.services, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return created;
    } catch {
      return null;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>): Promise<boolean> => {
    try {
      const success = await servicesService.updateService(id, updates);
      if (success) {
        setData((prev) => ({
          ...prev,
          services: prev.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      const success = await servicesService.deleteService(id);
      if (success) {
        setData((prev) => ({
          ...prev,
          services: prev.services.filter((s) => s.id !== id),
        }));
      }
      return success;
    } catch {
      return false;
    }
  };

  const duplicateService = async (id: string): Promise<Service | null> => {
    try {
      const cloned = await servicesService.duplicateService(id);
      if (cloned) {
        setData((prev) => ({
          ...prev,
          services: [...prev.services, cloned].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }));
      }
      return cloned;
    } catch {
      return null;
    }
  };

  const reorderServices = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const success = await servicesService.reorderServices(orderedIds);
      if (success) {
        setData((prev) => {
          const map = new Map(prev.services.map((s) => [s.id, s]));
          const reordered: Service[] = [];
          orderedIds.forEach((id, index) => {
            const item = map.get(id);
            if (item) {
              reordered.push({ ...item, order: index + 1, number: String(index + 1).padStart(2, '0') });
            }
          });
          return {
            ...prev,
            services: reordered,
          };
        });
      }
      return success;
    } catch {
      return false;
    }
  };

  const toggleServiceVisibility = async (id: string): Promise<boolean> => {
    try {
      const target = data.services.find((s) => s.id === id);
      if (!target) return false;
      const nextVisible = !target.visible;
      return updateService(id, { visible: nextVisible });
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
        updatePhilosophy,
        updateContactCTA,
        updateFooter,
        updateSettings,
        updateSectionVisibility,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        reorderProjects,
        togglePublishProject,
        toggleFeaturedProject,
        createSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        duplicateSkillCategory,
        reorderSkillCategories,
        toggleSkillCategoryVisibility,
        addSkillItem,
        updateSkillItem,
        deleteSkillItem,
        reorderSkillItems,
        toggleSkillVisibility,
        createService,
        updateService,
        deleteService,
        duplicateService,
        reorderServices,
        toggleServiceVisibility,
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
      updatePhilosophy: async () => true,
      updateContactCTA: async () => true,
      updateFooter: async () => true,
      updateSettings: async () => true,
      updateSectionVisibility: () => {},
      createProject: async () => null,
      updateProject: async () => true,
      deleteProject: async () => true,
      duplicateProject: async () => null,
      reorderProjects: async () => true,
      togglePublishProject: async () => true,
      toggleFeaturedProject: async () => true,
      createSkillCategory: async () => null,
      updateSkillCategory: async () => true,
      deleteSkillCategory: async () => true,
      duplicateSkillCategory: async () => null,
      reorderSkillCategories: async () => true,
      toggleSkillCategoryVisibility: async () => true,
      addSkillItem: async () => true,
      updateSkillItem: async () => true,
      deleteSkillItem: async () => true,
      reorderSkillItems: async () => true,
      toggleSkillVisibility: async () => true,
      createService: async () => null,
      updateService: async () => true,
      deleteService: async () => true,
      duplicateService: async () => null,
      reorderServices: async () => true,
      toggleServiceVisibility: async () => true,
    };
  }
  return context;
};

export default WebsiteDataContext;
