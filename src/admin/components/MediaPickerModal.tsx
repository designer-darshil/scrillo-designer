import React, { useState, useEffect, useCallback } from 'react';
import { X, Image as ImageIcon, Upload, Check, Link, Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { mediaService, MediaAsset } from '../services/mediaService';
import { validators } from '../utils/validators';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const curatedLibraryImages = [
  {
    title: 'Aurora Spatial UI',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Product Design',
  },
  {
    title: 'Mono AI Platform',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    category: 'AI Platform',
  },
  {
    title: 'Flux Tokyo Architecture',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'E-commerce',
  },
  {
    title: 'Minimal Studio Specimen',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    category: 'Studio',
  },
  {
    title: 'Monochrome Monolith',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=85',
    category: 'Architecture',
  },
  {
    title: 'Brutalist Concrete',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    category: 'Spatial',
  },
  {
    title: 'Kinetic Light Stream',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    category: 'Motion',
  },
  {
    title: 'Dark Typographic Void',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    category: 'Editorial',
  },
];

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mediaService.getAssets();
      setAssets(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen, loadAssets]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const check = validators.imageFile(file);
    if (!check.isValid) {
      setUploadError(check.error || 'Invalid file.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    setUploadProgress(20);
    setUploadStatus(`Uploading ${file.name}...`);

    try {
      const asset = await mediaService.uploadAsset(file);
      setUploadProgress(100);
      if (asset) {
        setSelectedUrl(asset.url);
        setUploadStatus('Upload successful!');
        await loadAssets();
        setActiveTab('library');
      }
    } catch (err: any) {
      setUploadError(validators.formatFriendlyError(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const check = validators.imageFile(file);
    if (!check.isValid) {
      setUploadError(check.error || 'Invalid file.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    setUploadProgress(30);
    setUploadStatus(`Uploading ${file.name}...`);

    try {
      const asset = await mediaService.uploadAsset(file);
      setUploadProgress(100);
      if (asset) {
        setSelectedUrl(asset.url);
        setUploadStatus('Upload successful!');
        await loadAssets();
        setActiveTab('library');
      }
    } catch (err: any) {
      setUploadError(validators.formatFriendlyError(err));
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    const finalUrl = activeTab === 'url' ? customUrl.trim() : selectedUrl;
    if (finalUrl) {
      if (activeTab === 'url') {
        const urlCheck = validators.url(finalUrl, false, 'Custom Asset URL');
        if (!urlCheck.isValid) {
          setUploadError(urlCheck.error || 'Unsafe URL format.');
          return;
        }
      }
      onSelect(finalUrl);
      onClose();
    }
  };

  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(query) ||
      asset.format.toLowerCase().includes(query) ||
      asset.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-4 border-b border-border pb-3 bg-surface">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media Library ({assets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'library' && (
            <>
              {loading ? (
                <div className="py-16 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted" />
                  <p className="text-xs text-muted">Loading media library...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-muted opacity-50" />
                  <p className="text-xs font-semibold text-foreground">No media assets found</p>
                  <p className="text-[11px] text-muted">Upload a new image or search with another keyword</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredAssets.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedUrl(item.url)}
                      className={`group relative rounded-xl border p-2 text-left transition-all overflow-hidden flex flex-col ${
                        selectedUrl === item.url
                          ? 'border-foreground ring-2 ring-foreground/20 bg-background'
                          : 'border-border hover:border-foreground/50 bg-background/50'
                      }`}
                    >
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-surface mb-2 relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-sm bg-background/80 backdrop-blur-xs font-mono text-[9px] text-foreground font-semibold uppercase">
                          {item.format}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-foreground truncate">{item.name}</p>
                      <div className="flex items-center justify-between text-[9px] text-muted mt-0.5 font-mono">
                        <span>{item.dimensions}</span>
                        <span>{item.sizeFormatted}</span>
                      </div>

                      {selectedUrl === item.url && (
                        <div className="absolute top-3 right-3 p-1 rounded-full bg-foreground text-background shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-3 bg-background/40"
            >
              <Upload className="w-8 h-8 mx-auto text-muted" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Click to upload or drag & drop</p>
                <p className="text-[11px] text-muted">Supports PNG, JPG, JPEG, WEBP, or SVG</p>
              </div>

              {uploading ? (
                <div className="max-w-xs mx-auto space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                  <span>Browse Local Files</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}

              {uploadError && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadStatus && !uploading && !uploadError && (
                <p className="text-[11px] text-emerald-500 font-medium pt-2">{uploadStatus}</p>
              )}

              {selectedUrl && (
                <div className="pt-4 max-w-xs mx-auto">
                  <p className="text-xs text-muted mb-2 font-medium">Selected Asset Preview:</p>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden border border-border">
                    <img src={selectedUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3 py-2">
              <label htmlFor="media-picker-custom-url" className="block text-xs font-semibold text-foreground">
                Direct Image Link / CDN Asset URL
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="media-picker-custom-url"
                    type="text"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      if (uploadError) setUploadError(null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>
              {uploadError && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
              {customUrl && (
                <div className="pt-2 max-w-xs">
                  <p className="text-[11px] text-muted mb-1 font-medium">Image Preview:</p>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden border border-border bg-background">
                    <img
                      src={customUrl}
                      alt="URL preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
          <div className="text-xs text-muted truncate max-w-xs font-mono">
            {activeTab === 'url' ? customUrl : selectedUrl ? 'Asset selected' : 'No asset chosen'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={activeTab === 'url' ? !customUrl.trim() : !selectedUrl}
              className="px-5 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
