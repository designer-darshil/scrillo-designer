import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Maximum tilt angle in degrees (default 6°)
  depthZ?: number; // How far card lifts towards user on hover in px (default 12px)
  glareOpacity?: number; // Subtle surface sheen opacity (default 0.15)
  dataCursor?: string;
  onClick?: () => void;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  maxRotation = 6,
  depthZ = 12,
  glareOpacity = 0.15,
  dataCursor = 'project',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Motion values for rotation and glare position
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Smooth springs for a natural, physical feel
  const springConfig = { damping: 24, stiffness: 240, mass: 0.8 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    // Check if device is touch or has reduced motion preference
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDisabled(hasTouch || prefersReducedMotion);
  }, []);

  const handleMouseEnter = () => {
    if (isDisabled || !cardRef.current) return;
    cachedRect.current = cardRef.current.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    let rect = cachedRect.current;
    if (!rect && cardRef.current) {
      rect = cardRef.current.getBoundingClientRect();
      cachedRect.current = rect;
    }
    if (!rect || rect.width === 0 || rect.height === 0) return;

    // Normalized position from center (-0.5 to +0.5)
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply restrained rotation: Y-axis responds to horizontal mouse, X-axis to vertical
    rotateX.set(-normY * maxRotation);
    rotateY.set(normX * maxRotation);

    // Dynamic specular sheen tracking
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    cachedRect.current = null;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative [perspective:1200px] ${className}`}
      data-cursor={dataCursor}
    >
      <motion.div
        style={{
          rotateX: isDisabled ? 0 : smoothRotateX,
          rotateY: isDisabled ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          translateZ: isHovered && !isDisabled ? depthZ : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full h-full relative [transform-style:preserve-3d] transition-shadow duration-300 will-change-transform"
      >
        {children}

        {/* Dynamic Specular Sheen Layer (Subtle surface light reflection) */}
        {!isDisabled && glareOpacity > 0 && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-30 transition-opacity duration-300"
            style={{
              opacity: isHovered ? glareOpacity : 0,
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
