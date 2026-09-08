import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MediaAsset } from '../types';

export const mediaService = {
  async getMediaAssets(): Promise<MediaAsset[]> {
    if (!isSupabaseConfigured) {
      return [
        {
          id: '1',
          name: 'aurora-crm-mockup.webp',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          size: 245000,
          type: 'image/webp',
          createdAt: '2026-03-01T10:00:00Z',
        },
        {
          id: '2',
          name: 'mono-ai-platform.webp',
          url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
          size: 312000,
          type: 'image/webp',
          createdAt: '2026-03-02T12:00:00Z',
        },
      ];
    }
    try {
      const { data, error } = await supabase.storage.from('portfolio-media').list();
      if (error || !data) return [];
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        url: supabase.storage.from('portfolio-media').getPublicUrl(item.name).data.publicUrl,
        size: item.metadata?.size || 0,
        type: item.metadata?.mimetype || 'image/webp',
        createdAt: item.created_at,
      }));
    } catch {
      return [];
    }
  },

  async uploadMedia(file: File): Promise<string | null> {
    if (!isSupabaseConfigured) {
      return URL.createObjectURL(file);
    }
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('portfolio-media').upload(fileName, file);
      if (error || !data) return null;
      return supabase.storage.from('portfolio-media').getPublicUrl(fileName).data.publicUrl;
    } catch {
      return null;
    }
  },
};

export default mediaService;
