import { PortfolioCategory } from '../../types';
import { websiteService } from './websiteService';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

export const categoryService = {
  async getCategories(): Promise<PortfolioCategory[]> {
    const cats = await websiteService.getCategories();
    return cats || defaultWebsiteData.categories || [];
  },

  async updateCategories(categories: PortfolioCategory[]): Promise<boolean> {
    return websiteService.updateCategories(categories);
  },

  async addCategory(categoryData: Omit<PortfolioCategory, 'id' | 'order'> & { id?: string; order?: number }): Promise<PortfolioCategory[]> {
    const current = await this.getCategories();
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: PortfolioCategory = {
      id: categoryData.id || `cat-${Date.now()}`,
      name: categoryData.name,
      slug,
      description: categoryData.description || '',
      order: categoryData.order || current.length + 1,
      visible: categoryData.visible !== false,
    };
    const updated = [...current, newCat];
    await this.updateCategories(updated);
    return updated;
  },

  async deleteCategory(id: string): Promise<PortfolioCategory[]> {
    const current = await this.getCategories();
    const updated = current.filter((c) => c.id !== id);
    await this.updateCategories(updated);
    return updated;
  },
};

export default categoryService;
