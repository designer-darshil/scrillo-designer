export interface SkillGroup {
  id: string;
  category: string;
  number: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'design',
    category: 'Design & Direction',
    number: '01',
    items: [
      'Art Direction',
      'Editorial Typography',
      'Design Systems & Tokens',
      'UI/UX Interaction Design',
      'Prototyping & Motion Specs',
      'Information Architecture',
    ],
  },
  {
    id: 'engineering',
    category: 'Creative Engineering',
    number: '02',
    items: [
      'React / Next.js / TypeScript',
      'GSAP / ScrollTrigger / Lenis',
      'Tailwind CSS / Vanilla CSS',
      'Framer Motion / Micro-interactions',
      'WebGL / Three.js Basics',
      'Performance & Web Vitals',
    ],
  },
  {
    id: 'philosophy',
    category: 'Core Principles',
    number: '03',
    items: [
      'Monochrome & High Contrast',
      'Negative Space as Function',
      'Micro-rhythm & Typography Scaling',
      'Zero-fluff Brutalist Pragmatism',
      'Tactile & Kinetic Feedback',
    ],
  },
];
