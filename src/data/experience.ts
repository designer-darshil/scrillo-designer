import { ExperienceItem } from '../types';

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-2026',
    period: '2024 — PRESENT',
    year: 2026,
    role: 'Lead UI/UX & Frontend Web Designer',
    companyOrContext: 'Scrillo Design (Independent Craft & Engineering)',
    type: 'Independent Craft',
    location: 'Remote / Global',
    isCurrent: true,
    description: 'Partnering directly with product founders and venture teams to lead end-to-end digital product design, tokenized design systems, and production React/TypeScript web implementations.',
    achievements: [
      'Designed and coded 12+ production web platforms with 98+ average Lighthouse performance ratings.',
      'Created custom design system frameworks bridging Figma variables directly to Tailwind CSS and React token scales.',
      'Constructed accessible, keyboard-first B2B dashboard interfaces with zero layout shift and sub-16ms render loops.'
    ],
    technologies: ['Figma', 'React 18', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion', 'Radix UI']
  },
  {
    id: 'exp-2024',
    period: '2021 — 2024',
    year: 2024,
    role: 'Senior Product Designer & UI Engineer',
    companyOrContext: 'Enterprise Cloud & Data Systems',
    type: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    isCurrent: false,
    description: 'Led UI/UX architecture and frontend engineering collaboration for high-density observability dashboards and developer-focused tooling.',
    achievements: [
      'Spearheaded the UX restructuring of telemetry workflows, reducing mean-time-to-diagnose for operators by 38%.',
      'Authored the corporate multi-product design system and companion React component library with 40+ tokens.',
      'Conducted 50+ moderated user research sessions and iterative usability testing sprints.'
    ],
    technologies: ['Figma', 'React', 'TypeScript', 'Design Systems', 'CSS Grid', 'Storybook', 'Git']
  },
  {
    id: 'exp-2021',
    period: '2018 — 2021',
    year: 2021,
    role: 'UI/UX & Web Designer',
    companyOrContext: 'Digital Product & Design Agency',
    type: 'Full-time',
    location: 'Remote',
    isCurrent: false,
    description: 'Designed bespoke web products, mobile applications, and high-conversion editorial websites across SaaS, fintech, and creative commerce.',
    achievements: [
      'Delivered 20+ responsive web platforms with custom art direction, precise typographic hierarchy, and clean CSS.',
      'Established systematic design token libraries ensuring high fidelity between Figma mockups and live browser builds.'
    ],
    technologies: ['Figma', 'HTML5', 'Modern CSS/SCSS', 'JavaScript (ES6+)', 'Prototyping', 'Design Systems']
  },
  {
    id: 'exp-2018',
    period: '2016 — 2018',
    year: 2018,
    role: 'UI/UX Designer',
    companyOrContext: 'Product Design Studio',
    type: 'Full-time',
    location: 'Bangalore, India',
    isCurrent: false,
    description: 'Executed user journey mapping, wireframing, high-fidelity interface design, and usability evaluations for early-stage digital startups.',
    achievements: [
      'Designed complete multi-platform UX flows from initial sketch discovery to verified production handoff.',
      'Mastered typographic grids, spatial rhythm, and responsive layout constraints.'
    ],
    technologies: ['Figma', 'Sketch', 'Wireframing', 'User Research', 'Design Guidelines', 'HTML/CSS']
  }
];

export const craftStats = [
  { label: 'UI/UX Design Experience', value: '8+ Yrs' },
  { label: 'Web Design & Frontend', value: '4+ Yrs' },
  { label: 'Shipped Digital Products', value: '30+' },
  { label: 'Design-to-Code Fidelity', value: '100%' }
];
