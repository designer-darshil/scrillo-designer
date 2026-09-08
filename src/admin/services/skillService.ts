import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SkillCategory, SkillItem } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

// Memory store for skill categories initialized from defaultWebsiteData
const memorySkillsStore: SkillCategory[] = JSON.parse(JSON.stringify(defaultWebsiteData.skills));

export const skillService = {
  /**
   * Fetch all skill categories sorted by order ASC
   */
  async getSkillCategories(): Promise<SkillCategory[]> {
    if (!isSupabaseConfigured) {
      return [...memorySkillsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    try {
      const { data, error } = await supabase.from('skill_categories').select('*').order('order', { ascending: true });
      if (error || !data || data.length === 0) {
        return [...memorySkillsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }

      memorySkillsStore.length = 0;
      data.forEach((item) => memorySkillsStore.push(item as SkillCategory));
      return data as SkillCategory[];
    } catch {
      return [...memorySkillsStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  },

  /**
   * Get single category by ID
   */
  async getSkillCategoryById(id: string): Promise<SkillCategory | null> {
    const local = memorySkillsStore.find((c) => c.id === id);
    if (!isSupabaseConfigured) return local ? { ...local } : null;

    try {
      const { data, error } = await supabase.from('skill_categories').select('*').eq('id', id).single();
      if (error || !data) return local ? { ...local } : null;
      return data as SkillCategory;
    } catch {
      return local ? { ...local } : null;
    }
  },

  /**
   * Create new skill category
   */
  async createSkillCategory(
    categoryData: Omit<SkillCategory, 'id'> & { id?: string }
  ): Promise<SkillCategory | null> {
    const nextOrder =
      memorySkillsStore.length > 0 ? Math.max(...memorySkillsStore.map((c) => c.order ?? 0)) + 1 : 1;

    const newCategory: SkillCategory = {
      ...categoryData,
      id: categoryData.id || `skill-cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      number: categoryData.number || String(nextOrder).padStart(2, '0'),
      order: categoryData.order ?? nextOrder,
      visible: categoryData.visible ?? true,
      items: categoryData.items || [],
      skills: categoryData.items || [],
      count: String((categoryData.items || []).length).padStart(2, '0'),
    };

    memorySkillsStore.push(newCategory);

    if (!isSupabaseConfigured) return newCategory;

    try {
      const { data, error } = await supabase.from('skill_categories').insert([newCategory]).select().single();
      if (error) return newCategory;
      return data as SkillCategory;
    } catch {
      return newCategory;
    }
  },

  /**
   * Update category
   */
  async updateSkillCategory(id: string, updates: Partial<SkillCategory>): Promise<boolean> {
    const index = memorySkillsStore.findIndex((c) => c.id === id);
    if (index !== -1) {
      const items = updates.items || updates.skills || memorySkillsStore[index].items;
      memorySkillsStore[index] = {
        ...memorySkillsStore[index],
        ...updates,
        items,
        skills: items,
        count: String(items.length).padStart(2, '0'),
      };
    }

    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('skill_categories').update(updates).eq('id', id);
      return !error;
    } catch {
      return true;
    }
  },

  /**
   * Delete category
   */
  async deleteSkillCategory(id: string): Promise<boolean> {
    const index = memorySkillsStore.findIndex((c) => c.id === id);
    if (index !== -1) {
      memorySkillsStore.splice(index, 1);
    }

    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('skill_categories').delete().eq('id', id);
      return !error;
    } catch {
      return true;
    }
  },

  /**
   * Duplicate category
   */
  async duplicateSkillCategory(id: string): Promise<SkillCategory | null> {
    const source = memorySkillsStore.find((c) => c.id === id);
    if (!source) return null;

    const maxOrder =
      memorySkillsStore.length > 0 ? Math.max(...memorySkillsStore.map((c) => c.order ?? 0)) + 1 : 1;

    const duplicatedData: Omit<SkillCategory, 'id'> = {
      ...source,
      title: `${source.title} (Copy)`,
      number: String(maxOrder).padStart(2, '0'),
      order: maxOrder,
      items: JSON.parse(JSON.stringify(source.items || [])),
      skills: JSON.parse(JSON.stringify(source.items || [])),
    };

    return this.createSkillCategory(duplicatedData);
  },

  /**
   * Reorder categories
   */
  async reorderSkillCategories(orderedCategoryIds: string[]): Promise<boolean> {
    orderedCategoryIds.forEach((id, index) => {
      const cat = memorySkillsStore.find((c) => c.id === id);
      if (cat) {
        cat.order = index + 1;
        cat.number = String(index + 1).padStart(2, '0');
      }
    });

    if (!isSupabaseConfigured) return true;

    try {
      const updates = orderedCategoryIds.map((id, index) =>
        supabase
          .from('skill_categories')
          .update({ order: index + 1, number: String(index + 1).padStart(2, '0') })
          .eq('id', id)
      );
      await Promise.all(updates);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Add skill item to category
   */
  async addSkillItem(
    categoryId: string,
    item: Omit<SkillItem, 'index'> & { index?: string }
  ): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === categoryId);
    if (!cat) return false;

    const currentItems = cat.items || cat.skills || [];
    const nextIdx = currentItems.length + 1;
    const newItem: SkillItem = {
      ...item,
      id: item.id || `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: item.name || item.title || '',
      title: item.title || item.name || '',
      index: item.index || String(nextIdx).padStart(2, '0'),
      visible: item.visible ?? true,
      order: item.order ?? nextIdx,
      image:
        item.image ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    };

    const updatedItems = [...currentItems, newItem];
    return this.updateSkillCategory(categoryId, { items: updatedItems });
  },

  /**
   * Update skill item in category
   */
  async updateSkillItem(
    categoryId: string,
    skillIndex: number,
    updates: Partial<SkillItem>
  ): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === categoryId);
    if (!cat) return false;

    const currentItems = [...(cat.items || cat.skills || [])];
    if (skillIndex < 0 || skillIndex >= currentItems.length) return false;

    const updatedItem = {
      ...currentItems[skillIndex],
      ...updates,
      name: updates.name || updates.title || currentItems[skillIndex].name,
      title: updates.title || updates.name || currentItems[skillIndex].title,
    };
    currentItems[skillIndex] = updatedItem;

    return this.updateSkillCategory(categoryId, { items: currentItems });
  },

  /**
   * Delete skill item from category
   */
  async deleteSkillItem(categoryId: string, skillIndex: number): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === categoryId);
    if (!cat) return false;

    const currentItems = (cat.items || cat.skills || []).filter((_, i) => i !== skillIndex);
    // Renumber remaining items
    const reindexed = currentItems.map((item, idx) => ({
      ...item,
      index: String(idx + 1).padStart(2, '0'),
      order: idx + 1,
    }));

    return this.updateSkillCategory(categoryId, { items: reindexed });
  },

  /**
   * Reorder skill items within category
   */
  async reorderSkillItems(categoryId: string, newItems: SkillItem[]): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === categoryId);
    if (!cat) return false;

    const reindexed = newItems.map((item, idx) => ({
      ...item,
      index: String(idx + 1).padStart(2, '0'),
      order: idx + 1,
    }));

    return this.updateSkillCategory(categoryId, { items: reindexed });
  },

  /**
   * Toggle category visibility
   */
  async toggleCategoryVisibility(id: string): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === id);
    if (!cat) return false;
    return this.updateSkillCategory(id, { visible: !cat.visible });
  },

  /**
   * Toggle skill item visibility
   */
  async toggleSkillVisibility(categoryId: string, skillIndex: number): Promise<boolean> {
    const cat = memorySkillsStore.find((c) => c.id === categoryId);
    if (!cat) return false;
    const currentItems = [...(cat.items || cat.skills || [])];
    if (skillIndex < 0 || skillIndex >= currentItems.length) return false;

    const currentVisible = currentItems[skillIndex].visible !== false;
    currentItems[skillIndex] = {
      ...currentItems[skillIndex],
      visible: !currentVisible,
    };

    return this.updateSkillCategory(categoryId, { items: currentItems });
  },
};

export default skillService;
