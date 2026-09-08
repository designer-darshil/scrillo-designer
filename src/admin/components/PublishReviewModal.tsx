import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  FolderGit2,
  Settings,
  ChevronRight,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { ContentDiffSummary, ContentDiffItem } from '../../types';

interface PublishReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffSummary: ContentDiffSummary;
  onConfirmPublish: () => Promise<boolean>;
}

export const PublishReviewModal: React.FC<PublishReviewModalProps> = ({
  isOpen,
  onClose,
  diffSummary,
  onConfirmPublish,
}) => {
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);

    try {
      const ok = await onConfirmPublish();
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError('Failed to publish changes. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during publishing.');
    } finally {
      setPublishing(false);
    }
  };

  const formatTimestamp = (iso?: string) => {
    if (!iso) return 'Never published';
    try {
      return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getDiffTypeBadge = (type: ContentDiffItem['type']) => {
    switch (type) {
      case 'added':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <PlusCircle className="w-2.5 h-2.5" />
            <span>Added</span>
          </span>
        );
      case 'modified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Edit3 className="w-2.5 h-2.5" />
            <span>Modified</span>
          </span>
        );
      case 'deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-red-500/10 text-red-500 border border-red-500/20">
            <Trash2 className="w-2.5 h-2.5" />
            <span>Deleted</span>
          </span>
        );
      case 'reordered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ArrowUpDown className="w-2.5 h-2.5" />
            <span>Reordered</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Review & Publish Changes
              </h3>
              <p className="text-[11px] text-muted">
                Push all working draft revisions to the live public portfolio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Metadata Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-border bg-background text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted block uppercase">Current Draft Status</span>
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                <span>
                  {diffSummary.totalChanges} {diffSummary.totalChanges === 1 ? 'Pending Revision' : 'Pending Revisions'}
                </span>
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted block uppercase">Last Published Version</span>
              <p className="font-semibold text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimestamp(diffSummary.lastPublishedAt)}</span>
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Published to live website!</p>
                <p className="opacity-80">Public visitors now see this updated revision.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Publishing Error</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Diff Summary Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              Summary of Detected Modifications ({diffSummary.items.length})
            </h4>

            {diffSummary.items.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border rounded-xl space-y-1 bg-background/50">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
                <p className="text-xs font-semibold text-foreground">Draft is in sync with Published</p>
                <p className="text-[11px] text-muted">No unpublished changes found to deploy.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {diffSummary.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted px-1.5 py-0.5 rounded-sm bg-surface border border-border">
                          {item.category}
                        </span>
                        <p className="font-bold text-foreground truncate">{item.title}</p>
                      </div>
                      <p className="text-[11px] text-muted truncate">{item.description}</p>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      {getDiffTypeBadge(item.type)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
          <div className="text-xs text-muted font-mono">
            {diffSummary.totalChanges > 0
              ? `${diffSummary.totalChanges} changes ready to push live`
              : 'Zero pending changes'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={publishing}
              className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || diffSummary.totalChanges === 0}
              className="px-5 py-2 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishReviewModal;
