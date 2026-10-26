import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  ActiveBadge, Button, ChangeHistoryTable, CountBadge, EmptyState, FormGrid, FormGridItem, MatrixCellButton, RecordLink,
  RowEndStatus, SectionNavigation, SingleSelectDropdown, StickySaveBar, TableScrollRegion, TruncatedText, WorkspaceSection,
  BusinessNumberInput, numericColumnClassName,
} from '../src/index';

const css = await readFile(join(dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'components.css'), 'utf8');
const rule = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
};
const render = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element);

describe('select popups and width', () => {
  it('keep the listbox portal out of the page height so opening never scrolls the page', () => {
    expect(rule(':where([data-nidec-ui])[data-nidec-ui-portal-host] > [data-portal-node]:has(> [role="listbox"])')).toMatch(/block-size:\s*0/);
  });

  it('end the selected text in an ellipsis inside the trigger', () => {
    const html = render(createElement(SingleSelectDropdown, {
      'aria-label': 'Platform',
      options: [{ value: 'a', text: 'A very long platform name' }, { value: 'b', text: 'B' }],
      selectedOption: 'a',
    }));
    expect(html).toContain('>A very long platform name</span>');
  });

  it('fill the field inside a form grid', () => {
    expect(rule(':where([data-nidec-ui]) .nidec-ui-form-grid')).toMatch(/--nidec-ui-select-width:\s*100%/);
  });
});

describe('table viewport', () => {
  it('marks the requested viewport features on the region', () => {
    const html = render(createElement(TableScrollRegion, {
      'aria-label': 'Matrix', maxHeight: 400, frozenColumns: 2, pinnedScrollbar: true, children: 'table',
    }));
    expect(html).toContain('data-max-height=""');
    expect(html).toContain('data-frozen-columns="2"');
    expect(html).toContain('data-pinned-scrollbar=""');
    expect(html).toContain('max-block-size:400px');
    expect(html).toMatch(/class="nidec-ui-table-scroll-region__scrollbar"[^>]*hidden=""|hidden=""[^>]*class="nidec-ui-table-scroll-region__scrollbar"/);
  });

  it('renders the plain region without a frame by default', () => {
    const html = render(createElement(TableScrollRegion, { 'aria-label': 'Orders', children: 'table' }));
    expect(html).not.toContain('nidec-ui-table-scroll-frame');
    expect(html).not.toContain('data-frozen-columns');
  });

  it('rejects a fractional frozen column count', () => {
    expect(() => render(createElement(TableScrollRegion, { 'aria-label': 'Orders', frozenColumns: 1.5, children: 'table' }))).toThrow();
  });

  it('gives frozen cells a solid background and a divider after the last one', () => {
    expect(css).toMatch(/\[data-nidec-frozen="last"\][^{]*\{[^}]*box-shadow:\s*inset -1px 0 0 var\(--colorNeutralStroke2\)/);
  });

  it('right-aligns numeric columns with tabular figures', () => {
    expect(numericColumnClassName).toBe('nidec-ui-numeric-column');
    expect(css).toMatch(/\.nidec-ui-numeric-column[^{]*\{[^}]*font-variant-numeric:\s*tabular-nums/);
  });

  it('renders matrix cells as buttons with their state', () => {
    const html = render(createElement(MatrixCellButton, { matched: true, selected: true, children: 'Rule' }));
    expect(html).toContain('type="button"');
    expect(html).toContain('data-matched="true"');
    expect(html).toContain('aria-current="true"');
    expect(render(createElement(MatrixCellButton, {}))).not.toContain('data-matched');
  });

  it('truncates text on one line', () => {
    expect(render(createElement(TruncatedText, { children: 'Long name' }))).toContain('class="nidec-ui-truncated-text"');
    expect(rule(':where([data-nidec-ui]) .nidec-ui-truncated-text')).toMatch(/text-overflow:\s*ellipsis/);
  });
});

describe('record patterns', () => {
  it('opens a record by link or by button', () => {
    expect(render(createElement(RecordLink, { href: '/r/1', children: 'R-1' }))).toMatch(/<a [^>]*href="\/r\/1"/);
    expect(render(createElement(RecordLink, { onClick: () => undefined, children: 'R-1' }))).toMatch(/<button [^>]*type="button"/);
  });

  it('shows zero and large counts in full', () => {
    expect(render(createElement(CountBadge, { count: 0 }))).toContain('>0<');
    expect(render(createElement(CountBadge, { count: 1234 }))).toContain('>1234<');
    expect(() => render(createElement(CountBadge, { count: -1 }))).toThrow();
  });

  it('labels active state and row-end status', () => {
    expect(render(createElement(ActiveBadge, { active: false }))).toContain('Inactive');
    const html = render(createElement(RowEndStatus, { status: 'Done', children: '12 kg' }));
    expect(html).toContain('nidec-ui-row-end-status__value');
    expect(html).toContain('nidec-ui-row-end-status__status');
  });

  it('announces an empty list', () => {
    expect(render(createElement(EmptyState, { title: 'No matches' }))).toMatch(/role="status"[\s\S]*No matches/);
  });

  it('adds a count and header controls to a module title', () => {
    const html = render(createElement(WorkspaceSection, {
      title: 'Components', count: 3, headerContent: createElement('span', null, 'Version'), children: 'body',
    }));
    expect(html).toContain('nidec-ui-workspace-section--toolbar-header');
    expect(html).toContain('>3<');
    expect(html).toContain('Version');
  });

  it('shows filled and total counts in section navigation', () => {
    const html = render(createElement(SectionNavigation, {
      'aria-label': 'Sections', sticky: true, items: [{ id: 'a', label: 'General', href: '#a', count: 2, total: 5, countLabel: '2 of 5 filled' }],
    }));
    expect(html).toContain('2/5');
    expect(html).toContain('aria-label="2 of 5 filled"');
    expect(html).toContain('nidec-ui-section-navigation--sticky');
  });
});

describe('disabled reasons', () => {
  it('keeps a disabled command focusable when it has a reason', () => {
    const html = render(createElement(Button, { disabled: true, disabledReason: 'Resolve 2 lines first', disabledReasonDisplay: 'inline', children: 'Approve' }));
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toMatch(/ disabled=""/);
    expect(html).toContain('Resolve 2 lines first');
    expect(html).toMatch(/aria-describedby="[^"]+"/);
  });

  it('stays a plain disabled button without a reason', () => {
    expect(render(createElement(Button, { disabled: true, children: 'Approve' }))).toContain('disabled=""');
  });
});

describe('forms', () => {
  it('lays out fields of one width and lets a field take the row', () => {
    const html = render(createElement(FormGrid, { columns: 2, children: createElement(FormGridItem, { wide: true, children: 'Notes' }) }));
    expect(html).toContain('--nidec-ui-form-grid-columns:2');
    expect(html).toContain('nidec-ui-form-grid__item--wide');
  });

  it('formats a business number with grouping and a unit', () => {
    const html = render(createElement(BusinessNumberInput, { 'aria-label': 'Price', value: 12000.5, onValueChange: () => undefined, unit: 'CNY', fixedDecimals: true }));
    expect(html).toContain('value="12,000.50"');
    expect(html).toContain('inputMode="decimal"');
    expect(html).toContain('CNY');
  });

  it('shows changed fields as old and new values', () => {
    const html = render(createElement(ChangeHistoryTable, {
      'aria-label': 'History',
      entries: [{ id: '1', at: '22 Oct 2026', actor: 'Ann', action: 'Updated', changes: [{ field: 'Weight', from: '10', to: '12' }], reason: 'Supplier change' }],
    }));
    expect(html).toContain('<del');
    expect(html).toContain('Supplier change');
    expect(render(createElement(ChangeHistoryTable, { 'aria-label': 'History', entries: [] }))).toContain('No changes recorded yet.');
  });

  it('labels the sticky save bar', () => {
    expect(render(createElement(StickySaveBar, { message: 'Unsaved changes', actions: 'Save' }))).toContain('aria-label="Unsaved changes"');
  });
});
