import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

type LoaderState = 'IDLE' | 'LOADING' | 'WAITING_FOR_PAGE' | 'READY' | 'EXITING' | 'COMPLETE';

interface ScrilloLoaderProps {
  /** Optional manual readiness override */
  isReady?: boolean;
}

/**
 * High-Precision Progress Station Sub-Component
 * Renders the laser-thin track, phase label, and tabular numbers with zero layout jitter.
 */
const ProgressStation = memo(function ProgressStation({ 
  progress, 
  state 
}: { 
  progress: number;
  state: LoaderState;
}) {
  const getStatusLabel = () => {
    if (progress >= 100) return 'DESTINATION READY';
    if (progress >= 85) return 'VERIFYING ASSETS';
    if (progress >= 40) return 'INITIALIZING ROUTE';
    return 'CONNECTING';
  };

  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pt-4 sm:pt-6 border-t border-white/[0.07]">
      {/* Left Metadata & Live Status */}
      <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/50">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3E00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3E00]" />
          </span>
          <span className="text-[#F5F5F5] font-semibold">SCRILLO_OS</span>
        </div>
        <span className="text-white/20">|</span>
        <span className="hidden sm:inline-block">DESIGN + CODE ARCHITECTURE</span>
        <span className="hidden sm:inline-block text-white/20">|</span>
        <span className="text-[#FF3E00] font-medium">{getStatusLabel()}</span>
      </div>

      {/* Right Progress Meter & Counter */}
      <div className="flex items-center gap-4 self-end sm:self-auto font-mono text-xs">
        <span className="text-white/40 tracking-widest text-[10px] uppercase hidden xs:inline-block">
          LOAD
        </span>

        {/* Laser Hairline Track */}
        <div
          className="w-28 sm:w-44 md:w-56 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full backdrop-blur-sm"
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-0 bg-[#FF3E00] rounded-full will-change-transform origin-left shadow-[0_0_10px_rgba(255,62,0,0.8)]"
            style={{
              transform: `scaleX(${clampedProgress / 100})`,
              transition: 'transform 80ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          />
        </div>

        {/* Formatted Tabular Numeric Readout */}
        <span className="text-white font-medium tabular-nums text-xs tracking-wider w-[4ch] text-right">
          {String(Math.round(clampedProgress)).padStart(3, '0')}%
        </span>
      </div>
    </div>
  );
});

/**
 * Utility: Check destination critical images
 */
function waitForCriticalImages(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const main = document.querySelector('main');
      if (!main) {
        resolve();
        return;
      }

      const images = Array.from(main.querySelectorAll('img')).slice(0, 4);
      const pendingImages = images.filter((img) => !img.complete && img.src);

      if (pendingImages.length === 0) {
        resolve();
        return;
      }

      let remaining = pendingImages.length;
      const onDone = () => {
        remaining -= 1;
        if (remaining <= 0) resolve();
      };

      pendingImages.forEach((img) => {
        if (img.complete) {
          onDone();
        } else {
          img.addEventListener('load', onDone, { once: true });
          img.addEventListener('error', onDone, { once: true });
        }
      });

      // Max image wait safeguard (450ms)
      setTimeout(resolve, 450);
    } catch {
      resolve();
    }
  });
}

/**
 * Utility: Check custom fonts readiness
 */
function waitForFonts(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => resolve()).catch(() => resolve());
        setTimeout(resolve, 250);
      } else {
        resolve();
      }
    } catch {
      resolve();
    }
  });
}

export function ScrilloLoader({ isReady }: ScrilloLoaderProps) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const [state, setState] = useState<LoaderState>('LOADING');
  const [progress, setProgress] = useState(0);

  const navIdRef = useRef(0);
  const isFirstMountRef = useRef(true);

  // Manage body scroll locking during active loader states
  useEffect(() => {
    if (state !== 'IDLE' && state !== 'COMPLETE') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [state]);

  // Main navigation & refresh lifecycle coordinator
  const runNavigationSequence = useCallback((targetNavId: number) => {
    setState('LOADING');
    setProgress(0);

    const startTime = performance.now();
    const targetPreloadTime = 550; // Snappy, premium pacing to ~92%
    let animFrameId: number;
    let isDestinationReady = false;

    // Track readiness resolution
    const checkReadiness = async () => {
      // Double requestAnimationFrame ensures React has committed the new route DOM
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      if (navIdRef.current !== targetNavId) return;

      // Parallel check for fonts and route images
      await Promise.all([waitForFonts(), waitForCriticalImages()]);

      if (navIdRef.current !== targetNavId) return;

      // Destination is confirmed ready
      isDestinationReady = true;
    };

    checkReadiness();

    // Progress animation tick
    const tick = (now: number) => {
      if (navIdRef.current !== targetNavId) return;

      const elapsed = now - startTime;

      if (!isDestinationReady) {
        // Smooth logarithmic climb towards 92%
        const ratio = Math.min(elapsed / targetPreloadTime, 1);
        const currentProg = Math.floor(ratio * 92);
        setProgress(currentProg);
        setState('WAITING_FOR_PAGE');
        animFrameId = requestAnimationFrame(tick);
      } else {
        // Page is ready: snap smoothly to 100%
        setState('READY');
        setProgress(100);

        // Brief hold at 100% so user perceives completion
        const exitTimer = setTimeout(() => {
          if (navIdRef.current !== targetNavId) return;
          setState('EXITING');

          // Transition to COMPLETE after curtain sweep completes
          const completeTimer = setTimeout(() => {
            if (navIdRef.current !== targetNavId) return;
            setState('COMPLETE');
          }, prefersReducedMotion ? 200 : 750);

          return () => clearTimeout(completeTimer);
        }, 100);

        return () => clearTimeout(exitTimer);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    // Hard fallback safeguard (2.2s maximum)
    const fallbackTimer = setTimeout(() => {
      if (navIdRef.current === targetNavId && !isDestinationReady) {
        isDestinationReady = true;
      }
    }, 2200);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(fallbackTimer);
    };
  }, [prefersReducedMotion]);

  // Trigger on full refresh AND on every route navigation
  useEffect(() => {
    navIdRef.current += 1;
    const currentNavId = navIdRef.current;

    if (!isFirstMountRef.current) {
      window.scrollTo(0, 0);
    }
    isFirstMountRef.current = false;

    const cleanup = runNavigationSequence(currentNavId);
    return cleanup;
  }, [location.pathname, location.search, runNavigationSequence]);

  // Handle external manual isReady override if provided
  useEffect(() => {
    if (isReady && state === 'WAITING_FOR_PAGE') {
      setProgress(100);
      setState('READY');
    }
  }, [isReady, state]);

  // If complete, hide loader
  if (state === 'COMPLETE' || state === 'IDLE') {
    return null;
  }

  // Cinematic high-craft bezier curve
  const curtainEase = [0.76, 0, 0.24, 1];
  const isExiting = state === 'EXITING';

  return (
    <div
      id="scrillo-global-loader"
      aria-live="polite"
      aria-busy={state !== 'EXITING'}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] pointer-events-auto select-none overflow-hidden bg-[#050505]"
      style={{
        opacity: isExiting && prefersReducedMotion ? 0 : 1,
        transition: prefersReducedMotion ? 'opacity 200ms ease-out' : undefined,
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
            duration: 0.75,
            ease: curtainEase,
          }}
          className="w-1/2 h-full bg-[#050505] border-r border-white/[0.06] relative"
        >
          {/* Subtle architectural dot matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{
            x: isExiting && !prefersReducedMotion ? '100%' : '0%',
          }}
          transition={{
            duration: 0.75,
            ease: curtainEase,
          }}
          className="w-1/2 h-full bg-[#050505] border-l border-white/[0.06] relative"
        >
          {/* Subtle architectural dot matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
        </motion.div>
      </div>

      {/* 
        Editorial Foreground Layer
        High-craft layout with registration marks, precision typography, and metadata
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting && !prefersReducedMotion ? 0.985 : 1,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.18 : 0.35,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 text-[#F5F5F5] pointer-events-none"
      >
        {/* Subtle Corner Registration Crosshairs */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] text-white/20 select-none pointer-events-none">
          +
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] text-white/20 select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[10px] text-white/20 select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[10px] text-white/20 select-none pointer-events-none">
          +
        </div>

        {/* Top Header Metadata Bar */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm bg-white/10 border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold text-white">
              SC
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-widest uppercase text-white font-bold">
                SCRILLO
              </span>
              <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase hidden sm:inline-block">
                STUDIO ARCHIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px] sm:text-xs tracking-widest text-white/50">
            <span className="hidden md:inline-block text-white/30">FOLIO // V2.6</span>
            <span className="border border-white/10 px-2.5 py-1 rounded-full bg-white/[0.02]">
              2026 EDITION
            </span>
          </div>
        </header>

        {/* Center Main Branded Showcase Area */}
        <main className="flex flex-col items-center justify-center text-center my-auto px-4 relative">
          {/* Subtle Ambient Glow behind Title */}
          <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FF3E00]/[0.05] blur-3xl pointer-events-none -z-10" />

          {/* Primary Bold Architectural Wordmark */}
          <div className="overflow-hidden">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extrabold tracking-[-0.04em] leading-none text-[#F5F5F5] select-none">
              SCRILLO
            </h1>
          </div>

          {/* Editorial Discipline Tagline */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-mono tracking-[0.3em] text-[#FF3E00] uppercase font-semibold">
              <span>UI</span>
              <span className="text-white/25">/</span>
              <span>UX</span>
              <span className="text-white/25">/</span>
              <span>WEB</span>
              <span className="text-white/25">/</span>
              <span className="text-white">CODE</span>
            </div>

            <p className="text-[11px] sm:text-xs font-mono tracking-widest text-white/40 uppercase mt-1 hidden sm:block">
              PRECISION DIGITAL PRODUCTS & INTERACTION ARCHITECTURE
            </p>
          </div>
        </main>

        {/* Bottom High-Precision Progress Station */}
        <footer>
          <ProgressStation progress={progress} state={state} />
        </footer>
      </motion.div>
    </div>
  );
}
