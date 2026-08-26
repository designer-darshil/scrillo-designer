export interface NavLink {
  label: string;
  href: string;
  number: string;
  description?: string;
}

export const navLinks: NavLink[] = [
  { label: 'WORK', href: '/work', number: '01', description: 'Selected digital products & websites' },
  { label: 'ABOUT', href: '/about', number: '02', description: 'Philosophy, background & craft values' },
  { label: 'SERVICES', href: '/services', number: '03', description: 'UI/UX, web design & frontend capabilities' },
  { label: 'EXPERIENCE', href: '/experience', number: '04', description: 'Career timeline & technical stack' },
  { label: 'CONTACT', href: '/contact', number: '05', description: 'Inquire for projects & collaborations' }
];

export const footerLinks = {
  navigation: navLinks,
  categories: [
    { label: 'Product Interfaces', href: '/work?category=product' },
    { label: 'Creative Web Design', href: '/work?category=web-design' },
    { label: 'UI/UX Systems', href: '/work?category=ui-ux' },
    { label: 'Frontend & Motion', href: '/work?category=frontend' },
    { label: 'Experiments Lab', href: '/work?category=experiments' }
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/scrillo-design', handle: '@scrillo-design' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/scrillo-design', handle: 'in/scrillo-design' },
    { label: 'Dribbble', href: 'https://dribbble.com/scrillo', handle: '@scrillo' },
    { label: 'Behance', href: 'https://behance.net/scrillo', handle: '@scrillo' },
    { label: 'X / Twitter', href: 'https://twitter.com/scrillocraft', handle: '@scrillocraft' }
  ]
};
