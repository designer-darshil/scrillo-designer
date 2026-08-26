export interface ToolCategory {
  category: string;
  description: string;
  items: Array<{
    name: string;
    level: string;
    role: string;
    focus: string;
  }>;
}

export const toolsData: ToolCategory[] = [
  {
    category: 'Design & Visual Systems',
    description: 'The creative arsenal for spatial exploration, token architecture, and wireframing.',
    items: [
      { name: 'Figma', level: 'Mastery', role: 'UI/UX & Design Systems', focus: 'Variables, Auto-Layout, Components & Prototypes' },
      { name: 'FigJam', level: 'Advanced', role: 'Workshopping & IA', focus: 'User Flows, Journey Maps, Architecture' },
      { name: 'Framer', level: 'Advanced', role: 'Interactive Prototyping', focus: 'Micro-interactions & Responsive Web' },
      { name: 'Adobe Suite', level: 'Proficient', role: 'Asset Curation', focus: 'Illustrator (Vectors), Photoshop (Textures)' }
    ]
  },
  {
    category: 'Frontend & Architecture',
    description: 'Production-grade engineering tools that transform design concepts into live software.',
    items: [
      { name: 'React 18 / 19', level: 'Mastery', role: 'Component Framework', focus: 'Hooks, Suspense, Composition & Virtual DOM' },
      { name: 'TypeScript', level: 'Mastery', role: 'Type Safety', focus: 'Strict Interfaces, Generics, Token Schemas' },
      { name: 'Next.js / Vite', level: 'Advanced', role: 'Build & Bundling', focus: 'SSR, SSG, Code Splitting, Fast Refresh' },
      { name: 'Tailwind CSS', level: 'Mastery', role: 'Utility & Token CSS', focus: 'Custom Configurations, Arbitrary Values, Dark Mode' },
      { name: 'Vanilla CSS / SCSS', level: 'Mastery', role: 'Styling Core', focus: 'CSS Grid, Flexbox, Custom Properties, Subgrid' },
      { name: 'Framer Motion', level: 'Mastery', role: 'Interaction Motion', focus: 'Spring Physics, Layout Animations, Gestures' }
    ]
  },
  {
    category: 'Workflow & Quality',
    description: 'Tooling ensuring rapid iteration, pristine code quality, and fast deployments.',
    items: [
      { name: 'Git & GitHub', level: 'Advanced', role: 'Version Control', focus: 'Branching, PR Reviews, CI/CD Actions' },
      { name: 'Radix UI / Headless', level: 'Advanced', role: 'Accessible Primitives', focus: 'ARIA Modals, Menus, Tooltips, Accordions' },
      { name: 'Lighthouse & Audits', level: 'Advanced', role: 'Web Performance', focus: 'Core Web Vitals, Contrast, Screen Readers' },
      { name: 'Vercel', level: 'Advanced', role: 'Edge Deployment', focus: 'Preview Branches, Serverless Functions, Analytics' }
    ]
  }
];
