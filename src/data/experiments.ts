import { ExperimentItem } from '../types';

export const experimentsData: ExperimentItem[] = [
  {
    id: 'exp-spring',
    number: '01',
    title: 'Tactile Spring Relay',
    category: 'Motion Physics',
    description: 'Mechanical damping curve simulation with mass-spring-damper equations.',
    tags: ['Spring Physics', 'Framer Motion'],
    demoType: 'spring-physics'
  },
  {
    id: 'exp-variable-font',
    number: '02',
    title: 'Variable Font Axis',
    category: 'Typography',
    description: 'Continuous weight and tracking axis interpolation using native CSS font-variation-settings.',
    tags: ['Variable Fonts', 'CSS Typography'],
    demoType: 'variable-font'
  },
  {
    id: 'exp-perspective',
    number: '03',
    title: 'Normalized Cursor Tilt',
    category: 'CSS 3D Vector',
    description: 'Calculates cursor distance from element centers using normalized Euclidean vectors.',
    tags: ['CSS Transform', 'Lightweight 3D'],
    demoType: 'css-3d-tilt'
  },
  {
    id: 'exp-color-matrix',
    number: '04',
    title: 'Perceptual Palette Ramps',
    category: 'Color Science',
    description: 'Mathematical color generator computing harmonious light-to-dark ramps with uniform lightness values.',
    tags: ['Color Science', 'Tokens'],
    demoType: 'palette-mixer'
  }
];
