import React from 'react';
import { FileText, Save } from 'lucide-react';
import { defaultHeroContent, defaultStatementContent, defaultPhilosophyContent, defaultContactCTAContent } from '../services/websiteService';

export const ContentManager: React.FC = () => {
  const heroLines = defaultHeroContent.headlineLines?.join(' ') || defaultHeroContent.title;
  const manifestoPhrases = defaultStatementContent.phrases || [
    defaultStatementContent.line1 || 'BE CURIOUS.*',
    defaultStatementContent.line2 || 'BE BOLD.+',
    defaultStatementContent.line3 || 'BE USEFUL.°™',
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <FileText className="w-4 h-4" />
            <span>EDITORIAL SECTIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            CONTENT MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1: Hero */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-mono text-xs font-bold uppercase text-foreground">[01 // HERO SECTION]</h3>
            <span className="font-mono text-[11px] text-muted">READ-ONLY PLACEHOLDER</span>
          </div>
          <div className="grid grid-cols-1 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-muted block">Headline</label>
              <input
                type="text"
                disabled
                value={heroLines}
                className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted block">Supporting Description</label>
              <textarea
                disabled
                rows={2}
                value={defaultHeroContent.description}
                className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Manifesto */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-mono text-xs font-bold uppercase text-foreground">[02 // CREATIVE MANIFESTO]</h3>
            <span className="font-mono text-[11px] text-muted">READ-ONLY PLACEHOLDER</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            {manifestoPhrases.map((phrase, i) => (
              <input key={i} type="text" disabled value={phrase} className="px-3 py-2 bg-background border border-border text-foreground/90 opacity-70" />
            ))}
          </div>
        </div>

        {/* Section 3: Philosophy */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-mono text-xs font-bold uppercase text-foreground">[03 // DESIGN PHILOSOPHY]</h3>
            <span className="font-mono text-[11px] text-muted">READ-ONLY PLACEHOLDER</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <label className="text-muted block">Statement</label>
            <input
              type="text"
              disabled
              value={`${defaultPhilosophyContent.line1} ${defaultPhilosophyContent.line2} ${defaultPhilosophyContent.line3}`}
              className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70"
            />
          </div>
        </div>

        {/* Section 4: Contact CTA */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-mono text-xs font-bold uppercase text-foreground">[04 // CONTACT CTA]</h3>
            <span className="font-mono text-[11px] text-muted">READ-ONLY PLACEHOLDER</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-muted block">Headline</label>
              <input type="text" disabled value={`${defaultContactCTAContent.headlineLine1} ${defaultContactCTAContent.headlineLine2}`} className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70" />
            </div>
            <div className="space-y-1">
              <label className="text-muted block">Direct Email</label>
              <input type="text" disabled value={defaultContactCTAContent.email} className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;

