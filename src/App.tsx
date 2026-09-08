import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header/Header';
import { Hero } from './sections/Hero/Hero';
import { Marquee } from './components/Marquee/Marquee';
import { SelectedWorks } from './sections/SelectedWorks/SelectedWorks';
import { CustomCursor } from './components/CustomCursor/CustomCursor';

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

      {/* Main Content */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Reusable Marquee Divider */}
        <Marquee
          items={marqueeItems}
          speed={30}
          direction="left"
          enableVelocity={true}
          velocityMultiplier={1.2}
          size="display"
          separator="✦"
        />

        {/* 3. Selected Works Section */}
        <SelectedWorks />
      </main>

      {/* Subtle bottom buffer for contact navigation target */}
      <div
        id="contact"
        className="h-[20vh] bg-background border-t border-border flex items-center justify-between page-container text-meta text-muted"
      >
        <span>DARSHIL BHUVA · SELECTED WORKS EDITION</span>
        <span>NEXT SECTIONS RESERVED FOR UPCOMING PHASES</span>
      </div>
    </div>
  );
};

export default App;
