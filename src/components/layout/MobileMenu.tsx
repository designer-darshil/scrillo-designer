import React from 'react';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] bg-[#050505]/98 backdrop-blur-xl flex flex-col justify-between p-6 md:p-12"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link to="/" onClick={onClose} className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-[#FF3E00] font-bold">00</span>
              <span className="font-bold tracking-tight text-lg text-white">SCRILLO</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Menu Links */}
          <div className="py-8 space-y-4">
            {navLinks.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="group flex items-baseline space-x-4 py-2"
                  >
                    <span className="font-mono text-xs text-[#FF3E00]">{item.number}</span>
                    <span
                      className={`text-3xl md:text-5xl font-extrabold tracking-tight transition-colors ${
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
          </div>

          {/* Bottom Editorial Quote & Socials */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <p className="font-handwritten text-xl text-[#FF3E00]/90">
              "designing digital things with intention"
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
              <span>{siteConfig.location}</span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-white hover:text-[#FF3E00] transition-colors underline"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
