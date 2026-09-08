export interface Project {
  id: string;
  number: string;
  title: string;
  year: string;
  category: string;
  client: string;
  description: string;
  image: string;
  link?: string;
}

export const projectsData: Project[] = [
  {
    id: 'aurora-crm',
    number: '01',
    title: 'Aurora CRM',
    year: '2026',
    category: 'Product Design',
    client: 'Aurora Systems Berlin',
    description: 'Autonomous customer relationship platform with fluid typographic dashboards and real-time interaction pipelines.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'mono-ai',
    number: '02',
    title: 'Mono AI',
    year: '2026',
    category: 'AI Platform',
    client: 'Mono Intelligence Labs',
    description: 'High-contrast monochrome machine learning playground translating high-dimensional embedding spaces.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'flux-commerce',
    number: '03',
    title: 'Flux Commerce',
    year: '2025',
    category: 'E-commerce',
    client: 'Flux Collective Tokyo',
    description: 'Minimalist high-conversion commerce infrastructure for architectural apparel and industrial design goods.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'orbit-studio',
    number: '04',
    title: 'Orbit Studio',
    year: '2025',
    category: 'Brand / Digital',
    client: 'Orbit Architecture London',
    description: 'Digital spatial archive capturing monolithic structures, brutalist materials, and interactive portfolios.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'noma-finance',
    number: '05',
    title: 'Noma Finance',
    year: '2025',
    category: 'Fintech',
    client: 'Noma Capital NYC',
    description: 'Institutional-grade asset visualizer and algorithmic liquidity trading terminal with subpixel precision.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'atlas-mobile',
    number: '06',
    title: 'Atlas Mobile',
    year: '2024',
    category: 'Mobile Product',
    client: 'Atlas Planetary Network',
    description: 'Native mobile navigation client with gesture-driven spatial timelines and offline topography cache.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'echo-ai',
    number: '07',
    title: 'Echo AI',
    year: '2024',
    category: 'AI Product',
    client: 'Echo Neural Audio',
    description: 'Generative soundscape synthesis software transforming typographic prompts into spatial multi-channel acoustics.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
  {
    id: 'forma-energy',
    number: '08',
    title: 'Forma Energy',
    year: '2024',
    category: 'Energy Platform',
    client: 'Forma Nordic Grid',
    description: 'Clean energy dispatch matrix monitoring continental power distributions and storage density.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    link: '#',
  },
];
