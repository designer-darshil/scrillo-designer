import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Service } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

// In-memory store for services initialized from defaultWebsiteData
const memoryServicesStore: Service[] = JSON.parse(JSON.stringify(defaultWebsiteData.services));

export const servicesService = {
  /**
   * Fetch all services ordered by order ASC
   */
  async getServices(): Promise<Service[]> {
    if (!isSupabaseConfigured) {
      return [...memoryServicesStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    try {
      const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
      if (error || !data || data.length === 0) {
        return [...memoryServicesStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }

      memoryServicesStore.length = 0;
      data.forEach((item) => memoryServicesStore.push(item as Service));
      return data as Service[];
    } catch {
      return [...memoryServicesStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  },

  /**
   * Get single service by ID
   */
  async getServiceById(id: string): Promise<Service | null> {
    const local = memoryServicesStore.find((s) => s.id === id);
    if (!isSupabaseConfigured) return local ? { ...local } : null;

    try {
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
      if (error || !data) return local ? { ...local } : null;
      return data as Service;
    } catch {
      return local ? { ...local } : null;
    }
  },

  /**
   * Create a new service
   */
  async createService(serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service | null> {
    const nextOrder =
      memoryServicesStore.length > 0
        ? Math.max(...memoryServicesStore.map((s) => s.order ?? 0)) + 1
        : 1;

    const newService: Service = {
      ...serviceData,
      id: serviceData.id || `svc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      number: serviceData.number || String(nextOrder).padStart(2, '0'),
      order: serviceData.order ?? nextOrder,
      visible: serviceData.visible ?? true,
      deliverables: serviceData.deliverables || [],
      icon: serviceData.icon || 'Briefcase',
    };

    memoryServicesStore.push(newService);

    if (!isSupabaseConfigured) return newService;

    try {
      const { data, error } = await supabase.from('services').insert([newService]).select().single();
      if (error) return newService;
      return data as Service;
    } catch {
      return newService;
    }
  },

  /**
   * Update service
   */
  async updateService(id: string, updates: Partial<Service>): Promise<boolean> {
    const index = memoryServicesStore.findIndex((s) => s.id === id);
    if (index !== -1) {
      memoryServicesStore[index] = {
        ...memoryServicesStore[index],
        ...updates,
      };
    }

    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('services').update(updates).eq('id', id);
      return !error;
    } catch {
      return true;
    }
  },

  /**
   * Delete service
   */
  async deleteService(id: string): Promise<boolean> {
    const index = memoryServicesStore.findIndex((s) => s.id === id);
    if (index !== -1) {
      memoryServicesStore.splice(index, 1);
    }

    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      return !error;
    } catch {
      return true;
    }
  },

  /**
   * Duplicate service
   */
  async duplicateService(id: string): Promise<Service | null> {
    const source = memoryServicesStore.find((s) => s.id === id);
    if (!source) return null;

    const nextOrder =
      memoryServicesStore.length > 0
        ? Math.max(...memoryServicesStore.map((s) => s.order ?? 0)) + 1
        : 1;

    const duplicatedData: Omit<Service, 'id'> = {
      ...source,
      title: `${source.title} (Copy)`,
      number: String(nextOrder).padStart(2, '0'),
      order: nextOrder,
      deliverables: JSON.parse(JSON.stringify(source.deliverables || [])),
    };

    return this.createService(duplicatedData);
  },

  /**
   * Reorder services batch
   */
  async reorderServices(orderedIds: string[]): Promise<boolean> {
    orderedIds.forEach((id, index) => {
      const svc = memoryServicesStore.find((s) => s.id === id);
      if (svc) {
        svc.order = index + 1;
        svc.number = String(index + 1).padStart(2, '0');
      }
    });

    if (!isSupabaseConfigured) return true;

    try {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('services')
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
   * Toggle visibility
   */
  async toggleVisibility(id: string): Promise<boolean> {
    const svc = memoryServicesStore.find((s) => s.id === id);
    if (!svc) return false;
    return this.updateService(id, { visible: !svc.visible });
  },
};

export default servicesService;
