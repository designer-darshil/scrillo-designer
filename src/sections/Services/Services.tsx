import React, { useEffect, useRef } from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

const servicesList: ServiceItem[] = [
  {
    number: '01',
    title: 'Website Design',
    description:
      'Art-directed, high-impact digital flagships with distinct typographic character, tailored micro-animations, and performance-first architecture.',
    deliverables: ['Creative Direction', 'Editorial Layouts', 'Responsive Prototyping'],
  },
  {
    number: '02',
    title: 'Product Design',
    description:
      'End-to-end digital product design from conceptual wireframing to high-fidelity design systems, intuitive user flows, and rigorous design tokens.',
    deliverables: ['UI/UX Systems', 'User Workflows', 'Figma Libraries'],
  },
  {
    number: '03',
    title: 'UI / Visual Design',
    description:
      'Monochrome & high-contrast visual identities, bespoke layout grids, editorial typography systems, and tactile digital interfaces.',
    deliverables: ['Visual Systems', 'Typography Systems', 'Design Tokens'],
  },
  {
    number: '04',
    title: 'Creative Development',
    description:
      'Frontend engineering in React, Next.js, and TypeScript with fluid GSAP choreographies, custom WebGL shaders, and 60/120fps smooth scrolling.',
    deliverables: ['React / Next.js', 'GSAP & Lenis', 'Motion Engineering'],
  },
];

export const Services: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

      // 2. Reveal Heading
      const headingInner = headingRef.current?.querySelector('.services-heading-inner');
      if (headingInner) {
        gsap.fromTo(
          headingInner,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Staggered reveal for service rows
      const rows = listRef.current?.querySelectorAll('.service-row');
      if (rows && rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative py-28 sm:py-36 bg-background text-foreground border-t border-border select-none overflow-hidden"
    >
      {/* Top Section Header */}
      <div className="page-container mb-16 sm:mb-24">
        <div ref={labelRef} className="mb-6">
          <SectionLabel number="05" title="COMMISSION SCOPE" />
        </div>

        {/* Section Heading: SERVICES */}
        <h2
          ref={headingRef}
          className="text-heading-section font-bold uppercase tracking-heading leading-[0.92] text-foreground"
        >
          <span className="block overflow-hidden py-1">
            <span className="services-heading-inner inline-block will-change-transform">
              SERVICES
            </span>
          </span>
        </h2>
      </div>

      {/* Asymmetrical 12-Column Service Rows */}
      <div ref={listRef} className="w-full border-b border-border">
        {servicesList.map((svc) => (
          <article
            key={svc.number}
            data-cursor="link"
            className="service-row group relative border-t border-border py-10 sm:py-14 lg:py-16 hover:bg-surface/40 transition-colors duration-300"
          >
            {/* Animated Bottom/Top Underline Accent */}
            <span className="absolute left-0 top-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out pointer-events-none z-10" />

            <div className="page-container editorial-grid items-start gap-y-6">
              {/* Left Column (2 Cols Desktop): Number */}
              <div className="col-span-4 md:col-span-2 lg:col-span-2 flex items-baseline">
                <span className="font-mono text-2xl sm:text-3xl md:text-4xl text-muted/40 group-hover:text-foreground font-light transition-colors duration-300">
                  [{svc.number}]
                </span>
              </div>

              {/* Center Column (5 Cols Desktop): Title & Arrow */}
              <div className="col-span-4 md:col-span-6 lg:col-span-5 space-y-3">
                <div className="flex items-center gap-3 group-hover:translate-x-3 transition-transform duration-300 ease-out">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold uppercase tracking-tight text-foreground">
                    {svc.title}
                  </h3>
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground shrink-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>

                {/* Tags / Deliverables */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {svc.deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-foreground bg-surface border border-border/80 px-2.5 py-1 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column (5 Cols Desktop): Short Description */}
              <div className="col-span-4 md:col-span-8 md:col-start-3 lg:col-span-5 lg:col-start-8 pt-2">
                <p className="text-body-editorial text-sm sm:text-base text-muted font-light leading-relaxed text-pretty">
                  {svc.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Section Meta */}
      <div className="page-container mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-meta text-muted">
        <span>[SCOPE OF WORK // BESPOKE ENGAGEMENTS]</span>
        <span>ACCEPTING COMMISSIONS WORLDWIDE</span>
        <span>Q2 / Q3 2026</span>
      </div>
    </section>
  );
};

export default Services;
