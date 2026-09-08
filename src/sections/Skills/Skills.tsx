import React, { useEffect, useRef, useState } from 'react';
import { skillCategories, SkillItem } from '../../data/skills';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '../../animations/gsapConfig';

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  // GSAP ScrollTrigger reveals and staggered entrance
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

      // 2. Animate each category column and its children
      const columns = categoriesRef.current?.querySelectorAll('.skill-column');
      if (columns && columns.length > 0) {
        columns.forEach((col, idx) => {
          // Staggered column appearance
          gsap.fromTo(
            col,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: idx * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: col,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Stagger rows within column
          const rows = col.querySelectorAll('.skill-row-item');
          if (rows.length > 0) {
            gsap.fromTo(
              rows,
              { opacity: 0, x: -10 },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.05,
                delay: 0.2 + idx * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: col,
                  start: 'top 80%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          // Subtle column parallax on desktop
          if (window.innerWidth >= 1024) {
            const yOffset = (idx - 1) * -30; // slight differential parallax
            gsap.to(col, {
              y: yOffset,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Desktop Mouse-Following Skill Image Preview
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const previewEl = previewRef.current;
    if (!previewEl) return;

    const setX = gsap.quickSetter(previewEl, 'x', 'px');
    const setY = gsap.quickSetter(previewEl, 'y', 'px');

    let targetX = -300;
    let targetY = -300;
    let currentX = -300;
    let currentY = -300;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onTick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setX(currentX);
      setY(currentY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    gsap.ticker.add(onTick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(onTick);
    };
  }, []);

  const handleSkillHoverStart = (skill: SkillItem) => {
    setHoveredSkill(skill);
    const previewEl = previewRef.current;
    const imgEl = previewImgRef.current;

    if (previewEl && imgEl && skill.image) {
      imgEl.src = skill.image;
      gsap.killTweensOf(previewEl);
      gsap.fromTo(
        previewEl,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' }
      );
    }
  };

  const handleSkillHoverEnd = () => {
    const previewEl = previewRef.current;
    if (previewEl) {
      gsap.to(previewEl, {
        scale: 0.85,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.inOut',
        onComplete: () => setHoveredSkill(null),
      });
    } else {
      setHoveredSkill(null);
    }
  };

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative py-28 sm:py-36 bg-background text-foreground border-t border-border overflow-hidden select-none"
    >
      {/* Floating Skill Visual Preview (Desktop Only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block opacity-0 -ml-[140px] -mt-[100px] will-change-transform"
      >
        <div className="w-[260px] aspect-[4/3] overflow-hidden border border-border bg-surface shadow-2xl">
          <img
            ref={previewImgRef}
            src={skillCategories[0].skills[0].image}
            alt="Skill Visual"
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
        </div>
      </div>

      {/* Top Section Label */}
      <div className="page-container mb-16 sm:mb-24">
        <div ref={labelRef}>
          <SectionLabel number="03" title="DISCIPLINE & CAPABILITIES" />
        </div>
      </div>

      {/* Main 3 Editorial Categories Grid */}
      <div className="page-container">
        <div
          ref={categoriesRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 xl:gap-16 items-start"
        >
          {skillCategories.map((cat) => (
            <div key={cat.id} className="skill-column flex flex-col will-change-transform">
              {/* Category Header Bar */}
              <div className="flex items-baseline justify-between font-mono text-xs text-muted mb-3">
                <span className="text-foreground/80 font-semibold">[{cat.number}]</span>
                <span>[{cat.count} DISCIPLINES]</span>
              </div>

              {/* Giant Category Title */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold uppercase tracking-tighter text-foreground mb-4">
                {cat.title}
              </h3>

              {/* Thin Divider */}
              <div className="w-full h-px bg-border mb-6" />

              {/* Numbered Skill Rows */}
              <ul className="space-y-0">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.name}
                    data-cursor="link"
                    onMouseEnter={() => handleSkillHoverStart(skill)}
                    onMouseLeave={handleSkillHoverEnd}
                    className="skill-row-item group relative py-3.5 border-b border-border/50 flex items-center justify-between cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-300 ease-out">
                      <span className="font-mono text-xs text-muted/60 group-hover:text-foreground transition-colors shrink-0">
                        {skill.index}
                      </span>
                      <span className="font-sans text-base sm:text-lg text-foreground/90 group-hover:text-foreground font-medium tracking-tight">
                        {skill.name}
                      </span>
                    </div>

                    {/* Animated Arrow Icon */}
                    <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>

                    {/* Expanding Bottom Underline Accent */}
                    <span className="absolute left-0 bottom-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out pointer-events-none" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section Metadata */}
      <div className="page-container mt-20 sm:mt-28 border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-meta text-muted">
        <span>[DISCIPLINE MATRIX // 2026 EDITION]</span>
        <span>FULL-STACK DESIGN & CREATIVE COMPUTING</span>
        <span>STATUS: VERIFIED</span>
      </div>
    </section>
  );
};

export default Skills;
