export interface NavItem {
  id: string;
  label: string;
  href: string;
  number: string;
}

export const navigationItems: NavItem[] = [
  { id: 'work', label: 'Index / Works', href: '#works', number: '01' },
  { id: 'about', label: 'Statement', href: '#statement', number: '02' },
  { id: 'skills', label: 'Discipline', href: '#skills', number: '03' },
  { id: 'services', label: 'Services', href: '#services', number: '04' },
  { id: 'contact', label: 'Contact', href: '#contact', number: '05' },
];

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', handle: 'github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com', handle: 'linkedin.com' },
  { label: 'Twitter / X', href: 'https://x.com', handle: '@portfolio' },
  { label: 'ReadCV', href: 'https://read.cv', handle: 'read.cv' },
];
