import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicIntro } from '../components/cinematic/CinematicIntro';
import { CinematicFilmHero } from '../components/cinematic/CinematicFilmHero';
import { CinematicSelectedWork } from '../components/cinematic/CinematicSelectedWork';
import { CinematicStatement } from '../components/cinematic/CinematicStatement';
import { CinematicCredits } from '../components/cinematic/CinematicCredits';
import { CinematicClosing } from '../components/cinematic/CinematicClosing';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative bg-[#030303]">
        {/* Prologue: 1.4s Fast Filmic Entrance Sequence */}
        <CinematicIntro />

        {/* Act 01: Dramatic Photographic Film Title Opening */}
        <CinematicFilmHero />

        {/* Act 02: Selected Work as a Sequence of Distinct Film Shots */}
        <CinematicSelectedWork />

        {/* Act 03: Quiet Moment & Typographic Statement */}
        <CinematicStatement />

        {/* Act 04: Production Credits & Career Timeline */}
        <CinematicCredits />

        {/* Act 05: Epilogue, Typographic Closing & Fallback Contact */}
        <CinematicClosing />
      </div>
    </PageTransition>
  );
};
