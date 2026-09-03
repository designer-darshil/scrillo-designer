export interface NavLink {
  label: string;
  href: string;
  number: string;
  description?: string;
}

export const navLinks: NavLink[] = [
  { label: 'WORK', href: '/work', number: '01', description: 'Selected digital product & website projects' },
  { label: 'ABOUT', href: '/about', number: '02', description: 'Background, employment history & skills' },
  { label: 'CONTACT', href: '/contact', number: '03', description: 'Get in touch for projects & collaborations' }
];

export const secondaryLinks: NavLink[] = [];

export const footerLinks = {
  navigation: navLinks,
  categories: [
    { label: 'UI/UX Design', href: '/work?category=ui-ux' },
    { label: 'Web Design', href: '/work?category=web-design' },
    { label: 'SaaS Products', href: '/work?category=product' },
    { label: 'Frontend Development', href: '/work?category=frontend' }
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/dsbhuva', handle: 'in/dsbhuva' },
    { label: 'Dribbble', href: 'https://dribbble.com', handle: 'Dribbble' },
    { label: 'Behance', href: 'https://behance.net', handle: 'Behance' },
    { label: 'Instagram', href: 'https://instagram.com', handle: 'Instagram' }
  ]
};
