import React from 'react';
import { Settings, Save } from 'lucide-react';
import { defaultSettings } from '../services/settingsService';

export const SettingsManager: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <Settings className="w-4 h-4" />
            <span>GLOBAL CONFIGURATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            SETTINGS MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Site Metadata */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase text-foreground border-b border-border pb-3">
            [01 // SITE METADATA]
          </h3>
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-muted block">SEO Title Tag</label>
              <input
                type="text"
                disabled
                value={defaultSettings.siteTitle}
                className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted block">Meta Description</label>
              <textarea
                disabled
                rows={2}
                value={defaultSettings.siteDescription}
                className="w-full px-3 py-2 bg-background border border-border text-foreground/90 opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase text-foreground border-b border-border pb-3">
            [02 // SECTION VISIBILITY]
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {Object.entries(defaultSettings.sectionVisibility).map(([key, isVisible]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-border bg-background">
                <span className="uppercase text-foreground">{key}</span>
                <span className="text-[11px] px-2 py-0.5 bg-foreground text-background font-bold">
                  {isVisible ? 'ACTIVE' : 'HIDDEN'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
