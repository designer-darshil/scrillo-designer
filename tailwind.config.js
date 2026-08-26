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
        bg: {
          primary: '#050505',
          secondary: '#0A0A0A',
          tertiary: '#111111',
          card: '#141414',
          subtle: '#1A1A1A'
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
          light: '#262626'
        },
        accent: {
          DEFAULT: '#FF3E00',
          hover: '#FF551A',
          dim: 'rgba(255, 62, 0, 0.15)',
          glow: 'rgba(255, 62, 0, 0.35)'
        },
        muted: {
          primary: '#A0A0A0',
          secondary: '#777777',
          tertiary: '#555555'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hand: ['"Caveat"', 'cursive']
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.18em',
        ultra: '0.25em'
      }
    },
  },
  plugins: [],
}
