import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  BusinessProcessFlow, FactList, FormDrawer, NidecProvider, PageHeader, Pagination, SectionNavigation, SegmentedControl, SingleSelectDropdown,
  StepStatusIcon, TableScrollRegion, WorkspaceStack, nidecLightTheme,
} from '../src/index';
import type { PaginationProps } from '../src/index';
import * as layouts from '../src/layouts';
import {
  BusinessDatePicker, businessDateToDate, dateToBusinessDate, formatBusinessDate, parseBusinessDate,
} from '../src/date-picker';

const css = await readFile(join(dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'components.css'), 'utf8');
const rule = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
};
const render = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element);

describe('NidecProvider portals', () => {
  it('still renders the scoped host on the server, where no portal host exists', () => {
    const html = render(createElement(NidecProvider, { theme: nidecLightTheme, children: 'Fixture' }));
    expect(html).toContain('data-nidec-ui=""');
  });

  it('keeps the portal host out of layout', () => {
    expect(rule(':where([data-nidec-ui])[data-nidec-ui-portal-host]')).toMatch(/display:\s*contents/);
  });
});

describe('horizontal scroll containers', () => {
  it('scroll sideways only, so a horizontal scrollbar never adds a vertical one', () => {
    expect(rule('.nidec-ui-table-scroll-region')).toMatch(/overflow-x:\s*auto;[\s\S]*overflow-y:\s*hidden/);
    expect(rule(':where([data-nidec-ui]) .nidec-ui-versioned-workspace__content')).toMatch(/overflow-y:\s*hidden/);
    const html = render(createElement(TableScrollRegion, { 'aria-label': 'Orders table', children: 'table' }));
    expect(html).toContain('role="region"');
    expect(html).toContain('tabindex="0"');
  });
});

describe('Pagination', () => {
  const base: PaginationProps = { 'aria-label': 'Results pages', page: 2, pageSize: 25, totalCount: 60, onPageChange: () => undefined };

  it('shows the range and enables both steps in the middle of the list', () => {
    const html = render(createElement(Pagination, base));
    expect(html).toContain('26–50 of 60');
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-label="Next page"');
    expect(html).not.toContain('disabled=""');
  });

  it('disables previous on the first page and next on the last', () => {
    expect(render(createElement(Pagination, { ...base, page: 1 }))).toMatch(/aria-label="Previous page"[^>]*disabled=""|disabled=""[^>]*aria-label="Previous page"/);
    const last = render(createElement(Pagination, { ...base, page: 3 }));
    expect(last).toContain('51–60 of 60');
    expect(last).toMatch(/aria-label="Next page"[^>]*disabled=""|disabled=""[^>]*aria-label="Next page"/);
  });

  it('reads 0 of 0 for an empty list and offers a page size only with a handler', () => {
    expect(render(createElement(Pagination, { ...base, page: 1, totalCount: 0 }))).toContain('0 of 0');
    expect(render(createElement(Pagination, { ...base, pageSizeOptions: [25, 50] }))).not.toContain('Rows per page');
    expect(render(createElement(Pagination, { ...base, pageSizeOptions: [25, 50], onPageSizeChange: () => undefined }))).toContain('Rows per page');
  });

  it('rejects a page outside the list', () => {
    expect(() => render(createElement(Pagination, { ...base, page: 4 }))).toThrow('between 1 and 3');
  });
});

describe('FactList', () => {
  it('renders labels above values in a description list, with a dash for empty values', () => {
    const html = render(createElement(FactList, {
      title: 'Site', facts: [{ label: 'Owner', value: 'Alex' }, { label: 'Due', value: '' }, { label: 'Notes' }],
    }));
    expect(html).toContain('<h3 class="nidec-ui-fact-list__title">Site</h3>');
    expect(html).toContain('<dt class="nidec-ui-fact-list__label">Owner</dt>');
    expect(html.match(/data-empty="true">—</g)).toHaveLength(2);
    expect(rule('.nidec-ui-fact-list__value')).toMatch(/font-weight:\s*var\(--fontWeightSemibold\)/);
    expect(rule('.nidec-ui-fact-list__label')).toMatch(/font-size:\s*var\(--fontSizeBase200\)/);
  });
});

describe('SingleSelectDropdown', () => {
  const options = Array.from({ length: 12 }, (_, index) => ({ value: `v${index}`, text: `Option ${index}` }));

  it('uses a Dropdown below the search threshold and a Combobox at it', () => {
    const short = render(createElement(SingleSelectDropdown, { 'aria-label': 'Pick', options: options.slice(0, 11), selectedOption: 'v3' }));
    expect(short).toContain('fui-Dropdown');
    expect(short).toContain('Option 3');
    const long = render(createElement(SingleSelectDropdown, { 'aria-label': 'Pick', options, selectedOption: 'v3' }));
    expect(long).toContain('fui-Combobox');
    expect(long).toContain('value="Option 3"');
  });

  it('rejects a selection that is not an option', () => {
    expect(() => render(createElement(SingleSelectDropdown, { 'aria-label': 'Pick', options, selectedOption: 'x' }))).toThrow('must match an option');
  });
});

describe('BusinessDatePicker', () => {
  it('converts yyyy-MM-dd without passing through UTC', () => {
    const date = businessDateToDate('2026-10-22')!;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 22]);
    expect(dateToBusinessDate(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
    expect(businessDateToDate('2026-02-30')).toBeNull();
  });

  it('formats as 22 Oct 2026 and parses ISO and display text', () => {
    expect(formatBusinessDate(new Date(2026, 9, 22))).toBe('22 Oct 2026');
    for (const text of ['2026-10-22', '22 Oct 2026', '22 october 2026', ' 22 Oct. 2026 ']) {
      expect(dateToBusinessDate(parseBusinessDate(text)!)).toBe('2026-10-22');
    }
    expect(parseBusinessDate('31 Feb 2026')).toBeNull();
    expect(parseBusinessDate('Oct 22')).toBeNull();
  });

  it('shows the display format in the field and rejects an invalid value', () => {
    const html = render(createElement(BusinessDatePicker, { 'aria-label': 'Due', value: '2026-10-22', onValueChange: () => undefined }));
    expect(html).toContain('value="22 Oct 2026"');
    expect(() => render(createElement(BusinessDatePicker, { 'aria-label': 'Due', value: '22/10/2026', onValueChange: () => undefined }))).toThrow('yyyy-MM-dd');
  });
});

describe('FormDrawer', () => {
  it('renders nothing while closed and requires a close label', () => {
    expect(render(createElement(FormDrawer, { open: false, onDismiss: () => undefined, title: 'Edit', children: 'Body' }))).not.toContain('Body');
    expect(() => render(createElement(FormDrawer, { open: false, onDismiss: () => undefined, title: 'Edit', closeLabel: ' ', children: 'Body' }))).toThrow('closeLabel');
  });
});

describe('SectionNavigation', () => {
  const items = [{ id: 'overview', label: 'Overview' }, { id: 'delivery', label: 'Delivery', count: 3 }];

  it('links to same-page sections and marks the current one', () => {
    const html = render(createElement(SectionNavigation, { 'aria-label': 'Record sections', items, currentId: 'delivery' }));
    expect(html).toContain('href="#overview"');
    expect(html).toMatch(/aria-current="location"[^>]*href="#delivery"|href="#delivery"[^>]*aria-current="location"/);
    expect(html).toContain('nidec-ui-section-navigation--horizontal');
    expect(html).toContain('<span class="nidec-ui-section-navigation__count">3</span>');
  });

  it('uses semibold 16px links with grey hover in the horizontal row', () => {
    expect(rule('.nidec-ui-section-navigation--horizontal .nidec-ui-section-navigation__link')).toMatch(/font-size:\s*var\(--fontSizeBase400\);[\s\S]*font-weight:\s*var\(--fontWeightSemibold\)/);
    expect(rule('.nidec-ui-section-navigation__link:hover')).toMatch(/background:\s*var\(--colorNeutralBackground1Hover\)/);
  });

  it('rejects duplicate ids', () => {
    expect(() => render(createElement(SectionNavigation, { 'aria-label': 'x', items: [items[0]!, items[0]!] }))).toThrow('unique');
  });
});

describe('StepStatusIcon', () => {
  it('names the status for assistive technology and makes a tooltip reachable by keyboard', () => {
    const html = render(createElement(StepStatusIcon, { status: 'done', label: 'Painting done', tooltip: '22 Oct 2026' }));
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Painting done"');
    expect(html).toContain('data-status="done"');
    expect(html).toContain('tabindex="0"');
    expect(render(createElement(StepStatusIcon, { status: 'pending', label: 'Painting' }))).not.toContain('tabindex');
  });
});

describe('page header, stack and segmented control', () => {
  it('places a title adornment beside the single h1', () => {
    const html = render(createElement(PageHeader, { title: createElement('span', {}, 'Record 1'), titleAdornment: 'Open' }));
    expect(html).toMatch(/<div class="nidec-ui-page-header__heading"><h1[^>]*><span>Record 1<\/span><\/h1><div class="nidec-ui-page-header__adornment">Open<\/div><\/div>/);
  });

  it('stacks modules with the 12px module gap', () => {
    expect(render(createElement(WorkspaceStack, { children: 'x' }))).toContain('nidec-ui-workspace-stack');
    expect(rule('.nidec-ui-workspace-stack')).toMatch(/gap:\s*var\(--spacingVerticalM\)/);
  });

  it('allows no selected option', () => {
    const html = render(createElement(SegmentedControl, {
      'aria-label': 'Filter', value: null, onValueChange: () => undefined,
      options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
    }));
    expect(html).not.toContain('aria-checked="true"');
  });
});

describe('application frame additions', () => {
  it('adds a breadcrumb row, a navigation footer and item badges', () => {
    const topBar = render(createElement(layouts.ApplicationTopBar, { location: 'App', breadcrumb: 'Records / R-1' }));
    expect(topBar).toContain('nidec-ui-application-topbar--with-breadcrumb');
    expect(topBar.indexOf('App')).toBeLessThan(topBar.indexOf('Records / R-1'));
    const navigation = render(createElement(layouts.ApplicationNavigation, {
      'aria-label': 'Primary', footer: 'v1.0.0',
      children: createElement(layouts.ApplicationNavigationItem, { href: '/work', label: 'My work', badge: '3' }),
    }));
    expect(navigation).toContain('nidec-ui-application-navigation__footer');
    expect(navigation).toContain('<span class="nidec-ui-application-navigation__badge">3</span>');
    expect(rule(':where([data-nidec-ui]) .nidec-ui-application-frame__navigation')).toMatch(/align-self:\s*start;[\s\S]*height:\s*100vh/);
  });

  it('can wrap the directory toolbar, results and pagination in one titled module', () => {
    const html = render(createElement(layouts.DirectoryWorkspace, {
      'aria-label': 'Records', header: 'Header', toolbar: 'Toolbar', results: 'Results', resultsLabel: 'Record results',
      pagination: 'Pagination', resultsTitle: 'Records (60)',
    }));
    const module = html.indexOf('nidec-ui-directory-workspace__module');
    expect(module).toBeGreaterThan(html.indexOf('Header'));
    expect(html).toContain('<h2 class="nidec-ui-workspace-section__title">Records (60)</h2>');
    expect(html.indexOf('Toolbar')).toBeGreaterThan(module);
    expect(html.indexOf('Pagination')).toBeGreaterThan(html.indexOf('Results'));
  });
});

describe('BusinessProcessFlow follow-up', () => {
  const stages = [
    { id: 'a', label: 'Draft', status: 'completed', statusLabel: 'Completed' },
    { id: 'b', label: 'Evidence collection and preparation', status: 'current', statusLabel: 'Current' },
    { id: 'c', label: 'Review', status: 'revisit', statusLabel: 'Reached before, must be redone' },
    { id: 'd', label: 'Approved', status: 'upcoming', statusLabel: 'Upcoming' },
  ] as const;

  it('makes a revisit stage viewable, unlike an upcoming one', () => {
    const html = render(createElement(BusinessProcessFlow, { 'aria-label': 'Flow', stages, viewedStageId: 'c', onStageView: () => undefined }));
    expect(html).toMatch(/data-stage-status="revisit" data-viewed="true"><button/);
    expect(html).toMatch(/data-stage-status="upcoming"><div/);
    expect(rule(':where([data-nidec-ui]) .nidec-ui-business-process-flow__stage[data-stage-status="revisit"] > .nidec-ui-business-process-flow__body')).toMatch(/background-image:\s*repeating-linear-gradient/);
  });

  it('wraps long stage names onto two lines with the full name as a title', () => {
    const html = render(createElement(BusinessProcessFlow, { 'aria-label': 'Flow', stages }));
    expect(html).toContain('<strong title="Evidence collection and preparation">');
    expect(css).toMatch(/-webkit-line-clamp:\s*2;[\s\S]*white-space:\s*normal/);
  });
});
