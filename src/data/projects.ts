import { Project } from '../types';
import { media } from './media';

export const projects: Project[] = [
  {
    id: 'nova',
    slug: 'nova',
    number: '01',
    title: 'NOVA',
    client: 'Nova Systems Inc.',
    subtitle: 'SaaS product interface redesigned for cognitive clarity and speed',
    tagline: 'Modern enterprise analytics platform simplifying complex data pipelines into intuitive visual models.',
    category: 'product',
    categoryLabel: 'Product Design & Frontend',
    year: 2026,
    featured: true,
    heroImage: media.novaHero,
    mockupImage: media.novaMockup,
    roles: ['Lead Product Designer', 'Design Systems Architect', 'Frontend Engineer'],
    services: ['UX Strategy', 'Information Architecture', 'Design System', 'React / TypeScript Frontend'],
    technologies: ['Figma', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
    timeline: '4 Months (Q1 2026)',
    liveUrl: 'https://demo.nova-systems.craft',
    githubUrl: 'https://github.com/designer-darshil/nova-ui-core',
    description: 'Nova is a modern B2B analytics platform where data engineers and product teams observe distributed application pipelines in real-time. The interface was rebuilt from the ground up to reduce cognitive fatigue during critical incident monitoring.',
    challenge: 'The legacy interface suffered from severe information overload: 14 nested menus, inconsistent data tables, and latency-heavy data visualizers that caused operator confusion during production incidents.',
    solution: 'Designed a unified command-center layout featuring an omnipresent command palette (Cmd+K), high-density data tables with custom virtualized rendering, and an ergonomic dark palette with strict semantic contrast tokens.',
    receipt: [
      { count: '38', label: 'Unique Interface Screens' },
      { count: '42', label: 'Tokenized UI Components' },
      { count: '4', label: 'Responsive Breakpoints' },
      { count: '3', label: 'Navigation Iterations Tested' },
      { count: '100%', label: 'WCAG AAA Contrast Compliance' },
      { count: '0ms', label: 'Cumulative Layout Shift' }
    ],
    decisionLogs: [
      {
        id: 'why-command-bar',
        question: 'Why replace top-level nested dropdowns with a global Cmd+K palette?',
        decision: 'Telemetry operators are power users whose hands stay on the keyboard during incident triaging. Moving secondary configuration out of sight into a keyboard-first index freed up 180px of vertical viewport real estate for live log streams.',
        tradeoff: 'First-time users need brief visual tooltips to discover shortcuts, solved via persistent footer shortcut reminders.',
        tag: 'INFORMATION ARCHITECTURE'
      },
      {
        id: 'why-oklch-dark',
        question: 'Why calibrate surface colors with OKLCH instead of pure black #000000?',
        decision: 'Pure #000000 causes harsh contrast halation with pure white text on OLED screens. We used OKLCH lightness ramps (#080808, #121212, #181818) to preserve perceptible depth layers while preventing operator eye fatigue during 12-hour shifts.',
        tradeoff: 'Requires modern CSS color function fallbacks for older browser targets.',
        tag: 'COLOR SCIENCE'
      }
    ],
    beforeAfter: {
      title: 'Telemetry Dashboard Restructuring',
      before: {
        label: 'Legacy Dashboard (v1.8)',
        description: 'Cluttered 14-tab navigation, inconsistent line-heights, and alerts scattered randomly across multiple sub-pages.',
        flaws: [
          'Critical incident alerts hidden behind 3 clicks',
          'Heavy DOM overhead causing 450ms lag during streaming ticks',
          'Poor contrast on status badges leading to operator ambiguity'
        ]
      },
      after: {
        label: 'Redesigned Command Canvas (v2.6)',
        description: 'Single-pane virtualized stream, instant Cmd+K filter bar, and unified severity color coding.',
        improvements: [
          'One-click drilldown into cluster stack traces',
          'Sub-16ms 60 FPS streaming data updates with canvas virtualization',
          'Zero-latency filter bar supporting regex queries'
        ]
      }
    },
    impactStatements: [
      'Reduced operator mean-time-to-diagnose by 38% through contextual hierarchy.',
      'Constructed a 42-component design system tokenized for React & Figma tokens.',
      'Achieved a 99.4/100 Lighthouse performance score with zero layout shift.'
    ],
    layoutType: 'large-hero',
    sections: [
      {
        title: '01. Problem & Context',
        subtitle: 'The Challenge of Complex Data Density',
        tag: 'RESEARCH & DISCOVERY',
        description: [
          'Enterprise telemetry operators monitor hundreds of simultaneous microservice metrics. The previous dashboard scattered alert states across four distinct tabs, forcing operators to context-switch during high-stress incidents.',
          'Our mission was clear: construct a calm, confident interface where critical alerts surface instantly without visual noise.'
        ],
        bulletPoints: [
          'Multi-layered information architecture with too many clicks to actionable insights.',
          'Inconsistent visual styling created by disparate engineering teams over 3 years.',
          'High memory overhead and slow table rendering with 10,000+ data points.'
        ],
        visual: {
          type: 'browser',
          image: media.novaAnalytics,
          caption: 'High-density telemetry dashboard featuring custom SVG stream charts and prioritized alert badges.'
        }
      },
      {
        title: '02. Information Architecture & UX Flow',
        subtitle: 'Restructuring the Workspace Hierarchy',
        tag: 'UX STRATEGY',
        description: [
          'We simplified the top-level navigation from 14 items down to 4 primary workspaces: Telemetry Stream, Service Mesh, Incident Drilldown, and Team Settings.',
          'A universal search index lets operators jump directly to service nodes, filter by error codes, and trigger remediation runbooks in under two keypresses.'
        ],
        visual: {
          type: 'wireframe',
          wireframePoints: [
            { step: '01', label: 'Global Telemetry Bar', detail: 'Real-time throughput indicator, active cluster status, and instant command trigger.' },
            { step: '02', label: 'Virtualized Stream View', detail: 'Zero-lag tabular stream with instant column reordering and regex query filters.' },
            { step: '03', label: 'Contextual Inspector Drawer', detail: 'Slide-over inspector displaying stack traces, log diffs, and deploy diffs side-by-side.' }
          ]
        }
      },
      {
        title: '03. Visual Direction & Design Tokens',
        subtitle: 'Ergonomic Contrast in a Dark Atmosphere',
        tag: 'DESIGN SYSTEM',
        description: [
          'Built a mathematically scaled color system using OKLCH color space for absolute perceptual uniformity. Backgrounds sit on deep charcoal tones (#080808, #121212) preventing eye strain during 12-hour shifts.',
          'Status colors (Success, Warning, Critical, Muted) strictly adhere to WCAG AAA contrast ratios against all layered surface depths.'
        ],
        visual: {
          type: 'tokens',
          tokens: [
            { name: '--surface-base', value: '#080808', type: 'color' },
            { name: '--surface-card', value: '#121212', type: 'color' },
            { name: '--status-alert', value: '#FF3E00', type: 'color' },
            { name: '--status-ok', value: '#10B981', type: 'color' },
            { name: '--font-mono', value: 'JetBrains Mono', type: 'typography' },
            { name: '--radius-base', value: '6px', type: 'radius' }
          ]
        }
      },
      {
        title: '04. Design-to-Code Implementation',
        subtitle: 'Zero-Friction React Architecture',
        tag: 'FRONTEND ARCHITECTURE',
        description: [
          'Translated Figma variables directly into Tailwind CSS custom properties and typed React component props. Built reusable composite widgets including virtualized tables, sparkline cards, and keyboard-driven menus.'
        ],
        visual: {
          type: 'code',
          codeSnippet: {
            filename: 'components/TelemetryTable.tsx',
            language: 'typescript',
            code: `interface TelemetryStreamProps {
  clusterId: string;
  refreshIntervalMs?: number;
  onAlertTrigger?: (event: IncidentAlert) => void;
}

export const TelemetryStream: React.FC<TelemetryStreamProps> = ({
  clusterId,
  refreshIntervalMs = 1000,
  onAlertTrigger
}) => {
  const { nodes, isStale } = useClusterTelemetry(clusterId, { pollMs: refreshIntervalMs });
  
  return (
    <div className="rounded-md border border-white/10 bg-[#0A0A0A] p-4">
      <TelemetryHeader clusterId={clusterId} status={isStale ? 'syncing' : 'live'} />
      <VirtualizedNodeGrid nodes={nodes} onSelectAlert={onAlertTrigger} />
    </div>
  );
};`
          }
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.novaMockup, alt: 'Nova Multi-device Interface', caption: 'Full-width dashboard overview' },
      { type: 'image', url: media.novaAnalytics, alt: 'Nova Analytics Graph', caption: 'Custom sparkline visualization' },
      { type: 'image', url: media.novaMobile, alt: 'Nova Mobile Emergency View', caption: 'Incident response on iOS mobile viewport' },
      { type: 'image', url: media.novaDesignSystem, alt: 'Nova Design System Grid', caption: 'Atomic component library in Figma & React' }
    ],
    nextProjectId: 'aura'
  },
  {
    id: 'aura',
    slug: 'aura',
    number: '02',
    title: 'AURA',
    client: 'Aura Atelier Living',
    subtitle: 'High-craft editorial e-commerce platform for architectural lifestyle objects',
    tagline: 'Merging high-fashion editorial typography with smooth micro-interactions and instant headless checkout.',
    category: 'web-design',
    categoryLabel: 'Creative Web Design',
    year: 2026,
    featured: true,
    heroImage: media.auraHero,
    mockupImage: media.auraEditorial,
    roles: ['Art Director', 'Web Designer', 'Creative Developer'],
    services: ['Brand Identity', 'Art Direction', 'Custom E-Commerce Design', 'Interactive Motion'],
    technologies: ['Figma', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Shopify Storefront API'],
    timeline: '3 Months (Late 2025)',
    liveUrl: 'https://aura.atelier.craft',
    description: 'Aura is a digital flagship store for an avant-garde architectural home goods manufacturer. The objective was to depart from standard modular e-commerce grids in favor of an immersive, magazine-style browsing journey.',
    challenge: 'Standard online storefronts felt transactional and cold. Aura required a tactile digital experience that conveyed the physical weight, raw texture, and artisanal craftsmanship of concrete, bronze, and stone objects.',
    solution: 'Designed an asymmetrical editorial grid with variable font scaling, cursor-linked perspective shifts, dynamic split-view lookbooks, and sub-100ms instant cart drawers.',
    receipt: [
      { count: '24', label: 'Editorial Pages Designed' },
      { count: '18', label: 'Bespoke Lookbook Modules' },
      { count: '5', label: 'Custom Motion Shaders' },
      { count: '60fps', label: 'Continuous Parallax Performance' },
      { count: 'sub-80ms', label: 'Instant Cart Drawer Latency' }
    ],
    decisionLogs: [
      {
        id: 'why-asymmetric-grid',
        question: 'Why discard the traditional 4-column product card grid?',
        decision: 'Aura sells artisanal objects ranging from $400 to $6,000. Uniform grid cards diminish perceived value by making sculptural pieces feel like commodity inventory. Staggered, magazine-scale compositions give each artifact gallery-level breathing room.',
        tag: 'ART DIRECTION'
      }
    ],
    beforeAfter: {
      title: 'Storefront Experience Transition',
      before: {
        label: 'Generic E-Commerce Grid',
        description: 'Standard square thumbnail boxes with generic price tags and standard modal popups.',
        flaws: [
          'No emotional resonance with architectural craftsmanship',
          'Cramped product photography hiding surface textures',
          'Clunky multi-step page reloads on variant selection'
        ]
      },
      after: {
        label: 'Editorial Spatial Flagship',
        description: 'Full-bleed atmospheric photography with contextual material origin notes and instant sliding cart.',
        improvements: [
          'Elevated brand prestige and art direction',
          'Seamless client-side transitions between chapters',
          'Instant variant switching without page reload'
        ]
      }
    },
    impactStatements: [
      'Elevated average time-on-site from 1m 12s to 3m 48s.',
      'Increased direct product detail page interaction rates by 44%.',
      'Engineered smooth client-side page transitions without layout jank.'
    ],
    layoutType: 'split-editorial',
    sections: [
      {
        title: '01. Editorial Vision',
        subtitle: 'Digital Space as a Modern Art Gallery',
        tag: 'ART DIRECTION',
        description: [
          'We treated each collection as an editorial chapter. Large serif titles combine with raw architectural photography, generous negative space, and numbered inventory tags.',
          'Instead of uniform product grids, products appear in curated living scenes with contextual annotations revealing material origins and artisanal techniques.'
        ],
        visual: {
          type: 'browser',
          image: media.auraEditorial,
          caption: 'Editorial chapter view with asymmetrical image pairing and tactile material tags.'
        }
      },
      {
        title: '02. Interactive Micro-Moments',
        subtitle: 'Subtle Motion Reflecting Physical Craft',
        tag: 'MOTION & INTERACTION',
        description: [
          'Images feature custom cursor magnification and subtle 3D parallax on desktop. Micro-animations guide the eye toward material specifications without interrupting the purchasing flow.'
        ],
        visual: {
          type: 'mobile',
          image: media.auraMobile,
          caption: 'Mobile responsive lookbook adapted for fluid vertical touch swipes.'
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.auraHero, alt: 'Aura Homepage Hero', caption: 'Editorial typographic hero composition' },
      { type: 'image', url: media.auraEditorial, alt: 'Aura Product Lookbook', caption: 'Interactive spatial product gallery' },
      { type: 'image', url: media.auraMobile, alt: 'Aura Mobile Experience', caption: 'Editorial lookbook on mobile screens' }
    ],
    nextProjectId: 'frame'
  },
  {
    id: 'frame',
    slug: 'frame',
    number: '03',
    title: 'FRAME',
    client: 'Frame Collaborative',
    subtitle: 'Next-generation canvas workspace for distributed design critique and spatial feedback',
    tagline: 'Real-time multiplayer canvas interface balancing boundless spatial freedom with strict structured critique workflows.',
    category: 'product',
    categoryLabel: 'Product Design & UX',
    year: 2026,
    featured: true,
    heroImage: media.frameHero,
    mockupImage: media.frameCanvas,
    roles: ['Principal UX Designer', 'Product Architect'],
    services: ['Multiplayer Canvas UX', 'Design System', 'Design-to-Code Specification'],
    technologies: ['Figma', 'React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    timeline: '5 Months (2025–2026)',
    liveUrl: 'https://frame.canvas.craft',
    description: 'Frame is a collaborative workspace where remote product designers and engineers mark up live web builds, leave pinned audio notes, and inspect CSS diffs directly on canvas.',
    challenge: 'Multiplayer canvases often suffer from visual chaos: overlapping cursor trails, cluttered toolbars, and unorganized commentary threads that obscure the actual design review.',
    solution: 'Engineered a "Focused Critique" spatial mode that dims secondary canvases, clusters commentary into thread ribbons, and provides an expandable bottom HUD with minimal visual footprint.',
    receipt: [
      { count: '46', label: 'Spatial Canvas Tools' },
      { count: '12', label: 'Multiplayer Cursor States' },
      { count: '6%', label: 'Total Screen HUD Footprint' },
      { count: '120fps', label: 'Inertial Zoom Smoothness' }
    ],
    decisionLogs: [
      {
        id: 'why-bottom-hud',
        question: 'Why move standard top/side toolbars to a collapsed bottom HUD dock?',
        decision: 'Side toolbars create permanent lateral visual occlusion on widescreen monitors. Placing tool triggers in an auto-collapsing bottom dock gives designers 100% unobstructed horizontal panning room for side-by-side design comparisons.',
        tag: 'SPATIAL UX'
      }
    ],
    impactStatements: [
      'Adopted by 180+ remote design squads during closed beta testing.',
      'Reduced design critique turnaround cycles from 4 days to 24 hours.',
      'Built a spatial HUD interface that occupies less than 6% of screen real estate.'
    ],
    layoutType: 'large-hero',
    sections: [
      {
        title: '01. Spatial Canvas Architecture',
        subtitle: 'Designing for Zero-Clutter Collaboration',
        tag: 'SPATIAL UX',
        description: [
          'The primary canvas uses an infinite coordinate system with smooth mouse-wheel zooming and inertial panning. Toolbars dynamically collapse into an ergonomic bottom dock when the user begins canvas manipulation.'
        ],
        visual: {
          type: 'browser',
          image: media.frameCanvas,
          caption: 'Frame infinite canvas with contextual feedback markers and collapsed bottom toolbar.'
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.frameHero, alt: 'Frame Workspace Hero', caption: 'Infinite canvas workspace in dark mode' },
      { type: 'image', url: media.frameCanvas, alt: 'Frame Multi-cursor Canvas', caption: 'Live multi-user critique mode' },
      { type: 'image', url: media.frameLayers, alt: 'Frame Layer Inspector', caption: 'Live DOM inspector integration' }
    ],
    nextProjectId: 'mono'
  },
  {
    id: 'mono',
    slug: 'mono',
    number: '04',
    title: 'MONO',
    client: 'Mono Type Foundry',
    subtitle: 'Typographic specimen archive & interactive glyph tester for independent type designers',
    tagline: 'A minimalist digital archive celebrating font geometry, kerning pairs, and variable font axis control.',
    category: 'frontend',
    categoryLabel: 'Frontend & Web Design',
    year: 2025,
    featured: true,
    heroImage: media.monoHero,
    mockupImage: media.monoPrint,
    roles: ['Creative Developer', 'Typographic Designer'],
    services: ['Interactive Web Experience', 'Variable Font Engine', 'Responsive Specimen Sheets'],
    technologies: ['Vite', 'React', 'TypeScript', 'CSS Canvas API', 'Opentype.js'],
    timeline: '2 Months (2025)',
    liveUrl: 'https://mono.foundry.craft',
    description: 'Mono is a digital specimen platform built for contemporary type foundries. It allows designers to test variable font axes (weight, slant, optical size), preview OpenType features, and export SVG outlines in real-time.',
    challenge: 'Traditional type foundry sites are static specimen PDFs or heavy flash-like apps that lag on mobile devices.',
    solution: 'Built a lightweight, canvas-accelerated text tester that renders 120 FPS font deformations and supports custom keyboard ligature testing with zero external libraries.',
    receipt: [
      { count: '14', label: 'Variable Axis Controllers' },
      { count: '850+', label: 'Glyphs Rendered in Real-Time' },
      { count: '48KB', label: 'Total Javascript Bundle Size' },
      { count: '0', label: 'Third-Party Heavy Canvas Libraries' }
    ],
    decisionLogs: [
      {
        id: 'why-native-css-axes',
        question: 'Why avoid WebGL for the glyph deformation tester?',
        decision: 'Variable font variation settings can be applied directly to DOM typography with zero-copy hardware acceleration on the GPU. Using native CSS font-variation-settings keeps the bundle under 50KB and retains 100% copy-paste text accessibility.',
        tag: 'FRONTEND PERFORMANCE'
      }
    ],
    impactStatements: [
      'Achieved a sub-50KB bundle size for the entire interactive specimen engine.',
      'Featured in multiple web design publications and design engineering newsletters.',
      'Over 85,000 unique font tests conducted in the first 90 days.'
    ],
    layoutType: 'horizontal-banner',
    sections: [
      {
        title: '01. Kinetic Typography',
        subtitle: 'Pushing the Limits of Browser Font Rendering',
        tag: 'CREATIVE DEVELOPMENT',
        description: [
          'Variable font axes are bound to custom interactive sliders with live SVG path rendering. The layout adapts automatically from desktop ultra-wide displays down to mobile touch viewports.'
        ],
        visual: {
          type: 'code',
          codeSnippet: {
            filename: 'engine/VariableFontController.ts',
            language: 'typescript',
            code: `export const applyVariableAxes = (
  element: HTMLElement,
  axes: { wght: number; slnt: number; opsz: number }
) => {
  element.style.fontVariationSettings = 
    \`'wght' \${axes.wght}, 'slnt' \${axes.slnt}, 'opsz' \${axes.opsz}\`;
};`
          }
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.monoHero, alt: 'Mono Specimen Hero', caption: 'High-contrast typography tester' },
      { type: 'image', url: media.monoPrint, alt: 'Mono Print Specimen', caption: 'Exportable vector glyph specimen' }
    ],
    nextProjectId: 'pulse'
  },
  {
    id: 'pulse',
    slug: 'pulse',
    number: '05',
    title: 'PULSE',
    client: 'Pulse Financial Analytics',
    subtitle: 'Institutional-grade quantitative analytics and portfolio health dashboard',
    tagline: 'High-frequency algorithmic trading interface engineered for microsecond clarity and risk visualization.',
    category: 'ui-ux',
    categoryLabel: 'UI/UX Design',
    year: 2025,
    featured: false,
    heroImage: media.pulseHero,
    mockupImage: media.pulseCharts,
    roles: ['Senior UI/UX Designer', 'Information Architect'],
    services: ['Complex Data Visualization', 'Design System', 'Accessibility Audits'],
    technologies: ['Figma', 'React', 'D3.js', 'Tailwind CSS'],
    timeline: '4 Months (2025)',
    description: 'Pulse delivers quantitative risk modeling and asset allocations to hedge funds and portfolio managers.',
    challenge: 'Traders had to synthesize dozens of volatile charts simultaneously across multiple monitor setups without losing situational awareness.',
    solution: 'Designed an ultra-dense, customizable modular grid system with custom candlestick rendering, heatmap matrices, and customizable audio cues for threshold breaches.',
    receipt: [
      { count: '28', label: 'Financial Chart Primitives' },
      { count: '100%', label: 'Color-Blind Accessible Palettes' },
      { count: '16ms', label: 'Streaming Tick Refresh Rate' }
    ],
    decisionLogs: [
      {
        id: 'why-duotone-status',
        question: 'Why replace traditional red/green financial colors with dual-channel luminance and pattern fills?',
        decision: 'Approximately 8% of male financial operators experience deuteranopia color blindness. Relying solely on red/green leads to catastrophic misinterpretation. We combined distinct luminance shifts with subtle geometric glyphs (▲ / ▼).',
        tag: 'ACCESSIBILITY'
      }
    ],
    impactStatements: [
      'Eliminated UI redraw bottlenecks with specialized canvas data renderers.',
      'Achieved 100% WCAG 2.1 AA accessibility compliance across all financial charts.'
    ],
    layoutType: 'asymmetric-stack',
    sections: [
      {
        title: '01. Quantitative Data Layout',
        subtitle: 'High-Density Spatial Hierarchy',
        tag: 'DATA VISUALIZATION',
        description: [
          'Constructed custom D3 visualization modules that handle continuous streaming WebSocket ticks without repainting the entire document tree.'
        ],
        visual: {
          type: 'browser',
          image: media.pulseCharts,
          caption: 'Real-time financial charts with custom volatility bands and risk indicators.'
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.pulseHero, alt: 'Pulse Dark Mode Dashboard', caption: 'Institutional multi-chart interface' },
      { type: 'image', url: media.pulseCharts, alt: 'Pulse Financial Matrix', caption: 'Heatmap correlation matrix view' }
    ],
    nextProjectId: 'form'
  },
  {
    id: 'form',
    slug: 'form',
    number: '06',
    title: 'FORM',
    client: 'Form Spatial Studio',
    subtitle: 'Branded digital showcase for a contemporary Scandinavian architecture practice',
    tagline: 'Architectural storytelling through brutalist typography, monochrome elevations, and seamless project transitions.',
    category: 'web-design',
    categoryLabel: 'Web Design & Art Direction',
    year: 2025,
    featured: false,
    heroImage: media.formHero,
    mockupImage: media.formGrid,
    roles: ['Art Director', 'Frontend Developer'],
    services: ['Web Design', 'Content Strategy', 'Responsive Frontend'],
    technologies: ['Vite', 'React', 'Tailwind CSS', 'Framer Motion'],
    timeline: '2 Months (2025)',
    description: 'Form Architecture required an online portfolio that mirrored their physical philosophy: raw concrete, honest materiality, and bold structural geometry.',
    challenge: 'Architectural imagery often gets lost in generic website layouts with distracting navigation and cramped photo carousels.',
    solution: 'Crafted full-bleed project spreads with crisp 1px structural gridlines, subtle scroll-driven parallax, and interactive building blueprints.',
    receipt: [
      { count: '16', label: 'Architectural Case Studies' },
      { count: '1px', label: 'Structural Swiss Grid Lines' },
      { count: '0', label: 'Unnecessary Visual Ornaments' }
    ],
    decisionLogs: [
      {
        id: 'why-exposed-grid',
        question: 'Why expose 1px structural gridlines across the entire layout?',
        decision: 'Architects think in grids, structural spans, and tectonic alignments. Showing the subtle 1px border scaffolding across every breakpoint creates an immediate subconscious kinship with architectural drawings.',
        tag: 'VISUAL METAPHOR'
      }
    ],
    impactStatements: [
      'Won praise in multiple international design archives for spatial layout.',
      'Elevated client inquiry conversion for premium architectural commissions by 60%.'
    ],
    layoutType: 'large-hero',
    sections: [
      {
        title: '01. Spatial Grids in the Browser',
        subtitle: 'Translating Physical Blueprint Systems',
        tag: 'BRAND DIRECTION',
        description: [
          'Using a 12-column Swiss grid system with visible structural guides, the website communicates architectural rigor before a single word is read.'
        ],
        visual: {
          type: 'browser',
          image: media.formGrid,
          caption: 'Visible grid lines framing high-resolution architectural photography.'
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.formHero, alt: 'Form Architecture Hero', caption: 'Monochrome concrete elevation study' },
      { type: 'image', url: media.formGrid, alt: 'Form Grid Layout', caption: 'Structural 12-column architectural index' }
    ],
    nextProjectId: 'shift'
  },
  {
    id: 'shift',
    slug: 'shift',
    number: '07',
    title: 'SHIFT',
    client: 'Shift Async Software',
    subtitle: 'Async-first team collaboration & standup tool designed to end calendar fatigue',
    tagline: 'Focus-centric productivity app combining rich markdown memos with contextual video micro-updates.',
    category: 'ui-ux',
    categoryLabel: 'UI/UX & Web Application',
    year: 2025,
    featured: false,
    heroImage: media.shiftHero,
    mockupImage: media.shiftApp,
    roles: ['Lead Product Designer', 'Frontend Lead'],
    services: ['Product UI/UX Design', 'Onboarding Journey', 'Design System'],
    technologies: ['Figma', 'React', 'TypeScript', 'Tailwind CSS'],
    timeline: '3 Months (2025)',
    description: 'Shift helps remote software engineering teams communicate asynchronously without getting pulled into endless recurring video syncs.',
    challenge: 'Explaining a paradigm shift in team workflow required a landing page that immediately demonstrated the product value within 10 seconds of landing.',
    solution: 'Designed an interactive landing page featuring a live "Calendar Freedom Simulator" and seamless onboarding flow that got teams writing their first async standup in under 2 minutes.',
    receipt: [
      { count: '12', label: 'Landing Page Section Variations' },
      { count: '1', label: 'Live Interactive Calendar Simulator' },
      { count: '2 min', label: 'Time-to-First-Standup UX Onboarding' }
    ],
    decisionLogs: [
      {
        id: 'why-interactive-simulator',
        question: 'Why include a live calendar simulator on the landing page hero?',
        decision: 'Reading marketing copy about "saving hours" feels abstract. Letting visitors click and delete bloated calendar blocks to calculate their team\'s reclaimed focus time generated immediate emotional buy-in before signup.',
        tag: 'CONVERSION UX'
      }
    ],
    impactStatements: [
      'Doubled landing page signup conversion rate from 3.2% to 6.8%.',
      'Engineered an interactive product walkthrough that converted 40% of visitors into trial users.'
    ],
    layoutType: 'split-editorial',
    sections: [
      {
        title: '01. The Narrative Landing Page',
        subtitle: 'Communicating the Value of Async Work',
        tag: 'LANDING PAGE DESIGN',
        description: [
          'Combined high-contrast typography, interactive micro-previews, and real product snippets to prove why async standups preserve deep work blocks.'
        ],
        visual: {
          type: 'browser',
          image: media.shiftApp,
          caption: 'Interactive product demo on the marketing homepage.'
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.shiftHero, alt: 'Shift Team Collaboration', caption: 'Team communication dashboard' },
      { type: 'image', url: media.shiftApp, alt: 'Shift Standup Editor', caption: 'Markdown async update composer' }
    ],
    nextProjectId: 'orbit'
  },
  {
    id: 'orbit',
    slug: 'orbit',
    number: '08',
    title: 'ORBIT',
    client: 'Orbit Interactive (Creative Frontend)',
    subtitle: 'High-performance interactive web canvas exploring CSS 3D perspectives and interaction physics',
    tagline: 'Pure CSS/JS interactive playground pushing browser performance without heavy 3D engine overhead.',
    category: 'frontend',
    categoryLabel: 'Creative Frontend & Interaction',
    year: 2026,
    featured: true,
    heroImage: media.orbitHero,
    mockupImage: media.orbitWebGL,
    roles: ['Creative Technologist', 'Motion Designer'],
    services: ['CSS Physics', 'Interaction Engineering', 'Procedural Audio'],
    technologies: ['TypeScript', 'CSS Matrix3D', 'Web Audio API', 'Framer Motion'],
    timeline: 'Continuous Exploration',
    description: 'Orbit is an ongoing research lab exploring spatial user interfaces, magnetic physics cursors, and procedural typography without relying on heavy WebGL libraries like Three.js.',
    challenge: 'Achieving responsive, fluid 3D-like depth and motion interactions on the web without ballooning bundle sizes or causing battery drain on mobile devices.',
    solution: 'Built a lightweight CSS 3D matrix transform engine paired with Framer Motion spring physics, keeping the bundle size below 12KB.',
    receipt: [
      { count: '8', label: 'Interactive Physics Modules' },
      { count: '12KB', label: 'Lightweight Math Engine' },
      { count: '120fps', label: 'Frame Rate on M-Series / Modern Mobile' }
    ],
    decisionLogs: [
      {
        id: 'why-no-webgl',
        question: 'Why avoid Three.js / WebGL for 3D interactions?',
        decision: 'Three.js adds ~600KB uncompressed, spikes mobile battery temperature, and breaks standard DOM text accessibility. Native CSS matrix3d transforms provide 90% of the perceived depth at 2% of the weight.',
        tag: 'ENGINEERING ARCHITECTURE'
      }
    ],
    impactStatements: [
      'Runs at steady 60–120 FPS on all modern mobile and desktop browsers.',
      '100% lightweight native CSS transforms and requestAnimationFrame loops.'
    ],
    layoutType: 'large-hero',
    sections: [
      {
        title: '01. Lightweight 3D Depth Engine',
        subtitle: 'Math-Driven CSS Transforms',
        tag: 'LAB EXPLORATION',
        description: [
          'Calculates cursor distance from element centers using normalized Euclidean vectors, applying subtle translate3d and rotateX/rotateY transforms without triggering layout reflows.'
        ],
        visual: {
          type: 'code',
          codeSnippet: {
            filename: 'physics/perspectiveTransform.ts',
            language: 'typescript',
            code: `export function computePerspectiveOffset(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  intensity = 15
) {
  const x = (clientX - rect.left) / rect.width - 0.5;
  const y = (clientY - rect.top) / rect.height - 0.5;
  return {
    rotateX: -y * intensity,
    rotateY: x * intensity,
    transform: \`perspective(1000px) rotateX(\${-y * intensity}deg) rotateY(\${x * intensity}deg)\`
  };
}`
          }
        }
      }
    ],
    gallery: [
      { type: 'image', url: media.orbitHero, alt: 'Orbit Interactive Playground', caption: 'Interactive procedural geometry canvas' },
      { type: 'image', url: media.orbitWebGL, alt: 'Orbit Physics Demonstration', caption: 'CSS 3D perspective coordinate demo' }
    ],
    nextProjectId: 'nova'
  }
];
