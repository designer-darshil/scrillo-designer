import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicHero } from '../components/sections/CinematicHero';
import { PersonalStatement } from '../components/sections/PersonalStatement';
import { SelectedWork } from '../components/sections/SelectedWork';
import { SignatureDesignCode } from '../components/sections/SignatureDesignCode';
import { ExperiencePreview } from '../components/sections/ExperiencePreview';
// import { ClientNotes } from '../components/sections/ClientNotes';
import { FinalCTA } from '../components/sections/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative">
        {/* 01: Distinctive Cinematic Hero: 8+ yrs UI/UX + 4+ yrs Frontend */}
        <CinematicHero />

        {/* 02: Experience Positioning & Philosophy */}
        <PersonalStatement />

        {/* 03: Selected Work & Portfolio Case Studies */}
        <SelectedWork />

        {/* 04: Signature DESIGN → CODE Pipeline Fidelity */}
        <SignatureDesignCode />

        {/* 05: Career Timeline & Tooling Proficiency */}
        <ExperiencePreview />

        {/* 06: Client / Collaborator Notes (Commented out to avoid dummy/placeholder text) */}
        {/* <ClientNotes /> */}

        {/* 07: Final Conversion CTA */}
        <FinalCTA />
      </div>
    </PageTransition>
  );
};
