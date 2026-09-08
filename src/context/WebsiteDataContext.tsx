import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteData, SectionSetting } from '../types';
import { defaultWebsiteData } from '../data/defaultWebsiteData';

interface WebsiteDataContextType {
  data: WebsiteData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
}

const WebsiteDataContext = createContext<WebsiteDataContextType>({
  data: defaultWebsiteData,
  loading: false,
  error: null,
  refreshData: async () => {},
  updateSectionVisibility: () => {},
});

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WebsiteData>(defaultWebsiteData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    // In future iterations, fetch from Supabase if connected
    try {
      setLoading(true);
      // fallback to current local data
      setData(defaultWebsiteData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load website data');
    } finally {
      setLoading(false);
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
      updateSectionVisibility: () => {},
    };
  }
  return context;
};

export default WebsiteDataContext;
