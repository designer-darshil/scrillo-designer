import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { SpatialHero } from '../components/spatial/SpatialHero';
import { SpatialProjectShowcase } from '../components/spatial/SpatialProjectShowcase';
import { SpatialAbout } from '../components/spatial/SpatialAbout';
import { SpatialTimeline } from '../components/spatial/SpatialTimeline';
import { TypographicSkills } from '../components/spatial/TypographicSkills';
import { SpatialContact } from '../components/spatial/SpatialContact';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative bg-[#050505]">
        {/* 01. Spatial Architectural Opening */}
        <SpatialHero />

        {/* 02. Spatial Interactive Project Showcase (Floating 3D Monolith) */}
        <SpatialProjectShowcase />

        {/* 03. Spatial Personal Introduction */}
        <SpatialAbout />

        {/* 04. Horizontal Spatial Timeline (2018 → NOW) */}
        <SpatialTimeline />

        {/* 05. Architectural Typographic Skills */}
        <TypographicSkills />

        {/* 06. Spatial Contact */}
        <SpatialContact />
      </div>
    </PageTransition>
  );
};


