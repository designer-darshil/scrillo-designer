import React from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { MagneticButton } from '../../components/MagneticButton/MagneticButton';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ContactCTAProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onHoverStateChange }) => {
  const [copied, setCopied] = useState(false);
  const email = 'contact@darshilbhuva.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 border-t border-white/10 bg-dark-900">
      <div className="editorial-container">
        <SectionLabel number="05" title="INITIATE CONTACT / COMMISSION" />

        <div className="pt-16 pb-20">
          <div className="font-mono text-xs text-light-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>ACCEPTING SELECTIVE PROJECTS & DIRECTION FOR 2026</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-light-100 leading-none">
            LET’S SHAPE
            <br />
            <span className="font-editorial-serif italic font-normal text-light-300">
              the next
            </span>{' '}
            STANDARD.
          </h2>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <MagneticButton href={`mailto:${email}`}>
              <div
                className="px-8 py-5 bg-light-100 text-dark-900 font-mono text-sm font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-light-300 transition-colors"
                onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                onMouseLeave={() => onHoverStateChange?.(false)}
              >
                <span>Write Email</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </MagneticButton>

            <button
              onClick={copyEmail}
              type="button"
              className="px-6 py-5 border border-white/20 text-light-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 transition-colors"
              onMouseEnter={() => onHoverStateChange?.(true, 'link')}
              onMouseLeave={() => onHoverStateChange?.(false)}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
