export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  client: string;
  tags: string[];
  link?: string;
  featuredImage?: string;
}

export const projectsData: Project[] = [
  {
    id: 'chronos',
    index: '01',
    title: 'KRONOS TEMPORAL',
    category: 'Digital Architecture / Web App',
    year: '2025',
    role: 'Lead Interaction Designer',
    description: 'A high-precision temporal analytics interface designed for quantum computational workflows with monochrome brutalist data views.',
    client: 'Kronos Systems Zurich',
    tags: ['UI/UX', 'System Design', 'WebGL', 'Creative Direction'],
    link: '#',
  },
  {
    id: 'form-void',
    index: '02',
    title: 'FORM & VOID',
    category: 'Spatial Design & Web Archive',
    year: '2024',
    role: 'Creative Developer & Art Director',
    description: 'An interactive editorial catalog for architectural studio Form & Void exploring monolithic concrete structures and brutalist typographies.',
    client: 'Atelier Form',
    tags: ['Art Direction', 'Typography', 'Next.js', 'GSAP'],
    link: '#',
  },
  {
    id: 'neuro-matrix',
    index: '03',
    title: 'SYNAPSE MONOLITH',
    category: 'Machine Learning Interface',
    year: '2024',
    role: 'Principal Product Designer',
    description: 'Minimalist neural node visualizer translating high-dimensional embeddings into typographic coordinates and spatial graphs.',
    client: 'Synapse Core Inc',
    tags: ['Data Visualization', 'Interaction', 'Design Systems'],
    link: '#',
  },
  {
    id: 'aether-sound',
    index: '04',
    title: 'AETHER ACOUSTICS',
    category: 'E-Commerce & Digital Experience',
    year: '2023',
    role: 'Design Engineer',
    description: 'Direct-to-consumer digital flagship for custom audiophile hardware with responsive real-time acoustic simulation.',
    client: 'Aether Audio London',
    tags: ['E-Commerce', 'Frontend', 'Interaction Design'],
    link: '#',
  },
];
