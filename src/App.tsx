import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header/Header';
import { Hero } from './sections/Hero/Hero';
import { Marquee } from './components/Marquee/Marquee';
import { SelectedWorks } from './sections/SelectedWorks/SelectedWorks';
import { Statement } from './sections/Statement/Statement';
import { Skills } from './sections/Skills/Skills';
import { Philosophy } from './sections/Philosophy/Philosophy';
import { Services } from './sections/Services/Services';
import { ExperimentalImage } from './sections/ExperimentalImage/ExperimentalImage';
import { ContactCTA } from './sections/ContactCTA/ContactCTA';
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

        {/* 4. Creative Statement Section */}
        <Statement />

        {/* 5. Discipline & Skills Section */}
        <Skills />

        {/* 6. Design Philosophy Section */}
        <Philosophy />

        {/* 7. Services Section */}
        <Services />

        {/* 8. Experimental Cinematic Visual Break */}
        <ExperimentalImage />

        {/* 9. Final Contact CTA Climax */}
        <ContactCTA />
      </main>
    </div>
  );
};

export default App;
