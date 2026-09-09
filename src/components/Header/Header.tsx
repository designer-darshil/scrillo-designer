import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../animations/gsapConfig';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useWebsiteData } from '../../hooks/useWebsiteData';

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection = 'home',
  onNavigate,
}) => {
  const { data } = useWebsiteData();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(activeSection);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Synchronize active section
  useEffect(() => {
    setActiveItem(activeSection);
  }, [activeSection]);

  // Hide on scroll down, reveal on scroll up using GSAP
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const header = headerRef.current;

          if (!header) return;

          // Don't hide if mobile menu is open
          if (isMobileMenuOpen) {
            gsap.to(header, {
              yPercent: 0,
              duration: 0.3,
              ease: 'power3.out',
              overwrite: true,
            });
            return;
          }

          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY.current + 8) {
              // Scrolling down: hide header
              gsap.to(header, {
                yPercent: -100,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            } else if (currentScrollY < lastScrollY.current - 8) {
              // Scrolling up: show header
              gsap.to(header, {
                yPercent: 0,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            }
          } else {
            // Near top of page: always visible
            gsap.to(header, {
              yPercent: 0,
              duration: 0.3,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.documentElement.classList.remove('lenis-stopped');
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    href: string
  ) => {
    setActiveItem(id);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
    setIsMobileMenuOpen(false);
  };

  const sections = data.settings?.sections || ({} as any);
  const brandText = data.profile?.name || data.footer?.brandText || data.settings?.siteTitle || 'DARSHIL S. BHUVA';
  const headerTagline = data.profile?.title || data.hero?.subEyebrow || data.settings?.siteDescription || 'UI/UX DESIGNER / WEB DESIGNER';
  const email = data.profile?.email || data.contact?.email || data.footer?.email || 'darshilbhuva4322@gmail.com';
  const availability = data.contact?.availabilityStatus || 'AVAILABLE FOR COMMISSIONS';
  const socialList = (data.footer?.socialLinks || [])
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const allNav = [
    { id: 'home', label: 'Home', href: '#home', number: '01', visible: sections.hero?.visible !== false },
    { id: 'about', label: 'About', href: '#about', number: '02', visible: sections.statement?.visible !== false },
    { id: 'works', label: 'Works', href: '#works', number: '03', visible: sections.projects?.visible !== false },
    { id: 'experience', label: 'Experience', href: '#experience', number: '04', visible: sections.experience?.visible !== false },
    { id: 'skills', label: 'Skills', href: '#skills', number: '05', visible: sections.skills?.visible !== false },
    { id: 'services', label: 'Services', href: '#services', number: '06', visible: sections.services?.visible !== false },
    { id: 'contact', label: "Let's Talk", href: '#contact', number: '07', visible: sections.contact?.visible !== false },
  ];

  const navigationItems = allNav.filter((n) => n.visible);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none transition-transform duration-300 will-change-transform"
      >
        {/* Dynamic Theme-Aware Backdrop Container */}
        <div className="w-full bg-background/85 backdrop-blur-md border-b border-border/50 text-foreground transition-colors duration-300">
          <div className="page-container flex items-center justify-between py-4 sm:py-5">
            {/* LEFT: Portfolio name / brand */}
            <div className="pointer-events-auto">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, 'home', '#home')}
                className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-foreground/90 hover:text-foreground transition-opacity"
              >
                <span className="w-1.5 h-1.5 bg-foreground rounded-none group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-semibold">{brandText}</span>
              </a>
            </div>

            {/* CENTER: Tagline / Role (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-muted pointer-events-none">
              <span className="text-muted/40">/</span>
              <span>{headerTagline}</span>
            </div>

            {/* RIGHT: Navigation & Theme Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 pointer-events-auto">
              <nav className="flex items-center gap-6 lg:gap-8">
                {navigationItems.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id, item.href)}
                      className="group relative py-1 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-muted hover:text-foreground transition-colors duration-200"
                    >
                      <span className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="w-1 h-1 bg-foreground inline-block" />
                        )}
                        <span className={isActive ? 'text-foreground font-semibold' : ''}>{item.label}</span>
                      </span>

                      {/* Hover Underline Animation */}
                      <span
                        className={`absolute left-0 bottom-0 w-full h-px bg-foreground origin-left transition-transform duration-300 ease-out ${
                          isActive
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  );
                })}
              </nav>

              {/* Theme Toggle (Desktop Minimalist Editorial Control) */}
              <button
                type="button"
                onClick={toggleTheme}
                data-cursor="link"
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-foreground/80 hover:text-foreground border border-border/80 hover:border-foreground transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                <span className={theme === 'dark' ? 'text-foreground font-bold' : 'text-muted/60'}>DARK</span>
                <span className="text-muted/30">/</span>
                <span className={theme === 'light' ? 'text-foreground font-bold' : 'text-muted/60'}>LIGHT</span>
              </button>
            </div>

            {/* Mobile Menu Trigger (44px touch target) */}
            <div className="md:hidden pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-end gap-2 py-2 px-1 text-xs font-mono uppercase tracking-widest text-foreground/90 hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2"
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <span>{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
                <span className="text-[10px]">
                  {isMobileMenuOpen ? '[×]' : '[+]'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background text-foreground flex flex-col justify-between pt-24 pb-10 px-6 sm:px-10 md:hidden transition-colors duration-300"
          >
            {/* Background Subtle Dot Grid Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,var(--text)_1px,transparent_1px),linear-gradient(to_bottom,var(--text)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Mobile Nav Links */}
            <div className="relative z-10 my-auto flex flex-col gap-6">
              <div className="text-meta text-muted mb-2">[INDEX NAVIGATION]</div>
              {navigationItems.map((item, index) => {
                const isActive = activeItem === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id, item.href)}
                      className="group flex items-baseline justify-between py-2 border-b border-border text-foreground hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted">
                          [{item.number}]
                        </span>
                        <span className="font-sans text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </motion.div>
                );
              })}

              {/* Mobile Theme Toggle Item */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  delay: 0.08 * navigationItems.length,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-2"
              >
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-mono text-xs text-muted">[APPEARANCE]</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="min-h-[44px] flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground border border-border focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2"
                    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  >
                    <span className={theme === 'dark' ? 'font-bold underline underline-offset-4' : 'text-muted'}>DARK</span>
                    <span className="text-muted/40">/</span>
                    <span className={theme === 'light' ? 'font-bold underline underline-offset-4' : 'text-muted'}>LIGHT</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Mobile Menu Footer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="relative z-10 border-t border-border pt-6 space-y-4"
            >
              <div className="flex items-center justify-between text-meta text-muted">
                <span>{headerTagline}</span>
                <span className="text-foreground">{availability}</span>
              </div>

              <div className="flex items-center justify-between text-meta">
                <a
                  href={`mailto:${email}`}
                  className="text-foreground underline underline-offset-4"
                >
                  {email}
                </a>
                <div className="flex gap-4 text-muted">
                  {socialList.slice(0, 2).map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.url || soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
