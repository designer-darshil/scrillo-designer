import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ServiceScope } from '../types';

export const defaultServicesList: ServiceScope[] = [
  {
    number: '01',
    title: 'Website Design',
    description: 'Art-directed, high-impact digital flagships with distinct typographic character, tailored micro-animations, and performance-first architecture.',
    deliverables: ['Creative Direction', 'Editorial Layouts', 'Responsive Prototyping'],
  },
  {
    number: '02',
    title: 'Product Design',
    description: 'End-to-end digital product design from conceptual wireframing to high-fidelity design systems, intuitive user flows, and rigorous design tokens.',
    deliverables: ['UI/UX Systems', 'User Workflows', 'Figma Libraries'],
  },
  {
    number: '03',
    title: 'UI / Visual Design',
    description: 'Monochrome & high-contrast visual identities, bespoke layout grids, editorial typography systems, and tactile digital interfaces.',
    deliverables: ['Visual Systems', 'Typography Systems', 'Design Tokens'],
  },
  {
    number: '04',
    title: 'Creative Development',
    description: 'Frontend engineering in React, Next.js, and TypeScript with fluid GSAP choreographies, custom WebGL shaders, and 60/120fps smooth scrolling.',
    deliverables: ['React / Next.js', 'GSAP & Lenis', 'Motion Engineering'],
  },
];

export const servicesService = {
  async getServices(): Promise<ServiceScope[]> {
    if (!isSupabaseConfigured) return defaultServicesList;
    try {
      const { data, error } = await supabase.from('services').select('*').order('number', { ascending: true });
      if (error || !data || data.length === 0) return defaultServicesList;
      return data as ServiceScope[];
    } catch {
      return defaultServicesList;
    }
  },

  async updateService(number: string, updates: Partial<ServiceScope>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('services').update(updates).eq('number', number);
      return !error;
    } catch {
      return false;
    }
  },
};

export default servicesService;
