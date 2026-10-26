import { createElement, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { withClass } from './with-class';

export type TableScrollRegionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'aria-label'> & {
  'aria-label': string;
  children: ReactNode;
  /**
   * Keeps the horizontal scrollbar at the bottom of the window while any part
   * of a wide table is on screen, instead of after its last row.
   */
  pinnedScrollbar?: boolean;
  /**
   * Maximum block size, as px or any CSS length (for example
   * `calc(100vh - 14rem)`). The region then also scrolls vertically and the
   * header row stays in view.
   */
  maxHeight?: number | string;
  /**
   * Leading columns that stay in place while the rest scroll sideways. A
   * grouped-table section row keeps its label at the left edge too.
   */
  frozenColumns?: number;
};

const useClientLayoutEffect = typeof document === 'undefined' ? () => undefined : useLayoutEffect;
const cellSelector = 'td, th, [role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]';
const rowSelector = 'tr, [role="row"]';

const cellsOf = (row: Element) => [...row.children].filter(child => child.matches(cellSelector)) as HTMLElement[];
const spanOf = (cell: HTMLElement) => (cell instanceof HTMLTableCellElement ? cell.colSpan : 1);

const headerCellSelector = 'thead th, .fui-TableHeader .fui-TableHeaderCell, .fui-DataGridHeader .fui-DataGridHeaderCell';

// Fluent table cells set `position: relative` in unlayered styles, which beat
// the package's layered stylesheet, so the sticky position is written inline.
const stick = (cell: HTMLElement, on: boolean) => {
  cell.style.position = on ? 'sticky' : '';
};

/** Keeps the header cells at the top of a fixed-height region. */
function stickHeader(region: HTMLElement, on: boolean) {
  for (const cell of region.querySelectorAll<HTMLElement>(headerCellSelector)) {
    stick(cell, on || cell.hasAttribute('data-nidec-frozen'));
    cell.style.insetBlockStart = on ? '0' : '';
  }
}

/** Pins the first `count` cells of every row at their cumulative offsets. Rows whose leading cells span columns are left alone. */
function freezeColumns(region: HTMLElement, count: number) {
  const rows = [...region.querySelectorAll(rowSelector)];
  const measured = rows.map(cellsOf).find(cells => cells.length >= count && cells.slice(0, count).every(cell => spanOf(cell) === 1));
  if (measured === undefined) return;
  const offsets: number[] = [];
  let edge = 0;
  for (const cell of measured.slice(0, count)) {
    offsets.push(edge);
    edge += cell.getBoundingClientRect().width;
  }
  for (const row of rows) {
    const cells = cellsOf(row);
    if (cells.slice(0, count).some(cell => spanOf(cell) !== 1)) continue;
    cells.forEach((cell, index) => {
      if (index < count) {
        stick(cell, true);
        cell.style.insetInlineStart = `${offsets[index]}px`;
        cell.setAttribute('data-nidec-frozen', index === count - 1 ? 'last' : 'true');
      } else if (cell.hasAttribute('data-nidec-frozen')) {
        stick(cell, false);
        cell.style.insetInlineStart = '';
        cell.removeAttribute('data-nidec-frozen');
      }
    });
  }
}

/**
 * Scroll container for a wide Table or DataGrid. By default it scrolls
 * sideways only: the vertical axis is clipped, so a horizontal scrollbar never
 * adds a second, vertical one. It is focusable so keyboard users can scroll it.
 *
 * `maxHeight` makes it a fixed-height viewport with a fixed header row,
 * `pinnedScrollbar` keeps the horizontal scrollbar on screen, and
 * `frozenColumns` keeps the leading columns in place.
 */
export function TableScrollRegion({
  'aria-label': ariaLabel,
  children,
  pinnedScrollbar = false,
  maxHeight,
  frozenColumns = 0,
  className,
  style,
  ...props
}: TableScrollRegionProps) {
  if (!ariaLabel.trim()) throw new Error('TableScrollRegion requires a non-empty aria-label.');
  if (!Number.isInteger(frozenColumns) || frozenColumns < 0) throw new Error('TableScrollRegion frozenColumns must be a non-negative integer.');
  const regionRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState<number | null>(null);

  const fixedHeader = maxHeight !== undefined;
  useClientLayoutEffect(() => {
    const region = regionRef.current;
    if (!region || (frozenColumns === 0 && !fixedHeader)) return undefined;
    const apply = () => {
      if (frozenColumns > 0) freezeColumns(region, frozenColumns);
      stickHeader(region, fixedHeader);
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    apply();
    const resize = new ResizeObserver(schedule);
    resize.observe(region);
    if (region.firstElementChild) resize.observe(region.firstElementChild);
    // Only added or removed rows and cells; the positions written here are attributes, so they never retrigger it.
    const mutation = new MutationObserver(schedule);
    mutation.observe(region, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
    };
  }, [frozenColumns, fixedHeader]);

  useClientLayoutEffect(() => {
    const region = regionRef.current;
    if (!region || !pinnedScrollbar) return undefined;
    const measure = () => setScrollWidth(region.scrollWidth > region.clientWidth + 1 ? region.scrollWidth : null);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(region);
    if (region.firstElementChild) resize.observe(region.firstElementChild);
    const follow = () => {
      const bar = barRef.current;
      if (bar && bar.scrollLeft !== region.scrollLeft) bar.scrollLeft = region.scrollLeft;
    };
    region.addEventListener('scroll', follow, { passive: true });
    return () => {
      resize.disconnect();
      region.removeEventListener('scroll', follow);
    };
  }, [pinnedScrollbar]);

  const regionStyle: CSSProperties | undefined = maxHeight === undefined ? style : {
    ...style,
    maxBlockSize: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
  };
  const region = createElement('div', {
    tabIndex: 0,
    ...props,
    ref: regionRef,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-table-scroll-region', className),
    ...(maxHeight === undefined ? {} : { 'data-max-height': '' }),
    ...(frozenColumns > 0 ? { 'data-frozen-columns': frozenColumns } : {}),
    ...(pinnedScrollbar ? { 'data-pinned-scrollbar': '' } : {}),
    role: 'region',
    style: regionStyle,
  }, children);
  if (!pinnedScrollbar) return region;

  // The region keeps keyboard scrolling; this bar repeats its scrollbar for the pointer and is hidden from assistive technology.
  return createElement('div', { className: 'nidec-ui-table-scroll-frame' },
    region,
    createElement('div', {
      'aria-hidden': true,
      className: 'nidec-ui-table-scroll-region__scrollbar',
      hidden: scrollWidth === null,
      onScroll: () => {
        const bar = barRef.current;
        const target = regionRef.current;
        if (bar && target && target.scrollLeft !== bar.scrollLeft) target.scrollLeft = bar.scrollLeft;
      },
      ref: barRef,
      tabIndex: -1,
    }, createElement('div', { style: { blockSize: '1px', inlineSize: `${scrollWidth ?? 0}px` } })));
}

/**
 * Class for a numeric column's header cell and body cells: both align to the
 * end, and digits use tabular figures so values line up.
 */
export const numericColumnClassName = 'nidec-ui-numeric-column';
