import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type LoaderState = 'INITIAL' | 'LOADING' | 'EXITING' | 'DONE';

interface ScrilloLoaderProps {
  /** Optional override to force show the loader regardless of sessionStorage */
  forceShow?: boolean;
  /** Callback fired when the loader finishes transitioning out */
  onComplete?: () => void;
}

/**
 * Isolated Progress Sub-Component
 * Prevents full re-render of the parent loader and wordmark during progress ticks.
 */
const ProgressTracker = memo(function ProgressTracker({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto font-mono text-[11px] sm:text-xs tracking-wider">
      <span className="text-[#A0A0A0] uppercase font-medium">LOADING</span>

      {/* Hairline Progress Track using GPU-accelerated scaleX */}
      <div
        className="w-24 sm:w-36 md:w-44 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-0 bg-[#FF3E00] rounded-full will-change-transform origin-left"
          style={{
            transform: `scaleX(${progress / 100})`,
            transition: 'transform 80ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
      </div>

      {/* Numeric Counter with fixed width to prevent layout shift */}
      <span className="text-white font-medium tabular-nums w-[3.5ch] text-right">
        {progress}%
      </span>
    </div>
  );
});

export function ScrilloLoader({ forceShow = false, onComplete }: ScrilloLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  // Determine initial state synchronously to prevent any white/transparent flash
  const [state, setState] = useState<LoaderState>(() => {
    if (forceShow) return 'INITIAL';
    try {
      if (sessionStorage.getItem('scrillo-loader-seen') === 'true') {
        return 'DONE';
      }
    } catch {
      // Ignore storage errors
    }
    return 'INITIAL';
  });

  const [progress, setProgress] = useState(0);
  const hasInitializedRef = useRef(false);

  // Manage body scroll locking cleanly without layout shift
  useEffect(() => {
    if (state !== 'DONE') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [state]);

  // Loading sequence controller (Idempotent for React 18 StrictMode)
  useEffect(() => {
    if (state === 'DONE') return;
    if (hasInitializedRef.current && state !== 'INITIAL') return;
    hasInitializedRef.current = true;

    setState('LOADING');

    const duration = 1200; // 1.2s smooth presentation
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Natural ease-out non-linear progress ramp
      const currentProgress = Math.min(
        100,
        Math.floor(
          t < 0.5
            ? (t / 0.5) * 65
            : 65 + ((t - 0.5) / 0.5) * 35
        )
      );

      setProgress(currentProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);

        // Hold at 100% briefly, then trigger the single exit transition
        const exitTimer = setTimeout(() => {
          setState('EXITING');
        }, 180);

        return () => clearTimeout(exitTimer);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    // Hard safety timeout (2.0s max) - guarantees loader never gets permanently stuck
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setState('EXITING');
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimer);
    };
  }, [state]);

  // Clean transition to DONE upon exit animation completion
  const handleExitComplete = () => {
    try {
      sessionStorage.setItem('scrillo-loader-seen', 'true');
    } catch {
      // Ignore storage errors
    }
    setState('DONE');
    if (onComplete) onComplete();
  };

  // If already finished or session active, don't render anything
  if (state === 'DONE') {
    return null;
  }

  // Animation constants
  const curtainEase = [0.85, 0, 0.15, 1]; // Editorial high-craft bezier
  const isExiting = state === 'EXITING';

  return (
    <div
      id="scrillo-experience-loader"
      aria-live="polite"
      aria-busy={state !== 'EXITING'}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] pointer-events-auto select-none overflow-hidden bg-[#050505]"
      style={{
        // Keep entire container fully opaque until exit
        opacity: isExiting && prefersReducedMotion ? 0 : 1,
        transition: prefersReducedMotion ? 'opacity 300ms ease-out' : undefined,
      }}
    >
      {/* 
        Solid Split Curtain Panels
        Left Panel sweeps to -100% X, Right Panel sweeps to +100% X on EXITING
      */}
      <div className="absolute inset-0 flex pointer-events-none z-0">
        {/* Left Curtain */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{
            x: isExiting && !prefersReducedMotion ? '-100%' : '0%',
          }}
          transition={{
            duration: 0.8,
            ease: curtainEase,
            delay: 0.05,
          }}
          className="w-1/2 h-full bg-[#050505] border-r border-white/[0.04] relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{
            x: isExiting && !prefersReducedMotion ? '100%' : '0%',
          }}
          transition={{
            duration: 0.8,
            ease: curtainEase,
            delay: 0.05,
          }}
          onAnimationComplete={() => {
            if (isExiting) {
              handleExitComplete();
            }
          }}
          className="w-1/2 h-full bg-[#050505] border-l border-white/[0.04] relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        </motion.div>
      </div>

      {/* 
        Foreground Content Layer
        Fades out cleanly and scales down very subtly during exit
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting && !prefersReducedMotion ? 0.98 : 1,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.25 : 0.4,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 text-[#F5F5F5] pointer-events-none"
      >
        {/* Top Header Metadata */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest uppercase text-[#A0A0A0] font-semibold">
              SCRILLO
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
          </div>

          <div className="font-mono text-xs tracking-widest text-[#A0A0A0]">
            2026
          </div>
        </header>

        {/* Center Main Branded Typography - Stable, Rock-Solid without remounting */}
        <main className="flex flex-col items-center justify-center text-center my-auto px-4">
          <div className="overflow-hidden">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extrabold tracking-tighter leading-none text-[#F5F5F5] select-none">
              SCRILLO
            </h1>
          </div>

          <div className="mt-3 sm:mt-5">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-[#FF3E00] uppercase font-medium">
              <span>UI</span>
              <span className="text-white/20">/</span>
              <span>UX</span>
              <span className="text-white/20">/</span>
              <span>WEB</span>
            </div>
          </div>
        </main>

        {/* Bottom Metadata & Isolated Progress Indicator */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full pt-4 border-t border-white/[0.06]">
          <div className="font-mono text-[11px] sm:text-xs tracking-widest text-[#A0A0A0] uppercase">
            DESIGN + CODE
          </div>

          {/* Isolated progress component: Only this sub-tree updates during progress ticks */}
          <ProgressTracker progress={progress} />
        </footer>
      </motion.div>
    </div>
  );
}
