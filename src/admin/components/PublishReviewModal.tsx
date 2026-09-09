import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';
import { ContentDiffSummary, ContentDiffItem } from '../../types';
import { Modal, ModalBody, ModalFooter, Button, Badge, Alert } from '../../design-system';

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
          <Badge variant="success" size="sm" icon={<PlusCircle className="w-2.5 h-2.5" />}>
            Added
          </Badge>
        );
      case 'modified':
        return (
          <Badge variant="info" size="sm" icon={<Edit3 className="w-2.5 h-2.5" />}>
            Modified
          </Badge>
        );
      case 'deleted':
        return (
          <Badge variant="error" size="sm" icon={<Trash2 className="w-2.5 h-2.5" />}>
            Deleted
          </Badge>
        );
      case 'reordered':
        return (
          <Badge variant="warning" size="sm" icon={<ArrowUpDown className="w-2.5 h-2.5" />}>
            Reordered
          </Badge>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] flex items-center justify-center">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Review & Publish Changes
            </h3>
            <p className="text-[11px] text-[var(--color-text-tertiary)] font-normal">
              Push all working draft revisions to the live public portfolio
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <ModalBody>
        {/* Metadata Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--color-text-tertiary)] block uppercase">Current Draft Status</span>
            <p className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>
                {diffSummary.totalChanges} {diffSummary.totalChanges === 1 ? 'Pending Revision' : 'Pending Revisions'}
              </span>
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--color-text-tertiary)] block uppercase">Last Published Version</span>
            <p className="font-semibold text-[var(--color-text-tertiary)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimestamp(diffSummary.lastPublishedAt)}</span>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <Alert variant="success" title="Published to live website!">
            Public visitors now see this updated revision.
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="error" title="Publishing Error">
            {error}
          </Alert>
        )}

        {/* Diff Summary Items List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
            Summary of Detected Modifications ({diffSummary.items.length})
          </h4>

          {diffSummary.items.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-[var(--color-border-default)] rounded-xl space-y-1 bg-[var(--color-background-primary)]/50">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">Draft is in sync with Published</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">No unpublished changes found to deploy.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {diffSummary.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-background-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] px-1.5 py-0.5 rounded-sm bg-[var(--color-background-secondary)] border border-[var(--color-border-default)]">
                        {item.category}
                      </span>
                      <p className="font-bold text-[var(--color-text-primary)] truncate">{item.title}</p>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">{item.description}</p>
                  </div>

                  <div className="shrink-0 self-start sm:self-auto">
                    {getDiffTypeBadge(item.type)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex-1 text-xs text-[var(--color-text-tertiary)] font-mono hidden sm:block">
          {diffSummary.totalChanges > 0
            ? `${diffSummary.totalChanges} changes ready to push live`
            : 'Zero pending changes'}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={publishing}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handlePublish}
          disabled={publishing || diffSummary.totalChanges === 0}
          loading={publishing}
          loadingText="Publishing..."
          icon={<UploadCloud className="w-3.5 h-3.5" />}
        >
          Publish Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PublishReviewModal;
