import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/navigation';
import { siteConfig } from '../../data/site';
import { X, ArrowUpRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[999] bg-[#050505]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 md:p-12 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link to="/" onClick={onClose} className="flex items-center space-x-3" aria-label="Home">
              <div className="w-8 h-8 rounded-sm bg-white text-black flex items-center justify-center font-bold text-xs tracking-wider select-none">
                {siteConfig.initials}
              </div>
              <span className="font-bold tracking-tight text-base text-white">{siteConfig.name}</span>
            </Link>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="py-8 space-y-4 my-auto" aria-label="Mobile Navigation Links">
            {navLinks.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="group flex items-center space-x-4 py-3 min-h-[48px]"
                  >
                    <span className="font-mono text-xs text-[#FF3E00]">{item.number}</span>
                    <span
                      className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
                        isActive
                          ? 'text-[#FF3E00]'
                          : 'text-white/80 group-hover:text-white group-hover:translate-x-2'
                      }`}
                    >
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[#FF3E00] transition-all"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom Editorial Tagline & Socials */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <p className="text-sm font-sans text-white/70 leading-relaxed">
              "{siteConfig.tagline}"
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/60">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-white hover:text-[#FF3E00] transition-colors underline min-h-[44px] flex items-center"
              >
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.phoneHref}
                className="text-white/80 hover:text-[#FF3E00] transition-colors min-h-[44px] flex items-center"
              >
                {siteConfig.formattedPhone}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
