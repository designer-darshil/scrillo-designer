import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  Copy,
  Check,
  Search as SearchIcon,
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
import { validators } from '../utils/validators';
import {
  Button,
  Input,
  Badge,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Search,
  Skeleton,
  EmptyState,
  useToast,
  StatCard,
} from '../../design-system';

export const MediaManager: React.FC = () => {
  const { data: websiteData } = useWebsiteData();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

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

  const showToast = (msg: string) => {
    toastSuccess(msg);
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

  // Handle file uploads with type & 10MB size validation
  const handleFiles = async (files: FileList | File[]) => {
    const rawFiles = Array.from(files);
    const validFiles: File[] = [];

    for (const f of rawFiles) {
      const check = validators.imageFile(f);
      if (!check.isValid) {
        showToast(check.error || `File "${f.name}" is invalid.`);
        continue;
      }
      validFiles.push(f);
    }

    if (validFiles.length === 0) {
      if (rawFiles.length > 0) {
        showToast('No valid images (PNG, JPG, JPEG, WEBP, SVG under 10MB) to upload.');
      }
      return;
    }

    setUploadProgress(0);
    try {
      const uploaded = await mediaService.uploadMultipleAssets(validFiles, (progress, name) => {
        setUploadProgress(progress);
        setUploadingFileName(name);
      });

      if (uploaded.length > 0) {
        showToast(`Uploaded ${uploaded.length} asset${uploaded.length > 1 ? 's' : ''} successfully!`);
        loadAssets();
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    } finally {
      setUploadProgress(null);
      setUploadingFileName(null);
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
      {/* Delete Confirmation Modal with In-Use Guard */}
      <Modal
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        title="Confirm Asset Deletion"
        size="md"
      >
        <div className="space-y-4">
          <Alert variant="error" title="Irreversible Storage Deletion">
            Remove asset file from storage bucket permanently.
          </Alert>

          {/* In-use Warning Alert */}
          {assetToDelete?.inUse && (
            <Alert variant="warning" title="Asset in Active Use!">
              <div className="space-y-1 mt-1 text-xs">
                <p>Deleting this media asset may cause broken images on the live website in the following sections:</p>
                <ul className="list-disc pl-4 font-mono text-[11px]">
                  {assetToDelete.references.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}

          {assetToDelete && (
            <div className="p-3.5 rounded-xl bg-background border border-border flex items-center gap-3">
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
          )}

          <ModalFooter className="px-0 pb-0">
            <Button variant="secondary" onClick={() => setAssetToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              loading={isDeleting}
            >
              Delete Asset
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Large Image Preview Modal */}
      <Modal
        isOpen={Boolean(previewAsset)}
        onClose={() => setPreviewAsset(null)}
        title={previewAsset?.name || 'Media Asset Preview'}
        size="lg"
      >
        {previewAsset && (
          <div className="space-y-5">
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
                <span className="text-muted block text-[10px] uppercase">Format</span>
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

            {/* Direct Link */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Direct CDN Asset Link</label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={previewAsset.url}
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  variant="primary"
                  onClick={() => handleCopyLink(previewAsset.url)}
                  icon={copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedUrl ? 'Copied' : 'Copy URL'}
                </Button>
              </div>
            </div>

            <ModalFooter className="px-0 pb-0 justify-between">
              <a
                href={previewAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground font-semibold"
              >
                <span>Open Original Asset</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                variant="destructive"
                onClick={() => handleOpenDelete(previewAsset)}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Asset
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Page Header */}
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
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
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload New Assets
          </Button>
        </div>
      </Card>

      {/* Quick Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Media Files"
          value={assets.length}
          subtitle="CDN stored assets"
          icon={ImageIcon}
          badgeText="CDN"
        />
        <StatCard
          title="Storage Utilized"
          value={totalStorageFormatted}
          subtitle="Compressed asset volume"
          icon={HardDrive}
          badgeText="Storage"
          badgeVariant="info"
        />
        <StatCard
          title="Storage Engine"
          value="Supabase Bucket"
          subtitle="PostgreSQL / CDN backed"
          icon={Sparkles}
          badgeText="Encrypted"
          badgeVariant="success"
        />
        <StatCard
          title="Supported Formats"
          value="WEBP, JPG, PNG"
          subtitle="Vector SVG supported"
          icon={Layers}
          badgeText="Optimized"
          badgeVariant="neutral"
        />
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

          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Local Files
          </Button>
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
                className="h-full bg-[var(--color-action-primary)] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <Search
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search assets by filename..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['ALL', 'WEBP', 'JPG', 'PNG', 'SVG'] as const).map((fmt) => (
              <Button
                key={fmt}
                variant={formatFilter === fmt ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFormatFilter(fmt)}
              >
                {fmt}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-44" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8" />}
          title="No media assets found"
          description="Upload images or adjust your search filter criteria."
          primaryAction={
            <Button variant="primary" onClick={() => fileInputRef.current?.click()} icon={<Upload className="w-4 h-4" />}>
              Upload Assets
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              onClick={() => setPreviewAsset(asset)}
              className="group overflow-hidden cursor-pointer hover:border-foreground/50 hover:shadow-md transition-all flex flex-col justify-between shadow-xs p-0"
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
                  <Badge variant="neutral" className="gap-1 shadow-xs font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </Badge>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
