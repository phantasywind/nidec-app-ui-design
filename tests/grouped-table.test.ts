import { createElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GroupedTableSectionRow, Table, TableBody } from '../src/index';
import type { GroupedTableSectionRowProps } from '../src/index';

const group: GroupedTableSectionRowProps = {
  label: 'Primary collection',
  count: 4,
  columnSpan: 5,
  level: 0,
  expanded: true,
  icon: createElement('span', { 'aria-hidden': true }, 'icon'),
  onToggle: () => undefined,
};
const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('GroupedTableSectionRow governance', () => {
  it('renders a full-width disclosure row inside the Fluent table with stable count', () => {
    const html = renderToStaticMarkup(createElement(Table, null,
      createElement(TableBody, null, createElement(GroupedTableSectionRow, group))));
    expect(html).toContain('nidec-ui-grouped-table__section-row--level-0');
    expect(html).toContain('colSpan="5"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-label="Primary collection, 4 rows"');
    expect(html).toContain('>4</span>');
  });

  it('reports hidden-state summary and indents the second level', () => {
    const html = renderToStaticMarkup(createElement(Table, null,
      createElement(TableBody, null, createElement(GroupedTableSectionRow, {
        ...group, level: 1, expanded: false, summary: '2 modified · 1 issue',
      }))));
    expect(html).toContain('nidec-ui-grouped-table__section-row--level-1');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('2 modified · 1 issue');
  });

  it('forwards the independent disclosure action', () => {
    const onToggle = vi.fn();
    const row = GroupedTableSectionRow({ ...group, onToggle });
    const cell = row.props.children;
    const button = cell.props.children;
    expect(button.props.onClick).toBe(onToggle);
    expect(button.props.type).toBe('button');
    expect(button.props.style.justifyContent).toBe('flex-start');
    expect(button.props.style.overflow).toBe('visible');
    expect(cell.props.style.overflow).toBe('visible');
    expect(button.props.children.at(-1).props.className).toBe('nidec-ui-grouped-table__section-count');
  });

  it('rejects malformed group identity, count and table span', () => {
    expect(() => GroupedTableSectionRow({ ...group, label: ' ' })).toThrow('requires a label');
    expect(() => GroupedTableSectionRow({ ...group, count: -1 })).toThrow('requires a label');
    expect(() => GroupedTableSectionRow({ ...group, columnSpan: 0 })).toThrow('requires a label');
  });

  it('keeps both group depths semibold and the compact count at row end', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const fixtureCss = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'region.css'), 'utf8');
    expect(css).toMatch(/\.nidec-ui-grouped-table__section-label\s*\{[^}]*font-weight:\s*var\(--fontWeightSemibold\)/);
    expect(css).toMatch(/\.nidec-ui-grouped-table__section-count\s*\{[^}]*background:\s*var\(--colorBrandBackground\)/);
    expect(css).toMatch(/\.nidec-ui-grouped-table__section-count\s*\{[^}]*margin-inline-start:\s*auto/);
    expect(css).toMatch(/\.nidec-ui-grouped-table__section-count\s*\{[^}]*min-block-size:\s*20px/);
    expect(fixtureCss).toContain('padding-inline-start: calc(var(--spacingHorizontalS) + 2.5rem)');
  });
});
