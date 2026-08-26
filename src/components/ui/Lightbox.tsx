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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
          <div className="text-white/60 flex items-center space-x-3">
            <span className="text-[#FF3E00] font-bold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <span>{currentImage?.caption || currentImage?.alt}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors"
            aria-label="Close Lightbox"
          >
            <X size={18} />
          </button>
        </div>

        {/* Center Content */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          <motion.img
            key={currentImage?.url}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={currentImage?.url}
            alt={currentImage?.alt}
            className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg border border-white/10 shadow-2xl"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => onNavigate((currentIndex + 1) % images.length)}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs font-mono text-white/40 pt-2">
          Use Left/Right arrows to navigate • ESC to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
