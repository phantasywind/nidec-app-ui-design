import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Lookup, createLookupAnchor } from '../src/index';
import type { LookupColumn, LookupProps } from '../src/index';
import {
  defaultFormatLookupMatchCount, moveLookupKey, resolveLookupSelection, sortLookupItems,
} from '../src/internal/components/lookup';

type CatalogItem = {
  code: string;
  name: string;
  spec: string;
  unit: string;
  leadDays: number;
};

const sampleItems: readonly CatalogItem[] = [
  { code: 'M0110061', name: 'Traction Drive', spec: 'WT 1000kg 1.75m/s', unit: 'EA', leadDays: 14 },
  { code: 'M0110053', name: 'Traction Drive', spec: 'WT 1000kg 1.0m/s', unit: 'EA', leadDays: 7 },
  { code: 'M0200102', name: 'Brake Assembly', spec: 'Dual coil 48V', unit: 'SET', leadDays: 21 },
];

const columns: readonly LookupColumn<CatalogItem>[] = [
  { key: 'code', header: 'Code', width: '9.5rem', getValue: item => item.code },
  { key: 'name', header: 'Name', width: '11rem', getValue: item => item.name },
  { key: 'spec', header: 'Specification', getValue: item => item.spec },
  { key: 'leadDays', header: 'Lead days', width: '6rem', getValue: item => item.leadDays },
  { key: 'unit', header: 'Unit', width: '4rem', sortable: false, getValue: item => item.unit },
];

const baseProps: LookupProps<CatalogItem> = {
  'aria-label': 'Primary item',
  title: 'Choose item',
  value: null,
  displayValue: '',
  columns,
  items: sampleItems,
  getItemKey: item => item.code,
  onSelect: () => undefined,
};

describe('Lookup', () => {
  it('renders a read-only input with a magnifying glass icon and dialog popup semantics', () => {
    const html = renderToStaticMarkup(createElement(Lookup<CatalogItem>, {
      ...baseProps,
      placeholder: 'Click to search items',
    }));
    expect(html).toContain('nidec-ui-lookup');
    expect(html).toContain('fui-Input');
    expect(html).toMatch(/readonly=""/i);
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Primary item"');
    expect(html).toContain('Click to search items');
    expect(html).toContain('nidec-ui-glyph');
    expect(html).not.toContain('nidec-ui-lookup-window');
  });

  it('displays the formatted value and tooltip title when an item is selected', () => {
    const html = renderToStaticMarkup(createElement(Lookup<CatalogItem>, {
      ...baseProps,
      value: 'M0110053',
      displayValue: 'M0110053  Traction Drive',
    }));
    expect(html).toContain('value="M0110053  Traction Drive"');
    expect(html).toContain('title="M0110053  Traction Drive"');
  });

  it('builds a virtual PositioningVirtualElement anchor from a DOMRect', () => {
    const rect = { x: 10, y: 20, width: 120, height: 32, top: 20, right: 130, bottom: 52, left: 10, toJSON: () => ({}) } as DOMRect;
    const anchor = createLookupAnchor(rect);
    expect(anchor.getBoundingClientRect()).toBe(rect);
  });

  it('sorts lookup rows by text and numeric columns without mutating input', () => {
    const byCodeAsc = sortLookupItems(sampleItems, columns, { key: 'code', ascending: true });
    expect(byCodeAsc.map(item => item.code)).toEqual(['M0110053', 'M0110061', 'M0200102']);
    expect(sampleItems[0]?.code).toBe('M0110061');

    const byLeadDesc = sortLookupItems(sampleItems, columns, { key: 'leadDays', ascending: false });
    expect(byLeadDesc.map(item => item.leadDays)).toEqual([21, 14, 7]);

    const unsortable = sortLookupItems(sampleItems, columns, { key: 'unit', ascending: true });
    expect(unsortable.map(item => item.code)).toEqual(['M0110061', 'M0110053', 'M0200102']);
  });

  it('moves active keyboard selection within list bounds', () => {
    const getKey = (item: CatalogItem) => item.code;
    expect(moveLookupKey(sampleItems, getKey, null, 1)).toBe('M0110061');
    expect(moveLookupKey(sampleItems, getKey, 'M0110061', 1)).toBe('M0110053');
    expect(moveLookupKey(sampleItems, getKey, 'M0200102', 1)).toBe('M0200102');
    expect(moveLookupKey(sampleItems, getKey, 'M0110061', -1)).toBe('M0110061');
    expect(moveLookupKey([], getKey, null, 1)).toBeNull();
  });

  it('resolves Enter confirmation to active row, sole match, or exact key match', () => {
    const getKey = (item: CatalogItem) => item.code;
    expect(resolveLookupSelection(sampleItems, getKey, 'M0110053', '')?.code).toBe('M0110053');
    expect(resolveLookupSelection([sampleItems[2]!], getKey, null, 'bra')?.code).toBe('M0200102');
    expect(resolveLookupSelection(sampleItems, getKey, null, 'm0200102')?.code).toBe('M0200102');
    expect(resolveLookupSelection(sampleItems, getKey, null, 'traction')).toBeUndefined();
  });

  it('formats singular, plural, and truncated match counts', () => {
    expect(defaultFormatLookupMatchCount(1, 1)).toBe('1 match');
    expect(defaultFormatLookupMatchCount(3, 3)).toBe('3 matches');
    expect(defaultFormatLookupMatchCount(200, 660)).toBe('660 matches: the first 200 are listed, add words to narrow down');
  });

  it('keeps equal fixed height for results and manual panels and uses semantic tokens', async () => {
    const source = await readFile(new URL('../src/internal/components/lookup.ts', import.meta.url), 'utf8');
    expect(source).toContain("height: '300px'");
    expect(source).toContain('tokens.colorBrandBackground2');
    expect(source).toContain('tokens.colorBrandForeground1');
    expect(source).toContain('tokens.colorNeutralStroke2');
  });
});
