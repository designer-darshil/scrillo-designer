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
  intensity = 10,
  dataCursor = 'project'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-container ${className}`}
      data-cursor={dataCursor}
    >
      <motion.div
        style={{
          rotateX: isTouch ? 0 : smoothRotateX,
          rotateY: isTouch ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full transition-transform duration-100 ease-out"
      >
        {children}
      </motion.div>
    </div>
  );
};
