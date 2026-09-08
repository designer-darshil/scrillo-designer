import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WebsiteData, ContentDiffItem, ContentDiffSummary, Project } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { websiteService } from './websiteService';
import { projectService } from './projectService';
import { skillService } from './skillService';
import { servicesService } from './servicesService';
import { settingsService } from './settingsService';
import { activityService } from './activityService';

const PUBLISHED_STORAGE_KEY = 'portfolio-published-snapshot';
const LAST_PUBLISHED_KEY = 'portfolio-last-published-date';

// Initial memory stores for published & draft states
let memoryPublishedData: WebsiteData = JSON.parse(JSON.stringify(defaultWebsiteData));
let lastPublishedTimestamp: string = new Date(Date.now() - 86400000).toISOString(); // 1 day ago

// Hydrate from localStorage if available
try {
  const savedPub = localStorage.getItem(PUBLISHED_STORAGE_KEY);
  if (savedPub) {
    memoryPublishedData = JSON.parse(savedPub);
  }
  const savedDate = localStorage.getItem(LAST_PUBLISHED_KEY);
  if (savedDate) {
    lastPublishedTimestamp = savedDate;
  }
} catch {
  // Local storage not available
}

export const publishService = {
  /**
   * Get the current published snapshot (served to public visitors)
   */
  async getPublishedSnapshot(): Promise<WebsiteData> {
    if (!isSupabaseConfigured) {
      return JSON.parse(JSON.stringify(memoryPublishedData));
    }

    try {
      const { data, error } = await supabase.from('website_published').select('content, published_at').single();
      if (!error && data?.content) {
        memoryPublishedData = data.content as WebsiteData;
        if (data.published_at) {
          lastPublishedTimestamp = data.published_at;
        }
        return JSON.parse(JSON.stringify(memoryPublishedData));
      }
      return JSON.parse(JSON.stringify(memoryPublishedData));
    } catch {
      return JSON.parse(JSON.stringify(memoryPublishedData));
    }
  },

  /**
   * Compute comprehensive diff summary between draft and published datasets
   */
  computeContentDiff(draft: WebsiteData, published: WebsiteData = memoryPublishedData): ContentDiffSummary {
    const items: ContentDiffItem[] = [];

    // 1. Check Projects
    const draftProjects = draft.projects || [];
    const pubProjects = published.projects || [];
    const pubProjectsMap = new Map(pubProjects.map((p) => [p.id, p]));

    draftProjects.forEach((dp, index) => {
      const pp = pubProjectsMap.get(dp.id);
      if (!pp) {
        items.push({
          id: `proj-add-${dp.id}`,
          category: 'Projects',
          title: `Project Added: "${dp.title || 'Untitled'}"`,
          description: `Created new ${dp.category || 'Portfolio'} project case study.`,
          type: 'added',
        });
      } else {
        const titleChanged = dp.title !== pp.title;
        const pubChanged = dp.published !== pp.published;
        const featChanged = dp.featured !== pp.featured;
        const descChanged = dp.description !== pp.description;
        const orderChanged = dp.order !== pp.order;

        if (titleChanged || pubChanged || featChanged || descChanged) {
          items.push({
            id: `proj-mod-${dp.id}`,
            category: 'Projects',
            title: `Project Modified: "${dp.title}"`,
            description: [
              titleChanged && `Renamed from "${pp.title}"`,
              pubChanged && (dp.published ? 'Set to Published' : 'Set to Draft'),
              featChanged && (dp.featured ? 'Marked as Featured' : 'Removed from Featured'),
              descChanged && 'Description copy updated',
            ]
              .filter(Boolean)
              .join(' · '),
            type: 'modified',
          });
        } else if (orderChanged) {
          items.push({
            id: `proj-ord-${dp.id}`,
            category: 'Projects',
            title: `Project Reordered: "${dp.title}"`,
            description: `Moved from position #${pp.order} to #${dp.order}`,
            type: 'reordered',
          });
        }
      }
    });

    pubProjects.forEach((pp) => {
      if (!draftProjects.some((dp) => dp.id === pp.id)) {
        items.push({
          id: `proj-del-${pp.id}`,
          category: 'Projects',
          title: `Project Removed: "${pp.title}"`,
          description: `Deleted project from catalog.`,
          type: 'deleted',
        });
      }
    });

    // 2. Check Hero Content
    if (JSON.stringify(draft.hero) !== JSON.stringify(published.hero)) {
      items.push({
        id: 'diff-hero',
        category: 'Content',
        title: 'Hero Section Updated',
        description: `Headline, eyebrow, or hero showcase specimen image modified.`,
        type: 'modified',
      });
    }

    // 3. Check Creative Statement (About)
    if (JSON.stringify(draft.about) !== JSON.stringify(published.about)) {
      items.push({
        id: 'diff-about',
        category: 'Content',
        title: 'Creative Statement (About) Updated',
        description: `Manifesto lines, subtext, or core principles modified.`,
        type: 'modified',
      });
    }

    // 4. Check Marquee Strip
    if (JSON.stringify(draft.marquee) !== JSON.stringify(published.marquee)) {
      items.push({
        id: 'diff-marquee',
        category: 'Content',
        title: 'Marquee Strip Updated',
        description: `Ticker phrases, scroll velocity, or separator symbols changed.`,
        type: 'modified',
      });
    }

    // 5. Check Philosophy
    if (JSON.stringify(draft.philosophy) !== JSON.stringify(published.philosophy)) {
      items.push({
        id: 'diff-philosophy',
        category: 'Content',
        title: 'Design Philosophy Thesis Updated',
        description: `Main statement or attribution text modified.`,
        type: 'modified',
      });
    }

    // 6. Check Skills Categories & Items
    if (JSON.stringify(draft.skills) !== JSON.stringify(published.skills)) {
      items.push({
        id: 'diff-skills',
        category: 'Skills',
        title: 'Discipline & Skills Matrix Updated',
        description: `Categories, nested skills, counts, or preview images updated.`,
        type: 'modified',
      });
    }

    // 7. Check Services
    if (JSON.stringify(draft.services) !== JSON.stringify(published.services)) {
      items.push({
        id: 'diff-services',
        category: 'Services',
        title: 'Services Scope Updated',
        description: `Offerings, deliverables, or Lucide icons adjusted.`,
        type: 'modified',
      });
    }

    // 8. Check Contact CTA
    if (JSON.stringify(draft.contact) !== JSON.stringify(published.contact)) {
      items.push({
        id: 'diff-contact',
        category: 'Content',
        title: 'Contact Collaboration Triggers Updated',
        description: `Email recipient, magnetic button URL, or availability tagline modified.`,
        type: 'modified',
      });
    }

    // 9. Check Footer & Social Links
    if (JSON.stringify(draft.footer) !== JSON.stringify(published.footer)) {
      items.push({
        id: 'diff-footer',
        category: 'Content',
        title: 'Footer & Social Directory Updated',
        description: `Location, copyright notice, or social channels modified.`,
        type: 'modified',
      });
    }

    // 10. Check Section Layout / Reordering / Visibility
    if (JSON.stringify(draft.settings?.sections) !== JSON.stringify(published.settings?.sections)) {
      items.push({
        id: 'diff-sections',
        category: 'Sections',
        title: 'Homepage Section Layout Reordered',
        description: `Section ordering or visibility states modified in Section Manager.`,
        type: 'reordered',
      });
    }

    // 11. Check Global Settings / Colors / SEO / Animations
    const draftGeneral = {
      theme: draft.settings?.defaultTheme,
      colors: draft.settings?.colors,
      animations: draft.settings?.animations,
      seo: draft.settings?.seo,
    };
    const pubGeneral = {
      theme: published.settings?.defaultTheme,
      colors: published.settings?.colors,
      animations: published.settings?.animations,
      seo: published.settings?.seo,
    };

    if (JSON.stringify(draftGeneral) !== JSON.stringify(pubGeneral)) {
      items.push({
        id: 'diff-settings',
        category: 'Settings',
        title: 'Global System Settings Modified',
        description: `Theme defaults, dynamic CSS color tokens, animation engines, or SEO metadata updated.`,
        type: 'modified',
      });
    }

    return {
      hasChanges: items.length > 0,
      totalChanges: items.length,
      items,
      lastPublishedAt: lastPublishedTimestamp,
      draftUpdatedAt: new Date().toISOString(),
    };
  },

  /**
   * Publish draft to live published state
   */
  async publishDraft(draftData: WebsiteData): Promise<{ success: boolean; publishedAt: string }> {
    const publishedAt = new Date().toISOString();
    const clonedSnapshot = JSON.parse(JSON.stringify(draftData));

    memoryPublishedData = clonedSnapshot;
    lastPublishedTimestamp = publishedAt;

    try {
      localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(clonedSnapshot));
      localStorage.setItem(LAST_PUBLISHED_KEY, publishedAt);
    } catch {
      // Ignored
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('website_published').upsert({
          id: 1,
          content: clonedSnapshot,
          published_at: publishedAt,
        });
      } catch (err) {
        console.warn('Supabase publish error, fallback to local storage:', err);
      }
    }

    // Log published activity
    activityService.logActivity({
      action: 'Content published',
      item: 'Live portfolio snapshot published',
      section: 'Publish Engine',
      user: 'admin@scrillo.design',
      status: 'Published',
    }).catch(() => {});

    return { success: true, publishedAt };
  },

  /**
   * Revert working draft back to the current published snapshot
   */
  async revertDraftToPublished(): Promise<WebsiteData> {
    const published = await this.getPublishedSnapshot();
    activityService.logActivity({
      action: 'Draft reverted',
      item: 'Staging draft reverted to published version',
      section: 'Publish Engine',
      user: 'admin@scrillo.design',
      status: 'Draft',
    }).catch(() => {});
    return JSON.parse(JSON.stringify(published));
  },
};

export default publishService;
