import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectMedia } from '../../types';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ProjectMedia[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
          <div className="text-white/70 flex items-center space-x-3">
            <span className="text-[#FF3E00] font-bold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <span className="truncate max-w-[200px] sm:max-w-md">{currentImage?.caption || currentImage?.alt}</span>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3E00]"
            aria-label="Close lightbox modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Center Content */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          <motion.img
            key={currentImage?.url}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            src={currentImage?.url}
            alt={currentImage?.alt}
            className="max-h-[80vh] max-w-[92vw] object-contain rounded-lg border border-white/10 shadow-2xl"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-6 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-black/70 border border-white/20 text-white hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3E00]"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => onNavigate((currentIndex + 1) % images.length)}
                className="absolute right-2 sm:right-6 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-black/70 border border-white/20 text-white hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3E00]"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs font-mono text-white/50 pt-2">
          Use Left/Right arrows to navigate • ESC to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
