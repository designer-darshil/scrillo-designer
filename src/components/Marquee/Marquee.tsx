import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';
import { cn } from '../../utils/cn';

export interface MarqueeProps {
  items: string[];
  speed?: number; // Duration in seconds for one full loop cycle
  direction?: 'left' | 'right';
  enableVelocity?: boolean;
  velocityMultiplier?: number;
  separator?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'display';
  outlined?: boolean;
  bordered?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = 28,
  direction = 'left',
  enableVelocity = true,
  velocityMultiplier = 1.2,
  separator = '✦',
  size = 'display',
  outlined = false,
  bordered = true,
  pauseOnHover = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const isRtl = direction === 'right';
    const startX = isRtl ? -50 : 0;
    const targetX = isRtl ? 0 : -50;

    const ctx = gsap.context(() => {
      // 1. Core infinite translation tween with zero jump
      gsap.set(track, { xPercent: startX });

      const tween = gsap.to(track, {
        xPercent: targetX,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });

      tweenRef.current = tween;

      // 2. Scroll velocity acceleration listener
      if (enableVelocity) {
        const velTracker = ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 10) {
              // Calculate dynamic surge based on velocity
              const surge = Math.min(velocity / 120, 5) * velocityMultiplier;
              const targetTimeScale = 1 + surge;

              // Instantly accelerate and smoothly decay back to base speed
              gsap.to(tween, {
                timeScale: targetTimeScale,
                duration: 0.1,
                overwrite: 'auto',
                onComplete: () => {
                  gsap.to(tween, {
                    timeScale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto',
                  });
                },
              });
            }
          },
        });

        return () => {
          velTracker.kill();
        };
      }
    }, container);

    return () => {
      ctx.revert();
      tweenRef.current = null;
    };
  }, [speed, direction, enableVelocity, velocityMultiplier]);

  // Handle optional pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover && tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0, duration: 0.3, overwrite: 'auto' });
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.3, overwrite: 'auto' });
    }
  };

  // Typography sizing variations
  const sizeClasses = {
    sm: 'text-xs sm:text-sm font-mono tracking-widest uppercase',
    md: 'text-lg sm:text-2xl font-sans font-bold tracking-tight uppercase',
    lg: 'text-2xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tighter uppercase',
    display:
      'text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tighter uppercase leading-none',
  }[size];

  // Repeat items multiple times to fill viewport width seamlessly
  const sequence = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'w-full overflow-hidden whitespace-nowrap select-none bg-background py-4 sm:py-6',
        bordered && 'border-y border-border',
        className
      )}
    >
      <div
        ref={trackRef}
        className="inline-flex items-center will-change-transform"
        style={{ width: 'max-content' }}
      >
        {/* Set A */}
        <div className="inline-flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14">
          {sequence.map((item, idx) => (
            <span key={`a-${idx}`} className="inline-flex items-center gap-8 sm:gap-14">
              <span
                className={cn(
                  sizeClasses,
                  outlined
                    ? 'text-stroke hover:text-foreground transition-colors'
                    : 'text-foreground'
                )}
              >
                {item}
              </span>
              <span className="text-muted text-xs sm:text-sm select-none font-mono opacity-60">
                {separator}
              </span>
            </span>
          ))}
        </div>

        {/* Set B (Identical duplicate for 100% seamless mathematical loop) */}
        <div className="inline-flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14" aria-hidden="true">
          {sequence.map((item, idx) => (
            <span key={`b-${idx}`} className="inline-flex items-center gap-8 sm:gap-14">
              <span
                className={cn(
                  sizeClasses,
                  outlined
                    ? 'text-stroke hover:text-foreground transition-colors'
                    : 'text-foreground'
                )}
              >
                {item}
              </span>
              <span className="text-muted text-xs sm:text-sm select-none font-mono opacity-60">
                {separator}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
