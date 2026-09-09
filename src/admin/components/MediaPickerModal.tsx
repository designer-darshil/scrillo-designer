import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Upload, Check, Link as LinkIcon, Sparkles } from 'lucide-react';
import { mediaService, MediaAsset } from '../services/mediaService';
import { validators } from '../utils/validators';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Search,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Alert,
  Badge,
  Skeleton,
} from '../../design-system';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const curatedLibraryImages = [
  {
    title: 'Darshil S. Bhuva — Profile Photo (Resume)',
    url: '/images/darshil-profile.jpg',
    category: 'Profile',
  },
  {
    title: 'Darshil S. Bhuva — Portfolio Cover Artifact',
    url: '/images/darshil-cover.png',
    category: 'Specimen',
  },
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
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Typography',
  },
  {
    title: 'Editorial Noir Spread',
    url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    category: 'Editorial',
  },
];

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
}) => {
  const [activeTab, setActiveTab] = useState('library');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const items = await mediaService.getAssets();
      setAssets(items);
    } catch {
      // Fallback to curated images
      setAssets(
        curatedLibraryImages.map((img, idx) => ({
          id: `curated-${idx}`,
          name: img.title,
          url: img.url,
          format: (img.url.endsWith('.png') ? 'PNG' : img.url.endsWith('.svg') ? 'SVG' : 'JPG') as 'PNG' | 'JPG' | 'SVG',
          size: 150000,
          sizeFormatted: '150 KB',
          dimensions: '1200x800',
          uploadedAt: new Date().toISOString(),
          type: 'image',
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
      setSelectedUrl('');
      setCustomUrl('');
      setUploadError(null);
    }
  }, [isOpen, loadAssets]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(20);
    setUploadError(null);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[var(--color-text-primary)]" />
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
            {title}
          </span>
        </div>
      }
      size="lg"
    >
      <ModalBody>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-3">
            <TabList ariaLabel="Media Selection Modes">
              <Tab value="library" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Media Library ({assets.length})
              </Tab>
              <Tab value="upload" icon={<Upload className="w-3.5 h-3.5" />}>
                Upload New
              </Tab>
              <Tab value="url" icon={<LinkIcon className="w-3.5 h-3.5" />}>
                Direct Link
              </Tab>
            </TabList>

            {activeTab === 'library' && (
              <div className="w-full sm:w-56">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..."
                />
              </div>
            )}
          </div>

          <TabPanel value="library" className="pt-2">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-[var(--color-text-tertiary)] opacity-50" />
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">No media assets found</p>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Upload a new image or search with another keyword</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredAssets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative rounded-xl border p-2 text-left transition-all overflow-hidden flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] ${
                      selectedUrl === item.url
                        ? 'border-[var(--color-action-primary)] ring-2 ring-[var(--color-action-primary)]/20 bg-[var(--color-background-elevated)]'
                        : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] bg-[var(--color-background-secondary)]'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[var(--color-background-primary)] mb-2 relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-sm bg-[var(--color-background-primary)]/80 backdrop-blur-xs font-mono text-[9px] text-[var(--color-text-primary)] font-semibold uppercase">
                        {item.format}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--color-text-primary)] truncate">{item.name}</p>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-tertiary)] mt-0.5 font-mono">
                      <span>{item.dimensions}</span>
                      <span>{item.sizeFormatted}</span>
                    </div>

                    {selectedUrl === item.url && (
                      <div className="absolute top-3 right-3 p-1 rounded-full bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel value="upload" className="pt-2">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[var(--color-border-default)] rounded-xl p-8 text-center space-y-3 bg-[var(--color-background-secondary)]/40"
            >
              <Upload className="w-8 h-8 mx-auto text-[var(--color-text-tertiary)]" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">Click to upload or drag & drop</p>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Supports PNG, JPG, JPEG, WEBP, or SVG</p>
              </div>

              {uploading ? (
                <div className="max-w-xs mx-auto space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] font-mono">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--color-border-default)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-action-primary)] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
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
                <Alert variant="error" title="Upload Error">
                  {uploadError}
                </Alert>
              )}

              {uploadStatus && !uploading && !uploadError && (
                <p className="text-[11px] text-[var(--color-status-success-text)] font-medium pt-2">{uploadStatus}</p>
              )}

              {selectedUrl && (
                <div className="pt-4 max-w-xs mx-auto">
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-2 font-medium">Selected Asset Preview:</p>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden border border-[var(--color-border-default)]">
                    <img src={selectedUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel value="url" className="pt-2">
            <div className="space-y-4 py-2">
              <Input
                label="Direct Image Link / CDN Asset URL"
                id="media-picker-custom-url"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  if (uploadError) setUploadError(null);
                }}
                placeholder="https://images.unsplash.com/..."
                leftIcon={<LinkIcon className="w-4 h-4" />}
                error={uploadError || undefined}
              />

              {customUrl && (
                <div className="pt-2 max-w-xs">
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mb-1 font-medium">Image Preview:</p>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-primary)]">
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
          </TabPanel>
        </Tabs>
      </ModalBody>

      <ModalFooter>
        <div className="text-xs text-[var(--color-text-tertiary)] truncate max-w-xs font-mono mr-auto">
          {activeTab === 'url' ? customUrl : selectedUrl ? 'Asset selected' : 'No asset chosen'}
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={activeTab === 'url' ? !customUrl.trim() : !selectedUrl}
        >
          Apply Asset
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MediaPickerModal;
