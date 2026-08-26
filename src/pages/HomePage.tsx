import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicHero } from '../components/sections/CinematicHero';
import { PersonalStatement } from '../components/sections/PersonalStatement';
import { SelectedWork } from '../components/sections/SelectedWork';
import { SignatureDesignCode } from '../components/sections/SignatureDesignCode';
import { LabPreview } from '../components/sections/LabPreview';
import { ThinkingPreview } from '../components/sections/ThinkingPreview';
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection';
import { DesignProcess } from '../components/sections/DesignProcess';
import { ExperiencePreview } from '../components/sections/ExperiencePreview';
import { CurrentlySection } from '../components/ui/CurrentlySection';
import { ClientNotes } from '../components/sections/ClientNotes';
import { FinalCTA } from '../components/sections/FinalCTA';
import { SectionHeading } from '../components/ui/SectionHeading';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative">
        {/* 01: Distinctive Cinematic Hero */}
        <CinematicHero />

        {/* 02: Personal Positioning */}
        <PersonalStatement />

        {/* 03: Selected Work Showcase */}
        <SelectedWork />

        {/* 04: Signature DESIGN → CODE Interaction */}
        <SignatureDesignCode />

        {/* 05: Design Playground / Lab Preview */}
        <LabPreview />

        {/* 06: Thinking & Design Observations Preview */}
        <ThinkingPreview />

        {/* 07: Capabilities & Services */}
        <CapabilitiesSection />

        {/* 08: Design Process & Methodology */}
        <DesignProcess />

        {/* 09: Currently & Exploring Section */}
        <section className="py-24 md:py-32 bg-[#050505] border-b border-white/10 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <SectionHeading
              number="06"
              tag="REAL-TIME FOCUS"
              title="CURRENTLY"
              serifWord="& exploration areas"
              description="Active client work, experimental sandbox projects, and technical research."
            />
            <div className="mt-8">
              <CurrentlySection />
            </div>
          </div>
        </section>

        {/* 10: Career Preview & Peer Notes */}
        <ExperiencePreview />
        <ClientNotes />

        {/* 11: Final Conversion CTA */}
        <FinalCTA />
      </div>
    </PageTransition>
  );
};
