export interface NavItem {
  id: string;
  label: string;
  href: string;
  number: string;
}

export const navigationItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', number: '01' },
  { id: 'about', label: 'About', href: '#about', number: '02' },
  { id: 'works', label: 'Works', href: '#works', number: '03' },
  { id: 'contact', label: "Let's Talk", href: '#contact', number: '04' },
];

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', handle: 'github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com', handle: 'linkedin.com' },
  { label: 'Twitter / X', href: 'https://x.com', handle: '@portfolio' },
  { label: 'ReadCV', href: 'https://read.cv', handle: 'read.cv' },
];
