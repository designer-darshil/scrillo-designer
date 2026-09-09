/**
 * WCAG 2.1 Relative Luminance & Contrast Ratio Calculator
 */

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  ratioFormatted: string;
  isAANormalText: boolean;     // >= 4.5:1
  isAALargeText: boolean;      // >= 3.0:1
  isAAANormalText: boolean;    // >= 7.0:1
  isAAALargeText: boolean;     // >= 4.5:1
  isAAUIComponent: boolean;    // >= 3.0:1
  score: 'AAA' | 'AA' | 'FAIL';
}

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function checkContrast(foregroundHex: string, backgroundHex: string): ContrastResult {
  const fgRgb = hexToRgb(foregroundHex);
  const bgRgb = hexToRgb(backgroundHex);

  const fgLum = getRelativeLuminance(fgRgb);
  const bgLum = getRelativeLuminance(bgRgb);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(ratio * 100) / 100;

  const isAANormalText = roundedRatio >= 4.5;
  const isAALargeText = roundedRatio >= 3.0;
  const isAAANormalText = roundedRatio >= 7.0;
  const isAAALargeText = roundedRatio >= 4.5;
  const isAAUIComponent = roundedRatio >= 3.0;

  let score: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  if (isAAANormalText) {
    score = 'AAA';
  } else if (isAANormalText) {
    score = 'AA';
  }

  return {
    foreground: foregroundHex,
    background: backgroundHex,
    ratio: roundedRatio,
    ratioFormatted: `${roundedRatio.toFixed(1)}:1`,
    isAANormalText,
    isAALargeText,
    isAAANormalText,
    isAAALargeText,
    isAAUIComponent,
    score,
  };
}

export interface TokenContrastPair {
  name: string;
  theme: 'dark' | 'light';
  fgToken: string;
  fgHex: string;
  bgToken: string;
  bgHex: string;
  usage: string;
  minRatio: number;
}

export const CORE_TOKEN_PAIRS: TokenContrastPair[] = [
  {
    name: 'Primary Text on Background',
    theme: 'dark',
    fgToken: '--color-text-primary',
    fgHex: '#F5F5F2',
    bgToken: '--color-background-primary',
    bgHex: '#050505',
    usage: 'Main body copy, headings, labels',
    minRatio: 4.5,
  },
  {
    name: 'Secondary Text on Background',
    theme: 'dark',
    fgToken: '--color-text-secondary',
    fgHex: '#B8B8B2',
    bgToken: '--color-background-primary',
    bgHex: '#050505',
    usage: 'Subtitles, secondary descriptions',
    minRatio: 4.5,
  },
  {
    name: 'Tertiary Text on Background',
    theme: 'dark',
    fgToken: '--color-text-tertiary',
    fgHex: '#8E8E8E',
    bgToken: '--color-background-primary',
    bgHex: '#050505',
    usage: 'Metadata, timestamps, helper text',
    minRatio: 4.5,
  },
  {
    name: 'Primary Action Text on Background',
    theme: 'dark',
    fgToken: '#050505',
    fgHex: '#050505',
    bgToken: '--color-action-primary',
    bgHex: '#F5F5F2',
    usage: 'Primary button label',
    minRatio: 4.5,
  },
  {
    name: 'UI Border Strong on Background',
    theme: 'dark',
    fgToken: '--color-border-strong',
    fgHex: '#3A3A3A',
    bgToken: '--color-background-primary',
    bgHex: '#050505',
    usage: 'Interactive component boundaries',
    minRatio: 3.0,
  },
  {
    name: 'Focus Ring Indicator',
    theme: 'dark',
    fgToken: '--color-focus-default',
    fgHex: '#FFFFFF',
    bgToken: '--color-background-primary',
    bgHex: '#050505',
    usage: 'Keyboard focus ring',
    minRatio: 3.0,
  },
  // Light Theme Pairs
  {
    name: 'Primary Text on Background',
    theme: 'light',
    fgToken: '--color-text-primary',
    fgHex: '#111111',
    bgToken: '--color-background-primary',
    bgHex: '#F3F2EE',
    usage: 'Main body copy, headings, labels',
    minRatio: 4.5,
  },
  {
    name: 'Secondary Text on Background',
    theme: 'light',
    fgToken: '--color-text-secondary',
    fgHex: '#555550',
    bgToken: '--color-background-primary',
    bgHex: '#F3F2EE',
    usage: 'Subtitles, secondary descriptions',
    minRatio: 4.5,
  },
  {
    name: 'Tertiary Text on Background',
    theme: 'light',
    fgToken: '--color-text-tertiary',
    fgHex: '#6F6F6A',
    bgToken: '--color-background-primary',
    bgHex: '#F3F2EE',
    usage: 'Metadata, timestamps, helper text',
    minRatio: 4.5,
  },
  {
    name: 'Primary Action Text on Background',
    theme: 'light',
    fgToken: '#F5F5F2',
    fgHex: '#F5F5F2',
    bgToken: '--color-action-primary',
    bgHex: '#111111',
    usage: 'Primary button label',
    minRatio: 4.5,
  },
  {
    name: 'UI Border Strong on Background',
    theme: 'light',
    fgToken: '--color-border-strong',
    fgHex: '#A9A8A2',
    bgToken: '--color-background-primary',
    bgHex: '#F3F2EE',
    usage: 'Interactive component boundaries',
    minRatio: 3.0,
  },
  {
    name: 'Focus Ring Indicator',
    theme: 'light',
    fgToken: '--color-focus-default',
    fgHex: '#111111',
    bgToken: '--color-background-primary',
    bgHex: '#F3F2EE',
    usage: 'Keyboard focus ring',
    minRatio: 3.0,
  },
];
