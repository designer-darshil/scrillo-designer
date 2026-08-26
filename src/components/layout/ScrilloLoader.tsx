import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type LoaderState = 'IDLE' | 'ACTIVE' | 'EXITING';

interface ScrilloLoaderProps {
  /** Optional manual readiness override */
  isReady?: boolean;
}

/**
 * Utility: Wait for critical above-the-fold images in destination page
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

      // Max image wait safeguard (350ms)
      setTimeout(resolve, 350);
    } catch {
      resolve();
    }
  });
}

/**
 * Utility: Wait for fonts readiness
 */
function waitForFonts(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => resolve()).catch(() => resolve());
        setTimeout(resolve, 200);
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

  const [state, setState] = useState<LoaderState>('ACTIVE');
  const navIdRef = useRef(0);
  const isFirstMountRef = useRef(true);

  // Manage body scroll locking during active loader
  useEffect(() => {
    if (state !== 'IDLE') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [state]);

  // Navigation and refresh transition coordinator
  const runTransition = useCallback((targetNavId: number) => {
    setState('ACTIVE');

    const startTime = performance.now();
    const minDisplayDuration = 450; // Clean, brief presentation so the brand entrance is perceived

    let isDone = false;
    let exitTimeout: ReturnType<typeof setTimeout>;
    let finishTimeout: ReturnType<typeof setTimeout>;

    const completeLoader = () => {
      if (isDone || navIdRef.current !== targetNavId) return;
      isDone = true;

      const elapsed = performance.now() - startTime;
      const remainingTime = Math.max(0, minDisplayDuration - elapsed);

      exitTimeout = setTimeout(() => {
        if (navIdRef.current !== targetNavId) return;
        setState('EXITING');

        finishTimeout = setTimeout(() => {
          if (navIdRef.current !== targetNavId) return;
          setState('IDLE');
        }, prefersReducedMotion ? 180 : 550);
      }, remainingTime);
    };

    // Parallel check for destination DOM, fonts, and critical images
    const checkReadiness = async () => {
      // Allow React to commit the new route DOM
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      if (navIdRef.current !== targetNavId) return;

      await Promise.all([waitForFonts(), waitForCriticalImages()]);

      if (navIdRef.current !== targetNavId) return;

      completeLoader();
    };

    checkReadiness();

    // Catastrophic safeguard (1.8s maximum)
    const safeguardTimer = setTimeout(() => {
      if (navIdRef.current === targetNavId && !isDone) {
        completeLoader();
      }
    }, 1800);

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(finishTimeout);
      clearTimeout(safeguardTimer);
    };
  }, [prefersReducedMotion]);

  // Trigger on full page load AND on every route navigation
  useEffect(() => {
    navIdRef.current += 1;
    const currentNavId = navIdRef.current;

    if (!isFirstMountRef.current) {
      window.scrollTo(0, 0);
    }
    isFirstMountRef.current = false;

    const cleanup = runTransition(currentNavId);
    return cleanup;
  }, [location.pathname, location.search, runTransition]);

  // Handle external manual readiness override if provided
  useEffect(() => {
    if (isReady && state === 'ACTIVE') {
      setState('EXITING');
      const timer = setTimeout(() => setState('IDLE'), prefersReducedMotion ? 180 : 550);
      return () => clearTimeout(timer);
    }
  }, [isReady, state, prefersReducedMotion]);

  if (state === 'IDLE') {
    return null;
  }

  // Smooth, controlled luxury easing curve
  const transitionEase = [0.76, 0, 0.24, 1];
  const isExiting = state === 'EXITING';

  return (
    <div
      id="scrillo-brand-loader"
      aria-live="polite"
      aria-busy={state === 'ACTIVE'}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] pointer-events-auto select-none overflow-hidden bg-[#050505] flex flex-col justify-between p-8 sm:p-12 md:p-16 text-[#F5F5F5]"
      style={{
        transform: isExiting && !prefersReducedMotion ? 'translateY(-100%)' : 'translateY(0%)',
        opacity: isExiting && prefersReducedMotion ? 0 : 1,
        transition: prefersReducedMotion
          ? 'opacity 180ms ease-out'
          : 'transform 550ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      {/* Top Brand Bar */}
      <header className="flex items-center justify-between w-full">
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/50 font-medium">
          SCRILLO
        </span>
        <span className="font-mono text-xs tracking-[0.25em] text-white/40">
          2026
        </span>
      </header>

      {/* Main Center Brand Showcase */}
      <main className="flex flex-col items-center justify-center text-center my-auto px-4">
        <h1 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold tracking-tight leading-none text-[#F5F5F5] select-none">
          SCRILLO
        </h1>
        <div className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm tracking-[0.35em] text-white/40 uppercase font-medium">
          UI / UX / WEB
        </div>
      </main>

      {/* Bottom Metadata Bar */}
      <footer className="flex items-center justify-between w-full font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
        <span>DESIGN + CODE</span>
        <span className="text-[#FF3E00]">PORTFOLIO</span>
      </footer>
    </div>
  );
}
