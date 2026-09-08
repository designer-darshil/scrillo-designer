import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header/Header';
import { Hero } from './sections/Hero/Hero';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll foundation
  useLenis();

  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
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

      {/* Main Hero Section */}
      <main className="relative z-10">
        <Hero />
      </main>

      {/* Subtle bottom buffer for scroll testing without other sections */}
      <div id="works" className="h-[30vh] bg-background border-t border-border flex items-center justify-center page-container text-meta text-muted">
        <span>[ SELECTED WORKS SECTION RESERVED FOR NEXT PHASE ]</span>
      </div>
    </div>
  );
};

export default App;
