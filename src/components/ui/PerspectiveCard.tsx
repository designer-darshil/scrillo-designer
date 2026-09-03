import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface PerspectiveCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  dataCursor?: string;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  children,
  className = '',
  intensity = 8,
  dataCursor = 'project'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 220 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDisabled(isTouch || reducedMotion);
  }, []);

  const handleMouseEnter = () => {
    if (isDisabled || !cardRef.current) return;
    // Cache bounding rect once on enter to prevent layout thrashing on every frame
    cachedRect.current = cardRef.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    
    let rect = cachedRect.current;
    if (!rect && cardRef.current) {
      rect = cardRef.current.getBoundingClientRect();
      cachedRect.current = rect;
    }
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  };

  const handleMouseLeave = () => {
    cachedRect.current = null;
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-container ${className}`}
      data-cursor={dataCursor}
    >
      <motion.div
        style={{
          rotateX: isDisabled ? 0 : smoothRotateX,
          rotateY: isDisabled ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full transition-transform duration-75 ease-out"
      >
        {children}
      </motion.div>
    </div>
  );
};
