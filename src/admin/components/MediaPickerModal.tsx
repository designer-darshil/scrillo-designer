import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload, Check, Link } from 'lucide-react';

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
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    const finalUrl = activeTab === 'url' ? customUrl.trim() : selectedUrl;
    if (finalUrl) {
      onSelect(finalUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
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

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-border pb-3 bg-surface">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-background'
            }`}
          >
            Curated Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-background'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-background'
            }`}
          >
            Direct URL
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {curatedLibraryImages.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => setSelectedUrl(item.url)}
                  className={`group relative rounded-xl border p-1 text-left transition-all overflow-hidden ${
                    selectedUrl === item.url
                      ? 'border-foreground ring-2 ring-foreground/20 bg-background'
                      : 'border-border hover:border-foreground/50 bg-background/50'
                  }`}
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-surface mb-1.5">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-foreground truncate px-1">{item.title}</p>
                  <p className="text-[9px] text-muted truncate px-1">{item.category}</p>

                  {selectedUrl === item.url && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-foreground text-background shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-3 bg-background/40">
              <Upload className="w-8 h-8 mx-auto text-muted" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Click to upload or drag & drop</p>
                <p className="text-[11px] text-muted">Supports PNG, JPG, WEBP, or SVG</p>
              </div>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                <span>Browse Local Files</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {selectedUrl && selectedUrl.startsWith('data:') && (
                <div className="pt-4 max-w-xs mx-auto">
                  <p className="text-xs text-muted mb-2 font-medium">Uploaded Preview:</p>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden border border-border">
                    <img src={selectedUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
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
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>
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
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
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
  );
};

export default MediaPickerModal;
