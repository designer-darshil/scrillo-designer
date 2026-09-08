export interface SkillItem {
  index: string;
  name: string;
  image?: string;
}

export interface SkillCategory {
  id: string;
  number: string;
  title: string;
  count: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ui-design',
    number: '01',
    title: 'UI DESIGN',
    count: '06',
    skills: [
      { index: '01', name: 'Visual Direction', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
      { index: '02', name: 'Design Systems', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
      { index: '03', name: 'Typography', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
      { index: '04', name: 'Color', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
      { index: '05', name: 'Composition', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
      { index: '06', name: 'Interaction', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 'ux-design',
    number: '02',
    title: 'UX DESIGN',
    count: '05',
    skills: [
      { index: '01', name: 'Research', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80' },
      { index: '02', name: 'Wireframing', image: 'https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80' },
      { index: '03', name: 'User Testing', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80' },
      { index: '04', name: 'User Interviews', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
      { index: '05', name: 'Information Architecture', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 'development',
    number: '03',
    title: 'DEVELOPMENT',
    count: '05',
    skills: [
      { index: '01', name: 'React', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80' },
      { index: '02', name: 'Next.js', image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80' },
      { index: '03', name: 'Animation', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
      { index: '04', name: 'WebGL', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
      { index: '05', name: 'Creative Development', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];
