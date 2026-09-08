import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { Asterisk } from 'lucide-react';

interface PreloaderProps {
  brandText?: string;
  brandSubtitle?: string;
  isReady?: boolean;
  onExitComplete?: () => void;
}

const statusPhrases = [
  'INITIALIZING EXPERIENCE',
  'LOADING CORE ASSETS',
  'PREPARING INTERFACE',
  'ENTERING PORTFOLIO',
];

export const Preloader: React.FC<PreloaderProps> = ({
  brandText = 'DARSHIL BHUVA',
  brandSubtitle = 'DIGITAL PRODUCT DESIGNER',
  isReady = false,
  onExitComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const mainTextInnerRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const gridOverlayRef = useRef<HTMLDivElement>(null);

  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const isExitingRef = useRef<boolean>(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const brand = brandRef.current;
      const mainTextInner = mainTextInnerRef.current;
      const statusText = statusTextRef.current;
      const counter = counterRef.current;
      const symbol = symbolRef.current;
      const progressBar = progressBarRef.current;

      if (!container) return;

      if (prefersReducedMotion) {
        // Fast, accessible transition for reduced motion users
        const tl = gsap.timeline({
          onComplete: () => onExitComplete?.(),
        });
        tl.to(container, {
          opacity: 0,
          duration: 0.35,
          delay: 0.15,
          ease: 'power2.out',
        });
        return;
      }

      // Continuous subtle editorial symbol rotation
      if (symbol) {
        gsap.to(symbol, {
          rotate: 360,
          duration: 9,
          repeat: -1,
          ease: 'linear',
        });
      }

      // 1. Entrance timeline (0.0s - 0.4s)
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entranceTl
        .fromTo(
          brand,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.08 }
        )
        .fromTo(
          mainTextInner,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
          '-=0.35'
        )
        .fromTo(
          [statusText, counter, symbol],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          '-=0.45'
        );

      // 2. Percentage counter object and progress line animation (0.3s - 1.5s)
      const progressObj = { value: 0 };

      // Animate smoothly to ~88% while waiting for isReady
      const countTween = gsap.to(progressObj, {
        value: 88,
        duration: 1.4,
        ease: 'power1.out',
        onUpdate: () => {
          const currentVal = Math.floor(progressObj.value);
          if (counter) {
            counter.textContent = `${String(currentVal).padStart(2, '0')}%`;
          }
          if (progressBar) {
            gsap.set(progressBar, { scaleX: progressObj.value / 100 });
          }

          // Cycle status phrase smoothly based on progress
          if (currentVal < 32) {
            setCurrentStatusIndex(0);
          } else if (currentVal < 68) {
            setCurrentStatusIndex(1);
          } else {
            setCurrentStatusIndex(2);
          }
        },
      });

      // Status text transition animation
      const updateStatusText = (phrase: string) => {
        if (!statusText) return;
        gsap.fromTo(
          statusText,
          { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      };

      // 3. When isReady flips to true (1.0s - 1.8s), smoothly finish to 100% and execute upward curtain lift
      if (isReady && !isExitingRef.current) {
        isExitingRef.current = true;
        countTween.kill();
        const finishTl = gsap.timeline();

        finishTl
          .to(progressObj, {
            value: 100,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => {
              const currentVal = Math.floor(progressObj.value);
              if (counter) {
                counter.textContent = `${String(currentVal).padStart(2, '0')}%`;
              }
              if (progressBar) {
                gsap.set(progressBar, { scaleX: progressObj.value / 100 });
              }
            },
          })
          .add(() => {
            setCurrentStatusIndex(3);
            updateStatusText(statusPhrases[3]);
          })
          // Micro delay before curtain lift so 100% is perceived
          .to(
            [mainTextInner, statusText, counter, brand, symbol],
            {
              y: -16,
              opacity: 0,
              duration: 0.35,
              stagger: 0.03,
              ease: 'power2.in',
            },
            '+=0.15'
          )
          // Master curtain lift upward out of the viewport
          .to(container, {
            yPercent: -100,
            duration: 0.95,
            ease: 'power4.inOut',
            onStart: () => {
              // Disable pointer events immediately on exit start
              if (container) {
                container.style.pointerEvents = 'none';
              }
            },
            onComplete: () => {
              onExitComplete?.();
            },
          });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReady, onExitComplete]);

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-label="Loading website"
      aria-live="polite"
      className="fixed inset-0 z-[100000] bg-background text-foreground flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 select-none overflow-hidden will-change-transform"
    >
      {/* Subtle Dot Grid Background Texture */}
      <div
        ref={gridOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(var(--text)_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      {/* TOP BAR: Brand Name & Meta Tagline */}
      <div
        ref={brandRef}
        className="relative z-10 flex items-start justify-between font-mono text-meta uppercase tracking-widest text-muted"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-foreground inline-block" />
            {brandText}
          </span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="text-[11px] text-muted/80">{brandSubtitle}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">SYSTEM READY</span>
        </div>
      </div>

      {/* CENTER: Massive Art-Directed LOADING Typography */}
      <div className="relative z-10 my-auto py-4 sm:py-8">
        <div className="max-w-7xl overflow-hidden py-1 sm:py-2 -translate-y-2 sm:-translate-y-4">
          <h1 className="font-sans text-[clamp(3.75rem,13vw,13.5rem)] font-extrabold uppercase tracking-[-0.04em] text-foreground leading-[0.84] select-none will-change-transform">
            <span
              ref={mainTextInnerRef}
              className="inline-block will-change-transform text-foreground"
            >
              LOADING
            </span>
          </h1>
        </div>
      </div>

      {/* BOTTOM BAR: Status Text & Percentage Counter */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-t border-border/70 pt-5 sm:pt-6">
        {/* Left: Dynamic Small Status Label */}
        <div className="flex items-center gap-3 font-mono text-xs sm:text-[13px] tracking-widest uppercase text-muted">
          <span className="text-foreground/60 font-semibold">
            [0{currentStatusIndex + 1}]
          </span>
          <span ref={statusTextRef} className="text-foreground font-medium truncate">
            {statusPhrases[currentStatusIndex]}
          </span>
        </div>

        {/* Right: Percentage Counter & Rotating Symbol */}
        <div className="flex items-baseline gap-3.5 self-end sm:self-auto">
          <div ref={symbolRef} className="text-muted/70 flex items-center justify-center">
            <Asterisk className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/80" />
          </div>

          <span
            ref={counterRef}
            className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground tabular-nums leading-none"
          >
            00%
          </span>
        </div>
      </div>

      {/* BOTTOM HAIRLINE PROGRESS BAR (0 -> 100%) */}
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
