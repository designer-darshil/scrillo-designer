import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export type ActivityAction =
  | 'Project created'
  | 'Project updated'
  | 'Project published'
  | 'Project deleted'
  | 'Project duplicated'
  | 'Image uploaded'
  | 'Media deleted'
  | 'Settings changed'
  | 'Section updated'
  | 'Content published'
  | 'Draft reverted';

export interface ActivityEvent {
  id: string;
  action: ActivityAction | string;
  item: string;
  section: string;
  user: string;
  timestamp: string; // ISO string
  status?: 'Published' | 'Draft' | 'Updated' | 'Deleted' | 'Uploaded' | 'Synced';
}

const ACTIVITY_STORAGE_KEY = 'scrillo_activity_log';

// Initial realistic default activities
const defaultActivities: ActivityEvent[] = [
  {
    id: 'act-init-1',
    action: 'Content published',
    item: 'Live portfolio snapshot version 2.4.0',
    section: 'Publish Engine',
    user: 'admin@scrillo.design',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    status: 'Published',
  },
  {
    id: 'act-init-2',
    action: 'Project updated',
    item: 'Aura Studio — Spatial Architecture',
    section: 'Projects',
    user: 'admin@scrillo.design',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // ~1.5 hours ago
    status: 'Updated',
  },
  {
    id: 'act-init-3',
    action: 'Image uploaded',
    item: 'abstract-minimal-fluid.webp (1.4 MB)',
    section: 'Media Library',
    user: 'admin@scrillo.design',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    status: 'Uploaded',
  },
  {
    id: 'act-init-4',
    action: 'Settings changed',
    item: 'Theme color variables & animation speeds',
    section: 'System Settings',
    user: 'admin@scrillo.design',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    status: 'Updated',
  },
  {
    id: 'act-init-5',
    action: 'Project created',
    item: 'Nexus AI — Generative Engine',
    section: 'Projects',
    user: 'admin@scrillo.design',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    status: 'Published',
  },
];

// In-memory array
let memoryActivities: ActivityEvent[] = [];

// Initialize memory from localStorage or defaults
try {
  const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  if (stored) {
    memoryActivities = JSON.parse(stored);
  } else {
    memoryActivities = [...defaultActivities];
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(memoryActivities));
  }
} catch {
  memoryActivities = [...defaultActivities];
}

export const activityService = {
  /**
   * Log a new activity event
   */
  async logActivity(
    event: Omit<ActivityEvent, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): Promise<ActivityEvent> {
    const newActivity: ActivityEvent = {
      id: event.id || `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action: event.action,
      item: event.item,
      section: event.section || 'General',
      user: event.user || 'admin@scrillo.design',
      timestamp: event.timestamp || new Date().toISOString(),
      status: event.status || 'Updated',
    };

    memoryActivities.unshift(newActivity);
    // Keep maximum 100 records
    if (memoryActivities.length > 100) {
      memoryActivities = memoryActivities.slice(0, 100);
    }

    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(memoryActivities));
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('activity_log').insert([
          {
            id: newActivity.id,
            action: newActivity.action,
            item: newActivity.item,
            section: newActivity.section,
            user_email: newActivity.user,
            status: newActivity.status,
            created_at: newActivity.timestamp,
          },
        ]);
      } catch (err) {
        console.warn('Supabase activity log insert warning:', err);
      }
    }

    return newActivity;
  },

  /**
   * Fetch recent activity log
   */
  async getRecentActivities(limit: number = 20): Promise<ActivityEvent[]> {
    if (!isSupabaseConfigured) {
      return [...memoryActivities].slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return [...memoryActivities].slice(0, limit);
      }

      const remoteActivities: ActivityEvent[] = data.map((d) => ({
        id: d.id || `act-${d.created_at}`,
        action: d.action,
        item: d.item,
        section: d.section || 'General',
        user: d.user_email || d.user || 'admin@scrillo.design',
        timestamp: d.created_at || new Date().toISOString(),
        status: d.status || 'Updated',
      }));

      // Cache
      memoryActivities = remoteActivities;
      try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(remoteActivities));
      } catch {
        // Ignore
      }

      return remoteActivities;
    } catch {
      return [...memoryActivities].slice(0, limit);
    }
  },

  /**
   * Clear activities
   */
  async clearActivities(): Promise<void> {
    memoryActivities = [];
    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};

export default activityService;
