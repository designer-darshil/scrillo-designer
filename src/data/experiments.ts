import { ExperimentItem } from '../types';

export const experimentsData: ExperimentItem[] = [
  {
    id: 'exp-spring',
    number: '01',
    title: 'Spring Physics Toggle',
    category: 'Interaction Motion',
    year: 2026,
    tagline: 'Tactile mechanical switch simulation with mass-spring damping equations',
    description: 'A tactile physics toggle widget mimicking mechanical switches with realistic dampening, rebound resistance, and spring tension using Framer Motion.',
    tags: ['Framer Motion', 'Spring Physics', 'Tactile UI'],
    demoType: 'spring-toggle',
    codeSnippet: `const springConfig = { stiffness: 500, damping: 25, mass: 1 };
<motion.div 
  animate={{ x: active ? 40 : 0 }} 
  transition={{ type: "spring", ...springConfig }} 
/>`
  },
  {
    id: 'exp-variable-font',
    number: '02',
    title: 'Kinetic Variable Font Axis',
    category: 'Typography Lab',
    year: 2026,
    tagline: 'Continuous vector font weight and optical tracking axis interpolation',
    description: 'Dynamic typographic scaling responding to cursor proximity and slider inputs along weight and slant axes with zero layout shift.',
    tags: ['Variable Fonts', 'CSS Font Variations', 'Kinetic Type'],
    demoType: 'variable-font',
    codeSnippet: `element.style.fontVariationSettings = \`'wght' \${weight}, 'slnt' \${slant}\`;`
  },
  {
    id: 'exp-perspective',
    number: '03',
    title: 'CSS 3D Parallax Matrix',
    category: '3D CSS Depth',
    year: 2026,
    tagline: 'Sub-millisecond normalized vector perspective without WebGL or Three.js',
    description: 'Cursor-driven perspective matrix calculations using pure transform3d math without heavy Canvas or GPU power draw.',
    tags: ['CSS Matrix3D', 'Lightweight 3D', 'Performance'],
    demoType: 'matrix-grid',
    codeSnippet: `transform: perspective(600px) rotateX(\${tiltX}deg) rotateY(\${tiltY}deg);`
  },
  {
    id: 'exp-color-matrix',
    number: '04',
    title: 'OKLCH Perceptual Palette Mixer',
    category: 'Design Systems',
    year: 2026,
    tagline: 'Perceptually uniform contrast steps across light and dark surfaces',
    description: 'Live mathematical color generator computing harmonious light-to-dark ramps with uniform lightness values conforming to WCAG AAA.',
    tags: ['Color Science', 'OKLCH', 'Design Tokens'],
    demoType: 'color-mixer',
    codeSnippet: `background: oklch(0.65 0.22 var(--hue));`
  },
  {
    id: 'exp-magnetic-btn',
    number: '05',
    title: 'Magnetic Button Attraction',
    category: 'Interaction Design',
    year: 2026,
    tagline: 'Subtle cursor magnetic pull with spring inertia recovery',
    description: 'Calculates the distance vector from the cursor to element center, gently pulling the CTA towards the user with smooth inertial decay.',
    tags: ['Cursor Physics', 'Magnetic UI', 'Micro-interaction'],
    demoType: 'magnetic-button',
    codeSnippet: `const distanceX = (clientX - centerX) * 0.35;
const distanceY = (clientY - centerY) * 0.35;`
  },
  {
    id: 'exp-interactive-nav',
    number: '06',
    title: 'Fluid Layout Pill Morph',
    category: 'Component Architecture',
    year: 2026,
    tagline: 'Shared layoutId spring animation for active tab transitions',
    description: 'Zero-flicker active tab pill morphing across irregular text widths using Framer Motion layoutId and transform caches.',
    tags: ['Layout Animations', 'Framer Motion', 'UI Primitives'],
    demoType: 'interactive-nav',
    codeSnippet: `<motion.span layoutId="activePill" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />`
  }
];
