import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { siteConfig } from '../../data/site';

export const CinematicIntro: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, immediately dismiss
    if (prefersReducedMotion) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Auto dismiss after 1.5 seconds total duration
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col justify-between p-6 sm:p-12 text-white pointer-events-auto select-none"
        >
          {/* Top Scene Marker */}
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
              <span>PROLOGUE</span>
            </span>
            <span>{siteConfig.location}</span>
          </div>

          {/* Center Title Card */}
          <div className="text-center my-auto space-y-4 sm:space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-sm bg-white text-black flex items-center justify-center font-bold text-sm sm:text-base tracking-wider shadow-2xl"
            >
              {siteConfig.initials}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight sm:tracking-tighter text-white"
            >
              {siteConfig.name}
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-[#FF3E00] font-medium"
            >
              {siteConfig.role}
            </motion.p>
          </div>

          {/* Bottom Coordinates & Skip Button */}
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
            <span>2026 REEL</span>
            <button
              onClick={() => {
                setVisible(false);
                onComplete?.();
              }}
              className="text-white/60 hover:text-white transition-colors cursor-pointer underline"
            >
              SKIP
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
