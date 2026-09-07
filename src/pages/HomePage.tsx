import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Interactive3DHero } from '../components/interactive3d/Interactive3DHero';
import { Interactive3DProjects } from '../components/interactive3d/Interactive3DProjects';
import { Interactive3DAbout } from '../components/interactive3d/Interactive3DAbout';
import { Interactive3DExperience } from '../components/interactive3d/Interactive3DExperience';
import { Interactive3DSkills } from '../components/interactive3d/Interactive3DSkills';
import { Interactive3DContact } from '../components/interactive3d/Interactive3DContact';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative bg-[#050505]">
        {/* 01. 3D Interactive Hero: Massive Typography & Interactive 3D Product Slab */}
        <Interactive3DHero />

        {/* 02. 3D Interactive Selected Work: Art-Directed Non-Uniform Grid with Multi-Layer Depth */}
        <Interactive3DProjects />

        {/* 03. About: Spatial Typography & Authentic Background */}
        <Interactive3DAbout />

        {/* 04. Experience: Clean Interactive Timeline with Subtle Depth Hover */}
        <Interactive3DExperience />

        {/* 05. Skills: 3-Column Interactive Category List with Micro 3D Response */}
        <Interactive3DSkills />

        {/* 06. Contact: Tactile 3D Form Card with Real Delivery & Fallback */}
        <Interactive3DContact />
      </div>
    </PageTransition>
  );
};

