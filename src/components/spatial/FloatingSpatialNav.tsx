import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../data/site';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const spatialNavItems = [
  { label: 'WORK', href: '/work' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' }
];

export const FloatingSpatialNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastState = window.scrollY > 30;
    const handleScroll = () => {
      const now = window.scrollY > 30;
      if (now !== lastState) {
        lastState = now;
        setIsScrolled(now);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center p-4 sm:p-6 select-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5 rounded-full border transition-all duration-300 shadow-2xl [transform-style:preserve-3d] ${
            isScrolled
              ? 'bg-[#090909]/90 backdrop-blur-xl border-white/20 shadow-black/80'
              : 'bg-[#0E0E0E]/80 backdrop-blur-md border-white/15'
          }`}
        >
          {/* Spatial DS Monogram with Subtle 3D Hover */}
          <Link
            to="/"
            className="group flex items-center space-x-3 shrink-0"
            aria-label="DS Portfolio Home"
          >
            <motion.div
              whileHover={{ rotateX: -8, rotateY: 10, translateZ: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-extrabold text-xs tracking-wider shadow-md group-hover:bg-[#FF3E00] group-hover:text-white transition-colors select-none"
            >
              {siteConfig.initials}
            </motion.div>

            <span className="font-mono text-[11px] tracking-widest text-white/50 uppercase hidden sm:flex items-center gap-1.5">
              <span>UI/UX · WEB</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] inline-block animate-pulse" />
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {spatialNavItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-4 py-1.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 rounded-full hover:translate-y-[-1px] ${
                    isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="spatialNavPill"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/25 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Action */}
          <div className="flex items-center space-x-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors shadow-md"
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden rounded-3xl border border-white/20 bg-[#0A0A0A]/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="space-y-2 font-mono text-sm uppercase tracking-widest">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block p-3 rounded-xl hover:bg-white/5 text-white"
              >
                HOME
              </Link>
              {spatialNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 rounded-xl hover:bg-white/5 text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span className="font-bold text-white">DS · UI/UX & WEB</span>
              <span className="text-[#FF3E00]">{siteConfig.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
