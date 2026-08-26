export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' }
];

export const siteMetadata = {
  name: 'SCRILLO',
  role: 'UI/UX Designer · Frontend Web Designer',
  intro: 'I design digital products and websites with a focus on clarity, interaction and detail.',
  location: 'India · Available for Select Projects',
  email: 'hello@scrillo.design',
  socials: [
    { label: 'GitHub', href: 'https://github.com/scrillo-design' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/scrillo-design' },
    { label: 'Dribbble', href: 'https://dribbble.com/scrillo' },
    { label: 'X / Twitter', href: 'https://twitter.com/scrillocraft' }
  ]
};
