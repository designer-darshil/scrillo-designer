import React, { useState } from 'react';
import {
  Palette,
  Type,
  Maximize2,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Eye,
  Sliders,
  Terminal,
  MousePointer,
  Bell,
  Box,
} from 'lucide-react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Search,
  Checkbox,
  Radio,
  Toggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Badge,
  Alert,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  EmptyState,
  Skeleton,
  Avatar,
  AvatarGroup,
  useToast,
  checkContrast,
  CORE_TOKEN_PAIRS,
} from '../../design-system';

export const DesignSystemDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form Playground States
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('opt1');
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonLoading, setButtonLoading] = useState(false);

  const toast = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const triggerLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-[var(--admin-content-max-width)] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-tertiary)]">
              Production Design System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Design System & Living Component Library
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            The single source of truth for design tokens, accessible primitives, WCAG 2.1 AA validation,
            and shared component architecture across Public Portfolio and Admin Panel.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="success" size="md" dot>
            WCAG 2.1 AA Certified
          </Badge>
          <Badge variant="neutral" size="md">
            v1.0.0
          </Badge>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList ariaLabel="Design System Sections">
          <Tab value="overview" icon={<Layers className="w-3.5 h-3.5" />}>
            Overview & Architecture
          </Tab>
          <Tab value="contrast" icon={<Palette className="w-3.5 h-3.5" />}>
            Tokens & WCAG Contrast
          </Tab>
          <Tab value="typography" icon={<Type className="w-3.5 h-3.5" />}>
            Typography Scale
          </Tab>
          <Tab value="components" icon={<Box className="w-3.5 h-3.5" />}>
            Component Matrix
          </Tab>
          <Tab value="guidelines" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            DO / DON'T Guidelines
          </Tab>
        </TabList>

        {/* 1. OVERVIEW TAB */}
        <TabPanel value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)] flex items-center justify-center mb-2">
                  <Palette className="w-4 h-4" />
                </div>
                <CardTitle>Unified Tokens</CardTitle>
                <CardDescription>
                  Semantic CSS variables for background, text, borders, actions, spacing (4px grid), and motion.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <CardTitle>Strict Accessibility</CardTitle>
                <CardDescription>
                  Every color token pair meets WCAG 2.1 AA (4.5:1 text, 3:1 UI). Full keyboard traps, ARIA roles, and visible focus rings.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)] flex items-center justify-center mb-2">
                  <Sliders className="w-4 h-4" />
                </div>
                <CardTitle>Dual Context Synergy</CardTitle>
                <CardDescription>
                  Drives both the creative editorial Public Website and the high-efficiency Admin Panel through one codebase.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Quick interactive test alert */}
          <Alert variant="info" title="Living Documentation Note">
            This page provides an interactive testing ground. You can click, tab, focus, and toggle components in real-time.
            Switch between Dark and Light mode using the theme toggle in the header to inspect reactive token adaptation.
          </Alert>
        </TabPanel>

        {/* 2. TOKENS & CONTRAST VALIDATION TAB */}
        <TabPanel value="contrast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated WCAG 2.1 AA Contrast Validation Table</CardTitle>
              <CardDescription>
                Live calculation of foreground/background luminance and contrast ratio against WCAG thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token Pair / Usage</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Foreground Hex</TableHead>
                    <TableHead>Background Hex</TableHead>
                    <TableHead>Contrast Ratio</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>WCAG Status</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CORE_TOKEN_PAIRS.map((pair, idx) => {
                    const result = checkContrast(pair.fgHex, pair.bgHex);
                    const passes = result.ratio >= pair.minRatio;

                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-xs text-[var(--color-text-primary)]">{pair.name}</p>
                            <p className="text-[11px] text-[var(--color-text-tertiary)] font-mono mt-0.5">{pair.usage}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pair.theme === 'dark' ? 'neutral' : 'info'} size="sm">
                            {pair.theme.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => handleCopy(pair.fgHex)}
                            className="font-mono text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1"
                            title="Click to copy hex"
                          >
                            <span>{pair.fgHex}</span>
                            {copiedToken === pair.fgHex ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-40" />}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => handleCopy(pair.bgHex)}
                            className="font-mono text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1"
                            title="Click to copy hex"
                          >
                            <span>{pair.bgHex}</span>
                            {copiedToken === pair.bgHex ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-40" />}
                          </button>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-bold text-xs">{result.ratioFormatted}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-[var(--color-text-tertiary)]">&ge; {pair.minRatio}:1</span>
                        </TableCell>
                        <TableCell>
                          {passes ? (
                            <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                              {result.score} PASS
                            </Badge>
                          ) : (
                            <Badge variant="error" size="sm" icon={<XCircle className="w-3 h-3" />}>
                              FAIL
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className="px-2.5 py-1 rounded-md text-xs font-medium border"
                            style={{
                              backgroundColor: pair.bgHex,
                              color: pair.fgHex,
                              borderColor: pair.theme === 'dark' ? '#333' : '#CCC',
                            }}
                          >
                            Aa Preview
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabPanel>

        {/* 3. TYPOGRAPHY TAB */}
        <TabPanel value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scales & Specifications</CardTitle>
              <CardDescription>
                Dual typography scales: fluid high-impact editorial typography for public display, and clean scanable styles for admin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Public Editorial Display */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-tertiary)] mb-4 border-b border-[var(--color-border-subtle)] pb-2">
                  Public Website Scale (Fluid Clamped)
                </h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block mb-1">
                      .text-display (clamp(3.5rem, 8vw, 9rem) / Bold / -0.055em)
                    </span>
                    <p className="text-display">SELECTED WORKS</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block mb-1">
                      .text-heading-section (clamp(2.5rem, 6.5vw, 7rem) / Bold / -0.04em)
                    </span>
                    <p className="text-heading-section">DISCIPLINE & CRAFT</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block mb-1">
                      .text-heading-project (clamp(1.75rem, 4.5vw, 5rem) / Semibold / -0.025em)
                    </span>
                    <p className="text-heading-project">FINANCE DASHBOARD AI</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block mb-1">
                      .text-body-editorial (clamp(1.125rem, 1.25vw, 1.5rem) / Regular)
                    </span>
                    <p className="text-body-editorial">
                      Designing digital experiences that bridge high-impact editorial storytelling with robust functional systems.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block mb-1">
                      .text-metadata (.text-meta / JetBrains Mono / 0.14em tracking)
                    </span>
                    <p className="text-metadata">01 // CREATIVE DIRECTION & SYSTEM DESIGN [2026]</p>
                  </div>
                </div>
              </div>

              {/* Admin Scales */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-tertiary)] mb-4 border-b border-[var(--color-border-subtle)] pb-2">
                  Admin Panel Scale (Clean & Structured)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin H1 Heading (28px)</h1>
                    <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">Page Titles</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Admin H2 Section Heading (20px)</h2>
                    <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">Section Headers</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Admin H3 Subsection / Card Title (14px)</h3>
                    <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">Card Titles</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
                    <p className="text-sm text-[var(--color-text-secondary)]">Admin Body Text (14px / Regular)</p>
                    <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">Standard Body</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
                    <p className="text-xs text-[var(--color-text-tertiary)] font-mono">Admin Caption & Meta (12px / JetBrains Mono)</p>
                    <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">Helper & Timestamps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        {/* 4. COMPONENT MATRIX TAB */}
        <TabPanel value="components" className="space-y-8">
          {/* Buttons Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Actions</CardTitle>
              <CardDescription>
                Primary, secondary, destructive, icon, sizes, and accessible loading/disabled states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="md">
                  Primary Action
                </Button>
                <Button variant="secondary" size="md">
                  Secondary Action
                </Button>
                <Button variant="tertiary" size="md">
                  Tertiary Link
                </Button>
                <Button variant="destructive" size="md">
                  Destructive
                </Button>
                <Button variant="primary" size="md" loading={buttonLoading} onClick={triggerLoading}>
                  Click to Test Loading
                </Button>
                <Button variant="primary" size="md" disabled>
                  Disabled
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
                <span className="text-xs text-[var(--color-text-tertiary)] mr-2">Sizes:</span>
                <Button variant="secondary" size="sm">
                  Small (sm)
                </Button>
                <Button variant="secondary" size="md">
                  Medium (md)
                </Button>
                <Button variant="secondary" size="lg">
                  Large (lg)
                </Button>
                <Button variant="icon" size="md" aria-label="Settings Demo">
                  <Sliders className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Controls Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
              <CardDescription>
                Input, Textarea, Select, Search, Checkbox, Radio, and Toggle with full ARIA state tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Project Title"
                  placeholder="e.g. Next-Gen Fintech App"
                  helperText="Enter a descriptive project name."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={inputError ? 'Title is required and must not be empty.' : undefined}
                />

                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setInputError(!inputError)}
                  className="text-xs"
                >
                  {inputError ? 'Clear Input Error State' : 'Simulate Input Error State'}
                </Button>

                <Search placeholder="Search media or projects..." />

                <Select
                  label="Project Category"
                  helperText="Select the primary discipline category."
                  options={[
                    { value: 'uiux', label: 'UI/UX Design' },
                    { value: 'web', label: 'Web Development' },
                    { value: 'brand', label: 'Brand Identity' },
                  ]}
                />
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Project Narrative"
                  placeholder="Describe the challenge, methodology, and results..."
                  rows={3}
                />

                <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)] space-y-4">
                  <Toggle
                    checked={toggleState}
                    onChange={setToggleState}
                    label="Public Visibility"
                    helperText="Control whether this section appears on the live website."
                  />

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-2">
                    <Checkbox
                      checked={checkboxState}
                      onChange={(e) => setCheckboxState(e.target.checked)}
                      label="Feature in Selected Works"
                      helperText="Plaque prominently in the primary portfolio showcase."
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center gap-4">
                    <Radio
                      name="demo-radio"
                      checked={radioState === 'opt1'}
                      onChange={() => setRadioState('opt1')}
                      label="Draft Mode"
                    />
                    <Radio
                      name="demo-radio"
                      checked={radioState === 'opt2'}
                      onChange={() => setRadioState('opt2')}
                      label="Live Published"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal, Dropdown & Tooltip Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Overlays & Menus</CardTitle>
              <CardDescription>
                Accessible dialogs with focus trapping, floating dropdowns, and accessible tooltips.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => {
                  setModalSize('md');
                  setIsModalOpen(true);
                }}
              >
                Open Test Dialog
              </Button>

              <Dropdown
                trigger={
                  <Button variant="secondary" icon={<Sliders className="w-4 h-4" />}>
                    Options Menu
                  </Button>
                }
              >
                <DropdownItem onClick={() => toast.info('Clicked View Analytics')}>View Analytics</DropdownItem>
                <DropdownItem onClick={() => toast.success('Duplicated item')}>Duplicate Project</DropdownItem>
                <DropdownDivider />
                <DropdownItem destructive onClick={() => toast.error('Item deleted')}>
                  Delete Item
                </DropdownItem>
              </Dropdown>

              <Tooltip content="Provides auxiliary help description for keyboard & mouse users">
                <Button variant="secondary" icon={<HelpCircle className="w-4 h-4" />}>
                  Hover / Focus Tooltip
                </Button>
              </Tooltip>

              <div className="flex items-center gap-2 pl-4 border-l border-[var(--color-border-subtle)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.success('Changes saved successfully!')}
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.error('Failed to sync changes with server.')}
                >
                  Trigger Error Toast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges, Alerts, Avatars & Empty States */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Alerts</CardTitle>
                <CardDescription>Semantic status indicators paired with labels and icons.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">Neutral</Badge>
                  <Badge variant="success" dot>
                    Published
                  </Badge>
                  <Badge variant="warning" dot>
                    Pending Review
                  </Badge>
                  <Badge variant="error" dot>
                    Rejected
                  </Badge>
                  <Badge variant="info">Info Badge</Badge>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Alert variant="success" title="Draft Synced">
                    All modified records are ready for deployment.
                  </Alert>
                  <Alert variant="warning" title="Unsaved Revisions">
                    You have 3 unpublished changes pending review.
                  </Alert>
                  <Alert variant="error" title="Authentication Token Expired">
                    Please refresh your credentials to continue editing.
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avatars, Skeletons & Empty State</CardTitle>
                <CardDescription>Placeholders, user identities, and empty views.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name="Darshil Bhuva" size="lg" status="online" />
                  <Avatar name="Sarah Jenkins" size="md" status="busy" />
                  <Avatar name="Alex Rivera" size="sm" status="away" />
                  <AvatarGroup max={3}>
                    <Avatar name="Darshil Bhuva" />
                    <Avatar name="Sarah Jenkins" />
                    <Avatar name="Alex Rivera" />
                    <Avatar name="Elena Rostova" />
                    <Avatar name="Marcus Vance" />
                  </AvatarGroup>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-2">
                  <span className="text-xs text-[var(--color-text-tertiary)] block">Skeleton Loading States:</span>
                  <Skeleton variant="text" lines={2} />
                  <div className="flex items-center gap-3">
                    <Skeleton variant="avatar" width={32} height={32} />
                    <Skeleton variant="text" width="60%" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)]">
                  <EmptyState
                    title="No Items Found"
                    description="Get started by creating your first showcase project or media asset."
                    primaryAction={
                      <Button variant="primary" size="sm">
                        Create Project
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table & Pagination Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Data Table & Pagination</CardTitle>
              <CardDescription>Structured tabular records with selection, sorting, and responsive pagination.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow interactive>
                    <TableCell className="font-semibold">Next-Gen Fintech App</TableCell>
                    <TableCell>UI/UX Design</TableCell>
                    <TableCell className="font-mono">2026</TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm" dot>
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow interactive>
                    <TableCell className="font-semibold">Spatial Audio Experience</TableCell>
                    <TableCell>Product Strategy</TableCell>
                    <TableCell className="font-mono">2025</TableCell>
                    <TableCell>
                      <Badge variant="warning" size="sm" dot>
                        Draft
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </CardContent>
          </Card>
        </TabPanel>

        {/* 5. GUIDELINES TAB */}
        <TabPanel value="guidelines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-[var(--color-status-success-border)] bg-[var(--color-status-success-bg)]/10">
              <CardHeader>
                <div className="flex items-center gap-2 text-[var(--color-status-success-text)]">
                  <CheckCircle2 className="w-5 h-5" />
                  <CardTitle className="text-[var(--color-status-success-text)]">DO Rules</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <p>✓ <strong>Always consume semantic tokens</strong> (<code className="font-mono">var(--color-text-primary)</code>, <code className="font-mono">var(--spacing-4)</code>) rather than hardcoded hex codes.</p>
                <p>✓ <strong>Ensure all interactive controls</strong> have visible focus rings (<code className="font-mono">:focus-visible</code>).</p>
                <p>✓ <strong>Pair status colors with text labels or icons</strong> (never communicate state using color alone).</p>
                <p>✓ <strong>Enforce keyboard navigation</strong> on all custom overlays, dropdowns, tabs, and modals.</p>
                <p>✓ <strong>Respect user motion preference</strong> via <code className="font-mono">prefers-reduced-motion</code> overrides.</p>
                <p>✓ <strong>Use semantic HTML elements</strong> (<code className="font-mono">&lt;button&gt;</code>, <code className="font-mono">&lt;nav&gt;</code>, <code className="font-mono">&lt;table&gt;</code>, <code className="font-mono">&lt;label&gt;</code>).</p>
              </CardContent>
            </Card>

            <Card className="border-[var(--color-status-error-border)] bg-[var(--color-status-error-bg)]/10">
              <CardHeader>
                <div className="flex items-center gap-2 text-[var(--color-status-error-text)]">
                  <XCircle className="w-5 h-5" />
                  <CardTitle className="text-[var(--color-status-error-text)]">DON'T Rules</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <p>✕ <strong>Do NOT hardcode arbitrary colors</strong> (<code className="font-mono">#121212</code>, <code className="font-mono">#e5e5e5</code>) directly in components.</p>
                <p>✕ <strong>Do NOT use divs or spans as interactive buttons</strong> without keyboard handlers and ARIA button roles.</p>
                <p>✕ <strong>Do NOT create forms without explicit <code className="font-mono">&lt;label&gt;</code> tags</strong> (relying only on placeholders fails WCAG).</p>
                <p>✕ <strong>Do NOT use low-contrast text combinations</strong> that fail the 4.5:1 WCAG AA threshold.</p>
                <p>✕ <strong>Do NOT animate every interaction</strong> or run infinite pulse animations when reduced motion is requested.</p>
                <p>✕ <strong>Do NOT invent ad-hoc border radii or shadows</strong> outside the design token scale.</p>
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </Tabs>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Interactive Dialog Demo"
        description="Demonstrates accessible focus trap, ESC closing, and semantic body/footer structure."
        size={modalSize}
      >
        <ModalBody>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            This dialog implements a complete focus trap. When pressing <kbd className="px-1 py-0.5 rounded bg-[var(--color-background-primary)] border font-mono">Tab</kbd>, focus cycles strictly within this window. Pressing <kbd className="px-1 py-0.5 rounded bg-[var(--color-background-primary)] border font-mono">Escape</kbd> closes the dialog and smoothly returns keyboard focus to the triggering element.
          </p>

          <Input
            label="Sample Modal Field"
            placeholder="Focus is captured here automatically"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsModalOpen(false);
              toast.success('Action executed inside dialog');
            }}
          >
            Confirm Action
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DesignSystemDocs;
