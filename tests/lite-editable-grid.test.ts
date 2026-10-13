import { createElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LiteEditableGrid } from '../src/index';
import type { LiteEditableGridColumn, LiteEditableGridProps } from '../src/index';
import {
  computeRenderRange, filterLiteGridOptions, LITE_GRID_ROW_HEIGHT,
} from '../src/internal/components/lite-editable-grid';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

type Line = { id: string; code: string; note: string; unit: string; supplier: string; qty: string };

const columns: LiteEditableGridColumn<Line>[] = [
  { key: 'code', header: 'Code', editor: 'none', width: 96 },
  { key: 'note', header: 'Note', editor: 'longText', width: 240 },
  { key: 'unit', header: 'Unit', editor: 'select', options: [{ value: 'ea', text: 'Each' }, { value: 'm', text: 'Metre' }] },
  { key: 'supplier', header: 'Supplier', editor: 'combobox', options: [{ value: 's1', text: 'Alpha' }] },
  { key: 'qty', header: 'Qty', align: 'end', validate: value => (/^\d+$/.test(value) ? undefined : 'Whole number required') },
];

const rows: Line[] = Array.from({ length: 5000 }, (_, index) => ({
  id: String(index), code: `C-${index}`, note: `Note ${index}`, unit: index % 2 ? 'm' : 'ea', supplier: index === 0 ? 'Beta' : 's1', qty: index === 1 ? 'x' : '1',
}));

const props: LiteEditableGridProps<Line> = {
  'aria-label': 'Lines', columns, rows, getRowId: row => row.id, onCellChange: () => undefined, height: 320,
};

describe('LiteEditableGrid', () => {
  it('renders only the rows in view plus overscan, as plain text cells', () => {
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, props));
    const rendered = html.match(/role="row"/g) ?? [];
    const { end } = computeRenderRange(0, 320, rows.length, 10);
    expect(rendered).toHaveLength(end + 1);
    expect(html).toContain('aria-rowcount="5001"');
    expect(html).toContain(`block-size:${rows.length * LITE_GRID_ROW_HEIGHT}px`);
    expect(html).not.toMatch(/<(input|textarea|select|button)\b/);
  });

  it('shows option text, read-only and invalid cells without mounting editors', () => {
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, props));
    expect(html).toContain('>Each<');
    expect(html).toContain('>Metre<');
    expect(html).toContain('>Beta<');
    expect(html).toMatch(/aria-readonly="true"[^>]*>C-0</);
    expect(html).toMatch(/aria-invalid="true"[^>]*title="Whole number required"/);
    expect(html).toContain('role="grid"');
    expect(html).toContain('tabindex="0"');
  });

  it('computes the render window from the scroll position', () => {
    expect(computeRenderRange(0, 320, 5000, 0)).toEqual({ start: 0, end: 10 });
    expect(computeRenderRange(3200, 320, 5000, 5)).toEqual({ start: 95, end: 115 });
    expect(computeRenderRange(10 ** 7, 320, 5000, 5)).toEqual({ start: 4995, end: 5000 });
    expect(computeRenderRange(0, 320, 3, 10)).toEqual({ start: 0, end: 3 });
  });

  it('filters combobox options by contained text', () => {
    const options = [{ value: 'a', text: 'Steel plate' }, { value: 'b', text: 'Copper' }];
    expect(filterLiteGridOptions(options, 'PLATE')).toEqual([options[0]]);
    expect(filterLiteGridOptions(options, ' ')).toBe(options);
  });

  it('rejects unnamed grids, duplicate keys and list editors without options', () => {
    expect(() => renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...props, 'aria-label': ' ' }))).toThrow('non-empty aria-label');
    expect(() => renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...props, columns: [columns[0]!, columns[0]!] }))).toThrow('unique');
    expect(() => renderToStaticMarkup(createElement(LiteEditableGrid<Line>, {
      ...props, columns: [{ key: 'unit', header: 'Unit', editor: 'select' }],
    }))).toThrow('needs options');
  });

  it('keeps hover grey and the active cell and selected option light green', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toMatch(/\.nidec-ui-lite-grid__row:hover \{\s*background: var\(--colorNeutralBackground1Hover\)/);
    expect(css).toMatch(/\.nidec-ui-lite-grid__cell\[aria-selected="true"\] \{\s*background: var\(--colorBrandBackground2\);\s*color: var\(--colorBrandForeground1\)/);
    expect(css).toMatch(/\.nidec-ui-lite-grid__option\[aria-selected="true"\]:hover \{\s*background: var\(--colorBrandBackground2\)/);
  });
});
