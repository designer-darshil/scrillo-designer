import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WebsiteData } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { activityService } from './activityService';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  category?: 'profile' | 'cover' | 'project' | 'general' | string;
  source?: 'Resume' | 'Upload' | 'Unsplash' | string;
  status?: 'active' | 'archived' | string;
  format: 'PNG' | 'JPG' | 'JPEG' | 'WEBP' | 'SVG';
  size: number;
  sizeFormatted: string;
  dimensions: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const initialMediaAssets: MediaAsset[] = [
  {
    id: 'media-darshil-profile',
    name: 'darshil-profile.jpg',
    url: '/images/darshil-profile.jpg',
    type: 'image/jpeg',
    category: 'profile',
    source: 'Resume',
    status: 'active',
    format: 'JPG',
    size: 411111,
    sizeFormatted: '401 KB',
    dimensions: '1200 × 1200',
    width: 1200,
    height: 1200,
    uploadedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'media-darshil-cover',
    name: 'darshil-cover.png',
    url: '/images/darshil-cover.png',
    type: 'image/png',
    category: 'cover',
    source: 'Resume',
    status: 'active',
    format: 'PNG',
    size: 688000,
    sizeFormatted: '672 KB',
    dimensions: '4032 × 2268',
    width: 4032,
    height: 2268,
    uploadedAt: '2026-03-01T10:05:00Z',
  },
  {
    id: 'media-1',
    name: 'abstract-minimal-fluid.webp',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    category: 'project',
    source: 'Unsplash',
    status: 'active',
    format: 'WEBP',
    size: 1420000,
    sizeFormatted: '1.4 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-15T14:30:00Z',
  },
  {
    id: 'media-2',
    name: 'mono-ai-spatial.webp',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    format: 'WEBP',
    size: 1850000,
    sizeFormatted: '1.8 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-18T10:15:00Z',
  },
  {
    id: 'media-3',
    name: 'flux-tokyo-architecture.webp',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    format: 'WEBP',
    size: 2100000,
    sizeFormatted: '2.0 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-20T16:45:00Z',
  },
  {
    id: 'media-4',
    name: 'monochrome-monolith.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=85',
    type: 'image/jpeg',
    format: 'JPG',
    size: 3400000,
    sizeFormatted: '3.4 MB',
    dimensions: '2400 × 1600',
    width: 2400,
    height: 1600,
    uploadedAt: '2026-01-10T09:20:00Z',
  },
  {
    id: 'media-5',
    name: 'clean-studio-specimen.webp',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    format: 'WEBP',
    size: 980000,
    sizeFormatted: '980 KB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-01-25T11:00:00Z',
  },
  {
    id: 'media-6',
    name: 'brutalist-monolith-spatial.webp',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    format: 'WEBP',
    size: 1650000,
    sizeFormatted: '1.6 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-05T13:10:00Z',
  },
  {
    id: 'media-7',
    name: 'typography-void-dark.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    type: 'image/jpeg',
    format: 'JPG',
    size: 1120000,
    sizeFormatted: '1.1 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-12T08:30:00Z',
  },
  {
    id: 'media-8',
    name: 'kinetic-light-stream.webp',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    type: 'image/webp',
    format: 'WEBP',
    size: 1380000,
    sizeFormatted: '1.3 MB',
    dimensions: '1200 × 800',
    width: 1200,
    height: 800,
    uploadedAt: '2026-02-22T17:00:00Z',
  },
];

// Memory store for media assets
const memoryMediaStore: MediaAsset[] = [...initialMediaAssets];

export const mediaService = {
  /**
   * Fetch all media assets
   */
  async getAssets(): Promise<MediaAsset[]> {
    if (!isSupabaseConfigured) {
      return [...memoryMediaStore];
    }

    try {
      // Try listing files from Supabase Storage bucket 'portfolio-media'
      const { data, error } = await supabase.storage.from('portfolio-media').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error || !data || data.length === 0) {
        return [...memoryMediaStore];
      }

      // Map Supabase storage files
      const storageAssets: MediaAsset[] = data
        .filter((file) => !file.name.startsWith('.'))
        .map((file) => {
          const { data: publicUrlData } = supabase.storage.from('portfolio-media').getPublicUrl(file.name);
          const ext = file.name.split('.').pop()?.toUpperCase() || 'WEBP';
          const format = (['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'].includes(ext) ? ext : 'WEBP') as any;
          const size = file.metadata?.size || 1024000;

          return {
            id: file.id || file.name,
            name: file.name,
            url: publicUrlData.publicUrl,
            type: file.metadata?.mimetype || `image/${ext.toLowerCase()}`,
            format,
            size,
            sizeFormatted: formatBytes(size),
            dimensions: '1920 × 1080',
            uploadedAt: file.created_at || new Date().toISOString(),
          };
        });

      // Merge with memory store ensuring unique URLs
      const existingUrls = new Set(storageAssets.map((a) => a.url));
      memoryMediaStore.forEach((m) => {
        if (!existingUrls.has(m.url)) {
          storageAssets.push(m);
        }
      });

      return storageAssets;
    } catch {
      return [...memoryMediaStore];
    }
  },

  /**
   * Upload single image asset
   */
  async uploadAsset(file: File): Promise<MediaAsset | null> {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'WEBP';
    const format = (['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'].includes(ext) ? ext : 'WEBP') as any;
    const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Read image dimensions if browser permits
    let dimensions = '1920 × 1080';
    let width: number | undefined;
    let height: number | undefined;
    let dataUrl: string | null = null;

    try {
      const dimensionsPromise = new Promise<{ w: number; h: number; dataUrl: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            resolve({ w: img.width, h: img.height, dataUrl: result });
          };
          img.onerror = () => resolve({ w: 1920, h: 1080, dataUrl: result });
          img.src = result;
        };
        reader.readAsDataURL(file);
      });

      const res = await dimensionsPromise;
      width = res.w;
      height = res.h;
      dimensions = `${width} × ${height}`;
      dataUrl = res.dataUrl;
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.storage
          .from('portfolio-media')
          .upload(sanitizedName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage.from('portfolio-media').getPublicUrl(sanitizedName);
          const newAsset: MediaAsset = {
            id: `media-${Date.now()}`,
            name: file.name,
            url: publicData.publicUrl,
            type: file.type || `image/${ext.toLowerCase()}`,
            format,
            size: file.size,
            sizeFormatted: formatBytes(file.size),
            dimensions,
            width,
            height,
            uploadedAt: new Date().toISOString(),
          };
          memoryMediaStore.unshift(newAsset);
          activityService.logActivity({
            action: 'Image uploaded',
            item: `${newAsset.name} (${newAsset.sizeFormatted})`,
            section: 'Media Library',
            user: 'admin@scrillo.design',
            status: 'Uploaded',
          }).catch(() => {});
          return newAsset;
        }
      } catch (err) {
        console.warn('Supabase storage upload error, fallback to local store:', err);
      }
    }

    // Local / data URL fallback
    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: file.name,
      url: dataUrl || URL.createObjectURL(file),
      type: file.type || `image/${ext.toLowerCase()}`,
      format,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      dimensions,
      width,
      height,
      uploadedAt: new Date().toISOString(),
    };

    memoryMediaStore.unshift(newAsset);
    activityService.logActivity({
      action: 'Image uploaded',
      item: `${newAsset.name} (${newAsset.sizeFormatted})`,
      section: 'Media Library',
      user: 'admin@scrillo.design',
      status: 'Uploaded',
    }).catch(() => {});
    return newAsset;
  },

  /**
   * Upload multiple files concurrently
   */
  async uploadMultipleAssets(
    files: File[],
    onProgress?: (progress: number, currentFileName: string) => void
  ): Promise<MediaAsset[]> {
    const uploaded: MediaAsset[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 100), file.name);
      }
      const asset = await this.uploadAsset(file);
      if (asset) uploaded.push(asset);
    }
    return uploaded;
  },

  /**
   * Replace an existing asset with a new file
   */
  async replaceAsset(id: string, newFile: File): Promise<MediaAsset | null> {
    const existingIndex = memoryMediaStore.findIndex((a) => a.id === id);
    const newAsset = await this.uploadAsset(newFile);
    if (!newAsset) return null;

    if (existingIndex !== -1) {
      const existing = memoryMediaStore[existingIndex];
      // Keep identity & category metadata if existing
      newAsset.category = existing.category;
      newAsset.source = existing.source;
      newAsset.status = existing.status;
      memoryMediaStore[existingIndex] = newAsset;
    }

    activityService.logActivity({
      action: 'Media replaced',
      item: `${newAsset.name}`,
      section: 'Media Library',
      user: 'admin@scrillo.design',
      status: 'Updated',
    }).catch(() => {});

    return newAsset;
  },

  /**
   * Delete asset with memory store update
   */
  async deleteAsset(id: string, url: string): Promise<boolean> {
    const index = memoryMediaStore.findIndex((a) => a.id === id || a.url === url);
    let deletedName = 'Media Asset';
    if (index !== -1) {
      deletedName = memoryMediaStore[index].name;
      memoryMediaStore.splice(index, 1);
    }

    activityService.logActivity({
      action: 'Media deleted',
      item: deletedName,
      section: 'Media Library',
      user: 'admin@scrillo.design',
      status: 'Deleted',
    }).catch(() => {});

    if (!isSupabaseConfigured) return true;

    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('portfolio-media').remove([fileName]);
      }
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Check whether an asset is currently referenced by published portfolio content
   */
  checkAssetUsage(assetUrl: string, websiteData: WebsiteData): { inUse: boolean; references: string[] } {
    const references: string[] = [];

    // 1. Check Hero Image
    if (websiteData.hero?.heroImage && websiteData.hero.heroImage.includes(assetUrl)) {
      references.push('Hero Showcase Specimen');
    }

    // 2. Check Projects
    (websiteData.projects || []).forEach((proj) => {
      const isThumb = proj.thumbnail && proj.thumbnail.includes(assetUrl);
      const isCover = (proj.coverImage && proj.coverImage.includes(assetUrl)) || (proj.image && proj.image.includes(assetUrl));
      const inGallery = (proj.gallery || []).some((g) => g.includes(assetUrl));

      if (isThumb || isCover || inGallery) {
        references.push(`Project: ${proj.title} (${[isThumb && 'Thumbnail', isCover && 'Cover', inGallery && 'Gallery'].filter(Boolean).join(', ')})`);
      }
    });

    // 3. Check Skills Categories & Items
    (websiteData.skills || []).forEach((cat) => {
      const items = cat.items || cat.skills || [];
      items.forEach((skill) => {
        if (skill.image && skill.image.includes(assetUrl)) {
          references.push(`Skill: ${cat.title} → ${skill.name || skill.title}`);
        }
      });
    });

    // 4. Check Full Bleed Image Break
    if (websiteData.image?.image && websiteData.image.image.includes(assetUrl)) {
      references.push('Experimental Visual Study Break');
    }

    return {
      inUse: references.length > 0,
      references,
    };
  },
};

export default mediaService;
