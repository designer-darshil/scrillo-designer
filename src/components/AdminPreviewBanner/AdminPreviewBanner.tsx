import React, { useState } from 'react';
import { ArrowLeft, UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { Button } from '../../design-system';

interface AdminPreviewBannerProps {
  onExitPreview: () => void;
  onOpenPublishModal?: () => void;
}

export const AdminPreviewBanner: React.FC<AdminPreviewBannerProps> = ({
  onExitPreview,
  onOpenPublishModal,
}) => {
  const { publishDraft } = useWebsiteData();
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleQuickPublish = async () => {
    if (onOpenPublishModal) {
      onOpenPublishModal();
      return;
    }

    setPublishing(true);
    try {
      const ok = await publishDraft();
      if (ok) {
        setPublishedSuccess(true);
        setTimeout(() => setPublishedSuccess(false), 3000);
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] bg-[var(--color-text-primary)] text-[var(--color-background-primary)] py-2 px-4 shadow-xl select-none animate-in slide-in-from-top duration-300 border-b border-[var(--color-border-strong)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Preview Status Badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            ADMIN PREVIEW MODE — VIEWING DRAFT CONTENT
          </span>
          <span className="hidden md:inline text-[11px] opacity-75 font-mono">
            (Public visitors only see published content)
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {publishedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-success font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published Live!</span>
            </span>
          )}

          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--color-background-primary)] text-[var(--color-text-primary)] font-mono text-[11px] font-bold uppercase hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Admin Panel</span>
          </a>

          <button
            type="button"
            onClick={handleQuickPublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-status-warning text-black font-mono text-[11px] font-bold uppercase hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{publishing ? 'Publishing...' : 'Publish Draft'}</span>
          </button>

          <button
            type="button"
            onClick={onExitPreview}
            className="p-1 rounded-md hover:bg-[var(--color-background-primary)]/20 transition-colors text-[var(--color-background-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
            title="Exit Preview Mode"
            aria-label="Exit Preview Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPreviewBanner;
