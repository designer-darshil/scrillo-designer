import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../../types';
import { ProjectRow } from '../../components/ProjectRow/ProjectRow';
import { gsap } from '../../animations/gsapConfig';
import { useWebsiteData } from '../../hooks/useWebsiteData';

interface SelectedWorksProps {
  projects?: Project[];
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ projects: propProjects }) => {
  const { data } = useWebsiteData();
  const rawProjects = propProjects || data.projects;
  const projects = [...rawProjects]
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  // Floating preview image refs
  const floatingPreviewRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  const [, setActiveProject] = useState<Project | null>(null);

  // ScrollTrigger reveals for section heading and project rows
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal small label
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Reveal section heading lines
      const headingLines = headingRef.current?.querySelectorAll('.heading-line');
      if (headingLines && headingLines.length > 0) {
        gsap.fromTo(
          headingLines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Staggered reveal for individual project rows
      const rows = rowsContainerRef.current?.querySelectorAll('article');
      if (rows && rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rowsContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop Mouse-Following & Dynamic Tilt for Floating Preview Image
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const floatingContainer = floatingPreviewRef.current;
    if (!floatingContainer) return;

    const setX = gsap.quickSetter(floatingContainer, 'x', 'px');
    const setY = gsap.quickSetter(floatingContainer, 'y', 'px');
    const setRotation = gsap.quickSetter(floatingContainer, 'rotation', 'deg');

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let currentRotation = 0;
    let prevMouseX = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onTick = () => {
      // Smooth position interpolation
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      // Calculate tilt based on mouse velocity delta
      const deltaX = targetX - prevMouseX;
      prevMouseX = targetX;
      const targetRotation = Math.max(-12, Math.min(12, deltaX * 0.35));
      currentRotation += (targetRotation - currentRotation) * 0.1;

      setX(currentX);
      setY(currentY);
      setRotation(currentRotation);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    gsap.ticker.add(onTick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(onTick);
    };
  }, []);

  // Handle row hover start on desktop
  const handleHoverStart = (project: Project) => {
    setActiveProject(project);

    const floatingContainer = floatingPreviewRef.current;
    const img = previewImageRef.current;

    if (floatingContainer && img) {
      img.src = project.coverImage || project.thumbnail || (project as any).image;
      gsap.killTweensOf(floatingContainer);
      gsap.fromTo(
        floatingContainer,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
        }
      );
    }
  };

  // Handle row hover end
  const handleHoverEnd = () => {
    const floatingContainer = floatingPreviewRef.current;
    if (floatingContainer) {
      gsap.to(floatingContainer, {
        scale: 0.88,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
        onComplete: () => setActiveProject(null),
      });
    } else {
      setActiveProject(null);
    }
  };

  const initialImage = projects[0]?.coverImage || projects[0]?.thumbnail || (projects[0] as any)?.image;

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative py-28 sm:py-36 bg-background text-foreground overflow-hidden"
    >
      {/* Floating Project Image Preview (Desktop Only, Pointer Events None) */}
      <div
        ref={floatingPreviewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block opacity-0 -ml-[200px] -mt-[140px] will-change-transform"
      >
        <div className="w-[380px] lg:w-[420px] aspect-[16/10] overflow-hidden border border-border/80 bg-surface shadow-2xl">
          <img
            ref={previewImageRef}
            src={initialImage}
            alt="Project Preview"
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="page-container mb-16 sm:mb-24">
        {/* Small Label */}
        <div ref={labelRef} className="flex items-center gap-2 mb-6 text-meta text-muted">
          <span className="w-1.5 h-1.5 bg-foreground inline-block" />
          <span>(Selected projects)</span>
        </div>

        {/* Section Heading: SELECTED WORKS */}
        <h2
          ref={headingRef}
          className="text-heading-section font-bold uppercase tracking-heading leading-[0.92] text-foreground"
        >
          <span className="block overflow-hidden py-1">
            <span className="heading-line inline-block will-change-transform">
              SELECTED
            </span>
          </span>
          <span className="block overflow-hidden py-1">
            <span className="heading-line inline-block will-change-transform text-muted">
              WORKS
            </span>
          </span>
        </h2>
      </div>

      {/* Project Rows Listing Container (NO CARD UI) */}
      <div ref={rowsContainerRef} className="w-full border-b border-border">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        ))}
      </div>

      {/* Section Bottom Meta */}
      <div className="page-container pt-8 flex items-center justify-between text-meta text-muted">
        <span>ARCHIVE COUNT: {String(projects.length).padStart(2, '0')} REPOSITORIES</span>
        <span>ALL RIGHTS & ARTIFACTS RESERVED</span>
      </div>
    </section>
  );
};

export default SelectedWorks;

