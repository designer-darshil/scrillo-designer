import React, { useRef, useEffect } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { cn } from '../../utils/cn';

interface RevealTextProps {
  children: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  className,
  tag = 'div',
  delay = 0,
  duration = 0.8,
  stagger = 0.02,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const words = containerRef.current.querySelectorAll('.word-inner');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          y: '100%',
          opacity: 0,
        },
        {
          y: '0%',
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [children, delay, duration, stagger]);

  const words = children.split(' ');

  const Tag = tag as any;

  return (
    <Tag
      ref={containerRef}
      className={cn('inline-flex flex-wrap overflow-hidden gap-x-[0.28em] gap-y-[0.1em]', className)}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-0.5">
          <span className="word-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
};
