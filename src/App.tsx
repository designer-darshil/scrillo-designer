import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header/Header';
import { SectionLabel } from './components/SectionLabel/SectionLabel';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll foundation
  useLenis();

  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Premium Minimalist Fixed Header */}
      <Header activeSection={activeSection} onNavigate={(id) => setActiveSection(id)} />

      {/* Main Container for Header Testing (Dark and Light Image Surfaces) */}
      <main className="page-container pt-32 pb-40 space-y-32">
        {/* Header Specimen Intro */}
        <section id="home" className="space-y-6">
          <SectionLabel number="01" title="HEADER INFRASTRUCTURE & BLEND SPECIFICATION" />

          <div className="space-y-4 max-w-3xl">
            <span className="text-meta text-muted">
              FIXED POSITION · MIX-BLEND-MODE: DIFFERENCE · GSAP SCROLL-AWARE REVEAL
            </span>
            <h1 className="text-heading-section">
              MINIMALIST
              <br />
              FIXED HEADER
            </h1>
            <p className="text-body-editorial">
              The header is engineered with near-zero visual weight and a transparent background. Using hardware-accelerated difference blend modes, the typography automatically inverts when passing over pure black surfaces, high-contrast imagery, and bright editorial blocks.
            </p>
          </div>
        </section>

        {/* Contrast Verification: Dark Surface vs Pure Light Surface */}
        <section id="about" className="space-y-8">
          <SectionLabel number="02" title="CONTRAST VERIFICATION (DARK VS LIGHT CONTENT)" />

          <div className="editorial-grid">
            {/* Dark Section */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6 p-10 bg-surface border border-border space-y-4">
              <span className="text-meta text-foreground font-semibold">SURFACE A: DEEP BLACK (#0B0B0B)</span>
              <p className="text-body-editorial text-sm">
                Header renders as crisp off-white (`#F5F5F2`) text with subtle tracking and underline hover states.
              </p>
              <div className="h-40 border border-border flex items-center justify-center text-meta text-muted">
                [DARK SURFACE BACKGROUND]
              </div>
            </div>

            {/* Light / High-Key Image Surface */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6 p-10 bg-[#F5F5F2] text-[#050505] border border-white/20 space-y-4">
              <span className="text-meta text-[#050505] font-semibold">SURFACE B: HIGH-KEY WHITE / LIGHT CONTENT</span>
              <p className="text-body-editorial text-sm text-[#555555]">
                When the fixed header scrolls over this light area, `mix-blend-mode: difference` automatically renders the text in inverted dark ink with zero contrast loss.
              </p>
              <div className="h-40 border border-[#292929]/20 bg-white flex items-center justify-center text-meta text-[#050505]">
                [LIGHT / HIGH-KEY CONTENT BLOCK]
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Behavior Verification Block */}
        <section id="works" className="space-y-8">
          <SectionLabel number="03" title="SCROLL DIRECTION COLLAPSE & REVEAL (GSAP)" />

          <div className="surface-card p-8 sm:p-12 space-y-6">
            <span className="text-meta text-foreground font-semibold">INTERACTIVE SCROLL VERIFICATION</span>
            <p className="text-body-editorial">
              Scroll down past 100px: The header smoothly collapses upward (`-100%`).<br />
              Scroll up at any point: The header instantly slides back down with `power3.out` easing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-meta text-muted">
              <div className="p-4 border border-border">01. SCROLL DOWN TO HIDE</div>
              <div className="p-4 border border-border">02. SCROLL UP TO REVEAL</div>
              <div className="p-4 border border-border">03. MOBILE MENU FULLSCREEN</div>
            </div>
          </div>
        </section>

        {/* Contact Nav Target */}
        <section id="contact" className="space-y-6 border-t border-border pt-16">
          <SectionLabel number="04" title="NAV TARGET: LET'S TALK" />
          <div className="space-y-2">
            <h2 className="text-heading-project">LET'S TALK</h2>
            <p className="text-body-editorial">
              contact@darshilbhuva.com · Available for selective design & engineering commissions.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Meta Strip */}
      <footer className="border-t border-border py-8">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-muted">
          <span>DARSHIL BHUVA — MINIMALIST FIXED HEADER</span>
          <span>EDITORIAL MONOCHROME INFRASTRUCTURE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
