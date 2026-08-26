import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicHero } from '../components/sections/CinematicHero';
import { PersonalStatement } from '../components/sections/PersonalStatement';
import { SelectedWork } from '../components/sections/SelectedWork';
import { SignatureDesignCode } from '../components/sections/SignatureDesignCode';
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection';
import { DesignProcess } from '../components/sections/DesignProcess';
import { ExperimentsSection } from '../components/sections/ExperimentsSection';
import { ExperiencePreview } from '../components/sections/ExperiencePreview';
import { ClientNotes } from '../components/sections/ClientNotes';
import { FinalCTA } from '../components/sections/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative">
        {/* 01: Distinctive Cinematic Hero */}
        <CinematicHero />

        {/* 02: Personal Introduction & Positioning */}
        <PersonalStatement />

        {/* 03: Selected Work Showcase */}
        <SelectedWork />

        {/* 04: Signature DESIGN → CODE Interaction */}
        <SignatureDesignCode />

        {/* 05: Capabilities & Services */}
        <CapabilitiesSection />

        {/* 06: Design Process & Methodology */}
        <DesignProcess />

        {/* 07: Experimental Lab & Interactions */}
        <ExperimentsSection />

        {/* 08: Career & Tooling Preview */}
        <ExperiencePreview />

        {/* 09: Collaborator / Client Notes */}
        <ClientNotes />

        {/* 10: Final Conversion CTA */}
        <FinalCTA />
      </div>
    </PageTransition>
  );
};
