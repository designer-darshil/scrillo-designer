import React, { useEffect, useRef } from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { gsap } from '../../animations/gsapConfig';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { ExperienceItem, EducationItem } from '../../types';

interface ExperienceProps {
  experience?: ExperienceItem[];
  education?: EducationItem[];
}

export const Experience: React.FC<ExperienceProps> = ({
  experience: propExperience,
  education: propEducation,
}) => {
  const { data } = useWebsiteData();
  const rawExperience = propExperience || data.experience || [];
  const rawEducation = propEducation || data.education || [];

  const experienceList = [...rawExperience]
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const educationList = [...rawEducation]
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // 2. Animate experience and education cards
      const items = gridRef.current?.querySelectorAll('.timeline-card');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
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
      id="experience"
      className="relative py-28 sm:py-36 bg-background text-foreground border-t border-border select-none overflow-hidden"
    >
      {/* Top Section Header */}
      <div className="page-container mb-16 sm:mb-24">
        <div ref={labelRef}>
          <SectionLabel number="04" title="CAREER & EDUCATION" />
          <h2 className="sr-only">Professional Experience and Academic Background</h2>
        </div>
      </div>

      {/* Main 2-Column Editorial Grid: Experience + Education */}
      <div ref={gridRef} className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-16 items-start">
          {/* Left Column (7 Cols): Professional Experience */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                [PROFESSIONAL EXPERIENCE]
              </span>
              <span className="font-mono text-xs text-foreground/80 font-semibold">
                {experienceList.length} POSITIONS
              </span>
            </div>

            <div className="space-y-6">
              {experienceList.map((exp, idx) => (
                <article
                  key={exp.id || idx}
                  className="timeline-card group relative p-6 sm:p-8 rounded-none border border-border bg-surface/30 hover:bg-surface/70 hover:border-foreground/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground group-hover:text-foreground">
                      {exp.company}
                    </h3>
                    <span className="font-mono text-xs text-muted tracking-wider">
                      {exp.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs uppercase tracking-widest text-muted mb-4 font-semibold">
                    {exp.role}
                  </div>

                  <p className="text-body-editorial text-sm sm:text-base text-muted font-light leading-relaxed">
                    {exp.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column (5 Cols): Education Milestones */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                [EDUCATION & FOUNDATION]
              </span>
              <span className="font-mono text-xs text-foreground/80 font-semibold">
                {educationList.length} MILESTONES
              </span>
            </div>

            <div className="space-y-6">
              {educationList.map((edu, idx) => (
                <article
                  key={edu.id || idx}
                  className="timeline-card group relative p-6 sm:p-8 rounded-none border border-border bg-surface/30 hover:bg-surface/70 hover:border-foreground/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                      {edu.institution}
                    </h3>
                    <span className="font-mono text-xs text-muted tracking-wider shrink-0">
                      {edu.period}
                    </span>
                  </div>

                  {edu.location && (
                    <div className="font-mono text-xs uppercase text-muted/80 mb-3">
                      {edu.location}
                    </div>
                  )}

                  <p className="text-body-editorial text-xs sm:text-sm text-muted font-light leading-relaxed">
                    {edu.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Meta */}
      <div className="page-container mt-16 sm:mt-24 border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-meta text-muted">
        <span>[CAREER MATRIX // 2018 - 2026]</span>
        <span>EXPERIENCE VERIFIED VIA OFFICIAL RESUME</span>
        <span>STATUS: ACTIVE</span>
      </div>
    </section>
  );
};

export default Experience;
