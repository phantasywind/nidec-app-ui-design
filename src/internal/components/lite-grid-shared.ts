import { createElement as h } from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

// Types and helpers shared by LiteEditableGrid (cell edit) and LiteRowEditGrid (row edit).

export const DEFAULT_COLUMN_WIDTH = 160;

export type LiteEditableGridEditor = 'text' | 'number' | 'longText' | 'select' | 'combobox' | 'multiselect' | 'none';

export type LiteEditableGridOption = Readonly<{ value: string; text: string }>;

export type LiteEditableGridColumn<Row> = Readonly<{
  /** Stable column key; also the default property read from each row. */
  key: string;
  header: string;
  /** Width in px. Default 160. The last column stretches to fill spare width. */
  width?: number;
  /**
   * Dedicated cell editor. Default `text`; `number` is a text editor with a numeric keyboard,
   * aligned to the end; `none` makes the column read-only.
   */
  editor?: LiteEditableGridEditor;
  align?: 'start' | 'end';
  /** Choices for `select`, `combobox` and `multiselect`. A cell shows the text of the option whose value it holds. */
  options?: readonly LiteEditableGridOption[];
  /** `multiselect` only: tags shown in a cell before the rest collapse into a count tag. Default 2. */
  maxVisibleTags?: number;
  /** `multiselect` only: accessible name of a tag's remove button. Default `Remove <text>`. */
  formatRemoveLabel?: (text: string) => string;
  /** `combobox` only: accept typed text that matches no option. Default true. */
  freeform?: boolean;
  /**
   * Reads the cell value. Default `String(row[key] ?? '')`; for `multiselect`
   * an array value is joined with commas, so option values must not contain one.
   */
  getValue?: (row: Row) => string;
  /**
   * Display text of a cell that is not being edited, such as an amount with its
   * currency (see `formatCurrency`); editors, copy and `onCellChange` keep the raw value.
   * Not used by list editors, which show their option text.
   */
  format?: (value: string, row: Row) => string;
  /** Returns a message when the value is invalid; the cell is then marked and the message is its tooltip. */
  validate?: (value: string, row: Row) => string | undefined;
}>;

export type LiteEditableGridCellChange<Row> = Readonly<{
  rowId: string;
  rowIndex: number;
  columnKey: string;
  /** New value; for `multiselect` the selected option values joined with commas. */
  value: string;
  /** `multiselect` only: the selected option values in option order. */
  values?: readonly string[];
  row: Row;
}>;

/** One collapsible section of a grouped grid, as passed to `getGroupSummary`. */
export type LiteEditableGridGroup = Readonly<{
  /** The path labels joined with ` / `; the key used in `collapsedGroups`. */
  key: string;
  path: readonly string[];
  label: string;
  level: 0 | 1;
  /** Indices into `rows` of every row in the section, sublevels included. */
  rowIndexes: readonly number[];
  expanded: boolean;
}>;

/** Props both grids share. */
export type LiteGridCommonProps<Row> = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'onChange' | 'onCopy' | 'onPaste'> & {
  'aria-label': string;
  /** Keep this array stable (module constant or useMemo); a new array re-renders every visible row. */
  columns: readonly LiteEditableGridColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  /** Rows rendered beyond each edge of the viewport when rows have a fixed height. Default 10. */
  overscan?: number;
  /** Called when the active row changes, or focus leaves the rows; the row then carries a brand edge. */
  onActiveRowChange?: (rowId: string | undefined) => void;
};

export type Section = LiteEditableGridGroup & { count: number };

export type Layout = Readonly<{
  count: number;
  /** Row index at a display position, or -1 for a section row. */
  rowAt: (position: number) => number;
  sectionAt: (position: number) => Section | undefined;
  depthAt: (position: number) => number;
}>;

const GROUP_SEPARATOR = ' / ';

/**
 * Display order of a grouped grid: section rows followed by their rows (when
 * expanded), in the order each section's first row appears.
 */
export function buildLiteGridLayout<Row>(
  rows: readonly Row[],
  getRowGroup: ((row: Row) => readonly string[]) | undefined,
  collapsed: ReadonlySet<string>,
): Layout {
  if (!getRowGroup) {
    return { count: rows.length, rowAt: position => position, sectionAt: () => undefined, depthAt: () => 0 };
  }
  type Node = { section: Section | undefined; entries: (Node | number)[]; children: Map<string, Node> };
  const root: Node = { section: undefined, entries: [], children: new Map() };
  rows.forEach((row, rowIndex) => {
    const path = getRowGroup(row);
    if (path.length > 2) throw new Error('LiteEditableGrid supports at most two group levels.');
    let node = root;
    path.forEach((label, depth) => {
      let child = node.children.get(label);
      if (!child) {
        const key = path.slice(0, depth + 1).join(GROUP_SEPARATOR);
        child = {
          section: { key, path: path.slice(0, depth + 1), label, level: depth as 0 | 1, rowIndexes: [], expanded: !collapsed.has(key), count: 0 },
          entries: [],
          children: new Map(),
        };
        node.children.set(label, child);
        node.entries.push(child);
      }
      (child.section!.rowIndexes as number[]).push(rowIndex);
      child.section!.count += 1;
      node = child;
    });
    node.entries.push(rowIndex);
  });
  const positions: number[] = [];
  const depths: number[] = [];
  const sections: Section[] = [];
  const walk = (node: Node, depth: number) => {
    for (const entry of node.entries) {
      if (typeof entry === 'number') {
        positions.push(entry);
        depths.push(depth);
      } else {
        sections.push(entry.section!);
        positions.push(-sections.length);
        depths.push(depth);
        if (entry.section!.expanded) walk(entry, depth + 1);
      }
    }
  };
  walk(root, 0);
  return {
    count: positions.length,
    rowAt: position => Math.max(-1, positions[position] ?? -1),
    sectionAt: position => {
      const value = positions[position];
      return value !== undefined && value < 0 ? sections[-value - 1] : undefined;
    },
    depthAt: position => depths[position] ?? 0,
  };
}

export type PreparedColumn<Row> = LiteEditableGridColumn<Row> & Readonly<{
  kind: LiteEditableGridEditor;
  px: number;
  offset: number;
  last: boolean;
  textByValue: ReadonlyMap<string, string> | undefined;
}>;

/** Options whose text contains the query, case-insensitively; an empty query keeps all. */
export function filterLiteGridOptions(options: readonly LiteEditableGridOption[], query: string) {
  const needle = query.trim().toLocaleLowerCase();
  return needle ? options.filter(option => option.text.toLocaleLowerCase().includes(needle)) : options;
}

export function readValue<Row>(column: LiteEditableGridColumn<Row>, row: Row) {
  if (column.getValue) return column.getValue(row);
  const raw = (row as Record<string, unknown>)[column.key];
  if (Array.isArray(raw)) return raw.join(',');
  return raw === undefined || raw === null ? '' : String(raw);
}

/** Multiselect values of a comma-joined cell value, kept in option order. */
export function splitLiteGridValues(value: string, options: readonly LiteEditableGridOption[] = []) {
  const picked = new Set(value ? value.split(',') : []);
  const known = options.filter(option => picked.has(option.value)).map(option => option.value);
  const unknown = [...picked].filter(item => !options.some(option => option.value === item));
  return [...known, ...unknown];
}

const removeLabel = <Row>(column: LiteEditableGridColumn<Row>, text: string) =>
  column.formatRemoveLabel ? column.formatRemoveLabel(text) : `Remove ${text}`;

/** Plain-span tags with a leading remove mark; a count tag stands for the rest. */
export function renderTags<Row>(column: PreparedColumn<Row>, values: readonly string[], limit: number) {
  const shown = values.slice(0, limit);
  const tags: ReactElement[] = shown.map(item => {
    const text = displayText(column, item);
    return h('span', { className: 'nidec-ui-lite-grid__tag', key: item },
      h('span', {
        'aria-label': removeLabel(column, text),
        className: 'nidec-ui-lite-grid__tag-remove',
        'data-remove': item,
        role: 'button',
      }),
      h('span', { className: 'nidec-ui-lite-grid__tag-text' }, text));
  });
  if (values.length > shown.length) {
    tags.push(h('span', { className: 'nidec-ui-lite-grid__tag nidec-ui-lite-grid__tag--count', key: '+' }, `+${values.length - shown.length}`));
  }
  return tags;
}

export function displayText<Row>(column: PreparedColumn<Row>, value: string) {
  return column.textByValue?.get(value) ?? value;
}

/** Text of a cell at rest: option text for list editors, otherwise the column's `format` when it has one. */
export function restingText<Row>(column: PreparedColumn<Row>, value: string, row: Row) {
  return column.format && !column.options ? column.format(value, row) : displayText(column, value);
}

/** Column metrics and option lookups, checked once per `columns` array. */
export function prepareLiteGridColumns<Row>(columns: readonly LiteEditableGridColumn<Row>[]): PreparedColumn<Row>[] {
  if (new Set(columns.map(column => column.key)).size !== columns.length) {
    throw new Error('LiteEditableGrid column keys must be unique.');
  }
  let offset = 0;
  return columns.map((column, index): PreparedColumn<Row> => {
    const px = column.width ?? DEFAULT_COLUMN_WIDTH;
    const kind = column.editor ?? 'text';
    if ((kind === 'select' || kind === 'combobox' || kind === 'multiselect') && !column.options) {
      throw new Error(`LiteEditableGrid column "${column.key}" needs options for its ${kind} editor.`);
    }
    if (kind === 'multiselect' && column.options?.some(option => option.value.includes(','))) {
      throw new Error(`LiteEditableGrid multiselect column "${column.key}" option values must not contain a comma.`);
    }
    const prepared = {
      ...column,
      ...(kind === 'number' && !column.align ? { align: 'end' as const } : {}),
      kind,
      px,
      offset,
      last: index === columns.length - 1,
      textByValue: column.options ? new Map(column.options.map(option => [option.value, option.text])) : undefined,
    };
    offset += px;
    return prepared;
  });
}

/** Editors that take typed text straight into the cell. */
export const isTypedEditor = (kind: LiteEditableGridEditor | undefined) =>
  kind === 'text' || kind === 'number' || kind === 'longText' || kind === 'combobox';
