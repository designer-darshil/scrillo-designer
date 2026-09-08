export * from '../../types';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

export type ProjectItem = import('../../types').Project;
export type ServiceScope = import('../../types').Service;
export type SiteSettings = import('../../types').WebsiteSettings;

