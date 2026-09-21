import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { TableRowId } from '@fluentui/react-components';
import { describe, expect, it } from 'vitest';
import {
  ActionableCardGalleryItem, BusinessProcessFlow, CardGallery, CardGalleryItem, CollectionList, CollectionListItem,
  ProcessStageIndicator, StageNavigator,
  RecordDataGridHeader, RecordIdentityCellLayout, RecordSelectionDataGrid, RecordSelectionDataGridRow,
  InlineModeTabs, RecordSelectionRegion, RecordTableHeader, SegmentedControl, TableActionIconButton, ViewModeToggle,
  DataGrid, DataGridHeader, DataGridRow, TableCellLayout, TableHeader,
} from '../src/index';
import type {
  BusinessProcessFlowProps, RecordIdentityCellLayoutProps, RecordSelectionDataGridProps,
  InlineModeTabsProps, RecordSelectionDataGridRowProps, SegmentedControlProps, StageNavigatorProps, TableActionIconButtonProps, ViewModeToggleProps,
} from '../src/index';

const stages = [
  { id: 'draft', label: 'Draft', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'Review', description: 'Example description', status: 'current', statusLabel: 'Current' },
  { id: 'release', label: 'Release', status: 'upcoming', statusLabel: 'Upcoming', disabled: true },
] as const;
const businessProcessStages = [
  { id: 'prepare', label: 'Prepare', description: 'Completed', status: 'completed', statusLabel: 'Completed' },
  { id: 'approval', label: 'Pending Approval', description: 'In progress', status: 'current', statusLabel: 'Current stage' },
  { id: 'issued', label: 'Issued', description: 'Not issued', status: 'upcoming', statusLabel: 'Upcoming' },
] as const;
const stageNavigatorContract: StageNavigatorProps = { 'aria-label': 'Workspace navigation', stages, onStageSelect: () => undefined };
// @ts-expect-error StageNavigator always has an activation contract.
const stageNavigatorWithoutAction: StageNavigatorProps = { 'aria-label': 'Workspace navigation', stages };
const businessProcessContract: BusinessProcessFlowProps = { 'aria-label': 'Business process', stages: businessProcessStages };
// @ts-expect-error BusinessProcessFlow never exposes a manual stage-switch callback.
const businessProcessWithAction: BusinessProcessFlowProps = { ...businessProcessContract, onStageSelect: () => undefined };
void [stageNavigatorContract, stageNavigatorWithoutAction, businessProcessContract, businessProcessWithAction];
const repositoryRoot = resolve(import.meta.dirname, '..');
const recordIdentityContract: RecordIdentityCellLayoutProps = { primary: 'Example' };
// @ts-expect-error The shared composition owns the primary appearance.
const recordIdentityWithAppearance: RecordIdentityCellLayoutProps = { primary: 'Example', appearance: 'primary' };
// @ts-expect-error Consumers use secondary rather than overriding the Fluent description slot.
const recordIdentityWithDescription: RecordIdentityCellLayoutProps = { primary: 'Example', description: 'Supporting' };
// @ts-expect-error Every identity layout requires explicit primary content.
const recordIdentityWithoutPrimary: RecordIdentityCellLayoutProps = {};
void [recordIdentityContract, recordIdentityWithAppearance, recordIdentityWithDescription, recordIdentityWithoutPrimary];
const tableActionContract: TableActionIconButtonProps = { icon: createElement('span'), 'aria-label': 'Open record' };
// @ts-expect-error Table row actions always use the governed transparent appearance.
const tableActionWithAppearance: TableActionIconButtonProps = { ...tableActionContract, appearance: 'primary' };
// @ts-expect-error Table row actions always use the governed small size.
const tableActionWithSize: TableActionIconButtonProps = { ...tableActionContract, size: 'large' };
// @ts-expect-error Table row actions are icon-only.
const tableActionWithText: TableActionIconButtonProps = { ...tableActionContract, children: 'Open' };
void [tableActionContract, tableActionWithAppearance, tableActionWithSize, tableActionWithText];
const recordSelectionContract: RecordSelectionDataGridProps = {
  'aria-label': 'Available records',
  columns: [],
  getRowId: item => (item as { id: string }).id,
  items: [],
  onSelectionChange: () => undefined,
  selectedItems: new Set(),
};
// @ts-expect-error Selection mode is fixed to one record.
const recordSelectionWithMode: RecordSelectionDataGridProps = { ...recordSelectionContract, selectionMode: 'multiselect' };
// @ts-expect-error The shared contract owns the selection appearance.
const recordSelectionWithAppearance: RecordSelectionDataGridProps = { ...recordSelectionContract, selectionAppearance: 'brand' };
// @ts-expect-error The grid must remain controlled by the consumer's record authority.
const recordSelectionWithDefault: RecordSelectionDataGridProps = { ...recordSelectionContract, defaultSelectedItems: new Set(['one']) };
const recordSelectionRowContract: RecordSelectionDataGridRowProps<{ id: string }> = { children: () => null, recordId: 'one' };
// @ts-expect-error The row uses the parent grid's single selection callback.
const recordSelectionRowWithClick: RecordSelectionDataGridRowProps<{ id: string }> = { ...recordSelectionRowContract, onClick: () => undefined };
void [recordSelectionContract, recordSelectionWithMode, recordSelectionWithAppearance, recordSelectionWithDefault,
  recordSelectionRowContract, recordSelectionRowWithClick];
const segmentedControlContract: SegmentedControlProps = {
  'aria-label': 'Change type',
  options: [{ value: 'commercial', label: 'Commercial change' }, { value: 'engineering', label: 'Engineering change' }],
  value: 'commercial',
  onValueChange: () => undefined,
};
// @ts-expect-error SegmentedControl owns the radiogroup children.
const segmentedControlWithChildren: SegmentedControlProps = { ...segmentedControlContract, children: 'Invalid' };
// @ts-expect-error SegmentedControl uses onValueChange rather than an ambiguous DOM onChange.
const segmentedControlWithOnChange: SegmentedControlProps = { ...segmentedControlContract, onChange: () => undefined };
void [segmentedControlContract, segmentedControlWithChildren, segmentedControlWithOnChange];
const viewModeToggleContract: ViewModeToggleProps = {
  'aria-label': 'Directory view',
  value: 'list',
  onValueChange: () => undefined,
  listIcon: createElement('span'),
  cardIcon: createElement('span'),
};
// @ts-expect-error ViewModeToggle owns both icon-button children.
const viewModeToggleWithChildren: ViewModeToggleProps = { ...viewModeToggleContract, children: 'Invalid' };
void [viewModeToggleContract, viewModeToggleWithChildren];
const inlineModeTabsContract: InlineModeTabsProps = {
  'aria-label': 'Editor mode',
  options: [
    { value: 'reference', label: 'Reference', tabId: 'mode-tab-reference', panelId: 'mode-panel-reference' },
    { value: 'manual', label: 'Manual', tabId: 'mode-tab-manual', panelId: 'mode-panel-manual' },
  ],
  value: 'reference',
  onValueChange: () => undefined,
};

describe('consumer-neutral composite patterns', () => {
  it('presents one governed materials page and five composed synthetic templates', async () => {
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    const fixtureCss = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'region.css'), 'utf8');
    expect(fixture).toContain("type ShowcaseView = 'elements' | 'authentication' | 'directory' | 'record' | 'master-data' | 'governance'");
    expect(fixture).toContain("label: 'UI materials'");
    expect(fixture).toContain("label: 'Authentication sample'");
    expect(fixture).toContain("label: 'Directory sample'");
    expect(fixture).toContain("label: 'Record workspace'");
    expect(fixture).toContain("label: 'Master data / Form + List'");
    expect(fixture).toContain("label: 'Governance sample'");
    expect(fixture).toContain('Template usage contract');
    expect(fixture).toContain('Business meaning remains with the adopting application.');
    expect(fixtureCss).toMatch(/showcase-content[\s\S]*?align-content: start/);
  });

  it('records authentication entry as a presentation pattern without owning authentication policy', async () => {
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    const governance = await readFile(join(repositoryRoot, 'docs', 'authentication-entry-pattern.md'), 'utf8');
    const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
    expect(fixture).toContain('<AuthenticationLayout aria-label="Authentication entry"');
    expect(fixture).toContain('autoComplete="username"');
    expect(fixture).toContain('autoComplete="current-password"');
    expect(fixture).toContain('Consumer-supplied identity');
    expect(governance).toContain('The shared package does not embed, reconstruct or recolor an application logo.');
    expect(governance).toContain('SSO, MFA, password policy, account recovery');
    expect(governance).toContain('not a new public authentication component or protocol');
    expect(readme).toContain('[Authentication entry pattern](docs/authentication-entry-pattern.md)');
  });

  it('renders a controlled Fluent radio-toolbar as one coherent segmented control', () => {
    const element = createElement(SegmentedControl, {
      ...segmentedControlContract,
      className: 'consumer-class',
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('nidec-ui-segmented-control consumer-class');
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('role="radio"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain('Commercial change');
    expect(html).toContain('Engineering change');
    expect(() => renderToStaticMarkup(createElement(SegmentedControl, { ...segmentedControlContract, 'aria-label': ' ' }))).toThrow('non-empty aria-label');
    expect(() => renderToStaticMarkup(createElement(SegmentedControl, { ...segmentedControlContract, options: [segmentedControlContract.options[0]!] }))).toThrow('at least two');
    expect(() => renderToStaticMarkup(createElement(SegmentedControl, { ...segmentedControlContract, value: 'missing' }))).toThrow('must match an option');
  });

  it('renders a compact controlled List/Card view switch with governed spacing', async () => {
    const html = renderToStaticMarkup(createElement(ViewModeToggle, viewModeToggleContract));
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const governance = await readFile(join(repositoryRoot, 'docs', 'view-mode-toggle.md'), 'utf8');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Directory view"');
    expect(html).toContain('aria-label="List view"');
    expect(html).toContain('aria-label="Card view"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
    expect(css).toMatch(/nidec-ui-view-mode-toggle[\s\S]*?gap: var\(--spacingHorizontalXS\)/);
    expect(css).toMatch(/nidec-ui-view-mode-toggle__button[\s\S]*?inline-size: 32px[\s\S]*?block-size: 32px/);
    expect(governance).toContain('4 CSS pixels');
    expect(governance).toContain('12 CSS pixels');
    expect(() => renderToStaticMarkup(createElement(ViewModeToggle, { ...viewModeToggleContract, 'aria-label': ' ' }))).toThrow('non-empty aria-label');
  });

  it('uses shared theme roles for a balanced segmented-control boundary and selection state', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toMatch(/nidec-ui-segmented-control[\s\S]*?colorNeutralBackground2/);
    expect(css).toMatch(/nidec-ui-segmented-control__item[\s\S]*?min-block-size: 32px/);
    expect(css).not.toContain('nidec-ui-segmented-control__item[aria-checked="true"]');
  });

  it('provides a dedicated inline editor mode without segmented-control chrome', async () => {
    const html = renderToStaticMarkup(createElement(InlineModeTabs, inlineModeTabsContract));
    const source = await readFile(join(repositoryRoot, 'src', 'index.ts'), 'utf8');
    const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
    const governance = await readFile(join(repositoryRoot, 'docs', 'inline-mode-tabs.md'), 'utf8');
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    const fixtureCss = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'region.css'), 'utf8');
    expect(html).toContain('nidec-ui-inline-mode-tabs');
    expect(html).not.toContain('nidec-ui-segmented-control');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-controls="mode-panel-reference"');
    expect(html).toContain('id="mode-tab-reference"');
    expect(html).toContain('type="button"');
    expect(source).toContain("height: '20px'");
    expect(source).toContain("width: 'fit-content'");
    expect(source).toContain("maxWidth: '100%'");
    expect(source).toContain("whiteSpace: 'nowrap'");
    expect(source).toContain('fontSize: tokens.fontSizeBase100');
    expect(source).toContain("'&& *'");
    expect(source).toContain('padding: tokens.spacingVerticalXXS');
    expect(source).toContain("appearance: 'transparent'");
    expect(source).toContain('borderRadius: tokens.borderRadiusCircular');
    expect(source).toContain('backgroundColor: tokens.colorBrandBackground');
    expect(source).toContain('boxShadow: tokens.shadow2');
    expect(source).toContain('color: tokens.colorNeutralForegroundOnBrand');
    expect(source).toContain("'&&:enabled:hover::before'");
    expect(source).toContain("'&&:enabled:hover::after'");
    expect(source).toContain("'&&:enabled:hover *'");
    expect(source).toContain("'&&[aria-selected=\"true\"]:hover *'");
    expect(source).toContain('fluentTabClassNames.content');
    expect(readme).toContain('## Inline editor mode contract');
    expect(readme).toContain('dedicated compact pill rather than the higher-level `SegmentedControl`');
    expect(readme).toContain('does not claim a separate `WorkspaceTabs` public component');
    expect(governance).toContain('Switching visibility must not clear inactive-mode input');
    expect(fixture).toContain('role="tabpanel"');
    expect(fixture).toContain('const [mode, setMode]');
    expect(fixture).toContain("active === 'reference' ? 'Shared field' : '42'");
    expect(fixtureCss).toMatch(/parameter-editor[\s\S]*?gap: var\(--spacingVerticalXS\)/);
    expect(fixtureCss).toContain('grid-template-columns: minmax(10rem, 1fr) 16rem');
    expect(fixtureCss).toMatch(/parameter-editor > \[role="tabpanel"\], \.parameter-editor input[\s\S]*?width: 100%/);
    expect(governance).toContain('switching modes or changing panel type must not move the pill');
    expect(() => renderToStaticMarkup(createElement(InlineModeTabs, {
      ...inlineModeTabsContract,
      options: [
        inlineModeTabsContract.options[0]!,
        { ...inlineModeTabsContract.options[1]!, tabId: 'mode-tab-reference' },
      ],
    }))).toThrow('tab IDs and panel IDs must be unique');
  });

  it('declares one record identity layout without owning the surrounding table cell', () => {
    const element = RecordIdentityCellLayout({
      primary: 'Example Alpha',
      secondary: 'Reference REC-1042',
      truncate: true,
    });
    expect(element.type).toBe(TableCellLayout);
    expect(element.props.appearance).toBe('primary');
    expect(element.props.children).toBe('Example Alpha');
    expect(element.props.description).toEqual({ children: 'Reference REC-1042' });
    expect(element.props.truncate).toBe(true);

    const html = renderToStaticMarkup(element);
    expect(html).toContain('fui-TableCellLayout');
    expect(html).toContain('Example Alpha');
    expect(html).toContain('Reference REC-1042');
    expect(html).not.toContain('<td');
  });

  it('keeps a navigable data-table identity cell to one link without stacked fields', async () => {
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
    expect(fixture).toContain('primary={<Link inline href={`#${record.id}`}');
    expect(fixture).not.toContain('secondary={record.owner}');
    expect(fixture).toContain('<TableCell>{record.owner}</TableCell>');
    expect(readme).toContain('do not stack an owner, description, status or other field beneath it');
  });

  it('applies one governed visual hierarchy to Table and DataGrid headers', async () => {
    const tableHeader = RecordTableHeader({ className: 'consumer-header', children: 'Header' });
    expect(tableHeader.type).toBe(TableHeader);
    expect(tableHeader.props.className).toBe('nidec-ui-record-table-header consumer-header');

    const dataGridHeader = RecordDataGridHeader({ children: 'Header' });
    expect(dataGridHeader.type).toBe(DataGridHeader);
    expect(dataGridHeader.props.className).toBe('nidec-ui-record-table-header');

    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toContain('background-color: var(--colorNeutralBackground2)');
    expect(css).toContain('border-bottom: var(--strokeWidthThick) solid var(--colorNeutralStroke1)');
    expect(css).toContain('font-weight: var(--fontWeightSemibold)');
  });

  it('creates a controlled single-record DataGrid without navigation semantics', () => {
    const onSelectionChange = () => undefined;
    const element = RecordSelectionDataGrid({
      'aria-label': 'Available records',
      columns: [],
      getRowId: item => (item as { id: string }).id,
      items: [],
      onSelectionChange,
      selectedItems: new Set(['one']),
    });
    const grid = (element.props as { children: ReactElement<Record<string, unknown>> }).children;
    expect(grid.type).toBe(DataGrid);
    expect(grid.props.selectionMode).toBe('single');
    expect(grid.props.selectionAppearance).toBe('neutral');
    expect(grid.props.focusMode).toBe('composite');
    expect(grid.props.subtleSelection).toBe(false);
    expect(grid.props.onSelectionChange).toBe(onSelectionChange);
    expect(grid.props.className).toBe('nidec-ui-record-selection-grid');
    expect(() => RecordSelectionDataGrid({ ...recordSelectionContract, 'aria-label': ' ' })).toThrow('non-empty aria-label');
    expect(() => RecordSelectionDataGrid({ ...recordSelectionContract, selectedItems: new Set(['one', 'two']) })).toThrow('zero or one');
  });

  it('adds Enter to the same row click path and leaves Space to Fluent selection', () => {
    let selectedItems = new Set<TableRowId>();
    const wrapper = RecordSelectionDataGridRow<{ id: string }>({ children: () => null, recordId: 'one' });
    const renderRow = (wrapper.props as { children: (context: {
      onSelectionChange: (event: unknown, data: { selectedItems: Set<TableRowId> }) => void;
    }) => ReactElement<{ className?: string; onKeyDown?: (event: unknown) => void; onKeyDownCapture?: (event: unknown) => void; selectionCell?: unknown }> }).children;
    const row = renderRow({
      onSelectionChange: (_event: unknown, data: { selectedItems: Set<TableRowId> }) => { selectedItems = data.selectedItems; },
    });
    expect(row.type).toBe(DataGridRow);
    expect(row.props.selectionCell).toBe(null);
    expect(row.props.className).toBe('nidec-ui-record-selection-row');
    let preventCount = 0;
    const currentTarget = {};
    row.props.onKeyDownCapture?.({
      currentTarget,
      defaultPrevented: false,
      key: 'Enter',
      preventDefault: () => { preventCount += 1; },
      target: currentTarget,
    } as never);
    expect([...selectedItems]).toEqual(['one']);
    expect(preventCount).toBe(1);
    selectedItems = new Set();
    row.props.onKeyDownCapture?.({
      currentTarget,
      defaultPrevented: true,
      key: 'Enter',
      preventDefault: () => { preventCount += 1; },
      target: currentTarget,
    });
    expect([...selectedItems]).toEqual(['one']);
    expect(preventCount).toBe(2);
    row.props.onKeyDownCapture?.({
      currentTarget,
      defaultPrevented: false,
      key: 'Enter',
      preventDefault: () => { preventCount += 1; },
      target: { closest: () => null },
    } as never);
    expect([...selectedItems]).toEqual(['one']);
    expect(preventCount).toBe(3);
    row.props.onKeyDownCapture?.({
      currentTarget,
      defaultPrevented: false,
      key: 'Enter',
      preventDefault: () => { preventCount += 1; },
      target: { closest: () => ({}) },
    } as never);
    expect([...selectedItems]).toEqual(['one']);
    expect(preventCount).toBe(3);
    row.props.onKeyDown?.({
      currentTarget,
      defaultPrevented: false,
      key: ' ',
      preventDefault: () => { preventCount += 1; },
      target: currentTarget,
    } as never);
    expect([...selectedItems]).toEqual(['one']);
    expect(preventCount).toBe(3);
  });

  it('governs selection-region spacing without a branded leading selection bar', async () => {
    const region = RecordSelectionRegion({ toolbar: 'Toolbar', children: 'Grid', 'aria-label': 'Record editor directory' });
    expect(region.type).toBe('section');
    expect(region.props.className).toBe('nidec-ui-record-selection-region');
    expect(region.props.children).toEqual(['Toolbar', 'Grid']);
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toMatch(/nidec-ui-record-selection-region[\s\S]*?gap: var\(--spacingVerticalM\)/);
    expect(css).not.toMatch(/nidec-ui-record-selection-row\[aria-selected="true"\][^{]*\{[^}]*box-shadow/);
    expect(css).toMatch(/nidec-ui-record-selection-row:is\(:focus-visible, :has\(:focus-visible\)\)[\s\S]*?colorStrokeFocus2/);
    expect(css).toContain('@media (forced-colors: active)');
    expect(css).toContain('.fui-TableCellActions');
    expect(css).toContain('margin-inline-end: var(--spacingHorizontalM)');
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    expect(fixture).toContain("type SelectionItem = { id: string; name: string }");
    expect(fixture).not.toContain('primary={item.name} secondary={item.detail}');
  });

  it('governs Data Table row actions as small transparent icon-only buttons', () => {
    const click = () => undefined;
    const element = TableActionIconButton({
      icon: createElement('span'),
      'aria-label': 'Open record',
      onClick: click,
    });
    expect(element.props.appearance).toBe('transparent');
    expect(element.props.size).toBe('small');
    expect(element.props.shape).toBe('rounded');
    expect(element.props.className).toContain('nidec-ui-table-action-icon-button');
    expect(element.props.type).toBe('button');
    expect(element.props.children).toBe('');
    expect(element.props['aria-label']).toBe('Open record');
    expect(element.props.onClick).toBe(click);
    expect(() => TableActionIconButton({ icon: createElement('span'), 'aria-label': '  ' })).toThrow('non-empty aria-label');
  });

  it('fixes the governed row-action target to an actual 24 by 24 CSS pixel box', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toContain('.nidec-ui-table-action-icon-button');
    expect(css).toContain('inline-size: 24px');
    expect(css).toContain('block-size: 24px');
    expect(css).toContain('min-block-size: 24px');
  });

  it('renders a semantic Fluent collection without owning selection meaning', () => {
    const html = renderToStaticMarkup(createElement(CollectionList, { density: 'compact', 'aria-label': 'Example records' },
      createElement(CollectionListItem, {
        primary: 'Record one', secondary: 'Supporting text', selection: createElement('input', { type: 'checkbox', 'aria-label': 'Select record one' }), metadata: 'Updated today', actions: createElement('button', { type: 'button' }, 'Open'),
      })));
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('nidec-ui-collection-list--compact');
    expect(html).toContain('Record one');
    expect(html).toContain('Supporting text');
    expect(html).toContain('Updated today');
    expect(html).toContain('aria-label="Select record one"');
    expect(html).not.toContain('role="option"');
  });

  it('ships an explicit record-entry decision rule for adopting applications', async () => {
    const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
    const fixture = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'main.tsx'), 'utf8');
    expect(readme).toContain('## Record-entry interaction contract');
    expect(readme).toContain('Each record has exactly one primary entry mechanism.');
    expect(readme).toContain('do not implement this with a raw `<li onClick>`');
    expect(readme).toContain('The row itself is not a hidden navigation target.');
    expect(readme).toContain('theme-governed Fluent `Link` with `inline`');
    expect(readme).toContain('setting `TableCellActions visible`');
    expect(readme).toContain('`RecordTableHeader` and `RecordDataGridHeader` preserve');
    expect(readme).toContain('`TableActionIconButton` fixes each direct row action');
    expect(readme).toContain('24 x 24 CSS pixel target');
    expect(readme).toContain('Every icon action requires both a non-empty `aria-label` and a visible-on-hover/focus `Tooltip`');
    expect(readme).toContain('does not retroactively add an interaction API to immutable `0.1.0-rc.1`');
    expect(fixture).toContain('<NidecProvider theme={nidecLightTheme}><ApplicationFrame');
    expect(fixture).toContain('primary={<Link inline href={`#${record.id}`}');
    expect(fixture).toContain('aria-label={`More actions for ${name}`}');
    expect(fixture).toContain('aria-label={`Open ${record.name}`}');
    expect(fixture).not.toMatch(/<CardGalleryItem[^>]*>\s*<Card>/);
  });

  it('renders a responsive semantic gallery with flat nested Fluent Cards', async () => {
    const source = await readFile(join(repositoryRoot, 'src', 'index.ts'), 'utf8');
    const html = renderToStaticMarkup(createElement(CardGallery, { minimumItemWidth: 'large', 'aria-label': 'Examples' },
      createElement(CardGalleryItem, {}, createElement('h3', {}, 'Example card'))));
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('nidec-ui-card-gallery--large');
    expect(html).toContain('fui-Card');
    expect(html).toContain('Example card');
    expect(source).toContain("appearance: remainingCardProps.appearance ?? 'subtle'");
    expect(source).toContain("boxShadow: 'none'");
  });

  it('renders navigation and command cards as one whole-card entry', () => {
    const navigation = renderToStaticMarkup(createElement(ActionableCardGalleryItem, {
      'aria-label': 'Open example', href: '/example', children: createElement('strong', {}, 'Example'),
    }));
    const command = renderToStaticMarkup(createElement(ActionableCardGalleryItem, {
      'aria-label': 'Choose example', onActivate: () => undefined, children: createElement('strong', {}, 'Example'),
    }));
    expect(navigation).toContain('<a aria-label="Open example"');
    expect(navigation).toContain('href="/example"');
    expect(command).toContain('role="button"');
    expect(command).toContain('tabindex="0"');
  });

  it('renders one current process step and consumer-supplied localized status labels', () => {
    const html = renderToStaticMarkup(createElement(ProcessStageIndicator, { stages, 'aria-label': 'Example process' }));
    expect(html).toContain('<ol');
    expect(html).toContain('aria-label="Example process"');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('Completed');
    expect(html).toContain('Current');
    expect(html).toContain('Upcoming');
    expect(html).not.toContain('<button');
  });

  it('renders optional Fluent activation without inventing transition permission', () => {
    const html = renderToStaticMarkup(createElement(ProcessStageIndicator, { stages, 'aria-label': 'Example process', onStageSelect: () => undefined }));
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('disabled=""');
  });

  it('renders StageNavigator as an explicitly interactive workspace navigator', () => {
    const html = renderToStaticMarkup(createElement(StageNavigator, {
      stages,
      'aria-label': 'Workspace navigation',
      onStageSelect: () => undefined,
    }));
    expect(html).toContain('<button');
    expect(html).toContain('nidec-ui-stage-navigator');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('type="button"');
  });

  it('ships an explicit consumer decision rule for the two stage patterns', async () => {
    const guide = await readFile(join(repositoryRoot, 'docs', 'stage-pattern-selection.md'), 'utf8');
    const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
    expect(readme).toContain('[阶段呈现模式选择规范](docs/stage-pattern-selection.md)');
    expect(guide).toContain('只改变“用户正在看哪里”');
    expect(guide).toContain('代表“业务现在走到哪里”');
    expect(guide).toContain('记录 `Business Rule Pending`');
    expect(guide).toContain('箭头仍使用 `BusinessProcessFlow`');
    expect(guide).toContain('新代码不得使用它');
  });

  it('renders BusinessProcessFlow as a read-only arrow lifecycle with no activation API', () => {
    const html = renderToStaticMarkup(createElement(BusinessProcessFlow, {
      stages: businessProcessStages,
      'aria-label': 'Quote lifecycle',
    }));
    expect(html).toContain('<section');
    expect(html).toContain('nidec-ui-business-process-flow__track');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('Pending Approval');
    expect(html).not.toContain('<button');
  });

  it('keeps the BusinessProcessFlow arrows at the governed compact density', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toContain('min-height: 3.25rem');
    expect(css).toContain('padding: var(--spacingVerticalXS) 1.5rem var(--spacingVerticalXS) 1.25rem');
    expect(css).toContain('grid-template-columns: 1.75rem minmax(0, 1fr)');
    expect(css).toContain('height: 1.75rem');
    expect(css).toMatch(/data-stage-status="completed"[\s\S]*?color: var\(--colorNeutralForeground1\)/);
    expect(css).toMatch(/nidec-ui-business-process-flow__copy small[\s\S]*?opacity: 1/);
  });

  it('rejects ambiguous BusinessProcessFlow structure without interpreting lifecycle rules', () => {
    expect(() => renderToStaticMarkup(createElement(BusinessProcessFlow, { stages: [], 'aria-label': 'Lifecycle' }))).toThrow('at least one stage');
    expect(() => renderToStaticMarkup(createElement(BusinessProcessFlow, {
      stages: [businessProcessStages[0], businessProcessStages[0]], 'aria-label': 'Lifecycle',
    }))).toThrow('unique');
    expect(() => renderToStaticMarkup(createElement(BusinessProcessFlow, {
      stages: [businessProcessStages[1], { ...businessProcessStages[1], id: 'second' }], 'aria-label': 'Lifecycle',
    }))).toThrow('Only one');
    expect(() => renderToStaticMarkup(createElement(BusinessProcessFlow, { stages: businessProcessStages, 'aria-label': ' ' }))).toThrow('non-empty');
  });

  it('keeps stage hover bounded and connectors outside marker geometry', async () => {
    const source = await readFile(join(repositoryRoot, 'src', 'index.ts'), 'utf8');
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const sealSource = await readFile(join(repositoryRoot, 'scripts', 'seal-composite-patterns-browser.mjs'), 'utf8');
    expect(source).toContain("appearance: 'transparent'");
    expect(source).toContain("className: 'nidec-ui-process-stage__layout'");
    expect(css).toContain('width: fit-content');
    expect(css).toContain('max-width: calc(100% - var(--spacingHorizontalXS))');
    expect(css).toContain('.nidec-ui-stage-navigator .nidec-ui-process-stage__item:not(:last-child)::after');
    expect(css).toContain('height: var(--strokeWidthThin)');
    expect(sealSource).toContain('axe-color-contrast-incomplete:scrollable-table-clipping-at-720');
    expect(sealSource).toContain('axe-color-contrast-incomplete:truncated-record-identity-at-narrow-viewports');
    expect(css).toContain('inset-inline-start: calc(var(--spacingHorizontalXS) + 1.5rem + var(--strokeWidthThin) + var(--strokeWidthThin) + var(--spacingHorizontalXS))');
    expect(css).toContain('inset-block-start: calc(var(--spacingVerticalXS) + 1.5rem + var(--strokeWidthThin) + var(--strokeWidthThin) + var(--spacingVerticalXS))');
    expect(css).not.toContain('inset-inline: calc(50% + 1.25rem)');
  });

  it('rejects ambiguous structural input without interpreting business state', () => {
    expect(() => renderToStaticMarkup(createElement(ProcessStageIndicator, { stages: [], 'aria-label': 'Process' }))).toThrow('at least one stage');
    expect(() => renderToStaticMarkup(createElement(ProcessStageIndicator, { stages: [stages[0], stages[0]], 'aria-label': 'Process' }))).toThrow('unique');
    expect(() => renderToStaticMarkup(createElement(ProcessStageIndicator, {
      stages: [{ ...stages[1], id: 'one' }, { ...stages[1], id: 'two' }], 'aria-label': 'Process',
    }))).toThrow('Only one');
    expect(() => renderToStaticMarkup(createElement(ProcessStageIndicator, { stages, 'aria-label': ' ' }))).toThrow('non-empty');
  });
});
