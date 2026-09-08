/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#080808',
          850: '#0F0F0F',
          800: '#141414',
          700: '#1F1F1F',
          600: '#2E2E2E',
        },
        light: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#EBEBEB',
          400: '#D4D4D4',
          500: '#A3A3A3',
          600: '#737373',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.3)',
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        sans: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.03em',
        normal: '0em',
        wide: '0.05em',
        wider: '0.12em',
        widest: '0.22em',
        ultra: '0.35em',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.9rem' }],
        'display-2xl': ['clamp(3.5rem, 9vw, 9.5rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(2.5rem, 6.5vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '0.96', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'circ-out': 'cubic-bezier(0, 0.55, 0.45, 1)',
      }
    },
  },
  plugins: [],
}

