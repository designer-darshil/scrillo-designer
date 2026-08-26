export interface NavLink {
  label: string;
  href: string;
  number: string;
  description?: string;
}

export const navLinks: NavLink[] = [
  { label: 'WORK', href: '/work', number: '01', description: 'Selected digital product interfaces & web case studies' },
  { label: 'ABOUT', href: '/about', number: '02', description: '8+ yrs UI/UX & 4+ yrs frontend experience' },
  { label: 'EXPERIENCE', href: '/experience', number: '03', description: 'Career timeline & technical stack' },
  { label: 'CONTACT', href: '/contact', number: '04', description: 'Inquire for projects & collaborations' }
];

export const secondaryLinks: NavLink[] = [
  // { label: 'SERVICES', href: '/services', number: '05', description: 'Capabilities & deliverables' },
  // { label: 'THINKING', href: '/thinking', number: '06', description: 'Design observations & architectural essays' }
];

export const footerLinks = {
  navigation: navLinks,
  categories: [
    { label: 'Product Interfaces', href: '/work?category=product' },
    { label: 'Creative Web Design', href: '/work?category=web-design' },
    { label: 'UI/UX Systems', href: '/work?category=ui-ux' },
    { label: 'Frontend Engineering', href: '/work?category=frontend' },
    { label: 'Career Timeline', href: '/experience' }
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/scrillo-design', handle: '@scrillo-design' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/scrillo-design', handle: 'in/scrillo-design' },
    { label: 'Dribbble', href: 'https://dribbble.com/scrillo', handle: '@scrillo' },
    { label: 'Behance', href: 'https://behance.net/scrillo', handle: '@scrillo' },
    { label: 'X / Twitter', href: 'https://twitter.com/scrillocraft', handle: '@scrillocraft' }
  ]
};
