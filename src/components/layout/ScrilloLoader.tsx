import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ScrilloLoaderProps {
  /** Optional override to force show the loader regardless of sessionStorage */
  forceShow?: boolean;
  /** Callback fired when the loader finishes transitioning out */
  onComplete?: () => void;
}

export function ScrilloLoader({ forceShow = false, onComplete }: ScrilloLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasSeen] = useState<boolean>(() => {
    if (forceShow) return false;
    try {
      return sessionStorage.getItem('scrillo-loader-seen') === 'true';
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'settled' | 'exiting' | 'complete'>(() => {
    return hasSeen ? 'complete' : 'loading';
  });

  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Lock body scroll while loader is active
  useEffect(() => {
    if (phase !== 'complete') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [phase]);

  // Loading sequence and progress controller
  useEffect(() => {
    if (hasSeen) return;

    const startTime = performance.now();
    const targetDuration = 1350; // ~1.35s smooth presentation time

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressFraction = Math.min(elapsed / targetDuration, 1);

      // Smooth custom non-linear easing for natural feeling progress
      const easedProgress = Math.min(
        100,
        Math.floor(
          progressFraction < 0.6
            ? (progressFraction / 0.6) * 72
            : 72 + ((progressFraction - 0.6) / 0.4) * 28
        )
      );

      progressRef.current = easedProgress;
      setProgress(easedProgress);

      if (progressFraction < 1) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setPhase('settled');

        // Hold settled state briefly before initiating curtain split
        const settleTimer = setTimeout(() => {
          setPhase('exiting');
        }, 200);

        return () => clearTimeout(settleTimer);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    // Fail-safe timeout (max 2.2s) ensures loader never hangs under any circumstance
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setPhase('settled');
      setTimeout(() => setPhase('exiting'), 150);
    }, 2200);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(safetyTimer);
    };
  }, [hasSeen]);

  // Handle completion of exit animation
  const handleExitComplete = () => {
    try {
      sessionStorage.setItem('scrillo-loader-seen', 'true');
    } catch {
      // Ignore sessionStorage exceptions
    }
    setPhase('complete');
    if (onComplete) onComplete();
  };

  // Curtain exit animation timing & easing
  const curtainEase = [0.85, 0, 0.15, 1]; // Premium editorial cubic bezier
  const curtainDuration = prefersReducedMotion ? 0.35 : 0.85;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase !== 'complete' && (
        <motion.div
          key="scrillo-loader-overlay"
          id="scrillo-experience-loader"
          aria-live="polite"
          aria-busy={phase !== 'exiting'}
          className="fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden"
          exit={{ opacity: prefersReducedMotion ? 0 : 1 }}
          transition={{ duration: curtainDuration }}
        >
          {/* Dual Split Curtain Panels (Left & Right) */}
          <div className="absolute inset-0 flex pointer-events-none">
            {/* Left Curtain */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{
                x: phase === 'exiting' ? (prefersReducedMotion ? '0%' : '-100%') : '0%',
              }}
              transition={{
                duration: curtainDuration,
                ease: curtainEase,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
              className="w-1/2 h-full bg-[#050505] border-r border-white/[0.04] relative"
            >
              {/* Subtle background grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
            </motion.div>

            {/* Right Curtain */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{
                x: phase === 'exiting' ? (prefersReducedMotion ? '0%' : '100%') : '0%',
              }}
              transition={{
                duration: curtainDuration,
                ease: curtainEase,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
              className="w-1/2 h-full bg-[#050505] border-l border-white/[0.04] relative"
            >
              {/* Subtle background grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
            </motion.div>
          </div>

          {/* Loader Editorial Foreground Content */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === 'exiting' ? 0 : 1,
              scale: phase === 'exiting' ? (prefersReducedMotion ? 1 : 0.98) : 1,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.45,
              ease: 'easeInOut',
            }}
            onAnimationComplete={() => {
              if (phase === 'exiting') {
                handleExitComplete();
              }
            }}
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 text-[#F5F5F5] pointer-events-none"
          >
            {/* Top Bar Metadata */}
            <header className="flex items-center justify-between w-full">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="font-mono text-xs tracking-widest uppercase text-[#A0A0A0] font-semibold">
                  SCRILLO
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-mono text-xs tracking-widest text-[#A0A0A0]"
              >
                2026
              </motion.div>
            </header>

            {/* Main Center Branded Typography Area */}
            <main className="flex flex-col items-center justify-center text-center my-auto px-4">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                  className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extrabold tracking-tighter leading-none text-[#F5F5F5] select-none"
                >
                  SCRILLO
                </motion.h1>
              </div>

              <div className="overflow-hidden mt-3 sm:mt-5">
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.25,
                  }}
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-[#FF3E00] uppercase font-medium"
                >
                  <span>UI</span>
                  <span className="text-white/20">/</span>
                  <span>UX</span>
                  <span className="text-white/20">/</span>
                  <span>WEB</span>
                </motion.div>
              </div>
            </main>

            {/* Bottom Metadata & Editorial Progress Bar */}
            <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full pt-4 border-t border-white/[0.06]">
              {/* Left Sub-metadata */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-mono text-[11px] sm:text-xs tracking-widest text-[#A0A0A0] uppercase"
              >
                DESIGN + CODE
              </motion.div>

              {/* Right Editorial Progress Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto font-mono text-[11px] sm:text-xs tracking-wider"
              >
                <span className="text-[#A0A0A0] uppercase font-medium">LOADING</span>

                {/* Hairline Progress Track */}
                <div
                  className="w-24 sm:w-36 md:w-44 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#FF3E00] transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Numeric Counter */}
                <span className="text-white font-medium tabular-nums min-w-[3.2ch] text-right">
                  {progress}%
                </span>
              </motion.div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
