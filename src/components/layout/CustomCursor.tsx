import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'project' | 'explore' | 'cta' | 'hidden'>('default');
  const [isDisabled, setIsDisabled] = useState(false);
  const isVisibleRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 26, stiffness: 320, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check touch device or reduced motion
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (touch || reducedMotion) {
      setIsDisabled(true);
      return;
    }

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      const projectTarget = target.closest('[data-cursor="project"]');
      const exploreTarget = target.closest('[data-cursor="explore"]');
      const ctaTarget = target.closest('[data-cursor="cta"]');
      const interactiveLink = target.closest('a, button, [role="button"]');

      if (projectTarget) {
        setCursorVariant('project');
        setCursorText('VIEW');
      } else if (exploreTarget) {
        setCursorVariant('explore');
        setCursorText('EXPLORE');
      } else if (ctaTarget) {
        setCursorVariant('cta');
        setCursorText('→');
      } else if (interactiveLink) {
        setCursorVariant('cta');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveMouse, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (isDisabled || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        className={`flex items-center justify-center rounded-full transition-colors duration-200 ${
          cursorVariant === 'project' || cursorVariant === 'explore'
            ? 'w-20 h-20 bg-[#FF3E00] text-white font-mono text-[11px] font-bold tracking-wider shadow-lg shadow-[#FF3E00]/30'
            : cursorVariant === 'cta'
            ? 'w-10 h-10 bg-white/90 text-black text-sm font-bold border border-white/20'
            : 'w-3.5 h-3.5 bg-white/80 border border-white/40'
        }`}
        animate={{
          scale: cursorVariant === 'default' ? 1 : 1.15,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {cursorText && (
          <span className="text-center font-bold tracking-widest">{cursorText}</span>
        )}
      </motion.div>
    </motion.div>
  );
};
