export type ProjectCategory = 
  | 'all'
  | 'product'
  | 'web-design'
  | 'frontend';

export interface ProjectReceiptItem {
  count: string;
  label: string;
}

export interface DecisionLogItem {
  id: string;
  title: string;
  optionsConsidered: {
    label: string;
    description: string;
  }[];
  finalDecision: string;
  rationale: string;
  tag?: string;
}

export interface DesignToCodeComparison {
  figmaNotes: string;
  codeSnippet: {
    filename: string;
    language: string;
    code: string;
  };
  responsiveDetails: string;
}

export interface CaseStudySectionData {
  title: string;
  subtitle?: string;
  description: string[];
  bulletPoints?: string[];
  image?: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: number;
  role: string;
  summary: string;
  heroImage: string;
  overview: string;
  problem: string;
  approach: string;
  receipt: ProjectReceiptItem[];
  decisionLogs: DecisionLogItem[];
  designToCode: DesignToCodeComparison;
  sections: CaseStudySectionData[];
  gallery: { url: string; caption: string }[];
  nextProjectId: string;
}

export interface ExperimentItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  demoType: 'spring-physics' | 'variable-font' | 'css-3d-tilt' | 'palette-mixer';
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  context: string;
  description: string;
  focus: string[];
}
