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
        background: 'var(--bg)',
        surface: 'var(--surface)',
        foreground: 'var(--text)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['"General Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        grotesk: ['"General Sans"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Display: clamp(2.5rem, 7.5vw, 9rem) line-height: 0.88-0.95, letter-spacing: -0.05em
        display: ['clamp(2.5rem, 7.5vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
        
        // Section headings: clamp(2.25rem, 6vw, 7rem)
        'heading-section': ['clamp(2.25rem, 6vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        
        // Project headings: clamp(1.75rem, 4.5vw, 5rem)
        'heading-project': ['clamp(1.75rem, 4.5vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        
        // Body: 18-24px
        'body-editorial': ['clamp(1.125rem, 1.25vw, 1.5rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        
        // Metadata: 11-14px
        metadata: ['clamp(0.6875rem, 0.8vw, 0.875rem)', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      letterSpacing: {
        'display': '-0.05em',
        'heading': '-0.04em',
        'subheading': '-0.03em',
        'normal': '0em',
        'meta': '0.08em',
        'meta-wide': '0.14em',
      },
      spacing: {
        'gutter': '24px',
        'page-desktop': '5vw',
        'page-mobile': '20px',
      },
      gridTemplateColumns: {
        'desktop-12': 'repeat(12, minmax(0, 1fr))',
        'tablet-8': 'repeat(8, minmax(0, 1fr))',
        'mobile-4': 'repeat(4, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}


