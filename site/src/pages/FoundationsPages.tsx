import { useState } from 'react';
import {
  Badge,
  Button,
  FactList,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  PageHeader,
  RecordTableHeader,
  SegmentedControl,
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableScrollRegion,
  WorkspaceSection,
  WorkspaceStack,
} from '@phantasywind/nidec-app-ui-design';
import { CodeBlock, CopyButton } from '../components/DocPrimitives';
import {
  COLOR_TOKENS,
  CONTRAST_CHECKS,
  DATE_PICKER_VERSION,
  FLUENT_VERSION,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  REACT_PEER_RANGE,
  RADIUS_TOKENS,
  REPO_URL,
  SPACING_TOKENS,
  TYPE_FAMILIES,
  TYPE_STYLES,
  type ColorTokenCategory,
} from '../data/metadata';

const NPMRC_SNIPPET = `@phantasywind:registry=https://npm.pkg.github.com
save-exact=true`;

const INSTALL_SNIPPET = `# Core package and exact Fluent peer
npm install --save-exact ${PACKAGE_NAME}@${PACKAGE_VERSION} @fluentui/react-components@${FLUENT_VERSION}

# Add only when consuming ${PACKAGE_NAME}/date-picker
npm install --save-exact @fluentui/react-datepicker-compat@${DATE_PICKER_VERSION}`;

const AUTH_SNIPPET = `# User-level ~/.npmrc (never commit tokens into a repository)
//npm.pkg.github.com/:_authToken=\${GITHUB_PACKAGES_TOKEN}

# Verify exact versions and single React / Fluent resolution
npm ls ${PACKAGE_NAME} @fluentui/react-components react react-dom`;

const QUICKSTART_SNIPPET = `import {
  NidecProvider,
  nidecLightTheme,
  PageHeader,
  WorkspaceSection,
  FormGrid,
  Field,
  Input,
  Button,
} from '${PACKAGE_NAME}';
import '${PACKAGE_NAME}/styles.css';

export function App() {
  return (
    <NidecProvider theme={nidecLightTheme}>
      <PageHeader
        title="Record details"
        description="Every application wraps its root in NidecProvider with nidecLightTheme."
      />
      <WorkspaceSection title="General information">
        <form onSubmit={(event) => event.preventDefault()}>
          <FormGrid columns={2}>
            <Field label="Record name" required>
              <Input placeholder="Enter name" />
            </Field>
            <Field label="Reference code">
              <Input placeholder="REC-1042" />
            </Field>
          </FormGrid>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <Button type="submit" appearance="primary">Save</Button>
            <Button appearance="attention">Return</Button>
            <Button>Cancel</Button>
          </div>
        </form>
      </WorkspaceSection>
    </NidecProvider>
  );
}`;

const WIDTH_CSS_SNIPPET = `/* Application-owned layout containers (do not override internal control skins) */
.form-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacingVerticalM) var(--spacingHorizontalL);
  width: 48rem;
  max-width: 100%;
  min-width: 0;
}
.short-field { width: 16rem; max-width: 100%; min-width: 0; justify-self: start; }
.number-field { width: 12rem; max-width: 100%; min-width: 0; justify-self: start; }
@media (max-width: 720px) {
  .form-columns { grid-template-columns: minmax(0, 1fr); }
}`;

export function OverviewPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="site-page">
      <PageHeader
        eyebrow="Shared Engineering UI Foundation"
        title="Nidec Engineering Design System"
        titleAdornment={
          <Badge appearance="tint" color="brand">
            v{PACKAGE_VERSION}
          </Badge>
        }
        description="Versioned tokens, governed Fluent UI React components, page layouts, and interactive specifications so every Nidec application ships with one consistent interface."
        actions={
          <div className="demo-row">
            <Button onClick={() => onNavigate('tokens')}>Browse tokens</Button>
            <Button appearance="primary" onClick={() => onNavigate('install')}>
              Install &amp; usage guide
            </Button>
          </div>
        }
      />

      <div className="site-card-grid">
        <div className="site-metric-card">
          <span className="site-metric-card__value">v{PACKAGE_VERSION}</span>
          <span className="site-metric-card__label">Immutable npm package</span>
          <span className="site-metric-card__desc">
            Published via GitHub Packages with matching GitHub Release tarball and SHA-256 verification.
          </span>
        </div>
        <div className="site-metric-card">
          <span className="site-metric-card__value">3 entries</span>
          <span className="site-metric-card__label">Explicit public surface</span>
          <span className="site-metric-card__desc">
            Root components (<code className="site-inline-code">.</code>), page layouts (<code className="site-inline-code">/layouts</code>), and isolated date picker (<code className="site-inline-code">/date-picker</code>).
          </span>
        </div>
        <div className="site-metric-card">
          <span className="site-metric-card__value">17 roles</span>
          <span className="site-metric-card__label">ADR-0006 light palette</span>
          <span className="site-metric-card__desc">
            Single governed light theme with automated WCAG contrast verification. Dark mode is out of scope.
          </span>
        </div>
        <div className="site-metric-card">
          <span className="site-metric-card__value">Fluent {FLUENT_VERSION}</span>
          <span className="site-metric-card__label">Pinned peer foundation</span>
          <span className="site-metric-card__desc">
            React {REACT_PEER_RANGE} and exact Fluent v9 peer contract prevent duplicate runtime instances.
          </span>
        </div>
      </div>

      <WorkspaceStack>
        <WorkspaceSection
          title="Start here"
          description="Use this dictionary to install the exact shared package, verify visual tokens, choose the right page archetype, and inspect live component behavior."
        >
          <div className="site-card-grid">
            <a
              className="site-quick-link-card"
              href="#/install"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('install');
              }}
            >
              <div>
                <h3 className="site-quick-link-card__title">1. Install &amp; Usage Guide</h3>
                <p className="site-quick-link-card__desc">
                  Configure GitHub Packages, pin exact versions, wrap with NidecProvider, and retire legacy CSS skins.
                </p>
              </div>
              <span className="site-quick-link-card__cta">Read adoption guide →</span>
            </a>

            <a
              className="site-quick-link-card"
              href="#/tokens"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('tokens');
              }}
            >
              <div>
                <h3 className="site-quick-link-card__title">2. Design Tokens</h3>
                <p className="site-quick-link-card__desc">
                  Inspect all governed light-theme color roles, contrast ratios, Fluent typography roles, spacing, and radii.
                </p>
              </div>
              <span className="site-quick-link-card__cta">Inspect tokens →</span>
            </a>

            <a
              className="site-quick-link-card"
              href="#/components/button"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('components/button');
              }}
            >
              <div>
                <h3 className="site-quick-link-card__title">3. Component Dictionary</h3>
                <p className="site-quick-link-card__desc">
                  Test live buttons, forms, drawers, editable grids, and process flows with Props tables and Do/Don&apos;t rules.
                </p>
              </div>
              <span className="site-quick-link-card__cta">Explore components →</span>
            </a>

            <a
              className="site-quick-link-card"
              href="#/examples/directory"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('examples/directory');
              }}
            >
              <div>
                <h3 className="site-quick-link-card__title">4. Workspace Examples</h3>
                <p className="site-quick-link-card__desc">
                  Interact with complete page archetypes: Directory, Form, Master Data, Record Workspace, Governance, and Login.
                </p>
              </div>
              <span className="site-quick-link-card__cta">Open examples →</span>
            </a>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title={`What's new in ${PACKAGE_VERSION}`}
          description="Key capabilities and breaking changes introduced in version 0.3.0 relative to 0.2.0."
        >
          <div className="demo-stack">
            <MessageBar intent="info">
              <MessageBarBody>
                <MessageBarTitle>Breaking changes in {PACKAGE_VERSION}</MessageBarTitle>
                <code className="site-inline-code">Button</code> accepts only <code className="site-inline-code">primary</code>,{' '}
                <code className="site-inline-code">attention</code> (amber), and <code className="site-inline-code">secondary</code>;{' '}
                <code className="site-inline-code">ToggleButton</code>, <code className="site-inline-code">MenuButton</code>, and{' '}
                <code className="site-inline-code">SplitButton</code> are removed. <code className="site-inline-code">LiteEditableGrid</code>{' '}
                now defaults <code className="site-inline-code">rowHeight</code> to <code className="site-inline-code">&apos;auto&apos;</code>{' '}
                (pass <code className="site-inline-code">32</code>/<code className="site-inline-code">40</code>/<code className="site-inline-code">48</code> for virtual scrolling).
              </MessageBarBody>
            </MessageBar>
            <FactList
              facts={[
                { label: 'Three button types', value: 'primary, attention (amber #e08a00), and secondary (default) with disabledReason support' },
                { label: 'Two lightweight editable grids', value: 'LiteEditableGrid (cell edit + optional groups) and LiteRowEditGrid (row edit + virtual scrolling)' },
                { label: 'Form & record helpers', value: 'FormGrid, BusinessNumberInput, formatCurrency, ChangeHistoryTable, UnsavedChangesProvider, StickySaveBar' },
                { label: 'Table viewport & patterns', value: 'TableScrollRegion (pinnedScrollbar, maxHeight, frozenColumns), TruncatedText, MatrixCellButton, RecordLink, EmptyState, MoreActionsMenu' },
                { label: 'Rollback baseline', value: '0.2.0 remains an immutable published release' },
                {
                  label: 'Release archive & docs',
                  value: (
                    <Link inline href={`${REPO_URL}/releases/tag/v${PACKAGE_VERSION}`} target="_blank" rel="noreferrer">
                      GitHub Release v{PACKAGE_VERSION}
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title="Responsibility boundary"
          description="What this shared package governs versus what remains owned by each adopting Nidec application."
        >
          <TableScrollRegion aria-label="Responsibility matrix">
            <Table aria-label="Responsibility matrix">
              <RecordTableHeader>
                <TableRow>
                  <TableHeaderCell style={{ minWidth: 200 }}>Area</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 240 }}>Design System package</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 260 }}>Adopting application</TableHeaderCell>
                </TableRow>
              </RecordTableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Tokens, components &amp; layouts</TableCell>
                  <TableCell>Owns light theme, Fluent wrappers, scoped CSS, and responsive layout structure</TableCell>
                  <TableCell>Consumes exact pinned version and removes conflicting legacy skins</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business workflows &amp; RBAC</TableCell>
                  <TableCell>Never embeds domain state machines, roles, or API calls</TableCell>
                  <TableCell>Owns routes, permissions, API contracts, validation, persistence, and state transitions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Versioning &amp; acceptance</TableCell>
                  <TableCell>Publishes immutable versions with release tarball and SHA-256 evidence</TableCell>
                  <TableCell>Pins exact version in lockfile and completes independent application acceptance</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollRegion>
        </WorkspaceSection>
      </WorkspaceStack>
    </div>
  );
}

export function InstallUsagePage() {
  return (
    <div className="site-page">
      <PageHeader
        eyebrow="Adoption & Integration Manual"
        title="Install & Usage Guide"
        titleAdornment={
          <Badge appearance="tint" color="brand">
            {PACKAGE_NAME}@{PACKAGE_VERSION}
          </Badge>
        }
        description="Standardized instructions for downloading, configuring, initializing, and upgrading the shared Nidec Design System package across all adopting applications."
      />

      <WorkspaceStack>
        <WorkspaceSection
          title="1. Registry & authentication setup"
          description="The package is distributed through GitHub Packages. Always configure the registry scope and keep authentication tokens out of source control."
        >
          <div className="demo-stack">
            <MessageBar intent="warning">
              <MessageBarBody>
                <MessageBarTitle>Authentication required for GitHub Packages</MessageBarTitle>
                Even though the source repository is public, npm requires a GitHub Personal Access Token (or CI <code className="site-inline-code">GITHUB_TOKEN</code>) with{' '}
                <code className="site-inline-code">read:packages</code> scope to download packages from <code className="site-inline-code">https://npm.pkg.github.com</code>. Store credentials only in your user-level <code className="site-inline-code">~/.npmrc</code> or CI secrets — never commit tokens into the repository.
              </MessageBarBody>
            </MessageBar>
            <CodeBlock label="Project .npmrc (commit to consumer repo)" code={NPMRC_SNIPPET} />
            <CodeBlock label="User-level ~/.npmrc & verification" code={AUTH_SNIPPET} />
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title="2. Install exact pinned versions"
          description="Exact-version pinning is mandatory. Ranges (^, ~), latest, Git URLs, and direct references to main are prohibited."
        >
          <div className="demo-stack">
            <CodeBlock label="Shell (npm)" code={INSTALL_SNIPPET} />
            <TableScrollRegion aria-label="Pinned peer dependencies">
              <Table aria-label="Pinned peer dependencies">
                <RecordTableHeader>
                  <TableRow>
                    <TableHeaderCell style={{ minWidth: 260 }}>Package</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 140 }}>Required version</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 280 }}>Notes</TableHeaderCell>
                  </TableRow>
                </RecordTableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><code className="site-inline-code">{PACKAGE_NAME}</code></TableCell>
                    <TableCell><code className="site-inline-code">{PACKAGE_VERSION}</code></TableCell>
                    <TableCell>Core design system package (exact pin; commit lockfile).</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code className="site-inline-code">@fluentui/react-components</code></TableCell>
                    <TableCell><code className="site-inline-code">{FLUENT_VERSION}</code></TableCell>
                    <TableCell>Required exact peer for all React consumers; optional only for token-only CSS consumers.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code className="site-inline-code">@fluentui/react-datepicker-compat</code></TableCell>
                    <TableCell><code className="site-inline-code">{DATE_PICKER_VERSION}</code></TableCell>
                    <TableCell>Install only when importing from <code className="site-inline-code">/date-picker</code>.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code className="site-inline-code">react</code> &amp; <code className="site-inline-code">react-dom</code></TableCell>
                    <TableCell><code className="site-inline-code">{REACT_PEER_RANGE}</code></TableCell>
                    <TableCell>Use one matching exact React / ReactDOM 19.2.x pair across the application.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableScrollRegion>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title="3. Public entrypoints"
          description="Import only from the documented public subpaths. Never import internal dist/ paths."
        >
          <TableScrollRegion aria-label="Public package entrypoints">
            <Table aria-label="Public package entrypoints">
              <RecordTableHeader>
                <TableRow>
                  <TableHeaderCell style={{ minWidth: 290 }}>Import path</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 320 }}>Provides</TableHeaderCell>
                </TableRow>
              </RecordTableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}</code></TableCell>
                  <TableCell>NidecProvider, nidecLightTheme, governed Nidec components, and re-exported Fluent UI primitives.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}/layouts</code></TableCell>
                  <TableCell>ApplicationFrame, ApplicationTopBar, ApplicationNavigation (+ Group/Item), AuthenticationLayout, DirectoryWorkspace, VersionedWorkspaceLayout.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}/date-picker</code></TableCell>
                  <TableCell>BusinessDatePicker, DatePicker, and timezone-free yyyy-MM-dd parsing/formatting helpers.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}/styles.css</code></TableCell>
                  <TableCell>Scoped component styles and light-theme tokens wrapped in <code className="site-inline-code">@layer nidec-ui</code>. Import once in your app root.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}/tokens.css</code></TableCell>
                  <TableCell>Framework-neutral CSS custom properties (<code className="site-inline-code">--nidec-ui-color-*</code>) for token-only consumers.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="site-inline-code">{PACKAGE_NAME}/tokens.json</code></TableCell>
                  <TableCell>Machine-readable JSON token export generated from ADR-0006 light palette.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollRegion>
        </WorkspaceSection>

        <WorkspaceSection
          title="4. Minimal application setup"
          description="Wrap the root tree in NidecProvider with nidecLightTheme and import styles.css once. Portals (Dialog, Drawer, Menu, Popover, Tooltip) inherit package scope automatically."
        >
          <CodeBlock label="App.tsx" code={QUICKSTART_SNIPPET} />
        </WorkspaceSection>

        <WorkspaceSection
          title="5. Width is not component size"
          description="Fluent size props (small / medium) control typography and control height, not horizontal width. Consumers own container widths."
        >
          <div className="demo-stack">
            <TableScrollRegion aria-label="Recommended container widths">
              <Table aria-label="Recommended container widths">
                <RecordTableHeader>
                  <TableRow>
                    <TableHeaderCell style={{ minWidth: 180 }}>Context</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 240 }}>Recommended composition</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 220 }}>Avoid</TableHeaderCell>
                  </TableRow>
                </RecordTableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Short code, date, short Dropdown</TableCell>
                    <TableCell>Bounded field, typically <code className="site-inline-code">16rem</code> with <code className="site-inline-code">max-width: 100%</code></TableCell>
                    <TableCell>Stretching across the full page</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quantity or unit value</TableCell>
                    <TableCell>Bounded field, typically <code className="site-inline-code">12rem</code></TableCell>
                    <TableCell>Page-wide numeric input</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name or long selection</TableCell>
                    <TableCell>Use <code className="site-inline-code">FormGrid</code> or bounded column up to <code className="site-inline-code">28rem</code></TableCell>
                    <TableCell>Fixed desktop widths that overflow narrow screens</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ordinary buttons</TableCell>
                    <TableCell>Content-sized inside a wrapping flex row (<code className="site-inline-code">gap: 8px</code>)</TableCell>
                    <TableCell><code className="site-inline-code">width: 100%</code> or <code className="site-inline-code">flex: 1</code> (except sign-in submit)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableScrollRegion>
            <CodeBlock label="Layout container CSS" code={WIDTH_CSS_SNIPPET} />
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title="6. Legacy UI migration & acceptance checklist"
          description="Installing the package does not complete migration. Follow these rules when replacing legacy controls region by region."
        >
          <div className="demo-stack">
            <ul className="site-bullet-list">
              <li>
                <strong>No mixed skins:</strong> Remove legacy backgrounds, borders, pseudo-elements, heights, and bold overrides from migrated regions. Never layer legacy CSS over Fluent controls.
              </li>
              <li>
                <strong>Class merging:</strong> Use <code className="site-inline-code">mergeClasses</code> from <code className="site-inline-code">@fluentui/react-components</code> or pass <code className="site-inline-code">className</code>. Do not target internal <code className="site-inline-code">nidec-ui-*</code> selectors.
              </li>
              <li>
                <strong>One module boundary:</strong> Do not nest bordered cards or elevation shadows inside an already bordered <code className="site-inline-code">WorkspaceSection</code>.
              </li>
              <li>
                <strong>Responsive &amp; keyboard checks:</strong> Verify actual rendered layouts at <code className="site-inline-code">1440px</code>, <code className="site-inline-code">1280px</code>, <code className="site-inline-code">900px</code>, and <code className="site-inline-code">720px</code>, plus Tab/Shift+Tab/Escape focus restoration on overlays.
              </li>
              <li>
                <strong>Rollback &amp; integrity:</strong> Keep the previous lockfile pin (for example <code className="site-inline-code">0.2.0</code>) as rollback point, and compare the installed tarball against the matching GitHub Release <code className="site-inline-code">SHA256SUMS.txt</code> on first adoption.
              </li>
            </ul>
            <MessageBar intent="info">
              <MessageBarBody>
                <MessageBarTitle>Built applications never contact GitHub at runtime</MessageBarTitle>
                The package bundles into your normal build output. Version-aligned release records and archives are published at{' '}
                <Link inline href={`${REPO_URL}/releases`} target="_blank" rel="noreferrer">
                  {REPO_URL}/releases
                </Link>.
              </MessageBarBody>
            </MessageBar>
          </div>
        </WorkspaceSection>
      </WorkspaceStack>
    </div>
  );
}

export function TokensPage() {
  const [category, setCategory] = useState<'all' | ColorTokenCategory>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const visibleColors = category === 'all' ? COLOR_TOKENS : COLOR_TOKENS.filter((t) => t.category === category);

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedToken(value);
      window.setTimeout(() => setCopiedToken(null), 1600);
    } catch {
      setCopiedToken(null);
    }
  };

  return (
    <div className="site-page">
      <PageHeader
        eyebrow="Visual Foundations (ADR-0006)"
        title="Design Tokens"
        titleAdornment={
          <Badge appearance="tint" color="success">
            Light theme only
          </Badge>
        }
        description="Governed color roles, WCAG contrast checks, Fluent typography roles, spacing rhythm, and border radii generated directly from tokens/nidec-light.tokens.json."
      />

      <WorkspaceStack>
        <WorkspaceSection
          title="Color palette"
          count={visibleColors.length}
          countLabel={`${visibleColors.length} color tokens`}
          description="Never hardcode raw hex values in application components. Consume nidecLightTheme or the --nidec-ui-color-* CSS variables."
          actions={
            <SegmentedControl
              aria-label="Filter color token category"
              size="small"
              value={category}
              onValueChange={(_, value) => setCategory(value as 'all' | ColorTokenCategory)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'brand', label: 'Brand' },
                { value: 'text', label: 'Text' },
                { value: 'surface', label: 'Surfaces & Borders' },
                { value: 'semantic', label: 'Semantic & Focus' },
              ]}
            />
          }
        >
          <div className="demo-stack">
            {copiedToken && (
              <MessageBar intent="success">
                <MessageBarBody>Copied <code className="site-inline-code">{copiedToken}</code> to clipboard.</MessageBarBody>
              </MessageBar>
            )}
            <div className="site-token-grid">
              {visibleColors.map((token) => (
                <article className="site-swatch-card" key={token.name}>
                  <div
                    className="site-swatch-card__color"
                    style={{
                      backgroundColor: token.cssVar ? `var(${token.cssVar})` : 'var(--nidec-ui-color-surface)',
                      color: token.isDarkFill ? 'var(--colorNeutralForegroundOnBrand)' : 'var(--nidec-ui-color-text)',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{token.name}</span>
                    <span style={{ fontFamily: 'var(--fontFamilyMonospace)', fontSize: 12 }}>
                      {token.contrastOnSurface.toFixed(2)}:1 on white
                    </span>
                  </div>
                  <div className="site-swatch-card__body">
                    <div className="site-swatch-card__title-row">
                      <span className="site-swatch-card__hex">{token.hex}</span>
                      <div className="demo-row">
                        <Button size="small" onClick={() => copyText(token.hex)}>
                          Hex
                        </Button>
                        {token.cssVar && (
                          <Button size="small" onClick={() => copyText(`var(${token.cssVar})`)}>
                            CSS var
                          </Button>
                        )}
                      </div>
                    </div>
                    {token.cssVar ? (
                      <code className="site-swatch-card__var">{token.cssVar}</code>
                    ) : (
                      <span className="demo-status-caption">Mapped to white on brand-strong fills</span>
                    )}
                    <p className="site-swatch-card__usage">{token.usage}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          title="Automated WCAG contrast checks"
          count={CONTRAST_CHECKS.length}
          description="Every required foreground/background token pair verified by the design system build."
        >
          <TableScrollRegion aria-label="Contrast verification checks">
            <Table aria-label="Contrast verification checks">
              <RecordTableHeader>
                <TableRow>
                  <TableHeaderCell style={{ minWidth: 140 }}>Foreground</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 140 }}>Background</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 110 }}>Minimum</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 110 }}>Actual</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 100 }}>Status</TableHeaderCell>
                </TableRow>
              </RecordTableHeader>
              <TableBody>
                {CONTRAST_CHECKS.map((check) => (
                  <TableRow key={`${check.fg}-${check.bg}`}>
                    <TableCell><code className="site-inline-code">{check.fg}</code></TableCell>
                    <TableCell><code className="site-inline-code">{check.bg}</code></TableCell>
                    <TableCell>{check.min.toFixed(1)}:1</TableCell>
                    <TableCell>{check.ratio.toFixed(2)}:1</TableCell>
                    <TableCell>
                      <Badge appearance="tint" color={check.pass ? 'success' : 'danger'}>
                        {check.pass ? 'Pass' : 'Fail'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollRegion>
        </WorkspaceSection>

        <WorkspaceSection
          title="Typography scale"
          description="Uses Fluent 9 font stacks and semantic type roles. No custom font files are shipped."
        >
          <div className="demo-stack">
            <FactList
              facts={[
                { label: 'Sans stack', value: <code className="site-inline-code">{TYPE_FAMILIES.sans}</code> },
                { label: 'Monospace stack', value: <code className="site-inline-code">{TYPE_FAMILIES.mono}</code> },
              ]}
            />
            <TableScrollRegion aria-label="Typography scale">
              <Table aria-label="Typography scale">
                <RecordTableHeader>
                  <TableRow>
                    <TableHeaderCell style={{ minWidth: 110 }}>Role</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 140 }}>Metrics</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 220 }}>Live sample</TableHeaderCell>
                    <TableHeaderCell style={{ minWidth: 240 }}>Usage</TableHeaderCell>
                  </TableRow>
                </RecordTableHeader>
                <TableBody>
                  {TYPE_STYLES.map((style) => (
                    <TableRow key={style.name}>
                      <TableCell><code className="site-inline-code">{style.name}</code></TableCell>
                      <TableCell>
                        {style.fontSize} / {style.lineHeight} · w{style.fontWeight}
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            fontSize: style.fontSize,
                            lineHeight: style.lineHeight,
                            fontWeight: style.fontWeight,
                          }}
                        >
                          Nidec UI Sample
                        </span>
                      </TableCell>
                      <TableCell>{style.usage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScrollRegion>
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Spacing scale" description="Fluent spacing rhythm applied across controls, fields, and modules.">
          <div className="site-ruler-list">
            {SPACING_TOKENS.map((token) => (
              <div className="site-ruler-row" key={token.name}>
                <code className="site-inline-code">{token.name}</code>
                <span>{token.value}</span>
                <div className="site-ruler-bar" style={{ width: token.value }} />
                <span className="demo-status-caption">{token.usage}</span>
              </div>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Border radius" description="Consistent corner geometry across chips, controls, cards, and capsules.">
          <div className="site-radius-grid">
            {RADIUS_TOKENS.map((token) => (
              <div className="site-radius-card" key={token.name}>
                <div className="site-radius-preview" style={{ borderRadius: token.value }} />
                <div className="demo-row--spread">
                  <code className="site-inline-code">{token.name}</code>
                  <CopyButton text={token.value} label={token.value} />
                </div>
                <span className="demo-status-caption">{token.usage}</span>
              </div>
            ))}
          </div>
        </WorkspaceSection>
      </WorkspaceStack>
    </div>
  );
}

const ARCHETYPES = [
  {
    question: 'Is the user starting an application session?',
    archetype: 'Authentication entry',
    layout: 'AuthenticationLayout',
    route: 'examples/authentication',
    rule: 'Centered bounded panel, visible field labels, one full-width primary submit. SSO/MFA stays app-owned.',
  },
  {
    question: 'Is the main task finding independent records that open elsewhere?',
    archetype: 'Directory / Work queue',
    layout: 'DirectoryWorkspace',
    route: 'examples/directory',
    rule: 'One primary identity Link per table row, or whole-card link in CardGallery; switching List/Card preserves query.',
  },
  {
    question: 'Is the main task creating or editing one record on its own page?',
    archetype: 'Complete entry form',
    layout: 'WorkspaceSection + FormGrid',
    route: 'examples/form',
    rule: 'Real <form>, fields grouped into titled sections, field errors inline, primary submit first at end of form.',
  },
  {
    question: 'Does selecting a row load an editor that stays on the same page?',
    archetype: 'Master data (Form + List)',
    layout: 'RecordManagementWorkspace + RecordSelectionDataGrid',
    route: 'examples/master-data',
    rule: 'Whole-row selection with plain text primary value (no Link, no Open button); guard unsaved changes on switch.',
  },
  {
    question: 'Does one record stay authoritative while the user moves among sections?',
    archetype: 'Record workspace',
    layout: 'RecordManagementWorkspace + StageNavigator',
    route: 'examples/record',
    rule: 'Optional right context rail (>900px) that reflows above primary content at <=900px without losing state.',
  },
  {
    question: 'Does one stable object advance through controlled governed versions?',
    archetype: 'Versioned governance',
    layout: 'VersionedWorkspaceLayout + BusinessProcessFlow',
    route: 'examples/governance',
    rule: 'Separate object identity, version, and status facts; BusinessProcessFlow only lets users inspect reached stages.',
  },
];

export function ArchetypesPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="site-page">
      <PageHeader
        eyebrow="Information Architecture"
        title="Page Archetypes & Layout Rules"
        description="Choose a page template by the user's primary task and row interaction semantics — not visual resemblance."
      />

      <WorkspaceStack>
        <WorkspaceSection
          title="Page selection decision matrix"
          description="Apply the first rule that matches your screen. Select an example link to inspect the live interactive layout."
        >
          <TableScrollRegion aria-label="Page archetype selection matrix">
            <Table aria-label="Page archetype selection matrix">
              <RecordTableHeader>
                <TableRow>
                  <TableHeaderCell style={{ minWidth: 230 }}>User task question</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 170 }}>Page archetype</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 210 }}>Layout components</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 240 }}>Key governance rule</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 110 }}>Example</TableHeaderCell>
                </TableRow>
              </RecordTableHeader>
              <TableBody>
                {ARCHETYPES.map((row) => (
                  <TableRow key={row.archetype}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell><strong>{row.archetype}</strong></TableCell>
                    <TableCell><code className="site-inline-code">{row.layout}</code></TableCell>
                    <TableCell>{row.rule}</TableCell>
                    <TableCell>
                      <Link
                        inline
                        href={`#/${row.route}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(row.route);
                        }}
                      >
                        Open demo
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollRegion>
        </WorkspaceSection>

        <WorkspaceSection title="Cross-cutting UI governance rules" description="Shared rules enforced across all Nidec applications.">
          <div className="site-guidelines-grid">
            <div className="site-guideline-card site-guideline-card--do">
              <h3 className="site-guideline-card__heading">Surfaces &amp; actions</h3>
              <ul className="site-bullet-list">
                <li>Forms and checklists opened over a page always use a Sheet (<code className="site-inline-code">FormDrawer</code>), never a centered <code className="site-inline-code">Dialog</code>.</li>
                <li>Centered <code className="site-inline-code">Dialog</code> is reserved for short confirmations, entering a reason, or reminders.</li>
                <li>Page-level actions go in <code className="site-inline-code">PageHeader</code> with at most one primary button placed last.</li>
                <li>Destructive commands live inside <code className="site-inline-code">MoreActionsMenu</code> followed by a confirmation Dialog.</li>
              </ul>
            </div>
            <div className="site-guideline-card site-guideline-card--do">
              <h3 className="site-guideline-card__heading">Tables, currency &amp; reflow</h3>
              <ul className="site-bullet-list">
                <li><strong>One column, one field:</strong> Never stack two fields (such as code over name) inside one table cell without separate approval.</li>
                <li><strong>Currency formatting:</strong> Use <code className="site-inline-code">formatCurrency(amount, currency)</code> — symbol + space for USD/CNY (<code className="site-inline-code">$ 100.00</code>, <code className="site-inline-code">¥ 1,250.50</code>), ISO code for others (<code className="site-inline-code">JPY 1,200</code>), right-aligned.</li>
                <li><strong>Editable tables:</strong> Choose <code className="site-inline-code">LiteEditableGrid</code> (cell edit, default auto rowHeight) or <code className="site-inline-code">LiteRowEditGrid</code> (row edit, virtualized).</li>
                <li><strong>Responsive reflow:</strong> Moving regions at 900px / 720px must never reset route, filters, selection, or unsaved edits.</li>
              </ul>
            </div>
          </div>
        </WorkspaceSection>
      </WorkspaceStack>
    </div>
  );
}
