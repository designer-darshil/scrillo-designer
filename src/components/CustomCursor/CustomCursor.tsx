import React, { useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsapConfig';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 1. Guard against touch devices and reduced-motion preferences
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const dot = cursorDotRef.current;
    const follower = cursorFollowerRef.current;
    const textEl = textRef.current;

    if (!dot || !follower || !textEl) return;

    // Fast coordinate setters using gsap.quickSetter for 120fps hardware acceleration
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
    const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;
    let currentMode: 'default' | 'link' | 'project' | 'cta' = 'default';

    // Show cursor on initial mouse move
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        followerX = mouseX;
        followerY = mouseY;
        gsap.to([dot, follower], { opacity: 1, duration: 0.25, ease: 'power2.out' });
      }

      setDotX(mouseX);
      setDotY(mouseY);
    };

    // Smooth trailing animation loop (lerp interpolation)
    const onTick = () => {
      if (!isVisible) return;
      // Damped interpolation for trailing effect
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      setFollowerX(followerX);
      setFollowerY(followerY);
    };

    gsap.ticker.add(onTick);

    // Hide when mouse leaves window
    const onMouseLeave = () => {
      isVisible = false;
      gsap.to([dot, follower], { opacity: 0, duration: 0.25 });
    };

    const onMouseEnter = () => {
      isVisible = true;
      gsap.to([dot, follower], { opacity: 1, duration: 0.25 });
    };

    // Event delegation for hover targets without React re-renders
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectTarget = target.closest<HTMLElement>('[data-cursor="project"]');
      const ctaTarget = target.closest<HTMLElement>('[data-cursor="cta"]');
      const linkTarget = target.closest<HTMLElement>('a, button, [data-cursor="link"], [role="button"]');
      const customTextTarget = target.closest<HTMLElement>('[data-cursor-text]');

      if (projectTarget) {
        if (currentMode !== 'project') {
          currentMode = 'project';
          textEl.textContent = projectTarget.getAttribute('data-cursor-text') || 'VIEW';
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          gsap.to(follower, {
            width: 72,
            height: 72,
            scale: 1,
            backgroundColor: '#FFFFFF',
            duration: 0.35,
            ease: 'back.out(1.5)',
          });
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.25, delay: 0.05 });
        }
      } else if (ctaTarget) {
        if (currentMode !== 'cta') {
          currentMode = 'cta';
          textEl.textContent = ctaTarget.getAttribute('data-cursor-text') || 'OPEN →';
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          gsap.to(follower, {
            width: 76,
            height: 76,
            scale: 1,
            backgroundColor: '#FFFFFF',
            duration: 0.35,
            ease: 'back.out(1.5)',
          });
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.25, delay: 0.05 });
        }
      } else if (linkTarget) {
        if (currentMode !== 'link') {
          currentMode = 'link';
          const customText = customTextTarget?.getAttribute('data-cursor-text');
          if (customText) {
            textEl.textContent = customText;
            gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.2 });
          } else {
            textEl.textContent = '';
            gsap.to(textEl, { opacity: 0, duration: 0.15 });
          }

          gsap.to(dot, { scale: 0, duration: 0.2 });
          gsap.to(follower, {
            width: customText ? 64 : 32,
            height: customText ? 64 : 32,
            scale: 1,
            backgroundColor: '#FFFFFF',
            duration: 0.3,
            ease: 'power3.out',
          });
        }
      } else {
        if (currentMode !== 'default') {
          currentMode = 'default';
          textEl.textContent = '';
          gsap.to(textEl, { opacity: 0, duration: 0.15 });
          gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
          gsap.to(follower, {
            width: 10,
            height: 10,
            scale: 1,
            backgroundColor: '#FFFFFF',
            duration: 0.3,
            ease: 'power3.out',
          });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Small 8-10px center pinpoint dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-white opacity-0 mix-blend-difference will-change-transform"
      />

      {/* Trailing follower element with dynamic expansion states */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference flex items-center justify-center will-change-transform"
      >
        <span
          ref={textRef}
          className="opacity-0 font-mono text-[10px] font-bold tracking-wider uppercase text-black select-none pointer-events-none text-center px-1 leading-none"
        />
      </div>
    </div>
  );
};

export default CustomCursor;
