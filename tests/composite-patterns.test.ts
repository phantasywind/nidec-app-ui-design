import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  BusinessProcessFlow, CardGallery, CardGalleryItem, CollectionList, CollectionListItem,
  ProcessStageIndicator, StageNavigator,
  RecordDataGridHeader, RecordIdentityCellLayout, RecordTableHeader, TableActionIconButton,
  DataGridHeader, TableCellLayout, TableHeader,
} from '../src/index';
import type {
  BusinessProcessFlowProps, RecordIdentityCellLayoutProps, StageNavigatorProps, TableActionIconButtonProps,
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

describe('consumer-neutral composite patterns', () => {
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
    expect(fixture).toContain('<NidecProvider theme={nidecLightTheme}><div className="composite-fixture">');
    expect(fixture).not.toContain('<NidecProvider theme={nidecLightTheme} className="composite-fixture">');
    expect(fixture).toContain('primary={<Link inline href={`#record-${record.id}`}>{record.name}</Link>}');
    expect(fixture).toContain('aria-label={`More actions for ${record.name}`}');
    expect(fixture).not.toContain('aria-label={`Open ${record.name}`}');
  });

  it('renders a responsive semantic gallery with Fluent Cards', () => {
    const html = renderToStaticMarkup(createElement(CardGallery, { minimumItemWidth: 'large', 'aria-label': 'Examples' },
      createElement(CardGalleryItem, { cardProps: { appearance: 'outline' } }, createElement('h3', {}, 'Example card'))));
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('nidec-ui-card-gallery--large');
    expect(html).toContain('fui-Card');
    expect(html).toContain('Example card');
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
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('Pending Approval');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('tabindex');
  });

  it('keeps the BusinessProcessFlow arrows at the governed compact density', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toContain('min-height: 3.25rem');
    expect(css).toContain('padding: var(--spacingVerticalXS) 1.5rem var(--spacingVerticalXS) 1.25rem');
    expect(css).toContain('grid-template-columns: 1.75rem minmax(0, 1fr)');
    expect(css).toContain('height: 1.75rem');
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
    expect(sealSource).toContain('axe-color-contrast-incomplete:scrollable-table-clipping-at-720');
    expect(css).toContain('inset-inline-start: calc(var(--spacingHorizontalXS) + 1.5rem + var(--strokeWidthThin) + var(--strokeWidthThin) + var(--strokeWidthThin))');
    expect(css).toContain('inset-block-start: calc(var(--spacingVerticalXS) + 1.5rem + var(--strokeWidthThin) + var(--strokeWidthThin) + var(--strokeWidthThin))');
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
