import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { AboutContent } from '../../types';

interface StatementProps {
  content?: AboutContent;
}

export const Statement: React.FC<StatementProps> = ({ content: propContent }) => {
  const { data } = useWebsiteData();
  const content = propContent || data.about;

  if (content.visible === false) return null;

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

  const sectionNumber = content.number || '02';
  const sectionLabel = content.label || 'CREATIVE MANIFESTO';
  const line1 = content.line1 || 'BE CURIOUS.';
  const line2 = content.line2 || 'BE BOLD.';
  const line3 = content.line3 || 'BE USEFUL.';
  const corePrinciples = content.supportingText || content.corePrinciples || 'FORM AS CONSEQUENCE OF FUNCTION AND RESTRAINT';
  const yearMeta = content.yearMeta || 'EST. 2026';

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-[90vh] flex flex-col justify-between py-24 sm:py-36 bg-background text-foreground border-t border-border overflow-hidden select-none"
    >
      {/* Top Header Label */}
      <div className="page-container">
        <div ref={labelRef}>
          <SectionLabel number={sectionNumber} title={sectionLabel} />
          <h2 className="sr-only">Creative Manifesto: {line1}, {line2}, {line3}</h2>
        </div>
      </div>

      {/* Main Asymmetrical Statement Display */}
      <div className="page-container my-auto py-16 sm:py-24">
        <div ref={headlineRef} className="max-w-7xl space-y-4 sm:space-y-6">
          {/* Line 1: BE CURIOUS.* */}
          <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-8">
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                {line1.split(' ')[0] || 'BE'}
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                {line1.split(' ').slice(1).join(' ') || 'CURIOUS.'}
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
                {line2.split(' ')[0] || 'BE'}
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                {line2.split(' ').slice(1).join(' ') || 'BOLD.'}
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
                {line3.split(' ')[0] || 'BE'}
              </span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <span className="statement-word inline-block font-sans text-display font-bold uppercase tracking-display text-foreground leading-[0.90] will-change-transform">
                {line3.split(' ').slice(1).join(' ') || 'USEFUL.'}
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
          <span className="text-foreground/80">{corePrinciples}</span>
          <span>{yearMeta}</span>
        </div>
      </div>
    </section>
  );
};

export default Statement;

