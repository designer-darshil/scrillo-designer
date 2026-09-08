import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';

export const Philosophy: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal small metadata label
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 16 },
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

      // 2. Line-by-line masked text reveal
      const lines = headlineRef.current?.querySelectorAll('.philosophy-line-inner');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Subtle smooth parallax while scrolling on desktop
      if (window.innerWidth >= 768 && headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 4. Reveal bottom metadata
      gsap.fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
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
      id="philosophy"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between py-24 sm:py-36 bg-background text-foreground border-t border-border overflow-hidden select-none"
    >
      {/* Top Metadata Header */}
      <div className="page-container">
        <div ref={labelRef}>
          <SectionLabel number="04" title="DESIGN PHILOSOPHY" />
        </div>
      </div>

      {/* Main Asymmetrical Large Typographic Statement */}
      <div className="page-container my-auto py-16 sm:py-24">
        <h2
          ref={headlineRef}
          className="max-w-7xl font-sans text-display font-bold uppercase tracking-display leading-[0.90] text-foreground will-change-transform"
        >
          {/* Line 1: Great design */}
          <span className="block overflow-hidden py-1">
            <span className="philosophy-line-inner inline-block will-change-transform text-foreground">
              Great design
            </span>
          </span>

          {/* Line 2: should feel obvious (Asymmetrically Indented) */}
          <span className="block overflow-hidden py-1 pl-0 sm:pl-16 md:pl-28 lg:pl-44">
            <span className="philosophy-line-inner inline-block will-change-transform text-muted">
              should feel obvious
            </span>
          </span>

          {/* Line 3: after you see it. */}
          <span className="block overflow-hidden py-1 pl-0 sm:pl-8 md:pl-14 lg:pl-20">
            <span className="philosophy-line-inner inline-block will-change-transform text-foreground">
              after you see it.
            </span>
          </span>
        </h2>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="page-container border-t border-border pt-6">
        <div
          ref={metaRef}
          className="flex items-center justify-between font-mono text-meta text-muted"
        >
          <span className="text-foreground font-medium">— 2026</span>
          <span className="tracking-meta">PHILOSOPHY STATEMENT</span>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
