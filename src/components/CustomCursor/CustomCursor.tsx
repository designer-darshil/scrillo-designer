import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  cursorText?: string;
  isHovered?: boolean;
  hoverType?: 'default' | 'link' | 'project' | 'view' | 'drag';
}

export const CustomCursor: React.FC<CustomCursorProps> = ({
  cursorText = '',
  isHovered = false,
  hoverType = 'default',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only active on desktop/pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isLarge = isHovered || hoverType === 'project' || hoverType === 'view';

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center rounded-full mix-blend-difference"
      animate={{
        x: mousePosition.x - (isLarge ? 40 : 6),
        y: mousePosition.y - (isLarge ? 40 : 6),
        width: isLarge ? 80 : 12,
        height: isLarge ? 80 : 12,
        backgroundColor: '#FFFFFF',
      }}
      transition={{
        type: 'spring',
        damping: 28,
        stiffness: 350,
        mass: 0.5,
      }}
    >
      {cursorText && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black text-center px-1">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
};
