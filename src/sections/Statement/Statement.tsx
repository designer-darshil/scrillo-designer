import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';

export const Statement: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Section Label
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Animate each word separately with vertical shift, opacity, and scale
      const words = headlineRef.current?.querySelectorAll('.statement-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0.05,
            yPercent: 60,
            scale: 0.92,
          },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 75%',
              end: 'bottom 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Subtle floating entrance for decorative symbols
      const symbols = headlineRef.current?.querySelectorAll('.statement-symbol');
      if (symbols && symbols.length > 0) {
        gsap.fromTo(
          symbols,
          { opacity: 0, scale: 0.5, rotate: -20 },
          {
            opacity: 0.6,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Reveal bottom metadata
      gsap.fromTo(
        metaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: metaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-[90vh] flex flex-col justify-between py-24 sm:py-36 bg-background text-foreground border-t border-border overflow-hidden select-none"
    >
      {/* Top Header Label */}
      <div className="page-container">
        <div ref={labelRef}>
          <SectionLabel number="02" title="CREATIVE MANIFESTO" />
          <h2 className="sr-only">Creative Manifesto: Be Curious, Be Bold, Be Useful</h2>
        </div>
      </div>

      {/* Main Asymmetrical Statement Display: Huge Typography with Empty Space */}
      <div className="page-container my-auto py-16 sm:py-24">
        <div ref={headlineRef} className="max-w-7xl space-y-4 sm:space-y-6">
          {/* Line 1: BE CURIOUS.* */}
          <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-8">
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                BE
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                CURIOUS.
              </span>
            </span>
            <span aria-hidden="true" className="statement-symbol font-mono text-2xl sm:text-4xl text-muted opacity-80 align-super select-none">
              *
            </span>
          </div>

          {/* Line 2: BE BOLD.+ (Asymmetrically Indented) */}
          <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-8 pl-0 sm:pl-16 md:pl-32 lg:pl-48">
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-muted leading-[0.90] will-change-transform">
                BE
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                BOLD.
              </span>
            </span>
            <span aria-hidden="true" className="statement-symbol font-mono text-2xl sm:text-4xl text-muted opacity-80 align-super select-none">
              +
            </span>
          </div>

          {/* Line 3: BE USEFUL.°™ */}
          <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-8 pl-0 sm:pl-8 md:pl-16">
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                BE
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                USEFUL.
              </span>
            </span>
            <div aria-hidden="true" className="inline-flex items-center gap-1.5 text-muted opacity-80 align-super select-none">
              <span className="statement-symbol font-mono text-xl sm:text-3xl">°</span>
              <span className="statement-symbol font-mono text-xs sm:text-sm tracking-widest uppercase">™</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Context Meta */}
      <div className="page-container border-t border-border pt-6">
        <div ref={metaRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-meta text-muted">
          <span>[CORE DISCIPLINE PRINCIPLES]</span>
          <span className="text-foreground/80">FORM AS CONSEQUENCE OF FUNCTION AND RESTRAINT</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </section>
  );
};

export default Statement;
