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

const STATUS_STEPS = [
  'INITIALIZING EXPERIENCE',
  'LOADING ASSETS',
  'PREPARING INTERFACE',
  'ENTERING PORTFOLIO',
];

export const Preloader: React.FC<PreloaderProps> = ({
  brandText = defaultWebsiteData.profile!.name,
  brandSuffix = defaultWebsiteData.header!.brandSuffix,
  duration = defaultWebsiteData.settings.preloader!.duration,
  animationEnabled = true,
  onExitComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const mainHeadingRef = useRef<HTMLDivElement>(null);
  const statusLabelRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const symbolRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMotionDisabled = prefersReducedMotion || !animationEnabled;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const brand = brandRef.current;
      const mainHeading = mainHeadingRef.current;
      const statusLabel = statusLabelRef.current;
      const counter = counterRef.current;
      const symbol = symbolRef.current;
      const progressBar = progressBarRef.current;
      const hairline = hairlineRef.current;

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

      // Continuous slow rotation for the editorial symbol
      if (symbol) {
        gsap.to(symbol, {
          rotation: 360,
          duration: 4,
          repeat: -1,
          ease: 'none',
        });
      }

      const masterTl = gsap.timeline({
        onComplete: () => {
          onExitComplete?.();
        },
      });

      // 1. Initial reveals: Brand, Main Editorial "LOADING", Status & Counter
      masterTl
        .fromTo(
          brand,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
        )
        .fromTo(
          mainHeading,
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          [statusLabel, counter, symbol],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 },
          '-=0.35'
        );

      // 2. Percentage counter, status text transitions, & progress line animation
      const progressObj = { value: 0 };
      const totalCountDuration = Math.max(0.9, (duration || 1.4) * 0.85);

      let currentStatusIndex = 0;

      masterTl.to(
        progressObj,
        {
          value: 100,
          duration: totalCountDuration,
          ease: 'power2.inOut',
          onUpdate: () => {
            const currentVal = Math.floor(progressObj.value);

            // Update 00% -> 100% formatted counter
            if (counter) {
              counter.textContent = `${String(currentVal).padStart(2, '0')}%`;
            }

            // Update Progress bar & hairline scale
            const scaleRatio = progressObj.value / 100;
            if (progressBar) {
              progressBar.style.transform = `scaleX(${scaleRatio})`;
            }
            if (hairline) {
              hairline.style.transform = `scaleX(${scaleRatio})`;
            }

            // Dynamic status step transition
            const stepIndex = Math.min(
              STATUS_STEPS.length - 1,
              Math.floor((progressObj.value / 100) * STATUS_STEPS.length)
            );

            if (stepIndex !== currentStatusIndex && statusLabel) {
              currentStatusIndex = stepIndex;
              gsap.to(statusLabel, {
                opacity: 0,
                y: -4,
                duration: 0.12,
                ease: 'power2.in',
                onComplete: () => {
                  if (statusLabel) {
                    statusLabel.textContent = STATUS_STEPS[stepIndex];
                    gsap.to(statusLabel, {
                      opacity: 1,
                      y: 0,
                      duration: 0.18,
                      ease: 'power2.out',
                    });
                  }
                },
              });
            }
          },
        },
        '-=0.2'
      );

      // 3. Cinematic Exit Transition (Curtain lifts upward: yPercent: 0 -> -100)
      masterTl.to(
        container,
        {
          yPercent: -100,
          duration: 0.85,
          ease: 'power3.inOut',
          onStart: () => {
            if (container) {
              container.style.pointerEvents = 'none';
            }
          },
        },
        '+=0.15'
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
      className="fixed inset-0 z-[100000] bg-background text-foreground flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 select-none overflow-hidden will-change-transform pointer-events-auto"
    >
      {/* ========================================== */}
      {/* 1. TOP BAR: Brand / Portfolio Name */}
      {/* ========================================== */}
      <div className="flex items-center justify-between w-full">
        <div
          ref={brandRef}
          className="font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase text-foreground/90 flex items-center gap-1.5"
        >
          <span>{brandText}</span>
          {brandSuffix && (
            <span className="text-muted/70 text-[11px] font-normal tracking-wider">
              {brandSuffix}
            </span>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. CENTER: Large Dynamic "LOADING" Text */}
      {/* ========================================== */}
      <div className="flex-1 flex items-center justify-center my-auto py-8">
        <div
          ref={mainHeadingRef}
          className="select-none pointer-events-none transform -translate-y-2 sm:-translate-y-4"
        >
          <h1 className="font-sans font-extrabold tracking-tighter text-left text-foreground text-[clamp(4.25rem,13vw,13rem)] leading-[0.85] uppercase opacity-95">
            LOADING...
          </h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. BOTTOM SECTION: Status, Counter, Bar */}
      {/* ========================================== */}
      <div className="w-full space-y-4 sm:space-y-5">
        {/* Row: Status Label & Percentage with Editorial Symbol */}
        <div className="flex items-end justify-between gap-4">
          {/* Bottom Left: Dynamic Status Text */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse shrink-0" />
            <span
              ref={statusLabelRef}
              className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted truncate"
            >
              {STATUS_STEPS[0]}
            </span>
          </div>

          {/* Bottom Right: Progress Percentage & Rotating Editorial Detail */}
          <div className="flex items-baseline gap-2 shrink-0">
            <span
              ref={symbolRef}
              className="font-mono text-xs sm:text-sm text-muted inline-block select-none"
              aria-hidden="true"
            >
              °
            </span>
            <span
              ref={counterRef}
              className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground tabular-nums leading-none"
            >
              00%
            </span>
          </div>
        </div>

        {/* Visible Progress Bar Track */}
        <div className="w-full h-1 sm:h-1.5 rounded-full bg-border/40 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-foreground rounded-full scale-x-0 origin-left will-change-transform"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. BOTTOM VIEWPORT EDGE: 1px Hairline Progress */}
      {/* ========================================== */}
      {/* <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-[1px] bg-border/30 overflow-hidden"
      >
        <div
          ref={hairlineRef}
          className="w-full h-full bg-foreground scale-x-0 origin-left will-change-transform"
        />
      </div> */}
    </div>
  );
};

export default Preloader;
