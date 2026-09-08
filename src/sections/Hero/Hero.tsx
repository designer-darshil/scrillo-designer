import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton/MagneticButton';

interface HeroProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHoverStateChange }) => {
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
    const worksElement = document.getElementById('works');
    if (worksElement) {
      worksElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 select-none overflow-hidden bg-background text-foreground"
    >
      {/* Top Subtle Coordinates / Spatial Anchor (Desktop) */}
      <div className="page-container flex items-center justify-between font-mono text-meta text-muted">
        <div ref={labelRef} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-foreground inline-block" />
          <span className="text-foreground/90 font-medium">(About me)</span>
        </div>

        <div ref={parallaxRef} className="hidden sm:flex items-center gap-6 text-muted">
          <span>PORTFOLIO SPECIMEN</span>
          <span>/</span>
          <span>AVAILABLE FOR SELECT COMMISSIONS</span>
        </div>
      </div>

      {/* Main Asymmetrical Content: Anchored toward the lower portion of the viewport with huge negative space */}
      <div className="page-container my-auto pt-16 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-6xl">
          {/* Large Headline (2-3 Lines, tight line-height, negative letter-spacing) */}
          <h1
            ref={headlineRef}
            className="text-display font-bold uppercase tracking-display leading-[0.90] text-foreground will-change-transform"
          >
            <span className="block overflow-hidden py-1">
              <span className="headline-line-inner inline-block will-change-transform">
                Building digital
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="headline-line-inner inline-block will-change-transform text-foreground/95">
                experiences that
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="headline-line-inner inline-block will-change-transform text-muted">
                feel inevitable.
              </span>
            </span>
          </h1>

          {/* Lower Asymmetrical Row: Supporting Text + Primary CTA */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-end">
            {/* Supporting Description */}
            <div ref={supportingRef} className="lg:col-span-7 xl:col-span-6">
              <p className="text-body-editorial text-muted leading-relaxed font-light text-pretty">
                Digital product designer & creative developer focused on thoughtful interfaces, products and interactive experiences.
              </p>
            </div>

            {/* Primary CTA (View Selected Works) */}
            <div ref={ctaRef} className="lg:col-span-5 xl:col-span-6 flex items-center lg:justify-end">
              <MagneticButton onClick={scrollToWorks} strength={0.3}>
                <button
                  type="button"
                  onClick={scrollToWorks}
                  data-cursor="cta"
                  data-cursor-text="OPEN →"
                  onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                  onMouseLeave={() => onHoverStateChange?.(false)}
                  className="group flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-foreground text-background font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[#E0E0DC] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                >
                  <span>VIEW SELECTED WORKS</span>
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
        {/* Left: 2026 Year Metadata */}
        <div ref={metaRef} className="flex items-center gap-3">
          <span className="text-foreground font-semibold">2026</span>
          <span className="text-border">/</span>
          <span className="hidden sm:inline">FOLIO ARCHIVE</span>
        </div>

        {/* Right: Scroll Down Indicator with Kinetic Arrow */}
        <div
          ref={scrollIndicatorRef}
          onClick={scrollToWorks}
          className="group cursor-pointer flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          onMouseEnter={() => onHoverStateChange?.(true, 'link')}
          onMouseLeave={() => onHoverStateChange?.(false)}
        >
          <span className="tracking-widest font-medium">SCROLL</span>
          <span className="scroll-arrow inline-block">
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
