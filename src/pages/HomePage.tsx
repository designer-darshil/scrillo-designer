import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { EditorialHero } from '../components/editorial/EditorialHero';
import { EditorialSelectedWork } from '../components/editorial/EditorialSelectedWork';
import { EditorialCapabilities } from '../components/editorial/EditorialCapabilities';
import { EditorialExperience } from '../components/editorial/EditorialExperience';
import { EditorialContact } from '../components/editorial/EditorialContact';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative bg-[#060606] selection:bg-[#FF3E00] selection:text-white">
        {/* 01. INTRO / Editorial Spatial Hero */}
        <EditorialHero />

        {/* 02. SELECTED WORK / Editorial Spreads with Alternating Rhythms */}
        <EditorialSelectedWork />

        {/* 03. CAPABILITIES / Structured Editorial Groupings (No percentage bars) */}
        <EditorialCapabilities />

        {/* 04. EXPERIENCE / Verified Professional Timeline */}
        <EditorialExperience />

        {/* 05. CONTACT / Final Editorial Spread with Fallback */}
        <EditorialContact />
      </div>
    </PageTransition>
  );
};

export default HomePage;
