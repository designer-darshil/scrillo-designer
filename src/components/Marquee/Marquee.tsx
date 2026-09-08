import React from 'react';
import { cn } from '../../utils/cn';

interface MarqueeProps {
  items: string[];
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'left' | 'right';
  className?: string;
  separator?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = 'medium',
  direction = 'left',
  className,
  separator = '✦',
}) => {
  const speedClass = {
    slow: 'duration-[40s]',
    medium: 'duration-[25s]',
    fast: 'duration-[15s]',
  }[speed];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={cn('relative overflow-hidden whitespace-nowrap select-none py-3 border-y border-white/10', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-8 animate-marquee',
          direction === 'right' && 'animate-marquee-reverse',
          speedClass
        )}
      >
        {repeated.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-light-400">
            <span>{item}</span>
            <span className="text-light-600 text-[10px]">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
