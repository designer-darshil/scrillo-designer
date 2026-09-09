import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

interface PreloaderProps {
  brandText?: string;
  brandSuffix?: string;
  duration?: number;
  animationEnabled?: boolean;
  onExitComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  brandText = defaultWebsiteData.profile!.name,
  brandSuffix = defaultWebsiteData.header!.brandSuffix,
  duration = defaultWebsiteData.settings.preloader!.duration,
  animationEnabled = true,
  onExitComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMotionDisabled = prefersReducedMotion || !animationEnabled;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const brand = brandRef.current;
      const counter = counterRef.current;
      const progressBar = progressBarRef.current;

      if (!container) return;

      if (isMotionDisabled) {
        // Fast accessible exit for reduced motion
        gsap.to(container, {
          opacity: 0,
          duration: 0.25,
          delay: 0.15,
          ease: 'power2.out',
          onComplete: () => onExitComplete?.(),
        });
        return;
      }

      const masterTl = gsap.timeline({
        onComplete: () => {
          onExitComplete?.();
        },
      });

      // 1. Brand & Counter reveal (0.0s - 0.3s)
      masterTl
        .fromTo(
          brand,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        )
        .fromTo(
          counter,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
          '-=0.25'
        );

      // 2. Percentage counter & 1px progress line animation
      const progressObj = { value: 0 };
      const countDuration = Math.max(0.7, (duration || 1.2) * 0.75);

      masterTl.to(
        progressObj,
        {
          value: 100,
          duration: countDuration,
          ease: 'power2.inOut',
          onUpdate: () => {
            const currentVal = Math.floor(progressObj.value);
            if (counter) {
              counter.textContent = `${String(currentVal).padStart(2, '0')}%`;
            }
            if (progressBar) {
              progressBar.style.transform = `scaleX(${progressObj.value / 100})`;
            }
          },
        },
        '-=0.15'
      );

      // 3. Clean upward exit (yPercent: 0 -> -100)
      masterTl.to(
        container,
        {
          yPercent: -100,
          duration: 0.6,
          ease: 'power4.inOut',
          onStart: () => {
            if (container) {
              container.style.pointerEvents = 'none';
            }
          },
        },
        '+=0.1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [duration, animationEnabled, onExitComplete]);

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-label="Loading website"
      aria-live="polite"
      className="fixed inset-0 z-[100000] bg-background text-foreground flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none overflow-hidden will-change-transform"
    >
      {/* TOP: Brand / Name */}
      <div
        ref={brandRef}
        className="font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase text-foreground/90 flex items-center gap-1"
      >
        <span>{brandText}</span>
        {brandSuffix && (
          <span className="text-muted/70 text-[11px] font-normal">{brandSuffix}</span>
        )}
      </div>

      {/* BOTTOM RIGHT: Restrained Percentage Counter */}
      <div className="flex justify-end items-end">
        <span
          ref={counterRef}
          className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground tabular-nums leading-none"
        >
          00%
        </span>
      </div>

      {/* BOTTOM: 1px Hairline Progress Line (0 -> 100%) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-[1px] bg-border/40 overflow-hidden"
      >
        <div
          ref={progressBarRef}
          className="w-full h-full bg-foreground scale-x-0 origin-left will-change-transform"
        />
      </div>
    </div>
  );
};

export default Preloader;
