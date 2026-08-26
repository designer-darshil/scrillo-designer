import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  target?: string;
  rel?: string;
  dataCursor?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  strength = 0.35,
  as = 'button',
  href,
  target,
  rel,
  dataCursor = 'cta'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const motionProps = {
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 350, damping: 20, mass: 0.5 },
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...motionProps}
      className={`inline-block ${className}`}
      data-cursor={dataCursor}
    >
      {children}
    </motion.div>
  );

  if (as === 'a' && href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick}>
        {content}
      </a>
    );
  }

  return content;
};
