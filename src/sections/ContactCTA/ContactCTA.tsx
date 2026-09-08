import React, { useEffect, useRef } from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { MagneticButton } from '../../components/MagneticButton/MagneticButton';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';

export const ContactCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const email = 'contact@darshilbhuva.com';

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
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Headline line-by-line reveal
      const lines = headlineRef.current?.querySelectorAll('.cta-headline-line');
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
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Secondary text reveal
      if (secondaryRef.current) {
        gsap.fromTo(
          secondaryRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: secondaryRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. CTA button reveal with spring
      if (ctaBtnRef.current) {
        gsap.fromTo(
          ctaBtnRef.current,
          { opacity: 0, scale: 0.94, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: ctaBtnRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 5. Subtle background grid movement during scroll
      if (bgGridRef.current) {
        gsap.to(bgGridRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-[85vh] md:min-h-[92vh] flex flex-col justify-between py-24 sm:py-36 bg-background text-foreground border-t border-border overflow-hidden select-none"
    >
      {/* Subtle Background Grid Movement while Scrolling */}
      <div
        ref={bgGridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,var(--text)_1px,transparent_1px),linear-gradient(to_bottom,var(--text)_1px,transparent_1px)] bg-[size:48px_48px] will-change-transform"
      />

      {/* Top Header Label */}
      <div className="page-container relative z-10">
        <div ref={labelRef}>
          <SectionLabel number="06" title="INITIATE COLLABORATION" />
        </div>
      </div>

      {/* Main Climax Content: Extremely Large Typography & Huge Negative Space */}
      <div className="page-container relative z-10 my-auto py-16 sm:py-24">
        <div className="max-w-6xl space-y-8 sm:space-y-12">
          {/* Main Huge Headline */}
          <h2
            ref={headlineRef}
            className="text-display font-bold uppercase tracking-display leading-[0.90] text-foreground will-change-transform"
          >
            <span className="block overflow-hidden py-1">
              <span className="cta-headline-line inline-block will-change-transform">
                HAVE SOMETHING
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="cta-headline-line inline-block will-change-transform text-muted">
                WORTH BUILDING?
              </span>
            </span>
          </h2>

          {/* Secondary Line */}
          <p
            ref={secondaryRef}
            className="text-2xl sm:text-3xl md:text-4xl text-muted font-light tracking-tight"
          >
            Let's make it real.
          </p>

          {/* Primary CTA Button with Magnetic Pull & Inverted Color Hover */}
          <div ref={ctaBtnRef} className="pt-4 sm:pt-6 w-full sm:w-auto">
            <MagneticButton strength={0.35} className="w-full sm:w-auto">
              <a
                href={`mailto:${email}?subject=Project%20Inquiry`}
                data-cursor="cta"
                data-cursor-text="OPEN →"
                className="group w-full sm:w-auto min-h-[52px] inline-flex items-center justify-between sm:justify-center gap-4 sm:gap-6 px-8 sm:px-12 py-5 sm:py-7 bg-foreground text-background border border-foreground font-mono text-xs sm:text-base font-bold uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
              >
                <span>START A PROJECT</span>
                <div className="w-6 h-6 flex items-center justify-center text-background group-hover:text-foreground group-hover:translate-x-2 transition-all duration-300 shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Context Metadata */}
      <div className="page-container relative z-10 border-t border-border pt-6">
        <div
          ref={metaRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-meta text-muted"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-foreground/90">AVAILABLE FOR COMMISSIONS WORLDWIDE</span>
          </div>

          <a
            href={`mailto:${email}`}
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            {email}
          </a>

          <span>21.1702° N, 72.8311° E</span>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
