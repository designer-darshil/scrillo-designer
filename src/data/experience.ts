import { ExperienceItem } from '../types';

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-2026',
    period: '2024 — PRESENT',
    year: 2026,
    role: 'Lead UI/UX & Frontend Web Designer',
    companyOrContext: 'Scrillo Design Studio (Independent Craft)',
    type: 'Independent Craft',
    location: 'Remote / Global',
    isCurrent: true,
    description: 'Partnering with progressive venture-backed tech startups, creative agencies, and product teams to deliver end-to-end digital experiences from initial wireframes to production React frontends.',
    achievements: [
      'Designed and coded 12+ production web platforms with 98+ average Lighthouse performance ratings.',
      'Created custom design system frameworks bridging Figma variables to Tailwind tokens for fast client iteration.',
      'Built bespoke micro-interaction libraries utilizing Framer Motion and lightweight CSS 3D perspectives.'
    ],
    technologies: ['Figma', 'React 18', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion', 'Radix UI']
  },
  {
    id: 'exp-2024',
    period: '2022 — 2024',
    year: 2024,
    role: 'Senior Product Designer & UI Engineer',
    companyOrContext: 'Digital Product Ventures (Demo Profile)',
    type: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    isCurrent: false,
    description: 'Led UI/UX redesigns for multi-tenant SaaS dashboards and developer tooling. Collaborated closely with engineering squads to establish reusable frontend component standards.',
    achievements: [
      'Spearheaded the redesign of core analytics workflows, reducing customer onboarding friction by 32%.',
      'Authored the company-wide design system documentation and React UI component library.',
      'Conducted 40+ moderated usability interviews and rapid prototyping testing cycles.'
    ],
    technologies: ['Figma', 'React', 'TypeScript', 'Design Systems', 'CSS Grid', 'Storybook', 'Git']
  },
  {
    id: 'exp-2022',
    period: '2020 — 2022',
    year: 2022,
    role: 'UI/UX & Web Designer',
    companyOrContext: 'Atelier Interactive Agency (Demo Profile)',
    type: 'Contract',
    location: 'Remote',
    isCurrent: false,
    description: 'Crafted bespoke marketing websites, brand identity systems, and interactive digital experiences for creative, fashion, and luxury clients.',
    achievements: [
      'Delivered 18+ high-craft editorial websites with custom typography and smooth scroll interactions.',
      'Mentored junior designers in design-to-code workflows and semantic HTML/CSS best practices.'
    ],
    technologies: ['Figma', 'HTML5', 'Modern CSS/SCSS', 'JavaScript (ES6+)', 'Webflow', 'Art Direction']
  },
  {
    id: 'exp-2019',
    period: '2018 — 2020',
    year: 2020,
    role: 'Frontend & Visual Design Explorer',
    companyOrContext: 'Early Creative Coding & Design Foundations',
    type: 'Open Source',
    location: 'Self-Directed',
    isCurrent: false,
    description: 'Began exploring generative typography, creative CSS experiments, and modern JavaScript framework architectures, laying the groundwork for full-spectrum design and frontend mastery.',
    achievements: [
      'Published open-source CSS animation libraries and experimental UI widgets on GitHub.',
      'Studied Swiss typographic systems, grid methodologies, and human-computer interaction heuristics.'
    ],
    technologies: ['HTML/CSS', 'JavaScript', 'SVG Manipulation', 'UI Architecture', 'Graphic Design']
  }
];

export const craftStats = [
  { label: 'Years of Digital Craft', value: '7+' },
  { label: 'Design-to-Code Projects', value: '30+' },
  { label: 'Production Design Systems', value: '14' },
  { label: 'Lighthouse Performance Avg', value: '98%' }
];
