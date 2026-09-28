import { createElement } from 'react';
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
  });

  it('rejects malformed group identity, count and table span', () => {
    expect(() => GroupedTableSectionRow({ ...group, label: ' ' })).toThrow('requires a label');
    expect(() => GroupedTableSectionRow({ ...group, count: -1 })).toThrow('requires a label');
    expect(() => GroupedTableSectionRow({ ...group, columnSpan: 0 })).toThrow('requires a label');
  });
});
