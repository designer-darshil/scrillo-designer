import { Project } from '../types';
import { media } from './media';

export const projects: Project[] = [
  {
    id: 'nova',
    slug: 'nova',
    number: '01',
    title: 'Nova',
    category: 'product',
    categoryLabel: 'Product Design',
    year: 2026,
    role: 'UI/UX Design · Frontend Architecture',
    summary: 'A clearer workflow for a complex SaaS telemetry product.',
    heroImage: media.novaHero,
    overview: 'Nova is a telemetry and cluster observation tool used by infrastructure engineers. The goal was to reduce visual fatigue and streamline how operators triage high-frequency alert states during live incidents.',
    problem: 'The previous interface scattered alert indicators across four disconnected tabs. Operators were forced to context-switch repeatedly to correlate CPU throttles with application deploy diffs.',
    approach: 'I consolidated the workspace into a single high-density stream view supported by a keyboard-driven command palette (Cmd+K). I restructured the color system around strict OKLCH contrast thresholds so status alerts remain distinguishable in both dim and bright control room environments.',
    receipt: [
      { count: '38', label: 'Screens Designed' },
      { count: '42', label: 'Components Tokenized' },
      { count: '3', label: 'Navigation Iterations' },
      { count: '0ms', label: 'Cumulative Layout Shift' }
    ],
    decisionLogs: [
      {
        id: 'nav-structure',
        title: 'Navigation Hierarchy Exploration',
        optionsConsidered: [
          {
            label: 'Option A: Nested Multi-Level Sidebar',
            description: 'Exposed all 14 sub-dashboards in a permanent 280px left rail. Cluttered the viewport and squeezed live telemetry tables.'
          },
          {
            label: 'Option B: Top Tab Navigation with Dropdowns',
            description: 'Freed up width but hid high-priority cluster filters behind 2 clicks.'
          }
        ],
        finalDecision: 'Final Direction: Compact 4-Workspace Bar + Global Cmd+K Index',
        rationale: 'Telemetry operators work primarily from the keyboard. Consolidating primary views into 4 workspaces while moving deep configuration to a fast shortcut palette freed up 180px of horizontal room for live streaming logs.',
        tag: 'Information Architecture'
      },
      {
        id: 'color-contrast',
        title: 'Status Palette Calibration',
        optionsConsidered: [
          {
            label: 'Option A: Standard Vibrant Neon Accents',
            description: 'High initial visual impact in Figma mockups, but produced severe eye strain during 12-hour continuous monitoring.'
          }
        ],
        finalDecision: 'Final Direction: Muted Dark Neutral Base (#0A0A0A) with Strict Semantic Accents',
        rationale: 'We reserved high-saturation orange and red exclusively for active critical breaches. Everything else sits on neutral charcoal tones to maintain focus.',
        tag: 'Visual System'
      }
    ],
    designToCode: {
      figmaNotes: 'Designed in Figma using auto-layout variables for spacing (4px/8px/16px/24px) and semantic surface tokens.',
      codeSnippet: {
        filename: 'components/TelemetryStream.tsx',
        language: 'tsx',
        code: `export const TelemetryStream: React.FC<StreamProps> = ({ clusterId, nodes }) => {
  return (
    <div className="border border-white/10 bg-[#0A0A0A] p-4 rounded-md">
      <StreamHeader clusterId={clusterId} status="live" />
      <VirtualizedTable data={nodes} />
    </div>
  );
};`
      },
      responsiveDetails: 'At tablet viewports (under 1024px), the secondary stack inspector slides into a bottom sheet rather than squeezing the primary table columns.'
    },
    sections: [
      {
        title: 'Restructuring the Workspace',
        subtitle: 'From fragmented views to a unified canvas',
        description: [
          'I began by mapping every frequent action an operator performs during an outage. The 14 previous tabs were organized into four primary focus areas: Stream, Services, Incidents, and Settings.',
          'The primary table uses virtualized DOM rendering so operators can scroll through 10,000+ continuous log events without frame drops.'
        ],
        image: media.novaAnalytics,
        caption: 'High-density stream view with contextual alert indicators.'
      },
      {
        title: 'Component Consistency',
        subtitle: 'Figma tokens mapped directly to React props',
        description: [
          'Every component was documented in Figma with strict variant states: Rest, Hover, Active, Disabled, and Error. These directly mapped to TypeScript props in the component library.'
        ],
        image: media.novaDesignSystem,
        caption: 'Tokenized component library for table cells, filter chips, and badges.'
      }
    ],
    gallery: [
      { url: media.novaMockup, caption: 'Overview of the desktop dashboard layout' },
      { url: media.novaAnalytics, caption: 'Detailed telemetry chart and log stream' },
      { url: media.novaMobile, caption: 'Mobile responsive emergency view' }
    ],
    nextProjectId: 'aura'
  },
  {
    id: 'aura',
    slug: 'aura',
    number: '02',
    title: 'Aura',
    category: 'web-design',
    categoryLabel: 'Web Design',
    year: 2026,
    role: 'Art Direction · Web Design · Frontend',
    summary: 'An editorial e-commerce platform for architectural lifestyle objects.',
    heroImage: media.auraHero,
    overview: 'Aura is a digital flagship store for an architectural home goods studio. The goal was to move away from generic modular e-commerce grids in favor of an editorial, publication-inspired browsing experience.',
    problem: 'Standard e-commerce templates made heavy concrete, bronze, and stone objects feel like generic commodity products, failing to convey the physical craftsmanship and material texture.',
    approach: 'I developed an asymmetrical layout using large serif headlines, generous negative space, and material origin notes. The checkout flow was engineered with a sub-100ms slide-over cart drawer that avoids full-page redirects.',
    receipt: [
      { count: '18', label: 'Editorial Spreads' },
      { count: '24', label: 'Product Templates' },
      { count: 'sub-80ms', label: 'Cart Drawer Latency' }
    ],
    decisionLogs: [
      {
        id: 'grid-vs-lookbook',
        title: 'Product Catalog Layout',
        optionsConsidered: [
          {
            label: 'Option A: 4-Column Uniform Card Grid',
            description: 'Familiar and quick to browse, but created a commodity discount-store feel.'
          }
        ],
        finalDecision: 'Final Direction: Asymmetrical Split Lookbook Spreads',
        rationale: 'Because Aura sells bespoke items in limited runs, pairing products directly with architectural interior photography creates higher perceived value and better spatial context.',
        tag: 'Art Direction'
      }
    ],
    designToCode: {
      figmaNotes: 'Constructed using a responsive 12-column baseline grid with variable font weight parameters.',
      codeSnippet: {
        filename: 'components/LookbookSpread.tsx',
        language: 'tsx',
        code: `export const LookbookSpread: React.FC<SpreadProps> = ({ item, image }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-16">
      <div className="md:col-span-7">
        <img src={image} alt={item.title} className="w-full object-cover" />
      </div>
      <div className="md:col-span-5 space-y-4">
        <h2 className="text-3xl font-editorial-serif">{item.title}</h2>
        <p className="text-sm text-neutral-400">{item.description}</p>
      </div>
    </section>
  );
};`
      },
      responsiveDetails: 'On touch screens, the split spread naturally converts into a clean single-column story with large tap targets.'
    },
    sections: [
      {
        title: 'Editorial Storytelling',
        subtitle: 'Framing objects in their architectural context',
        description: [
          'Rather than displaying isolated 3D cutouts on white backgrounds, each object is introduced with its material lineage, weight, and artisan notes.',
          'Typography uses Instrument Serif for headlines and clean sans-serif for dimensions, prices, and specifications.'
        ],
        image: media.auraEditorial,
        caption: 'Lookbook chapter spread with contextual material notes.'
      }
    ],
    gallery: [
      { url: media.auraHero, caption: 'Flagship homepage composition' },
      { url: media.auraEditorial, caption: 'Editorial product detail view' },
      { url: media.auraMobile, caption: 'Mobile lookbook touch layout' }
    ],
    nextProjectId: 'frame'
  },
  {
    id: 'frame',
    slug: 'frame',
    number: '03',
    title: 'Frame',
    category: 'product',
    categoryLabel: 'Product Design',
    year: 2026,
    role: 'Product UX · Design Systems',
    summary: 'A focused multiplayer canvas workspace for design critique.',
    heroImage: media.frameHero,
    overview: 'Frame is a collaborative workspace where remote product designers and engineers mark up live web builds, leave pinned audio notes, and inspect CSS diffs directly on canvas.',
    problem: 'Multiplayer canvases often suffer from visual chaos: overlapping cursor trails, cluttered toolbars, and unorganized commentary threads that obscure the actual design review.',
    approach: 'I designed a "Focused Critique" mode that dims secondary canvases, clusters commentary into thread ribbons, and collapses tool triggers into a clean bottom dock that occupies less than 6% of the screen.',
    receipt: [
      { count: '32', label: 'Canvas Tools' },
      { count: '6%', label: 'HUD Screen Footprint' },
      { count: '120fps', label: 'Pan/Zoom Smoothness' }
    ],
    decisionLogs: [
      {
        id: 'toolbar-placement',
        title: 'Toolbar Placement & Occlusion',
        optionsConsidered: [
          {
            label: 'Option A: Permanent Left Sidebar',
            description: 'Occupied 240px of lateral canvas width, causing constant panning on 13-inch laptop screens.'
          }
        ],
        finalDecision: 'Final Direction: Auto-Collapsing Bottom HUD Dock',
        rationale: 'Moving tools to a centered bottom pill provided 100% unobstructed horizontal panning room for side-by-side version comparisons.',
        tag: 'Spatial UX'
      }
    ],
    designToCode: {
      figmaNotes: 'Prototyped interactive cursor clustering in Figma using smart animate components.',
      codeSnippet: {
        filename: 'canvas/CanvasToolbar.tsx',
        language: 'tsx',
        code: `export const CanvasToolbar: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#121212] border border-white/10 px-4 py-2 rounded-full flex items-center space-x-2">
      <ToolButton icon="select" active />
      <ToolButton icon="comment" />
      <ToolButton icon="inspect" />
    </div>
  );
};`
      },
      responsiveDetails: 'The canvas interface disables multi-pointer gestures on small viewports and defaults to an inspection list view.'
    },
    sections: [
      {
        title: 'Spatial Information Architecture',
        subtitle: 'Uncluttered collaboration',
        description: [
          'Feedback ribbons cluster together when zooming out, preventing comment pins from completely obscuring the UI being critiqued.'
        ],
        image: media.frameCanvas,
        caption: 'Frame canvas workspace with comment threads collapsed into subtle indicator markers.'
      }
    ],
    gallery: [
      { url: media.frameHero, caption: 'Canvas workspace overview' },
      { url: media.frameCanvas, caption: 'Live multi-user critique mode' },
      { url: media.frameLayers, caption: 'DOM element inspector panel' }
    ],
    nextProjectId: 'mono'
  },
  {
    id: 'mono',
    slug: 'mono',
    number: '04',
    title: 'Mono',
    category: 'frontend',
    categoryLabel: 'Frontend · Web Design',
    year: 2025,
    role: 'Web Design · Frontend Development',
    summary: 'An interactive variable font specimen tester and archive.',
    heroImage: media.monoHero,
    overview: 'Mono is a digital specimen platform built for contemporary type designers to test variable font axes (weight, slant, optical size) and preview glyph kerning in real time.',
    problem: 'Most type foundry websites are either static PDFs or heavy flash-like apps that lag on mobile devices and take seconds to load.',
    approach: 'I built a lightweight, hardware-accelerated text tester using native CSS font-variation-settings that renders 120 FPS font deformations with a total bundle size under 50KB.',
    receipt: [
      { count: '14', label: 'Axis Controllers' },
      { count: '48KB', label: 'Total JS Bundle' },
      { count: '0', label: 'Heavy 3D Libraries' }
    ],
    decisionLogs: [
      {
        id: 'native-css-vs-canvas',
        title: 'Font Rendering Engine Selection',
        optionsConsidered: [
          {
            label: 'Option A: Heavy WebGL / Canvas Mesh',
            description: 'Allowed extreme warp effects but added 600KB to bundle size and broke native text selection/copying.'
          }
        ],
        finalDecision: 'Final Direction: Pure CSS font-variation-settings on DOM Elements',
        rationale: 'CSS variable font properties are accelerated by the GPU natively, preserve 100% text accessibility and copy-pasting, and require zero external runtime libraries.',
        tag: 'Performance Architecture'
      }
    ],
    designToCode: {
      figmaNotes: 'Designed typography test sheets with strict modular scales (12px to 96px).',
      codeSnippet: {
        filename: 'engine/FontAxisSlider.tsx',
        language: 'tsx',
        code: `export const applyAxis = (el: HTMLElement, weight: number, slant: number) => {
  el.style.fontVariationSettings = \`'wght' \${weight}, 'slnt' \${slant}\`;
};`
      },
      responsiveDetails: 'Sliders automatically switch to compact bottom controls on mobile viewports so the specimen text remains visible while adjusting values.'
    },
    sections: [
      {
        title: 'Real-Time Glyphs in Motion',
        subtitle: 'Sub-50KB font tester',
        description: [
          'Users can type custom text strings, toggle OpenType stylistic alternates, and export clean SVG outlines directly from the browser.'
        ],
        image: media.monoPrint,
        caption: 'Interactive specimen tester with live axis sliders.'
      }
    ],
    gallery: [
      { url: media.monoHero, caption: 'High-contrast typography tester' },
      { url: media.monoPrint, caption: 'Print-ready specimen sheet export' }
    ],
    nextProjectId: 'nova'
  }
];
