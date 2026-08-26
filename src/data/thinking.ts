import { ThinkingArticle } from '../types';

export const thinkingArticles: ThinkingArticle[] = [
  {
    id: 'why-most-portfolios-feel-the-same',
    slug: 'why-most-portfolios-feel-the-same',
    number: '01',
    title: 'Why Most Portfolios Feel the Same',
    date: 'August 2026',
    category: 'Philosophy',
    readTime: '2 min read',
    introduction: 'Open ten designer portfolios today and you will see the same purple radial gradients, floating 3D spheres, and generic claims about crafting intuitive digital experiences.',
    mainArgument: [
      'The modern designer portfolio has succumbed to algorithmic homogenization. Instead of showcasing how a designer actually reasons through ambiguity, portfolios have turned into Dribbble showcases decorated with fake awards and manufactured metric claims.',
      'A true portfolio should not be an ad agency brochure. It should be an honest window into the designer\'s mental models: why a particular navigation hierarchy was chosen, what tradeoffs were weighed, and how the design holds up under real network constraints.'
    ],
    observation: 'When visual decoration precedes information architecture, the interface ceases to be a product and becomes mere digital wallpaper.',
    conclusion: 'The strongest portfolios don\'t rely on gratuitous motion or superficial trends. They let the structural clarity of the work speak for itself.',
    keyTakeaway: 'Personality comes from editorial restraint, intentional whitespace, and honest decision-making—not from visual noise.',
    relatedProjectSlug: 'mono',
    relatedProjectName: 'Mono Type Specimen'
  },
  {
    id: 'when-beautiful-ui-becomes-bad-ux',
    slug: 'when-beautiful-ui-becomes-bad-ux',
    number: '02',
    title: 'When Beautiful UI Becomes Bad UX',
    date: 'July 2026',
    category: 'UX Architecture',
    readTime: '2 min read',
    introduction: 'Low-contrast gray text on darker gray backgrounds looks stunning in a static screenshot. In the hands of a rushed operator under sunlight, it becomes completely unusable.',
    mainArgument: [
      'Aesthetic minimalism often hides severe functional debt. Designers frequently strip out crucial labels, hide key actions behind nested hamburger menus, and reduce clickable surface areas just to keep a layout looking clean.',
      'True elegance in product design is the resolution of complexity, not the concealment of it. An interface with 40 data points can feel calm if the spatial hierarchy and typography guide the operator\'s gaze effortlessly.'
    ],
    observation: 'Cognitive load is reduced through clear categorization and predictable affordances, never through hiding essential tools.',
    conclusion: 'Great UX isn\'t the absence of information; it\'s the presence of absolute clarity.',
    keyTakeaway: 'Never sacrifice an operator\'s speed or accessibility for an aesthetic screenshot.',
    relatedProjectSlug: 'nova',
    relatedProjectName: 'Nova Telemetry Platform'
  },
  {
    id: 'why-i-dont-animate-everything',
    slug: 'why-i-dont-animate-everything',
    number: '03',
    title: 'Why I Don\'t Animate Everything',
    date: 'June 2026',
    category: 'Motion Design',
    readTime: '1.5 min read',
    introduction: 'Just because an element can slide in with a 1.2-second bouncy spring bezier does not mean it should.',
    mainArgument: [
      'Motion on the web serves three legitimate purposes: spatial continuity (where did this modal come from?), system feedback (did my action succeed?), and delightful micro-interaction on primary touchpoints.',
      'When every header, paragraph, badge, and border plays an entrance animation on scroll, the user spends more energy waiting for text to settle than actually reading the content.'
    ],
    observation: 'If an animation slows down an operator from completing their intent by even 200ms, it is a defect, not a feature.',
    conclusion: 'Treat motion like seasoning in haute cuisine: subtle, deliberate, and noticeable only in its harmonious elevation of the whole.',
    keyTakeaway: 'Maximum personality with minimum visual noise. Respect the user\'s time.',
    relatedProjectSlug: 'orbit',
    relatedProjectName: 'Orbit Interaction Sandbox'
  },
  {
    id: 'from-figma-to-react',
    slug: 'from-figma-to-react',
    number: '04',
    title: 'From Figma to React: The Lossless Handoff',
    date: 'May 2026',
    category: 'Design-to-Code',
    readTime: '3 min read',
    introduction: 'The traditional wall between design files and production codebases is a historical artifact of tooling limitations. It is time to eliminate it.',
    mainArgument: [
      'When designers understand how CSS Grid handles content overflow, how the DOM renders subtrees, and how React state flows through components, they design radically better interfaces.',
      'By architecting design tokens with the same mathematical rigor in both Figma variables and Tailwind CSS configs, we achieve 100% fidelity without the customary back-and-forth QA cycles.'
    ],
    observation: 'A design system is only as good as the sync between its Figma components and its React implementations.',
    conclusion: 'The future belongs to designers who can translate aesthetic intent directly into production code.',
    keyTakeaway: 'Designing with the DOM in mind prevents layout shift, reduces bundle size, and guarantees 60fps performance.',
    relatedProjectSlug: 'frame',
    relatedProjectName: 'Frame Collaborative Canvas'
  },
  {
    id: 'designing-for-mobile-first',
    slug: 'designing-for-mobile-first',
    number: '05',
    title: 'Designing for Mobile Beyond Responsive Shrinkage',
    date: 'April 2026',
    category: 'UX Architecture',
    readTime: '2 min read',
    introduction: 'Mobile design is not simply desktop design scaled down to 375px with horizontal overflow hidden.',
    mainArgument: [
      'Touch ergonomics require bottom-heavy toolbars, thumb-friendly tap targets, and gesture-driven sheets rather than dropdowns. Context switches are higher on mobile devices, meaning hierarchy must be even more ruthless.',
      'We must recompose the storytelling on mobile rather than merely shrinking column widths.'
    ],
    observation: 'Thumb zones determine usability. Keep critical triggers within the bottom 40% of the viewport.',
    conclusion: 'Design the mobile experience as an independent editorial composition.',
    keyTakeaway: 'Recompose, don\'t just collapse.',
    relatedProjectSlug: 'aura',
    relatedProjectName: 'Aura Atelier Storefront'
  },
  {
    id: 'the-problem-with-overdesigned-interfaces',
    slug: 'the-problem-with-overdesigned-interfaces',
    number: '06',
    title: 'The Problem with Overdesigned Interfaces',
    date: 'March 2026',
    category: 'Visual Craft',
    readTime: '2 min read',
    introduction: 'When every element screams for attention with bevels, glows, badges, and gradients, nothing stands out.',
    mainArgument: [
      'Confidence in digital design is expressed through negative space and precise typography. When you strip away gratuitous decorative chrome, the interface feels lighter, faster, and distinctly human.',
      'Let the work and content be the visual hero. The interface is the bespoke gallery frame that elevates it.'
    ],
    observation: 'Simplicity is not the absence of design; it is the pinnacle of focused craft.',
    conclusion: 'Spend your design tokens on typography, spatial rhythm, and tactile feedback.',
    keyTakeaway: 'Clarity is the ultimate luxury in modern software.',
    relatedProjectSlug: 'form',
    relatedProjectName: 'Form Architecture Studio'
  }
];
