import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers } from 'lucide-react';
import { projects } from '../../data/projects';

export const EditorialSelectedWork: React.FC = () => {
  // Take the primary curated projects
  const nova = projects.find((p) => p.slug === 'nova') || projects[0];
  const aura = projects.find((p) => p.slug === 'aura') || projects[1];
  const frame = projects.find((p) => p.slug === 'frame') || projects[2];
  const mono = projects.find((p) => p.slug === 'mono') || projects[3];

  return (
    <section id="selected-work" className="relative bg-[#060606] text-white">
      {/* Section Header Bar */}
      <div className="border-b border-white/[0.08] py-8 sm:py-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">02</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00]">SELECTED WORK</span>
          </div>
          <div className="hidden sm:block">
            <span>EDITORIAL SPREADS · 2024 — 2026</span>
          </div>
          <Link
            to="/work"
            className="text-white/70 hover:text-[#FF3E00] transition-colors flex items-center gap-1.5"
          >
            <span>VIEW ALL ({projects.length})</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* SPREAD 01: NOVA (Left-heavy composition) */}
      <article className="border-b border-white/[0.08] py-16 sm:py-24 lg:py-32">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-xs text-[#FF3E00] tracking-widest uppercase">
              {nova.number} / {nova.categoryLabel}
            </div>

            <h2 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title transition-transform duration-300">
              <Link to={`/work/${nova.slug}`} className="hover:text-[#FF3E00] transition-colors">
                {nova.title}
              </Link>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed text-pretty max-w-md">
              {nova.subtitle}
            </p>

            {/* Concise Real Metadata */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 font-mono text-xs text-white/50">
              <div>
                <span className="block text-white/30 uppercase text-[10px]">ROLE</span>
                <span className="text-white/80">{nova.roles[0]}</span>
              </div>
              <div>
                <span className="block text-white/30 uppercase text-[10px]">YEAR</span>
                <span className="text-white/80">{nova.year}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/work/${nova.slug}`}
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white hover:text-[#FF3E00] transition-colors"
              >
                <span>VIEW SPREAD</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Dimensional Visual Spread */}
          <div className="lg:col-span-7 [perspective:1200px]">
            <Link
              to={`/work/${nova.slug}`}
              className="group block relative rounded-lg overflow-hidden border border-white/10 bg-[#0E0E0E] shadow-2xl transition-all duration-500 hover:border-white/25 hover:shadow-black/90 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-3deg)_translateZ(10px)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={nova.heroImage}
                  alt={nova.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>

              {/* Floating secondary badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white/70 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Layers size={10} className="text-[#FF3E00]" />
                <span>SPATIAL VIEWPORT</span>
              </div>
            </Link>
          </div>
        </div>
      </article>

      {/* SPREAD 02: AURA (Right-heavy composition) */}
      <article className="border-b border-white/[0.08] py-16 sm:py-24 lg:py-32">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Dimensional Visual Spread (offset) */}
          <div className="lg:col-span-7 order-2 lg:order-1 [perspective:1200px]">
            <Link
              to={`/work/${aura.slug}`}
              className="group block relative rounded-lg overflow-hidden border border-white/10 bg-[#0E0E0E] shadow-2xl transition-all duration-500 hover:border-white/25 hover:shadow-black/90 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(3deg)_translateZ(10px)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={aura.heroImage}
                  alt={aura.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>

              <div className="absolute bottom-4 left-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white/70 flex items-center gap-1.5">
                <span>AURA // EDITORIAL COMMERCE</span>
              </div>
            </Link>
          </div>

          {/* Right Column: Editorial Information */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="font-mono text-xs text-[#FF3E00] tracking-widest uppercase">
              {aura.number} / {aura.categoryLabel}
            </div>

            <h2 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title">
              <Link to={`/work/${aura.slug}`} className="hover:text-[#FF3E00] transition-colors">
                {aura.title}
              </Link>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed text-pretty max-w-md">
              {aura.subtitle}
            </p>

            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 font-mono text-xs text-white/50">
              <div>
                <span className="block text-white/30 uppercase text-[10px]">ROLE</span>
                <span className="text-white/80">{aura.roles[0]}</span>
              </div>
              <div>
                <span className="block text-white/30 uppercase text-[10px]">YEAR</span>
                <span className="text-white/80">{aura.year}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/work/${aura.slug}`}
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white hover:text-[#FF3E00] transition-colors"
              >
                <span>VIEW SPREAD</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* SPREAD 03: FRAME (Centered / Wide cinematic composition) */}
      <article className="border-b border-white/[0.08] py-16 sm:py-24 lg:py-32">
        <div className="site-container space-y-8 sm:space-y-12">
          
          {/* Centered Editorial Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="font-mono text-xs text-[#FF3E00] tracking-widest uppercase">
              {frame.number} / {frame.categoryLabel}
            </div>

            <h2 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title">
              <Link to={`/work/${frame.slug}`} className="hover:text-[#FF3E00] transition-colors">
                {frame.title}
              </Link>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              {frame.subtitle}
            </p>
          </div>

          {/* Wide Cinematic Spatial Canvas */}
          <div className="[perspective:1400px] max-w-5xl mx-auto">
            <Link
              to={`/work/${frame.slug}`}
              className="group block relative rounded-lg overflow-hidden border border-white/10 bg-[#0E0E0E] shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-black/90 [transform-style:preserve-3d] hover:[transform:rotateX(2.5deg)_translateZ(12px)]"
            >
              <div className="relative aspect-[21/10] overflow-hidden bg-black">
                <img
                  src={frame.heroImage}
                  alt={frame.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              </div>

              {/* Bottom metadata banner */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/60 bg-[#0C0C0C]">
                <div className="flex items-center gap-6">
                  <span>ROLE: {frame.roles[0]}</span>
                  <span className="hidden sm:inline text-white/20">/</span>
                  <span className="hidden sm:inline">YEAR: {frame.year}</span>
                </div>
                <div className="flex items-center gap-1 text-[#FF3E00] group-hover:translate-x-1 transition-transform">
                  <span>EXPLORE CASE STUDY</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>

      {/* SPREAD 04: MONO (Layered / Overlapping typography composition) */}
      <article className="border-b border-white/[0.08] py-16 sm:py-24 lg:py-32">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-xs text-[#FF3E00] tracking-widest uppercase">
              {mono.number} / {mono.categoryLabel}
            </div>

            <h2 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title">
              <Link to={`/work/${mono.slug}`} className="hover:text-[#FF3E00] transition-colors">
                {mono.title}
              </Link>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed text-pretty max-w-md">
              {mono.subtitle}
            </p>

            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 font-mono text-xs text-white/50">
              <div>
                <span className="block text-white/30 uppercase text-[10px]">ROLE</span>
                <span className="text-white/80">{mono.roles[0]}</span>
              </div>
              <div>
                <span className="block text-white/30 uppercase text-[10px]">YEAR</span>
                <span className="text-white/80">{mono.year}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/work/${mono.slug}`}
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white hover:text-[#FF3E00] transition-colors"
              >
                <span>VIEW SPREAD</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Layered Overlapping Panels */}
          <div className="lg:col-span-7 relative [perspective:1200px] min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
            {/* Primary Base Panel */}
            <Link
              to={`/work/${mono.slug}`}
              className="group block relative w-[85%] aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-[#0E0E0E] shadow-2xl transition-all duration-500 hover:border-white/30 [transform:rotate(-2deg)] hover:[transform:rotate(0deg)_scale(1.02)]"
            >
              <img
                src={mono.heroImage}
                alt={mono.title}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </Link>

            {/* Overlapping Specimen Card */}
            <div className="absolute -bottom-4 right-2 sm:right-6 w-48 sm:w-60 p-3.5 sm:p-4 rounded border border-white/15 bg-[#121212]/95 backdrop-blur-md shadow-2xl [transform:translateZ(30px)] pointer-events-none">
              <span className="font-mono text-[9px] text-[#FF3E00] tracking-widest uppercase block mb-1">
                TYPOGRAPHIC SPECIMEN
              </span>
              <p className="font-mono text-xs text-white/90 leading-tight">
                JetBrains Mono × Plus Jakarta Sans
              </p>
              <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px] text-white/40">
                <span>GRID 12-COL</span>
                <span>AA / AAA</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Archive Callout Banner */}
      <div className="py-12 sm:py-16 text-center border-b border-white/[0.08]">
        <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="font-mono text-xs text-[#FF3E00] uppercase tracking-widest block mb-1">
              ARCHIVE
            </span>
            <p className="text-white text-base sm:text-lg font-medium">
              Explore the complete directory of 8 digital design and frontend case studies.
            </p>
          </div>

          <Link
            to="/work"
            className="shrink-0 px-6 py-3 rounded border border-white/20 bg-white/5 hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white font-mono text-xs tracking-widest uppercase transition-all duration-200 flex items-center gap-2"
          >
            <span>EXPLORE ALL PROJECTS</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
