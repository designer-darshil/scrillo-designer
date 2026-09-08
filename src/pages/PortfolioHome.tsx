import React, { useState } from 'react';
import { useLenis } from '../hooks/useLenis';
import { Header } from '../components/Header/Header';
import { Hero } from '../sections/Hero/Hero';
import { Marquee } from '../components/Marquee/Marquee';
import { SelectedWorks } from '../sections/SelectedWorks/SelectedWorks';
import { Statement } from '../sections/Statement/Statement';
import { Skills } from '../sections/Skills/Skills';
import { Philosophy } from '../sections/Philosophy/Philosophy';
import { Services } from '../sections/Services/Services';
import { ExperimentalImage } from '../sections/ExperimentalImage/ExperimentalImage';
import { ContactCTA } from '../sections/ContactCTA/ContactCTA';
import { Footer } from '../components/Footer/Footer';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { useWebsiteData } from '../hooks/useWebsiteData';

export const PortfolioHome: React.FC = () => {
  // Initialize Lenis smooth scroll foundation
  useLenis();

  const { data } = useWebsiteData();
  const [activeSection, setActiveSection] = useState('home');

  const { sections } = data.settings;
  const marquee = data.marquee;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:font-mono focus:text-xs focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Reusable High-Performance Desktop Custom Cursor */}
      {data.settings.enableCustomCursor !== false && <CustomCursor />}

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
      <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
        {/* 1. Hero Section */}
        {sections.hero?.visible !== false && <Hero content={data.hero} />}

        {/* 2. Reusable Marquee Divider */}
        {sections.marquee?.visible !== false && (
          <Marquee
            items={marquee.items}
            speed={marquee.speed || 30}
            direction={marquee.direction || 'left'}
            enableVelocity={marquee.enableVelocity ?? true}
            velocityMultiplier={1.2}
            size="display"
            separator={marquee.separator || '✦'}
          />
        )}

        {/* 3. Selected Works Section */}
        {sections.projects?.visible !== false && (
          <SelectedWorks projects={data.projects} />
        )}

        {/* 4. Creative Statement Section */}
        {sections.statement?.visible !== false && (
          <Statement content={data.about} />
        )}

        {/* 5. Discipline & Skills Section */}
        {sections.skills?.visible !== false && (
          <Skills categories={data.skills} />
        )}

        {/* 6. Design Philosophy Section */}
        {sections.philosophy?.visible !== false && (
          <Philosophy content={data.philosophy} />
        )}

        {/* 7. Services Section */}
        {sections.services?.visible !== false && (
          <Services services={data.services} />
        )}

        {/* 8. Experimental Cinematic Visual Break */}
        {sections.image?.visible !== false && (
          <ExperimentalImage content={data.image} />
        )}

        {/* 9. Final Contact CTA Climax */}
        {sections.contact?.visible !== false && (
          <ContactCTA content={data.contact} />
        )}
      </main>

      {/* 10. Large Editorial Footer */}
      {sections.footer?.visible !== false && (
        <Footer content={data.footer} />
      )}
    </div>
  );
};

export default PortfolioHome;

