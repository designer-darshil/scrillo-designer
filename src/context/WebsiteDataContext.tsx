import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteData, HeroContent, AboutContent, MarqueeContent } from '../types';
import { defaultWebsiteData } from '../data/defaultWebsiteData';
import { websiteService } from '../admin/services/websiteService';

interface WebsiteDataContextType {
  data: WebsiteData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateHero: (hero: HeroContent) => Promise<boolean>;
  updateAbout: (about: AboutContent) => Promise<boolean>;
  updateMarquee: (marquee: MarqueeContent) => Promise<boolean>;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
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
});

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData>(defaultWebsiteData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const remoteData = await websiteService.getWebsiteData();
      setData((prev) => ({
        ...prev,
        hero: remoteData.hero || prev.hero,
        about: remoteData.about || prev.about,
        marquee: remoteData.marquee || prev.marquee,
      }));
    } catch (err: any) {
      setError(err?.message || 'Failed to load website data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
    };
  }
  return context;
};

export default WebsiteDataContext;

