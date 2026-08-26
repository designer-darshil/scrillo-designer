import { ExperimentItem } from '../types';

export const experimentsData: ExperimentItem[] = [
  {
    id: 'exp-spring',
    number: '01',
    title: 'Spring Physics Toggle',
    category: 'Interaction Motion',
    year: 2026,
    description: 'A tactile physics toggle widget mimicking mechanical switches with realistic dampening and spring tension.',
    tags: ['Framer Motion', 'Spring Physics', 'Tactile UI'],
    demoType: 'spring-toggle',
    codeSnippet: `const springConfig = { stiffness: 450, damping: 28, mass: 1 };
<motion.div animate={{ x: active ? 28 : 0 }} transition={{ type: "spring", ...springConfig }} />`
  },
  {
    id: 'exp-variable-font',
    number: '02',
    title: 'Kinetic Variable Font Axis',
    category: 'Typography Lab',
    year: 2026,
    description: 'Dynamic typographic scaling responding to cursor proximity and scroll velocity along weight and slant axes.',
    tags: ['Variable Fonts', 'CSS Font Variations', 'Kinetic Type'],
    demoType: 'variable-font'
  },
  {
    id: 'exp-perspective',
    number: '03',
    title: 'CSS 3D Parallax Matrix',
    category: '3D CSS Depth',
    year: 2026,
    description: 'Sub-millisecond cursor-driven perspective matrix calculations without WebGL or Three.js dependencies.',
    tags: ['CSS Matrix3D', 'Lightweight 3D', 'Performance'],
    demoType: 'matrix-grid'
  },
  {
    id: 'exp-color-matrix',
    number: '04',
    title: 'OKLCH Perceptual Palette Mixer',
    category: 'Design Systems',
    year: 2025,
    description: 'Live mathematical color generator computing harmonious light-to-dark ramps with uniform lightness values.',
    tags: ['Color Science', 'OKLCH', 'Design Tokens'],
    demoType: 'color-mixer'
  }
];
