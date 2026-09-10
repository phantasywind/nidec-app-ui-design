import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  CardGallery, CardGalleryItem, CollectionList, CollectionListItem, ProcessStageIndicator,
  RecordIdentityCellLayout, TableCellLayout,
} from '../src/index';
import type { RecordIdentityCellLayoutProps } from '../src/index';

const stages = [
  { id: 'draft', label: 'Draft', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'Review', description: 'Example description', status: 'current', statusLabel: 'Current' },
  { id: 'release', label: 'Release', status: 'upcoming', statusLabel: 'Upcoming', disabled: true },
] as const;
const repositoryRoot = resolve(import.meta.dirname, '..');
const recordIdentityContract: RecordIdentityCellLayoutProps = { primary: 'Example' };
// @ts-expect-error The shared composition owns the primary appearance.
const recordIdentityWithAppearance: RecordIdentityCellLayoutProps = { primary: 'Example', appearance: 'primary' };
// @ts-expect-error Consumers use secondary rather than overriding the Fluent description slot.
const recordIdentityWithDescription: RecordIdentityCellLayoutProps = { primary: 'Example', description: 'Supporting' };
// @ts-expect-error Every identity layout requires explicit primary content.
const recordIdentityWithoutPrimary: RecordIdentityCellLayoutProps = {};
void [recordIdentityContract, recordIdentityWithAppearance, recordIdentityWithDescription, recordIdentityWithoutPrimary];

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
    expect(readme).toContain('## Record-entry interaction contract');
    expect(readme).toContain('Each record has exactly one primary entry mechanism.');
    expect(readme).toContain('do not implement this with a raw `<li onClick>`');
    expect(readme).toContain('The row itself is not a hidden navigation target.');
    expect(readme).toContain('does not retroactively add an interaction API to immutable `0.1.0-rc.1`');
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
