export interface NavLink {
  label: string;
  href: string;
  number: string;
  description?: string;
}

export const navLinks: NavLink[] = [
  { label: 'WORK', href: '/work', number: '01', description: 'Selected digital products & websites' },
  { label: 'LAB', href: '/lab', number: '02', description: 'Interactive design & code playground' },
  { label: 'THINKING', href: '/thinking', number: '03', description: 'Design observations & architectural essays' },
  { label: 'ABOUT', href: '/about', number: '04', description: 'Philosophy, background & craft values' },
  { label: 'CONTACT', href: '/contact', number: '05', description: 'Inquire for projects & collaborations' }
];

export const secondaryLinks: NavLink[] = [
  { label: 'SERVICES', href: '/services', number: '06', description: 'Capabilities & deliverables' },
  { label: 'EXPERIENCE', href: '/experience', number: '07', description: 'Career timeline & technical stack' }
];

export const footerLinks = {
  navigation: [...navLinks, ...secondaryLinks],
  categories: [
    { label: 'Product Interfaces', href: '/work?category=product' },
    { label: 'Creative Web Design', href: '/work?category=web-design' },
    { label: 'UI/UX Systems', href: '/work?category=ui-ux' },
    { label: 'Frontend & Motion', href: '/work?category=frontend' },
    { label: 'Interactive Lab', href: '/lab' },
    { label: 'Thinking & Notes', href: '/thinking' }
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/scrillo-design', handle: '@scrillo-design' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/scrillo-design', handle: 'in/scrillo-design' },
    { label: 'Dribbble', href: 'https://dribbble.com/scrillo', handle: '@scrillo' },
    { label: 'Behance', href: 'https://behance.net/scrillo', handle: '@scrillo' },
    { label: 'X / Twitter', href: 'https://twitter.com/scrillocraft', handle: '@scrillocraft' }
  ]
};
