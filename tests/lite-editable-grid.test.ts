import { createElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LiteEditableGrid } from '../src/index';
import type { LiteEditableGridColumn, LiteEditableGridProps } from '../src/index';
import {
  buildLiteGridLayout, computeRenderRange, filterLiteGridOptions, LITE_GRID_ROW_HEIGHT, splitLiteGridValues,
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
    expect(html).toMatch(/aria-readonly="true"[^>]*>C-0<span aria-hidden="true" class="nidec-ui-lite-grid__lock"><svg/);
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

  it('renders multiselect values as removable tags with a count tag for the rest', () => {
    type Tagged = { id: string; regions: string[] };
    const options = [{ value: 'a', text: 'Asia' }, { value: 'e', text: 'Europe' }, { value: 'm', text: 'Americas' }];
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Tagged>, {
      'aria-label': 'Tags', getRowId: row => row.id, onCellChange: () => undefined,
      columns: [{ key: 'regions', header: 'Regions', editor: 'multiselect', options }],
      rows: [{ id: '1', regions: ['m', 'a', 'e'] }],
    }));
    expect(html).toContain('data-remove="a"');
    expect(html).toContain('aria-label="Remove Asia"');
    expect(html).toContain('>+1<');
    expect(html).toContain('title="Asia, Europe, Americas"');
    expect(splitLiteGridValues('m,a', options)).toEqual(['a', 'm']);
    expect(() => renderToStaticMarkup(createElement(LiteEditableGrid<Tagged>, {
      'aria-label': 'Tags', getRowId: row => row.id, onCellChange: () => undefined, rows: [],
      columns: [{ key: 'regions', header: 'Regions', editor: 'multiselect', options: [{ value: 'a,b', text: 'AB' }] }],
    }))).toThrow('must not contain a comma');
  });

  it('lays out two-level groups in first-appearance order and hides collapsed rows', () => {
    const items = [
      { id: 'a', path: ['Electrical', 'Drives'] }, { id: 'b', path: ['Mechanical'] },
      { id: 'c', path: ['Electrical', 'Cables'] }, { id: 'd', path: ['Electrical', 'Drives'] }, { id: 'e', path: [] as string[] },
    ];
    const describe = (collapsed: string[]) => {
      const layout = buildLiteGridLayout(items, item => item.path, new Set(collapsed));
      return Array.from({ length: layout.count }, (_, position) => {
        const section = layout.sectionAt(position);
        return section ? `${section.key}(${section.count})` : `${items[layout.rowAt(position)]!.id}@${layout.depthAt(position)}`;
      });
    };
    expect(describe([])).toEqual([
      'Electrical(3)', 'Electrical / Drives(2)', 'a@2', 'd@2', 'Electrical / Cables(1)', 'c@2', 'Mechanical(1)', 'b@1', 'e@0',
    ]);
    expect(describe(['Electrical / Drives'])).toEqual([
      'Electrical(3)', 'Electrical / Drives(2)', 'Electrical / Cables(1)', 'c@2', 'Mechanical(1)', 'b@1', 'e@0',
    ]);
    expect(describe(['Electrical'])).toEqual(['Electrical(3)', 'Mechanical(1)', 'b@1', 'e@0']);
    expect(() => buildLiteGridLayout([{ path: ['a', 'b', 'c'] }], item => item.path, new Set())).toThrow('two group levels');
  });

  it('renders section rows with an accessible count, summary and expansion state', () => {
    type Grouped = { id: string; group: string; code: string };
    const groupedRows: Grouped[] = [{ id: '1', group: 'Electrical', code: 'A' }, { id: '2', group: 'Mechanical', code: 'B' }];
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Grouped>, {
      'aria-label': 'Grouped', getRowId: row => row.id, onCellChange: () => undefined, rows: groupedRows,
      columns: [{ key: 'code', header: 'Code' }],
      getRowGroup: row => [row.group],
      defaultCollapsedGroups: ['Mechanical'],
      getGroupSummary: group => (group.label === 'Mechanical' ? '1 modified' : undefined),
    }));
    expect(html).toContain('aria-rowcount="4"');
    expect(html).toContain('aria-label="Electrical, 1 row"');
    expect(html).toContain('aria-label="Mechanical, 1 row, 1 modified"');
    expect(html).toMatch(/aria-expanded="true"[^>]*aria-label="Electrical/);
    expect(html).toMatch(/aria-expanded="false"[^>]*aria-label="Mechanical/);
    expect(html).toContain('>A<');
    expect(html).not.toContain('>B<');
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

  describe('row edit mode', () => {
    const few = rows.slice(0, 6);
    const rowProps: LiteEditableGridProps<Line> = {
      'aria-label': 'Lines', columns, rows: few, getRowId: row => row.id, editMode: 'row', onRowChange: () => undefined,
    };

    it('renders every row as plain text with a 40px default height and an edit action per row', () => {
      const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, rowProps));
      expect(html).toContain('data-edit-mode="row"');
      expect(html).toContain('--nidec-ui-lite-grid-row-height:40px');
      expect(html.match(/data-row-id=/g)).toHaveLength(few.length);
      expect(html).toContain('aria-colcount="6"');
      expect(html).toContain('>Actions<');
      expect(html.match(/aria-label="Edit row \d"/g)).toHaveLength(few.length);
      expect(html).not.toMatch(/<(input|textarea)\b/);
    });

    it('accepts row heights 32, 48 and auto', () => {
      expect(renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...rowProps, rowHeight: 32 }))).toContain('--nidec-ui-lite-grid-row-height:32px');
      expect(renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...rowProps, rowHeight: 48 }))).toContain('--nidec-ui-lite-grid-row-height:48px');
      const auto = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...rowProps, rowHeight: 'auto' }));
      expect(auto).toContain('data-row-height="auto"');
      expect(auto).toContain('--nidec-ui-lite-grid-row-height:40px');
    });

    it('turns only the editing row into boxless fields with confirm and cancel', () => {
      const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...rowProps, editingRowId: '1' }));
      expect(html.match(/data-editing="true"/g)).toHaveLength(1);
      // Combobox and quantity are inputs, the note a textarea, the unit a list value.
      expect(html.match(/<input\b/g)).toHaveLength(2);
      expect(html.match(/<textarea\b/g)).toHaveLength(1);
      expect(html.match(/class="nidec-ui-lite-grid__field-list"/g)).toHaveLength(2);
      expect(html.match(/class="nidec-ui-lite-grid__field"/g)).toHaveLength(4);
      expect(html).toContain('aria-label="Confirm row 1"');
      expect(html).toContain('aria-label="Cancel row 1"');
      // Row 1 has an invalid quantity, so it cannot be confirmed yet.
      expect(html).toMatch(/aria-label="Confirm row 1"[^>]*disabled=""|disabled=""[^>]*aria-label="Confirm row 1"/);
      expect(html.match(/aria-label="Edit row \d"/g)).toHaveLength(few.length - 1);
    });

    it('disables the edit action with a reason from canEditRow', () => {
      const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, {
        ...rowProps, canEditRow: row => (row.id === '2' ? 'Locked by approval' : true),
      }));
      expect(html).toMatch(/aria-label="Edit row 2"[^>]*aria-disabled="true"/);
      expect(html).not.toMatch(/aria-label="Edit row 3"[^>]*aria-disabled="true"/);
    });

    it('caps the height with maxHeight', () => {
      expect(renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...rowProps, maxHeight: 'calc(100vh - 320px)' })))
        .toContain('max-block-size:calc(100vh - 320px)');
    });

    it('draws the editing row as a light green row with semibold values and a brand underline on focus', async () => {
      const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
      expect(css).toMatch(/\[data-edit-mode="row"\] \.nidec-ui-lite-grid__row\[data-editing="true"\] \{\s*background: var\(--colorBrandBackground2\)/);
      // Locke dropped the green text on review (2026-10-26): values are neutral and semibold.
      expect(css).toMatch(/\.nidec-ui-lite-grid__field-input,[^{]*\{[^}]*color: var\(--colorNeutralForeground1\);[^}]*font-weight: var\(--fontWeightSemibold\)/s);
      expect(css).toMatch(/\.nidec-ui-lite-grid__field\[data-focused="true"\] \{\s*box-shadow: inset 0 -2px 0 var\(--colorCompoundBrandStroke\)/);
    });
  });

  it('uses a decimal keyboard for the number editor and right-aligns it by default', () => {
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, {
      ...props, columns: [...columns.slice(0, 4), { key: 'qty', header: 'Qty', editor: 'number' }],
    }));
    expect(html).toMatch(/data-align="end"[^>]*data-editor="number"/);
    const editing = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, {
      'aria-label': 'Lines', columns: [{ key: 'qty', header: 'Qty', editor: 'number' }], rows: rows.slice(0, 2),
      getRowId: row => row.id, editMode: 'row', onRowChange: () => undefined, editingRowId: '0',
    }));
    expect(editing).toMatch(/<input[^>]*inputMode="decimal"/);
  });

  it('renders every row in flow for auto row height in cell mode', async () => {
    const html = renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...props, rows: rows.slice(0, 300), rowHeight: 'auto' }));
    expect(html).toContain('data-edit-mode="cell"');
    expect(html).toContain('data-row-height="auto"');
    expect(html.match(/class="nidec-ui-lite-grid__row"/g)).toHaveLength(300);
    expect(html).not.toContain('translateY');
    expect(html).toContain('--nidec-ui-lite-grid-row-height:40px');
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    // The cell editor is a white field with the brand underline and no frame.
    expect(css).toMatch(/\.nidec-ui-lite-grid__editor \{\s*background: var\(--colorNeutralBackground1\);\s*box-shadow: inset 0 -2px 0 var\(--colorCompoundBrandStroke\)/);
  });

  it('sizes cell mode rows by rowHeight', () => {
    expect(renderToStaticMarkup(createElement(LiteEditableGrid<Line>, { ...props, rowHeight: 48 })))
      .toContain(`block-size:${rows.length * 48}px`);
  });
});
