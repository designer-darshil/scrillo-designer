import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { CinematicHero } from '../components/sections/CinematicHero';
import { SelectedWork } from '../components/sections/SelectedWork';
import { HomeAboutPreview } from '../components/sections/HomeAboutPreview';
import { FinalCTA } from '../components/sections/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative">
        {/* 01: Hero - UI/UX Designer + Web Designer / Frontend */}
        <CinematicHero />

        {/* 02: Selected Work - Focused Project Cards */}
        <SelectedWork />

        {/* 03: Short About / Experience */}
        <HomeAboutPreview />

        {/* 04: Contact Conversion */}
        <FinalCTA />
      </div>
    </PageTransition>
  );
};
