import React, { useState, useEffect } from 'react';
import { navigationItems } from '../../data/navigation';
import { MagneticButton } from '../MagneticButton/MagneticButton';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onHoverStateChange }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        }) + ' UTC'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-dark-900/80 backdrop-blur-md border-b border-white/10">
      <div className="editorial-container flex items-center justify-between h-16 sm:h-20">
        {/* Brand / Title */}
        <a
          href="#"
          className="group flex items-center gap-3 no-underline"
          onMouseEnter={() => onHoverStateChange?.(true, 'link')}
          onMouseLeave={() => onHoverStateChange?.(false)}
        >
          <div className="w-3 h-3 bg-light-100 group-hover:rotate-45 transition-transform duration-300" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-light-100">
              DARSHIL BHUVA
            </span>
            <span className="font-mono text-[10px] tracking-widest text-light-500 uppercase">
              Digital Designer / Dev
            </span>
          </div>
        </a>

        {/* Center Live Coordinates & Status (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-light-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR Q2/Q3</span>
          </span>
          <span className="text-white/20">/</span>
          <span>{currentTime || '00:00:00 UTC'}</span>
          <span className="text-white/20">/</span>
          <span>21.1702° N, 72.8311° E</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="group font-mono text-xs text-light-400 hover:text-light-100 transition-colors py-1 flex items-center gap-1.5"
              onMouseEnter={() => onHoverStateChange?.(true, 'link')}
              onMouseLeave={() => onHoverStateChange?.(false)}
            >
              <span className="text-light-600 text-[10px]">[{item.number}]</span>
              <span>{item.label}</span>
            </a>
          ))}

          <MagneticButton href="#contact">
            <div className="px-4 py-2 bg-light-100 text-dark-900 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1 hover:bg-light-300 transition-colors">
              <span>Initiate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </MagneticButton>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-light-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark-950 px-6 py-8 flex flex-col gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between font-display text-xl uppercase tracking-wider text-light-200 hover:text-white border-b border-white/5 pb-3"
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs text-light-500">[{item.number}]</span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 w-full text-center py-3 bg-light-100 text-dark-900 font-mono text-xs font-bold uppercase tracking-widest"
          >
            Initiate Project [05]
          </a>
        </div>
      )}
    </header>
  );
};
