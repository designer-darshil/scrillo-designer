import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

type LoaderState = 'IDLE' | 'LOADING' | 'WAITING_FOR_PAGE' | 'READY' | 'EXITING' | 'COMPLETE';

interface ScrilloLoaderProps {
  /** Optional manual readiness override */
  isReady?: boolean;
}

/**
 * Isolated Progress Sub-Component
 * Renders the hairline track and numerical percentage without causing full layout re-renders.
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
            transform: `scaleX(${Math.max(0, Math.min(progress, 100)) / 100})`,
            transition: 'transform 80ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
      </div>

      {/* Numeric Counter with fixed width to prevent layout shift */}
      <span className="text-white font-medium tabular-nums w-[3.5ch] text-right">
        {Math.round(progress)}%
      </span>
    </div>
  );
});

/**
 * Utility: Wait for critical above-the-fold images to load or error out
 */
function waitForCriticalImages(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const main = document.querySelector('main');
      if (!main) {
        resolve();
        return;
      }

      // Find visible/critical images within main content
      const images = Array.from(main.querySelectorAll('img')).slice(0, 6);
      const pendingImages = images.filter((img) => !img.complete && img.src);

      if (pendingImages.length === 0) {
        resolve();
        return;
      }

      let remaining = pendingImages.length;
      const onImageFinish = () => {
        remaining -= 1;
        if (remaining <= 0) resolve();
      };

      pendingImages.forEach((img) => {
        if (img.complete) {
          onImageFinish();
        } else {
          img.addEventListener('load', onImageFinish, { once: true });
          img.addEventListener('error', onImageFinish, { once: true });
        }
      });

      // Max image wait safeguard (600ms)
      setTimeout(resolve, 600);
    } catch {
      resolve();
    }
  });
}

/**
 * Utility: Wait for critical fonts to load
 */
function waitForFonts(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => resolve()).catch(() => resolve());
        // Max font wait safeguard (300ms)
        setTimeout(resolve, 300);
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
    const targetPreloadTime = 650; // Smooth initial ramp to ~90%
    let animFrameId: number;
    let isDestinationReady = false;

    // Track readiness resolution
    const checkReadiness = async () => {
      // 1. Double requestAnimationFrame to ensure React has mounted the new route DOM
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      if (navIdRef.current !== targetNavId) return;

      // 2. Parallel check for fonts and critical route images
      await Promise.all([waitForFonts(), waitForCriticalImages()]);

      if (navIdRef.current !== targetNavId) return;

      // Destination is now genuinely ready
      isDestinationReady = true;
    };

    checkReadiness();

    // Progress animation tick
    const tick = (now: number) => {
      if (navIdRef.current !== targetNavId) return;

      const elapsed = now - startTime;

      if (!isDestinationReady) {
        // Smoothly approach 92% while waiting for the page to be ready
        const ratio = Math.min(elapsed / targetPreloadTime, 1);
        const currentProg = Math.floor(ratio * 92);
        setProgress(currentProg);
        setState('WAITING_FOR_PAGE');
        animFrameId = requestAnimationFrame(tick);
      } else {
        // Page is ready! Leap smoothly to 100%
        setState('READY');
        setProgress(100);

        // Brief hold at 100% so the user perceives completion
        const exitTimer = setTimeout(() => {
          if (navIdRef.current !== targetNavId) return;
          setState('EXITING');

          // Transition to COMPLETE/IDLE after curtain panels part
          const completeTimer = setTimeout(() => {
            if (navIdRef.current !== targetNavId) return;
            setState('COMPLETE');
          }, prefersReducedMotion ? 250 : 800);

          return () => clearTimeout(completeTimer);
        }, 120);

        return () => clearTimeout(exitTimer);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    // Safety fallback (2.5s maximum) to guarantee user is never blocked
    const fallbackTimer = setTimeout(() => {
      if (navIdRef.current === targetNavId && !isDestinationReady) {
        isDestinationReady = true;
      }
    }, 2500);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(fallbackTimer);
    };
  }, [prefersReducedMotion]);

  // Trigger loader on full refresh (mount) AND on every route navigation
  useEffect(() => {
    navIdRef.current += 1;
    const currentNavId = navIdRef.current;

    // Scroll to top immediately when route changes under the cover of the loader
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

  const curtainEase = [0.85, 0, 0.15, 1]; // Premium editorial bezier
  const isExiting = state === 'EXITING';

  return (
    <div
      id="scrillo-global-loader"
      aria-live="polite"
      aria-busy={state !== 'EXITING'}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] pointer-events-auto select-none overflow-hidden bg-[#050505]"
      style={{
        opacity: isExiting && prefersReducedMotion ? 0 : 1,
        transition: prefersReducedMotion ? 'opacity 250ms ease-out' : undefined,
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
            delay: 0.04,
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
            duration: 0.75,
            ease: curtainEase,
            delay: 0.04,
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
          duration: prefersReducedMotion ? 0.2 : 0.35,
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

          {/* Isolated progress component */}
          <ProgressTracker progress={progress} />
        </footer>
      </motion.div>
    </div>
  );
}
