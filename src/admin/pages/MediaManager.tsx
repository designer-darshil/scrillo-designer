import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  Copy,
  Check,
  Search,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  FileImage,
  Sparkles,
  ArrowUpRight,
  HardDrive,
  Filter,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { mediaService, MediaAsset } from '../services/mediaService';

export const MediaManager: React.FC = () => {
  const { data: websiteData } = useWebsiteData();

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'PNG' | 'JPG' | 'WEBP' | 'SVG'>('ALL');

  // Upload state
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal state
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Delete Modal state
  const [assetToDelete, setAssetToDelete] = useState<{
    asset: MediaAsset;
    inUse: boolean;
    references: string[];
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load assets on mount
  const loadAssets = async () => {
    setLoading(true);
    const list = await mediaService.getAssets();
    setAssets(list);
    setLoading(false);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search filename
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!asset.name.toLowerCase().includes(q)) return false;
      }

      // Format filter
      if (formatFilter !== 'ALL') {
        if (formatFilter === 'JPG' && (asset.format === 'JPG' || asset.format === 'JPEG')) return true;
        if (asset.format !== formatFilter) return false;
      }

      return true;
    });
  }, [assets, searchTerm, formatFilter]);

  // Total storage calculated
  const totalStorageFormatted = useMemo(() => {
    const totalBytes = assets.reduce((sum, a) => sum + a.size, 0);
    const mb = (totalBytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  }, [assets]);

  // Handle file uploads
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(f.type)
    );

    if (fileArray.length === 0) {
      showToast('Please select valid image files (PNG, JPG, WEBP, or SVG).');
      return;
    }

    setUploadProgress(0);
    const uploaded = await mediaService.uploadMultipleAssets(fileArray, (progress, name) => {
      setUploadProgress(progress);
      setUploadingFileName(name);
    });

    setUploadProgress(null);
    setUploadingFileName(null);

    if (uploaded.length > 0) {
      showToast(`Uploaded ${uploaded.length} asset${uploaded.length > 1 ? 's' : ''} successfully!`);
      loadAssets();
    }
  };

  // Copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    showToast('Asset CDN URL copied to clipboard.');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Open delete confirmation
  const handleOpenDelete = (asset: MediaAsset) => {
    const usage = mediaService.checkAssetUsage(asset.url, websiteData);
    setAssetToDelete({
      asset,
      inUse: usage.inUse,
      references: usage.references,
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    setIsDeleting(true);
    const success = await mediaService.deleteAsset(assetToDelete.asset.id, assetToDelete.asset.url);
    setIsDeleting(false);

    if (success) {
      showToast(`Asset "${assetToDelete.asset.name}" deleted.`);
      if (previewAsset?.id === assetToDelete.asset.id) {
        setPreviewAsset(null);
      }
      setAssetToDelete(null);
      loadAssets();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/30 bg-surface p-4 shadow-xl flex items-center gap-3 text-xs text-foreground animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal with In-Use Guard */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide text-foreground">Confirm Asset Deletion</h3>
                <p className="text-xs text-muted">Remove asset file from storage bucket permanently.</p>
              </div>
            </div>

            {/* In-use Warning Alert */}
            {assetToDelete.inUse && (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2 text-xs text-amber-600 dark:text-amber-400">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Warning: Asset is currently referenced by published content!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Deleting this media asset may cause broken images on the live website in the following sections:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-mono text-foreground">
                  {assetToDelete.references.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 rounded-xl bg-background border border-border flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-border bg-surface shrink-0">
                <img
                  src={assetToDelete.asset.url}
                  alt={assetToDelete.asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1 text-xs">
                <p className="font-bold text-foreground truncate">{assetToDelete.asset.name}</p>
                <p className="font-mono text-[11px] text-muted">
                  {assetToDelete.asset.dimensions} • {assetToDelete.asset.sizeFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAssetToDelete(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-foreground" />
                <h3 className="text-sm font-bold truncate max-w-md text-foreground">{previewAsset.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Image Box */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-border bg-background flex items-center justify-center">
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="w-full h-full object-contain filter grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Asset Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-background text-xs font-mono">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Format / Type</span>
                  <span className="text-foreground font-semibold uppercase">{previewAsset.format}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Dimensions</span>
                  <span className="text-foreground font-semibold">{previewAsset.dimensions}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">File Size</span>
                  <span className="text-foreground font-semibold">{previewAsset.sizeFormatted}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Uploaded</span>
                  <span className="text-foreground font-semibold">
                    {new Date(previewAsset.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* URL & Copy Action */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">Direct CDN Asset Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={previewAsset.url}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-mono truncate focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(previewAsset.url)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
              <a
                href={previewAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground font-semibold"
              >
                <span>Open Original Asset</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDelete(previewAsset)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/30 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Storage & Media Assets Bucket
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Portfolio Media Library
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Upload, preview, optimize, and organize architectural specimens, project covers, and visual assets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Assets</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Total Media Files</span>
          <span className="text-2xl font-bold text-foreground mt-2">{assets.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Storage Utilized</span>
          <span className="text-2xl font-bold text-foreground mt-2">{totalStorageFormatted}</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Storage Engine</span>
          <span className="text-xs font-mono font-bold text-emerald-500 mt-3">SUPABASE BUCKET</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Supported Formats</span>
          <span className="text-xs font-mono font-bold text-muted mt-3">WEBP, JPG, PNG, SVG</span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all bg-surface/50 ${
          isDraggingOver
            ? 'border-foreground bg-foreground/5 scale-[1.005]'
            : 'border-border hover:border-foreground/40'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground mx-auto shadow-xs">
            <Upload className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Drag & drop files here to upload</h3>
            <p className="text-xs text-muted">Supports high-res PNG, JPG, JPEG, WEBP, and safe vector SVG</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-surface transition-colors"
          >
            <span>Browse Local Files</span>
          </button>
        </div>

        {/* Progress bar */}
        {uploadProgress !== null && (
          <div className="mt-6 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span className="truncate max-w-xs">{uploadingFileName || 'Uploading...'}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-background border border-border overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets by filename..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Format Filter Tabs */}
            {(['ALL', 'WEBP', 'JPG', 'PNG', 'SVG'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formatFilter === fmt
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted hover:text-foreground hover:bg-background'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl border border-border bg-surface text-muted text-xs">
          <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading asset library...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-surface text-muted space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto opacity-30" />
          <p className="text-sm font-semibold text-foreground">No media assets found</p>
          <p className="text-xs">Upload images or clear your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setPreviewAsset(asset)}
              className="group rounded-2xl border border-border bg-surface overflow-hidden cursor-pointer hover:border-foreground/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                />

                {/* Overlay Preview Trigger */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <span className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold flex items-center gap-1 shadow-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </span>
                </div>

                {/* Format Tag */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-xs text-[9px] font-mono font-bold uppercase text-foreground">
                  {asset.format}
                </span>
              </div>

              {/* Metadata Details */}
              <div className="p-3.5 space-y-1 border-t border-border bg-surface">
                <p className="text-xs font-bold text-foreground truncate group-hover:text-foreground">
                  {asset.name}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>{asset.dimensions}</span>
                  <span>{asset.sizeFormatted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
