import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';

export const ExperimentalImage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = imageWrapperRef.current;
      const img = imageRef.current;
      const caption = captionRef.current;

      if (!wrapper || !img) return;

      // 1. Image Clip-Path Reveal Animation
      gsap.fromTo(
        wrapper,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.3,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Slow Scale, Vertical Parallax & Slight Horizontal Shift while Scrolling
      gsap.fromTo(
        img,
        {
          scale: 1.15,
          y: -40,
          x: 20,
        },
        {
          scale: 1.0,
          y: 40,
          x: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // 3. Caption Reveal
      if (caption) {
        gsap.fromTo(
          caption,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[75vh] md:min-h-[85vh] lg:min-h-[95vh] bg-background border-t border-border overflow-hidden select-none"
    >
      {/* Full-width Cinematic Image Wrapper with Clip-Path Reveal */}
      <div
        ref={imageWrapperRef}
        className="relative w-full h-[75vh] md:h-[85vh] lg:h-[95vh] overflow-hidden will-change-[clip-path]"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        {/* High-Resolution Black-and-White Cinematic Visual */}
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=85"
          alt="Monolithic Architectural Visual Study"
          loading="lazy"
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 will-change-transform"
        />

        {/* CSS-Only Lightweight Subtle Film Grain Texture Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(var(--text)_1px,transparent_1px)] bg-[size:4px_4px]"
        />

        {/* Subtle Vignette Shading for Cinematic Depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 opacity-70"
        />

        {/* Tiny Editorial Caption Overlay at the Bottom */}
        <div
          ref={captionRef}
          className="absolute bottom-6 sm:bottom-10 left-0 w-full z-10 pointer-events-none"
        >
          <div className="page-container flex items-center justify-between text-meta text-foreground/90 drop-shadow-md">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground inline-block" />
              <span>Selected visual study — 2026</span>
            </span>

            <span className="hidden sm:inline font-mono text-muted text-xs">
              [SPATIAL ARTIFACT // 35MM MONOCHROME]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperimentalImage;
