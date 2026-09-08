import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { AboutContent } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface StatementProps {
  content?: AboutContent;
}

export const Statement: React.FC<StatementProps> = ({ content: propContent }) => {
  const { data } = useWebsiteData();
  const content = propContent || data.about;

  if (content.visible === false) return null;

  const profile = data.profile || {
    name: 'Darshil S. Bhuva',
    title: 'UI/UX Designer / Web Designer',
    primaryDescription:
      'As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions.',
    objective:
      'Improve user experience through the utility, ease of use, and pleasure provided in the design and interaction with a product.',
    profileImage: '/images/darshil-profile.jpg',
  };

  const experienceList = (data.experience || [])
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const educationList = (data.education || [])
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Resume-defined Design skills and Tools fallback
  const defaultDesignSkills = [
    'Wireframes & Flows',
    'Prototyping',
    'User Interface Design',
    'Interaction Design',
    'Wireframing',
  ];

  const defaultTools = [
    'Figma',
    'Photoshop',
    'Illustrator',
    'XD',
    'Sketch',
    'InVision',
    'HTML/CSS',
    'JavaScript',
    'GitHub',
  ];

  // Derive dynamic skills or fall back to resume spec
  const designCategory = data.skills?.find((c) => c.id === 'design') || data.skills?.[0];
  const designSkills = (designCategory?.items || designCategory?.skills || []).length > 0
    ? (designCategory?.items || designCategory?.skills || [])
        .filter((s) => s.visible !== false)
        .map((s) => s.name)
    : defaultDesignSkills;

  const toolsList = (data.tools || []).length > 0
    ? (data.tools || []).map((t) => t.name)
    : defaultTools;

  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Section Label
      if (labelRef.current) {
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
      }

      // 2. Profile Intro block entrance
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: profileRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Experience rows stagger entrance
      const expRows = experienceRef.current?.querySelectorAll('.editorial-timeline-row');
      if (expRows && expRows.length > 0) {
        gsap.fromTo(
          expRows,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: experienceRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Education rows stagger entrance
      const eduRows = educationRef.current?.querySelectorAll('.editorial-edu-row');
      if (eduRows && eduRows.length > 0) {
        gsap.fromTo(
          eduRows,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: educationRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 5. Skills columns entrance
      const skillCols = skillsRef.current?.querySelectorAll('.editorial-skill-col');
      if (skillCols && skillCols.length > 0) {
        gsap.fromTo(
          skillCols,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const sectionNumber = content.number || '02';
  const sectionLabel = 'ABOUT ME';

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 sm:py-36 bg-background text-foreground border-t border-border select-none overflow-hidden"
    >
      {/* Top Header Label */}
      <div className="page-container mb-16 sm:mb-24">
        <div ref={labelRef}>
          <SectionLabel number={sectionNumber} title={sectionLabel} />
          <h2 className="sr-only">About Me — Darshil S. Bhuva UI/UX Designer & Web Designer</h2>
        </div>
      </div>

      <div className="page-container space-y-24 sm:space-y-32">
        {/* ================================================== */}
        {/* 1. ABOUT ME PROFILE STORY */}
        {/* ================================================== */}
        <div
          ref={profileRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start border-b border-border/60 pb-20 sm:pb-28"
        >
          {/* Profile Image Column */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="relative group overflow-hidden border border-border bg-surface aspect-[4/5] max-w-sm sm:max-w-md mx-auto lg:mx-0 shadow-lg">
              <img
                src={profile.profileImage || '/images/darshil-profile.jpg'}
                alt={profile.name || 'Darshil S. Bhuva'}
                className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-foreground/90 uppercase tracking-widest bg-background/60 backdrop-blur-xs px-3 py-1.5 border border-border/40">
                <span>[PORTFOLIO SPECIMEN]</span>
                <span>2026</span>
              </div>
            </div>
          </div>

          {/* Profile Story & Typography Column */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6 sm:space-y-8 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted block">
                {profile.title || 'UI/UX DESIGNER / WEB DESIGNER'}
              </span>
              <h3 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground leading-[1.05]">
                {profile.name || 'DARSHIL S. BHUVA'}
              </h3>
            </div>

            {/* Intro Paragraph */}
            <p className="text-body-editorial text-base sm:text-xl text-foreground/90 font-light leading-relaxed max-w-3xl">
              {profile.primaryDescription ||
                'As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions.'}
            </p>

            {/* Objective / Design Philosophy Quote */}
            {profile.objective && (
              <div className="pt-4 border-t border-border/40 max-w-3xl">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted block mb-2">
                  [DESIGN OBJECTIVE]
                </span>
                <blockquote className="font-serif italic text-base sm:text-lg text-muted leading-relaxed">
                  “{profile.objective}”
                </blockquote>
              </div>
            )}
          </div>
        </div>

        {/* ================================================== */}
        {/* 2. EXPERIENCE SECTION */}
        {/* ================================================== */}
        <div ref={experienceRef} className="space-y-8 border-b border-border/60 pb-20 sm:pb-28">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted font-bold">[01]</span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                EXPERIENCE
              </h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {experienceList.length} POSITIONS // CAREER TIMELINE
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {experienceList.map((exp, idx) => (
              <article
                key={exp.id || idx}
                className="editorial-timeline-row group py-8 sm:py-10 transition-colors duration-300 hover:bg-surface/30 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-none"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  {/* Left: Date / Period */}
                  <div className="lg:col-span-3">
                    <span className="font-mono text-xs sm:text-sm text-muted group-hover:text-foreground tracking-wider uppercase font-semibold transition-colors">
                      {exp.period}
                    </span>
                  </div>

                  {/* Middle: Company & Role */}
                  <div className="lg:col-span-4 space-y-1">
                    <h4 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground flex items-center gap-2 group-hover:text-foreground">
                      <span>{exp.company}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h4>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted block">
                      {exp.role}
                    </span>
                  </div>

                  {/* Right: Detailed Description */}
                  <div className="lg:col-span-5">
                    <p className="text-body-editorial text-sm sm:text-base text-muted font-light leading-relaxed group-hover:text-foreground/90 transition-colors">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* 3. EDUCATION SECTION */}
        {/* ================================================== */}
        <div ref={educationRef} className="space-y-8 border-b border-border/60 pb-20 sm:pb-28">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted font-bold">[02]</span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                EDUCATION
              </h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {educationList.length} MILESTONES // ACADEMIC FOUNDATION
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {educationList.map((edu, idx) => (
              <article
                key={edu.id || idx}
                className="editorial-edu-row group py-8 sm:py-10 transition-colors duration-300 hover:bg-surface/30 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-none"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  {/* Left: Date / Period */}
                  <div className="lg:col-span-3">
                    <span className="font-mono text-xs sm:text-sm text-muted group-hover:text-foreground tracking-wider uppercase font-semibold transition-colors">
                      {edu.period}
                    </span>
                    {edu.location && (
                      <span className="font-mono text-[11px] text-muted/80 block mt-1">
                        {edu.location}
                      </span>
                    )}
                  </div>

                  {/* Middle: Institution & Degree */}
                  <div className="lg:col-span-4 space-y-1">
                    <h4 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-foreground">
                      {edu.institution}
                    </h4>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted block">
                      {edu.educationType || edu.degree || 'Degree / Diploma'}
                    </span>
                  </div>

                  {/* Right: Description */}
                  <div className="lg:col-span-5">
                    <p className="text-body-editorial text-sm sm:text-base text-muted font-light leading-relaxed group-hover:text-foreground/90 transition-colors">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* 4. SKILLS & TOOLS SECTION */}
        {/* ================================================== */}
        <div ref={skillsRef} className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted font-bold">[03]</span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                SKILLS & CAPABILITIES
              </h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              DESIGN DISCIPLINES & DEVELOPMENT TOOLS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column: DESIGN */}
            <div className="editorial-skill-col space-y-6">
              <div className="border-b border-border/80 pb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground font-bold">
                  DESIGN
                </span>
                <span className="font-mono text-[11px] text-muted">
                  [{String(designSkills.length).padStart(2, '0')}]
                </span>
              </div>

              <ul className="divide-y divide-border/40">
                {designSkills.map((skill, idx) => (
                  <li
                    key={skill || idx}
                    className="py-3.5 flex items-center justify-between group hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className="font-sans text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground/90 group-hover:text-foreground">
                        {skill}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      ✦
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: TOOLS */}
            <div className="editorial-skill-col space-y-6">
              <div className="border-b border-border/80 pb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground font-bold">
                  TOOLS & TECHNICAL
                </span>
                <span className="font-mono text-[11px] text-muted">
                  [{String(toolsList.length).padStart(2, '0')}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-border/40">
                <ul className="divide-y divide-border/40">
                  {toolsList.slice(0, Math.ceil(toolsList.length / 2)).map((tool, idx) => (
                    <li
                      key={tool || idx}
                      className="py-3.5 flex items-center justify-between group hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-muted">
                          [{String(idx + 1).padStart(2, '0')}]
                        </span>
                        <span className="font-sans text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground/90 group-hover:text-foreground">
                          {tool}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <ul className="divide-y divide-border/40">
                  {toolsList.slice(Math.ceil(toolsList.length / 2)).map((tool, idx) => {
                    const realIdx = Math.ceil(toolsList.length / 2) + idx;
                    return (
                      <li
                        key={tool || realIdx}
                        className="py-3.5 flex items-center justify-between group hover:text-foreground transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-muted">
                            [{String(realIdx + 1).padStart(2, '0')}]
                          </span>
                          <span className="font-sans text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground/90 group-hover:text-foreground">
                            {tool}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statement;
