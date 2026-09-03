import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicIntro } from '../components/cinematic/CinematicIntro';
import { CinematicFilmHero } from '../components/cinematic/CinematicFilmHero';
import { CinematicSelectedWork } from '../components/cinematic/CinematicSelectedWork';
import { CinematicNarrative } from '../components/cinematic/CinematicNarrative';
import { CinematicClosing } from '../components/cinematic/CinematicClosing';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative">
        {/* Prologue: 1.4s Fast Filmic Entrance Sequence */}
        <CinematicIntro />

        {/* Act 01: Title Sequence Hero */}
        <CinematicFilmHero />

        {/* Act 02: Full-Width Scene-Based Projects */}
        <CinematicSelectedWork />

        {/* Act 03: Narrative Chronicle & Career Credits */}
        <CinematicNarrative />

        {/* Act 04: Typographic Closing & Fallback-Guarded Contact */}
        <CinematicClosing />
      </div>
    </PageTransition>
  );
};
