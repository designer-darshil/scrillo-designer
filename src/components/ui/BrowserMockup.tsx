import React from 'react';
import { Lock, RefreshCw, ExternalLink } from 'lucide-react';

interface BrowserMockupProps {
  url?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  actionUrl?: string;
  theme?: 'dark' | 'glass';
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  url = 'https://scrillo.craft/preview',
  title = 'Interactive Preview',
  children,
  className = '',
  actionUrl,
  theme = 'dark'
}) => {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 ${
        theme === 'glass'
          ? 'bg-[#0F0F0F]/80 backdrop-blur-xl'
          : 'bg-[#0C0C0C]'
      } ${className}`}
    >
      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#080808] select-none text-xs">
        {/* Window controls */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
        </div>

        {/* URL Bar */}
        <div className="hidden sm:flex items-center space-x-2 px-4 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-[11px] font-mono max-w-sm w-full mx-4 truncate">
          <Lock size={10} className="text-emerald-400 shrink-0" />
          <span className="truncate">{url}</span>
        </div>

        {/* Controls / Refresh */}
        <div className="flex items-center space-x-2 text-white/40">
          <RefreshCw size={12} className="hover:text-white transition-colors cursor-pointer" />
          {actionUrl && (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF3E00] transition-colors"
              title="Open external live link"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Browser Body Viewport */}
      <div className="relative overflow-hidden bg-[#0A0A0A]">
        {children}
      </div>
    </div>
  );
};
