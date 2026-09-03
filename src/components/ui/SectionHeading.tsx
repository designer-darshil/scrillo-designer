import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number: string;
  tag: string;
  title: string;
  serifWord?: string;
  description?: string;
  align?: 'left' | 'center' | 'split';
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  tag,
  title,
  serifWord,
  description,
  align = 'left',
  className = '',
  children
}) => {
  return (
    <div className={`mb-16 ${className}`}>
      {/* Top Metadata Line */}
      <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
        <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
          {number}
        </span>
        <span className="text-white/30">/</span>
        <span className="text-white/60">{tag}</span>
      </div>

      {/* Main Title & Content Layout */}
      {align === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight">
              {title}{' '}
              {serifWord && (
                <span className="italic font-light text-[#FF3E00] tracking-tight">
                  {serifWord}
                </span>
              )}
            </h2>
          </div>
          <div className="lg:col-span-4 space-y-4">
            {description && (
              <p className="text-sm md:text-base text-muted-primary leading-relaxed">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight mb-4">
            {title}{' '}
            {serifWord && (
              <span className="italic font-light text-[#FF3E00] tracking-tight">
                {serifWord}
              </span>
            )}
          </h2>
          {description && (
            <p className="text-sm md:text-base text-muted-primary leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      )}
    </div>
  );
};
