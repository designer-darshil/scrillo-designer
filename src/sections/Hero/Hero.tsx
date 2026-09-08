import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton/MagneticButton';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { HeroContent } from '../../types';

interface HeroProps {
  content?: HeroContent;
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content: propContent, onHoverStateChange }) => {
  const { data } = useWebsiteData();
  const content = propContent || data.hero;

  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // GSAP Page Load Timeline & Line Reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.15,
      });

      // 1. Reveal small label (About me)
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // 2. Reveal Hero heading line by line using overflow mask
      const lines = headlineRef.current?.querySelectorAll('.headline-line-inner');
      if (lines && lines.length > 0) {
        tl.fromTo(
          lines,
          { yPercent: 115, rotateX: -10, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.5'
        );
      }

      // 3. Supporting text fade in
      tl.fromTo(
        supportingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      );

      // 4. Primary CTA appears
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.6'
      );

      // 5. Metadata and scroll indicator fade in
      tl.fromTo(
        [metaRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        '-=0.5'
      );

      // 6. Continuous subtle scroll indicator bounce
      const scrollArrow = scrollIndicatorRef.current?.querySelector('.scroll-arrow');
      if (scrollArrow) {
        gsap.to(scrollArrow, {
          y: 6,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Desktop subtle mouse parallax
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;

      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          x: xNorm * 12,
          y: yNorm * 8,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }

      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          x: xNorm * -16,
          y: yNorm * -12,
          duration: 1.5,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWorks = () => {
    const target = content.ctaLink.startsWith('#') ? content.ctaLink.substring(1) : 'works';
    const worksElement = document.getElementById(target);
    if (worksElement) {
      worksElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  const lines =
    content.headlineLines && content.headlineLines.length > 0
      ? content.headlineLines
      : content.title
      ? content.title.split('\n')
      : [
          'Building digital',
          'experiences that',
          'feel inevitable.',
        ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 select-none overflow-hidden bg-background text-foreground"
    >
      {/* Subtle Specimen Visual Asset if configured */}
      {content.heroImage && (
        <div
          aria-hidden="true"
          className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-80 aspect-[4/5] opacity-25 hover:opacity-60 transition-opacity duration-500 pointer-events-none hidden md:block overflow-hidden border border-border/80 shadow-2xl z-0"
        >
          <img
            src={content.heroImage}
            alt="Hero Specimen"
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
          />
        </div>
      )}

      {/* Top Subtle Coordinates / Spatial Anchor (Desktop) */}
      <div className="page-container relative z-10 flex items-center justify-between font-mono text-meta text-muted">
        <div ref={labelRef} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-foreground inline-block" />
          <span className="text-foreground/90 font-medium">{content.eyebrow}</span>
        </div>

        {content.subEyebrow && (
          <div ref={parallaxRef} className="hidden sm:flex items-center gap-6 text-muted uppercase">
            <span>{content.subEyebrow.split('/')[0]?.trim()}</span>
            {content.subEyebrow.includes('/') && <span>/</span>}
            {content.subEyebrow.includes('/') && (
              <span>{content.subEyebrow.split('/')[1]?.trim()}</span>
            )}
          </div>
        )}
      </div>

      {/* Main Asymmetrical Content */}
      <div className="page-container my-auto pt-16 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-6xl">
          {/* Large Headline */}
          <h1
            ref={headlineRef}
            className="text-display font-bold uppercase tracking-display leading-[0.90] text-foreground will-change-transform"
          >
            {lines.map((line, idx) => (
              <span key={idx} className="block overflow-hidden py-1">
                <span
                  className={`headline-line-inner inline-block will-change-transform ${
                    idx === 1 ? 'text-foreground/95' : idx === 2 ? 'text-muted' : ''
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* Lower Asymmetrical Row: Supporting Text + Primary CTA */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-end">
            {/* Supporting Description */}
            <div ref={supportingRef} className="lg:col-span-7 xl:col-span-6">
              <p className="text-body-editorial text-muted leading-relaxed font-light text-pretty">
                {content.description}
              </p>
            </div>

            {/* Primary CTA (View Selected Works) */}
            <div ref={ctaRef} className="lg:col-span-5 xl:col-span-6 flex items-center lg:justify-end w-full sm:w-auto">
              <MagneticButton onClick={scrollToWorks} strength={0.3} className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToWorks}
                  data-cursor="cta"
                  data-cursor-text="OPEN →"
                  onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                  onMouseLeave={() => onHoverStateChange?.(false)}
                  className="group w-full sm:w-auto min-h-[48px] flex items-center justify-between sm:justify-center gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-foreground text-background font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-all focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                >
                  <span>{content.ctaText}</span>
                  <div className="w-5 h-5 flex items-center justify-center bg-background text-foreground group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metadata & Scroll Indicator Bar */}
      <div className="page-container border-t border-border pt-4 sm:pt-6 flex items-center justify-between font-mono text-meta text-muted">
        {/* Left: Year Metadata */}
        <div ref={metaRef} className="flex items-center gap-3">
          <span className="text-foreground font-semibold">{content.year}</span>
          {content.yearLabel && (
            <>
              <span className="text-border">/</span>
              <span className="hidden sm:inline">{content.yearLabel}</span>
            </>
          )}
        </div>

        {/* Right: Scroll Down Indicator with Kinetic Arrow */}
        <div
          ref={scrollIndicatorRef}
          onClick={scrollToWorks}
          className="group cursor-pointer flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          onMouseEnter={() => onHoverStateChange?.(true, 'link')}
          onMouseLeave={() => onHoverStateChange?.(false)}
        >
          <span className="tracking-widest font-medium">{content.scrollLabel}</span>
          <span className="scroll-arrow inline-block">
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

