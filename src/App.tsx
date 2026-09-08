import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header/Header';
import { Hero } from './sections/Hero/Hero';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { Marquee } from './components/Marquee/Marquee';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll foundation
  useLenis();

  const [activeSection, setActiveSection] = useState('home');

  const marqueeItems = [
    'CREATIVE DEVELOPER',
    'DIGITAL DESIGNER',
    'INTERACTION DESIGNER',
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Reusable High-Performance Desktop Custom Cursor */}
      <CustomCursor />

      {/* Premium Minimalist Fixed Header */}
      <Header
        activeSection={activeSection}
        onNavigate={(id) => {
          setActiveSection(id);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Content: Hero & Full-Width Editorial Marquee */}
      <main className="relative z-10">
        <Hero />

        {/* Full-width Editorial Horizontal Marquee */}
        <section className="w-full py-8 bg-background">
          <Marquee
            items={marqueeItems}
            speed={30}
            direction="left"
            enableVelocity={true}
            velocityMultiplier={1.2}
            size="display"
            separator="✦"
          />
        </section>
      </main>

      {/* Subtle bottom buffer for scroll testing without other sections */}
      <div
        id="works"
        className="h-[40vh] bg-background border-t border-border flex items-center justify-center page-container text-meta text-muted"
      >
        <span>[ SELECTED WORKS SECTION RESERVED FOR NEXT PHASE ]</span>
      </div>
    </div>
  );
};

export default App;
