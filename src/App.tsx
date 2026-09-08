import React from 'react';
import { useLenis } from './hooks/useLenis';
import { useCustomCursor } from './hooks/useCustomCursor';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { Header } from './components/Header/Header';
import { Hero } from './sections/Hero/Hero';
import { SelectedWorks } from './sections/SelectedWorks/SelectedWorks';
import { Statement } from './sections/Statement/Statement';
import { Skills } from './sections/Skills/Skills';
import { Philosophy } from './sections/Philosophy/Philosophy';
import { Services } from './sections/Services/Services';
import { ExperimentalImage } from './sections/ExperimentalImage/ExperimentalImage';
import { ContactCTA } from './sections/ContactCTA/ContactCTA';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useLenis();

  // Initialize custom interactive cursor
  const { cursorState, setHoverState } = useCustomCursor();

  return (
    <div className="relative min-h-screen bg-dark-950 text-light-200 selection:bg-light-100 selection:text-dark-950">
      {/* Subtle Grain Overlay for tactile texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Interactive Custom Cursor */}
      <CustomCursor
        cursorText={cursorState.cursorText}
        isHovered={cursorState.isHovered}
        hoverType={cursorState.hoverType}
      />

      {/* Global Header */}
      <Header onHoverStateChange={setHoverState} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero onHoverStateChange={setHoverState} />
        <SelectedWorks onHoverStateChange={setHoverState} />
        <Statement />
        <Skills />
        <Philosophy />
        <Services />
        <ExperimentalImage onHoverStateChange={setHoverState} />
        <ContactCTA onHoverStateChange={setHoverState} />
      </main>

      {/* Global Footer */}
      <Footer onHoverStateChange={setHoverState} />
    </div>
  );
};

export default App;
