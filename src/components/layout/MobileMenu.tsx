import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mobileNavLinks = [
  { label: 'WORK', href: '/work', number: '01' },
  { label: 'ABOUT', href: '/about', number: '02' },
  { label: 'CONTACT', href: '/contact', number: '03' }
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] bg-[#060606]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-2" aria-label="Home">
              <span className="font-extrabold text-base tracking-widest text-white">DS</span>
              <span className="w-1 h-1 rounded-full bg-[#FF3E00]" />
            </Link>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="py-12 space-y-6 my-auto" aria-label="Mobile Navigation">
            {mobileNavLinks.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-baseline justify-between py-2.5 group"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[#FF3E00]/80">{item.number}</span>
                      <span
                        className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[#FF3E00]'
                            : 'text-white/80 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-white/30 group-hover:text-[#FF3E00] transition-colors"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Minimal Footer Details */}
          <div className="border-t border-white/[0.08] pt-6 flex flex-col gap-2 font-mono text-xs text-white/50">
            <a
              href="mailto:darshilbhuva4322@gmail.com"
              className="hover:text-white transition-colors py-1"
            >
              darshilbhuva4322@gmail.com
            </a>
            <span className="text-white/30">Surat, Gujarat, India</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
