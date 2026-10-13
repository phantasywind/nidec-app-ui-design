import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MultiSelectDropdown } from '../src/index';
import type { MultiSelectDropdownProps } from '../src/index';

const options = [
  { value: 'a', text: 'Alpha' },
  { value: 'b', text: 'Beta' },
  { value: 'c', text: 'Gamma' },
  { value: 'd', text: 'Delta', disabled: true },
] as const;
const contract: MultiSelectDropdownProps = { 'aria-label': 'Categories', options };
const render = (props: Partial<MultiSelectDropdownProps>) =>
  renderToStaticMarkup(createElement(MultiSelectDropdown, { ...contract, ...props }));

describe('MultiSelectDropdown', () => {
  it('renders a Fluent dropdown trigger with the placeholder when nothing is selected', () => {
    const html = render({ placeholder: 'Select categories' });
    expect(html).toContain('role="combobox"');
    expect(html).toContain('fui-Dropdown');
    expect(html).toContain('nidec-ui-multi-select-dropdown');
    expect(html).toContain('Select categories');
    expect(html).not.toContain('fui-Tag');
  });

  it('shows selected values as brand tags in option order, with the full list for assistive technology', () => {
    const html = render({ selectedOptions: ['b', 'a'] });
    const tags = [...html.matchAll(/class="fui-Tag__primaryText[^"]*">([^<]+)</g)].map(match => match[1]);
    expect(tags).toEqual(['Alpha', 'Beta']);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('>Alpha, Beta<');
  });

  it('collapses selections beyond maxVisibleTags into a count tag', () => {
    const html = render({ selectedOptions: ['a', 'b', 'c'], maxVisibleTags: 1 });
    expect(html).toContain('nidec-ui-multi-select-dropdown__overflow');
    expect(html).toContain('>+2<');
    expect(html).toContain('>Alpha, Beta, Gamma<');
    const custom = render({ selectedOptions: ['a', 'b', 'c'], maxVisibleTags: 1, formatOverflowText: count => `${count} more` });
    expect(custom).toContain('>2 more<');
  });

  it('uses the uncontrolled default selection', () => {
    const html = render({ defaultSelectedOptions: ['c'] });
    expect(html).toContain('>Gamma<');
    expect(html).not.toContain('nidec-ui-multi-select-dropdown__overflow');
  });

  it('gives checked multiselect options the shared green selected fill', async () => {
    const source = await readFile(new URL('../src/internal/components/option.ts', import.meta.url), 'utf8');
    expect(source).toMatch(/'&\[aria-checked="true"\]:not\(\[aria-disabled="true"\]\)': \{\s*backgroundColor: tokens\.colorBrandBackground2,\s*color: tokens\.colorBrandForeground1,/);
  });

  it('can list the selection as removable tags below a short trigger, with Clear all', () => {
    const html = render({ tagPlacement: 'below', selectedOptions: ['a', 'c'], placeholder: 'Pick' });
    expect(html).toContain('nidec-ui-multi-select-dropdown--tags-below');
    expect(html).toContain('value="2 selected"');
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('aria-label="Remove Alpha"');
    expect(html).toContain('aria-label="Remove Gamma"');
    expect(html).toContain('>Clear all<');
    expect(html).not.toContain('nidec-ui-multi-select-dropdown__overflow');
    expect(render({ tagPlacement: 'below', placeholder: 'Pick' })).not.toContain('Clear all');
  });

  it('searches with a multiselect Combobox only when tags are below', () => {
    const html = render({ tagPlacement: 'below', searchable: true, selectedOptions: ['b'] });
    expect(html).toContain('fui-Combobox');
    expect(html).toContain('placeholder="1 selected"');
    expect(() => render({ searchable: true })).toThrow('tagPlacement="below"');
  });

  it('rejects ambiguous option data and unknown selections', () => {
    expect(() => render({ options: [{ value: 'a', text: 'Alpha' }, { value: 'a', text: 'Again' }] })).toThrow('must be unique');
    expect(() => render({ options: [{ value: ' ', text: 'Blank' }] })).toThrow('non-empty values and text');
    expect(() => render({ maxVisibleTags: 0 })).toThrow('positive integer');
    expect(() => render({ selectedOptions: ['missing'] })).toThrow('must match an option: missing');
  });
});

// @ts-expect-error The component owns its options; children are not accepted.
const withChildren: MultiSelectDropdownProps = { ...contract, children: 'Invalid' };
// @ts-expect-error Display text is derived from the selection, not passed in.
const withValue: MultiSelectDropdownProps = { ...contract, value: 'Alpha' };
// @ts-expect-error Multiple selection is fixed.
const withMultiselect: MultiSelectDropdownProps = { ...contract, multiselect: false };
const withHandler: MultiSelectDropdownProps = { ...contract, onOptionSelect: (_, data) => { void data.selectedOptions; } };
void [withChildren, withValue, withMultiselect, withHandler];
