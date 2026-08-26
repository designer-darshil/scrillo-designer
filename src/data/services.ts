import { ServiceItem } from '../types';

export const services: ServiceItem[] = [
  {
    id: 'ui-ux-design',
    number: '01',
    title: 'UI/UX Design',
    category: 'design',
    tagline: 'Crafting intuitive, human-centered product architectures and high-craft interfaces.',
    description: 'Transforming ambiguous product requirements into structured, tactile interfaces. Focused on cognitive clarity, ergonomic interaction patterns, and rigorous accessibility standards.',
    problemSolved: 'Eliminates product friction, reduces user drop-off rates, and creates clear visual hierarchy for complex features.',
    whatYouGet: [
      'Comprehensive UX audit and user journey mapping',
      'High-fidelity interactive prototypes in Figma',
      'Pixel-perfect responsive screen layouts (Desktop, Tablet, Mobile)',
      'WCAG 2.1 AA/AAA accessibility compliance'
    ],
    technologies: ['Figma', 'FigJam', 'Framer', 'Design Systems', 'Usability Testing'],
    deliverables: ['Figma Source Files', 'Interactive Prototypes', 'UX Research Dossier', 'Design Specifications']
  },
  {
    id: 'web-design-art-direction',
    number: '02',
    title: 'Web Design & Art Direction',
    category: 'design',
    tagline: 'Distinctive digital flagship websites with editorial typography and bespoke art direction.',
    description: 'Rejecting cookie-cutter templates in favor of tailored digital storytelling. Combining bold typography, intentional white space, and rich media composition to elevate brand authority.',
    problemSolved: 'Rescues brands from generic SaaS/corporate aesthetics, establishing immediate credibility and high conversion.',
    whatYouGet: [
      'Bespoke visual identity and typographic hierarchy',
      'Art-directed landing page & marketing website concepts',
      'Custom iconography, vector graphics, and media curation',
      'Micro-interaction and motion design guidelines'
    ],
    technologies: ['Art Direction', 'Typography', 'Figma', 'Framer Motion', 'Editorial Grids'],
    deliverables: ['Desktop & Mobile Mockups', 'Brand Visual Guidelines', 'Animation Spec Sheets', 'Exported Vector Assets']
  },
  {
    id: 'frontend-development',
    number: '03',
    title: 'Frontend Web Development',
    category: 'engineering',
    tagline: 'Production-ready React, TypeScript, and modern CSS built with 100% design fidelity.',
    description: 'Bridging the design-to-code gap. Writing clean, modular, and performant frontend code that mirrors Figma files down to the sub-pixel with smooth 60fps animations.',
    problemSolved: 'Prevents the loss of design fidelity during engineering handoff and ensures ultra-fast page loads.',
    whatYouGet: [
      'Clean, componentized React / Next.js / Vite architecture',
      'Type-safe TypeScript codebases with zero bloat',
      'Responsive CSS with modern Tailwind or vanilla token systems',
      'SEO-optimized, accessible DOM structure with 95+ Lighthouse scores'
    ],
    technologies: ['React 18', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'Git'],
    deliverables: ['Production GitHub Repository', 'Component Storybook / Documentation', 'Vercel / Netlify Deployment', 'Clean Build Pipeline']
  },
  {
    id: 'design-systems',
    number: '04',
    title: 'Design Systems & Tokens',
    category: 'strategy',
    tagline: 'Scalable design token architectures linking Figma design files directly to React UI libraries.',
    description: 'Constructing robust atomic component systems with strict naming conventions, semantic color tokens, spacing scales, and reusable stateful UI primitives.',
    problemSolved: 'Accelerates feature shipping velocity by 3x and enforces visual consistency across large multidisciplinary teams.',
    whatYouGet: [
      'Multi-tier design token architecture (Global, Semantic, Component)',
      'Figma component library with auto-layout and variant properties',
      'Synchronized React/Tailwind theme configuration',
      'Comprehensive design system documentation & usage guidelines'
    ],
    technologies: ['Design Tokens', 'Figma Variables', 'Tailwind CSS', 'Radix UI', 'CSS Custom Properties'],
    deliverables: ['Figma UI Kit', 'Token JSON Schema', 'Reusable React Component Library', 'Usage Documentation']
  },
  {
    id: 'landing-page-design',
    number: '05',
    title: 'Landing Page & Conversion Design',
    category: 'design',
    tagline: 'High-impact conversion pages designed to communicate product value in seconds.',
    description: 'Structuring clear narrative arcs that guide visitors from curiosity to high-intent action. Combining compelling value propositions with proof points and magnetic CTAs.',
    problemSolved: 'Converts cold visitor traffic into active beta signups, waitlist leads, and paying customers.',
    whatYouGet: [
      'Value-proposition narrative mapping and section wireframing',
      'Interactive feature showcases and product demo simulators',
      'A/B test ready page variants',
      'Fast-loading responsive frontend implementation'
    ],
    technologies: ['Figma', 'React', 'Conversion Strategy', 'Framer Motion', 'SEO Optimization'],
    deliverables: ['High-Converting Page Layout', 'Interactive Prototype', 'Frontend Codebase', 'Analytics Setup']
  },
  {
    id: 'interaction-motion',
    number: '06',
    title: 'Interaction Design & Motion',
    category: 'engineering',
    tagline: 'Tactile micro-animations, scroll-driven choreography, and smooth route transitions.',
    description: 'Breathing life into static interfaces with spring physics, custom cursor dynamics, and gesture-driven feedback that feels intuitive and organic.',
    problemSolved: 'Transforms rigid websites into engaging, memorable digital experiences without slowing down page performance.',
    whatYouGet: [
      'Framer Motion interaction choreographies',
      'Lightweight CSS 3D perspective and parallax effects',
      'Fluid page and state transitions',
      'Strict prefers-reduced-motion accessibility fallbacks'
    ],
    technologies: ['Framer Motion', 'CSS Transform 3D', 'Web Animations API', 'Spring Physics'],
    deliverables: ['Custom Animation Modules', 'Physics Curves Config', 'Motion Guidelines', 'Accessible Fallback Styles']
  }
];
