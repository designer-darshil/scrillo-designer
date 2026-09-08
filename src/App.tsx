import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { SectionLabel } from './components/SectionLabel/SectionLabel';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll foundation
  useLenis();

  const [showGridOverlay, setShowGridOverlay] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Optional Responsive Grid Overlay for Verification */}
      {showGridOverlay && (
        <div className="fixed inset-0 pointer-events-none z-50 page-container">
          <div className="editorial-grid h-full opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-white/10 border-x border-white/20 flex items-start justify-center pt-2 font-mono text-[10px] text-foreground"
              >
                C{i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Header / Infrastructure Bar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="page-container flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-foreground inline-block" />
            <span className="font-mono text-metadata uppercase tracking-meta text-foreground font-semibold">
              VISUAL SYSTEM SPECIMEN
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              className="px-3 py-1.5 border border-border text-meta hover:border-foreground transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
            >
              {showGridOverlay ? '[ HIDE GRID OVERLAY ]' : '[ SHOW GRID OVERLAY ]'}
            </button>
            <span className="hidden sm:inline-block text-meta text-muted">
              12 / 8 / 4 COL RESPONSIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Specimen & Infrastructure Verification */}
      <main className="page-container py-16 space-y-24">
        {/* 1. COLOR SYSTEM SPECIMEN */}
        <section className="space-y-6">
          <SectionLabel number="01" title="COLOR PALETTE SPECIFICATION" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="p-6 bg-background border border-border rounded-none space-y-3">
              <div className="h-16 w-full bg-[#050505] border border-border" />
              <p className="text-meta text-foreground font-medium">--background</p>
              <p className="text-meta text-muted">#050505 (Near Black)</p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-none space-y-3">
              <div className="h-16 w-full bg-[#0B0B0B] border border-border" />
              <p className="text-meta text-foreground font-medium">--surface</p>
              <p className="text-meta text-muted">#0B0B0B (Deep Surface)</p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-none space-y-3">
              <div className="h-16 w-full bg-[#F5F5F2] border border-border" />
              <p className="text-meta text-foreground font-medium">--foreground</p>
              <p className="text-meta text-muted">#F5F5F2 (Off White)</p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-none space-y-3">
              <div className="h-16 w-full bg-[#8E8E8E] border border-border" />
              <p className="text-meta text-foreground font-medium">--muted</p>
              <p className="text-meta text-muted">#8E8E8E (Muted Gray)</p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-none space-y-3">
              <div className="h-16 w-full bg-[#292929] border border-border" />
              <p className="text-meta text-foreground font-medium">--border</p>
              <p className="text-meta text-muted">#292929 (Subtle Rule)</p>
            </div>
          </div>
        </section>

        {/* 2. TYPOGRAPHY SYSTEM SPECIMEN */}
        <section className="space-y-12">
          <SectionLabel number="02" title="TYPOGRAPHY & HIERARCHY RULES" />

          {/* Display Scale */}
          <div className="space-y-3 border-b border-border pb-12">
            <span className="text-meta block">
              [DISPLAY] · clamp(4rem, 8vw, 9rem) · LINE-HEIGHT: 0.90 · TRACKING: -0.05EM
            </span>
            <h1 className="text-display">
              CREATIVE
              <br />
              DIRECTION
            </h1>
          </div>

          {/* Section Heading Scale */}
          <div className="space-y-3 border-b border-border pb-12">
            <span className="text-meta block">
              [SECTION HEADING] · clamp(3rem, 6vw, 7rem) · LINE-HEIGHT: 0.92 · TRACKING: -0.04EM
            </span>
            <h2 className="text-heading-section">
              SELECTED WORKS
            </h2>
          </div>

          {/* Project Heading Scale */}
          <div className="space-y-3 border-b border-border pb-12">
            <span className="text-meta block">
              [PROJECT HEADING] · clamp(2rem, 4vw, 5rem) · LINE-HEIGHT: 0.95 · TRACKING: -0.03EM
            </span>
            <h3 className="text-heading-project">
              KRONOS QUANTUM INTERFACE
            </h3>
          </div>

          {/* Body Editorial Scale */}
          <div className="space-y-3 border-b border-border pb-12">
            <span className="text-meta block">
              [BODY EDITORIAL] · 18PX - 24PX (clamp(1.125rem, 1.25vw, 1.5rem)) · LINE-HEIGHT: 1.5
            </span>
            <p className="text-body-editorial max-w-4xl">
              In an era crowded with ephemeral noise, rigorous restraint creates enduring impact. By synthesizing high-contrast monochrome aesthetics with razor-sharp creative engineering, we sculpt digital environments that command undivided attention.
            </p>
          </div>

          {/* Metadata Scale */}
          <div className="space-y-3">
            <span className="text-meta block">
              [METADATA & LABELS] · 11PX - 14PX (clamp(0.6875rem, 0.8vw, 0.875rem)) · TRACKING: 0.08EM
            </span>
            <div className="flex flex-wrap gap-6 text-meta">
              <span>INDEX: 001/008</span>
              <span>CLIENT: ATELIER FORM</span>
              <span>YEAR: 2026</span>
              <span>DISCIPLINE: DESIGN ENGINEERING</span>
              <span>LOCATION: 21.1702° N, 72.8311° E</span>
            </div>
          </div>
        </section>

        {/* 3. GRID & LAYOUT SYSTEM SPECIMEN */}
        <section className="space-y-6">
          <SectionLabel number="03" title="RESPONSIVE GRID & GUTTER SPECIFICATION" />

          <div className="text-meta text-muted mb-4">
            DESKTOP (1024px+): 12 COLUMNS, 5VW PADDING, 24PX GUTTERS | TABLET (768px): 8 COLUMNS | MOBILE: 4 COLUMNS, 20PX PADDING
          </div>

          <div className="editorial-grid">
            <div className="col-span-4 md:col-span-4 lg:col-span-6 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">BLOCK 01 (6 COLS DESKTOP / 4 COLS TABLET & MOBILE)</span>
              <p className="text-body-editorial text-sm text-muted">
                Demonstrates modular column span compliance within the 24px gutter layout.
              </p>
            </div>

            <div className="col-span-4 md:col-span-4 lg:col-span-6 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">BLOCK 02 (6 COLS DESKTOP / 4 COLS TABLET & MOBILE)</span>
              <p className="text-body-editorial text-sm text-muted">
                Maintains equal proportion and typographic baseline alignment across break points.
              </p>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-3 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">SPAN 3 COLS</span>
              <p className="text-meta text-muted">Desktop: 3 / Tablet: 2 / Mobile: 4</p>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-3 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">SPAN 3 COLS</span>
              <p className="text-meta text-muted">Desktop: 3 / Tablet: 2 / Mobile: 4</p>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-3 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">SPAN 3 COLS</span>
              <p className="text-meta text-muted">Desktop: 3 / Tablet: 2 / Mobile: 4</p>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-3 surface-card p-6 space-y-2">
              <span className="text-meta text-foreground font-semibold">SPAN 3 COLS</span>
              <p className="text-meta text-muted">Desktop: 3 / Tablet: 2 / Mobile: 4</p>
            </div>
          </div>
        </section>

        {/* 4. GLOBAL BEHAVIORS & ACCESSIBILITY SPECIMEN */}
        <section className="space-y-6 border-t border-border pt-12 pb-20">
          <SectionLabel number="04" title="BEHAVIOR, ACCESSIBLE FOCUS & SCROLLBAR" />

          <div className="editorial-grid">
            {/* Focus States */}
            <div className="col-span-4 md:col-span-4 lg:col-span-4 surface-card p-6 space-y-4">
              <span className="text-meta text-foreground font-semibold">[ACCESSIBLE FOCUS STATES]</span>
              <p className="text-meta text-muted">
                Interactive elements provide a clear 1px contrast outline offset by 3px on keyboard focus.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-border text-meta hover:border-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground transition-colors"
                >
                  Focus Target A
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-foreground text-background text-meta font-bold focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                >
                  Focus Target B
                </button>
              </div>
            </div>

            {/* Selection & Image Foundation */}
            <div className="col-span-4 md:col-span-4 lg:col-span-4 surface-card p-6 space-y-4">
              <span className="text-meta text-foreground font-semibold">[SELECTION & IMAGE RULES]</span>
              <p className="text-meta text-muted">
                Highlighting text activates the inverted selection palette (<span className="text-foreground bg-foreground/20 px-1">#F5F5F2 bg / #050505 text</span>).
              </p>
              <div className="h-16 w-full border border-border bg-[#141414] flex items-center justify-center text-meta text-muted">
                <span>[IMAGE RENDERING CONTAINER: OBJECT-FIT COVER]</span>
              </div>
            </div>

            {/* Lenis Smooth Scrolling Foundation */}
            <div className="col-span-4 md:col-span-8 lg:col-span-4 surface-card p-6 space-y-4">
              <span className="text-meta text-foreground font-semibold">[LENIS SMOOTH SCROLL]</span>
              <p className="text-meta text-muted">
                Active smooth scrolling with momentum physics, synchronized to GSAP ticker and ScrollTrigger updates.
              </p>
              <div className="text-meta text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>LENIS SCROLL ENGINE ACTIVE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Meta Strip */}
      <footer className="border-t border-border py-8">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-muted">
          <span>DARSHIL BHUVA — VISUAL DESIGN SYSTEM</span>
          <span>EDITORIAL MONOCHROME INFRASTRUCTURE · 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
