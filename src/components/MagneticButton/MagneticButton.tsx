import React, { useRef, useEffect } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { cn } from '../../utils/cn';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  onClick,
  href,
  strength = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isFinePointer = useRef(true);

  useEffect(() => {
    isFinePointer.current =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    gsap.to(ref.current, {
      x: distanceX,
      y: distanceY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block will-change-transform', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block no-underline">
        {content}
      </a>
    );
  }

  return content;
};

export default MagneticButton;
