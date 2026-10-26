import { createElement as h, memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type {
  ClipboardEvent, CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, ReactElement,
} from 'react';
import { lockIcon } from './icons';
import {
  buildLiteGridLayout, displayText, filterLiteGridOptions, isTypedEditor, prepareLiteGridColumns, readValue, renderTags, restingText,
  splitLiteGridValues,
} from './lite-grid-shared';
import type {
  LiteEditableGridCellChange, LiteEditableGridGroup, LiteEditableGridOption, LiteGridCommonProps, PreparedColumn,
} from './lite-grid-shared';
import { withClass } from './with-class';

export { buildLiteGridLayout, filterLiteGridOptions, splitLiteGridValues } from './lite-grid-shared';
export type {
  LiteEditableGridCellChange, LiteEditableGridColumn, LiteEditableGridEditor, LiteEditableGridGroup, LiteEditableGridOption,
} from './lite-grid-shared';

/** Row and header height in px of a fixed-height grid when none is given. */
export const LITE_GRID_ROW_HEIGHT = 32;
const DEFAULT_OVERSCAN = 10;
const AUTO_ROW_MIN_HEIGHT = 40;
const LIST_POPUP_HEIGHT = 240;
const LONG_TEXT_POPUP_HEIGHT = 160;

/** Fixed row heights a grid can use: compact (32), standard (40) and comfortable (48). */
export type LiteEditableGridRowHeight = 32 | 40 | 48;

export type LiteEditableGridProps<Row> = LiteGridCommonProps<Row> & {
  onCellChange: (change: LiteEditableGridCellChange<Row>) => void;
  /**
   * Row height. Default `auto`: long text and tags wrap and the row grows with
   * them (40px minimum); every row is rendered, so keep such grids to a few
   * hundred rows. A fixed height (32, 40 or 48) turns on virtual scrolling
   * for any number of rows.
   */
  rowHeight?: LiteEditableGridRowHeight | 'auto';
  /** Viewport block size: px number or any CSS length, such as `calc(100dvh - 16rem)` to follow the window. Default `28rem`. */
  height?: number | string;
  /**
   * Groups rows under collapsible section rows: return one label (one level)
   * or two labels (a section and a subsection). Sections appear in the order
   * of their first row; an empty path leaves the row outside any section.
   */
  getRowGroup?: (row: Row) => readonly string[];
  /** Controlled set of collapsed group keys (path labels joined with ` / `). */
  collapsedGroups?: ReadonlySet<string>;
  /** Initially collapsed group keys when `collapsedGroups` is not controlled. */
  defaultCollapsedGroups?: Iterable<string>;
  onCollapsedGroupsChange?: (collapsed: ReadonlySet<string>) => void;
  /** Text after a section label, such as "2 modified"; also part of its accessible name. */
  getGroupSummary?: (group: LiteEditableGridGroup) => string | undefined;
  /** Accessible wording of a section's row count. Default `1 row` / `N rows`. */
  formatGroupCount?: (count: number) => string;
};

type Cell = Readonly<{ row: number; col: number }>;
type Move = 'none' | 'up' | 'down' | 'left' | 'right';
/** First (inclusive) and last (exclusive) row indices to render for a scroll position. */
export function computeRenderRange(
  scrollTop: number, viewportHeight: number, rowCount: number, overscan: number, rowHeight: number = LITE_GRID_ROW_HEIGHT,
) {
  const first = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const visible = Math.ceil(Math.max(0, viewportHeight - rowHeight) / rowHeight) + 1;
  return {
    start: Math.max(0, Math.min(first, rowCount) - overscan),
    end: Math.min(rowCount, first + visible + overscan),
  };
}

const cellId = (gridId: string, row: number, col: number) => `${gridId}-r${row}-c${col}`;

type RowViewProps<Row> = {
  row: Row;
  /** Display position, which differs from the row index in a grouped grid. */
  rowIndex: number;
  depth: number;
  columns: readonly PreparedColumn<Row>[];
  activeCol: number;
  /** Column being edited in this row, or -1. */
  editingCol: number;
  /** Auto row height only: the editor, drawn inside its cell so the row grows with the draft. */
  editor: ReactElement | null;
  gridId: string;
};

function RowViewImpl<Row>({
  row, rowIndex, depth, columns, activeCol, editingCol, editor, gridId,
}: RowViewProps<Row>): ReactElement {
  return h('div', {
    'aria-rowindex': rowIndex + 2,
    className: 'nidec-ui-lite-grid__row',
    'data-current': activeCol >= 0 ? true : undefined,
    'data-depth': depth || undefined,
    'data-editing': editingCol >= 0 ? true : undefined,
    'data-row': rowIndex,
    role: 'row',
  }, columns.map((column, col) => {
    const value = readValue(column, row);
    const error = column.validate?.(value, row);
    const multi = column.kind === 'multiselect';
    const values = multi ? splitLiteGridValues(value, column.options) : undefined;
    const text = values ? values.map(item => displayText(column, item)).join(', ') : restingText(column, value, row);
    const inline = editor !== null && col === editingCol;
    return h('div', {
      'aria-colindex': col + 1,
      'aria-invalid': error ? true : undefined,
      'aria-readonly': column.kind === 'none' ? true : undefined,
      'aria-selected': col === activeCol ? true : undefined,
      className: 'nidec-ui-lite-grid__cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      'data-col': col,
      'data-editing': col === editingCol ? true : undefined,
      'data-editor': column.kind,
      id: cellId(gridId, rowIndex, col),
      key: column.key,
      role: 'gridcell',
      title: inline ? undefined : error ?? ((column.kind === 'longText' || multi) && text ? text : undefined),
    }, inline ? editor : values ? renderTags(column, values, column.maxVisibleTags ?? 2) : text,
    // Read-only cells keep the row background and carry a lock mark instead of a grey fill.
    column.kind === 'none' ? h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__lock' }, lockIcon()) : null);
  }));
}

const RowView = memo(RowViewImpl) as typeof RowViewImpl;

type EditorProps<Row> = {
  column: PreparedColumn<Row>;
  value: string;
  seed: string | undefined;
  label: string;
  placement: 'below' | 'above';
  /** Positioned over the cell; undefined when the editor is drawn inside its cell (auto row height). */
  style: CSSProperties | undefined;
  listId: string;
  onCommit: (value: string, move: Move) => void;
  onCancel: () => void;
};

function tabMove(event: KeyboardEvent): Move {
  return event.shiftKey ? 'left' : 'right';
}

/** React removes the editor at once; a detached copy of a popup editor fades out in its place. */
function useExitFade(wrapperRef: { current: HTMLDivElement | null }, enabled: boolean) {
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !parent || !enabled) return undefined;
    return () => {
      const ghost = wrapper.cloneNode(true) as HTMLElement;
      ghost.classList.add('nidec-ui-lite-grid__editor--exit');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.removeAttribute('id');
      for (const node of ghost.querySelectorAll('[id]')) node.removeAttribute('id');
      const text = wrapper.querySelector('textarea');
      const ghostText = ghost.querySelector('textarea');
      if (text && ghostText) ghostText.value = text.value;
      parent.appendChild(ghost);
      if (text && ghostText) ghostText.scrollTop = text.scrollTop;
      setTimeout(() => ghost.remove(), 200);
    };
  }, [wrapperRef, enabled]);
}

/**
 * One editor at a time, positioned over the active cell. The draft lives here,
 * so typing re-renders only the editor, never the rows.
 */
function CellEditor<Row>(props: EditorProps<Row>) {
  const { column, value, seed, label, placement, style, listId, onCommit, onCancel } = props;
  const done = useRef(false);
  const finish = (next: string, move: Move) => {
    if (done.current) return;
    done.current = true;
    onCommit(next, move);
  };
  const cancel = () => {
    if (done.current) return;
    done.current = true;
    onCancel();
  };
  const options = column.options ?? [];
  const initialText = seed ?? displayText(column, value);
  const [draft, setDraft] = useState(initialText);
  const [highlight, setHighlight] = useState(() => {
    if (seed !== undefined) {
      return column.freeform === false && filterLiteGridOptions(options, seed).length ? 0 : -1;
    }
    const current = options.findIndex(option => option.value === value);
    return current < 0 && column.kind === 'select' && options.length ? 0 : current;
  });
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useExitFade(wrapperRef, style !== undefined && column.kind !== 'text' && column.kind !== 'number');

  const comboOptions = column.kind === 'combobox'
    ? (seed === undefined && draft === initialText ? options : filterLiteGridOptions(options, draft))
    : options;

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (field) {
      field.focus({ preventScroll: true });
      if (seed === undefined) field.select();
      else field.setSelectionRange(field.value.length, field.value.length);
    } else {
      listRef.current?.focus({ preventScroll: true });
    }
  }, [seed]);

  useEffect(() => {
    if (highlight < 0) return;
    const list = listRef.current;
    const item = list?.children[highlight] as HTMLElement | undefined;
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
  }, [highlight]);

  const resolveCombo = (text: string) => {
    const option = highlight >= 0 ? comboOptions[highlight] : undefined;
    if (option) return option.value;
    const match = options.find(item => item.text.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (match) return match.value;
    return column.freeform === false ? undefined : text;
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    if (column.kind === 'select') return cancel();
    if (column.kind === 'combobox') {
      const next = resolveCombo(draft);
      return next === undefined ? cancel() : finish(next, 'none');
    }
    finish(draft, 'none');
  };

  const moveHighlight = (event: KeyboardEvent, count: number) => {
    if (!count) return false;
    const last = count - 1;
    switch (event.key) {
      case 'ArrowDown': setHighlight(index => Math.min(last, index + 1)); return true;
      case 'ArrowUp': setHighlight(index => Math.max(0, index - 1)); return true;
      case 'PageDown': setHighlight(index => Math.min(last, index + 8)); return true;
      case 'PageUp': setHighlight(index => Math.max(0, index - 8)); return true;
      default: return false;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); return cancel(); }
    if (column.kind === 'text' || column.kind === 'number') {
      if (event.key === 'Enter') { event.preventDefault(); finish(draft, event.shiftKey ? 'up' : 'down'); }
      else if (event.key === 'Tab') { event.preventDefault(); finish(draft, tabMove(event)); }
      return;
    }
    if (column.kind === 'longText') {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); finish(draft, 'down'); }
      else if (event.key === 'Tab') { event.preventDefault(); finish(draft, tabMove(event)); }
      return;
    }
    if (column.kind === 'select') {
      if (moveHighlight(event, options.length)) { event.preventDefault(); return; }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        setHighlight(event.key === 'Home' ? 0 : options.length - 1);
        return;
      }
      const option = options[highlight];
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') {
        event.preventDefault();
        if (!option) return cancel();
        return finish(option.value, event.key === 'Tab' ? tabMove(event) : 'none');
      }
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const key = event.key.toLocaleLowerCase();
        const order = options.map((_, index) => (highlight + 1 + index) % options.length);
        const next = order.find(index => options[index]!.text.toLocaleLowerCase().startsWith(key));
        if (next !== undefined) setHighlight(next);
      }
      return;
    }
    // combobox
    if (moveHighlight(event, comboOptions.length)) { event.preventDefault(); return; }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const next = resolveCombo(draft);
      if (next === undefined) return cancel();
      finish(next, event.key === 'Tab' ? tabMove(event) : 'down');
    }
  };

  const listbox = (items: readonly LiteEditableGridOption[]) => h('div', {
    'aria-label': label,
    'aria-activedescendant': highlight >= 0 && items[highlight] ? `${listId}-o${highlight}` : undefined,
    className: 'nidec-ui-lite-grid__listbox',
    'data-placement': placement,
    id: listId,
    ref: listRef,
    role: 'listbox',
    tabIndex: column.kind === 'select' ? 0 : -1,
  }, items.length === 0
    ? h('div', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__option-empty' }, '—')
    : items.map((option, index) => h('div', {
      'aria-selected': option.value === value,
      className: 'nidec-ui-lite-grid__option',
      'data-active': index === highlight ? true : undefined,
      id: `${listId}-o${index}`,
      key: option.value,
      onClick: () => finish(option.value, 'none'),
      onMouseDown: (event: MouseEvent) => event.preventDefault(),
      onMouseEnter: () => setHighlight(index),
      role: 'option',
    }, option.text)));

  let content: ReactElement | ReactElement[];
  if (column.kind === 'select') {
    content = [
      h('div', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__editor-value', key: 'value' },
        options[highlight]?.text ?? displayText(column, value)),
      h('div', { key: 'list' }, listbox(options)),
    ];
  } else if (column.kind === 'combobox') {
    content = [
      h('input', {
        'aria-activedescendant': highlight >= 0 && comboOptions[highlight] ? `${listId}-o${highlight}` : undefined,
        'aria-autocomplete': 'list',
        'aria-controls': listId,
        'aria-expanded': true,
        'aria-label': label,
        autoComplete: 'off',
        className: 'nidec-ui-lite-grid__editor-input',
        key: 'input',
        onChange: (event: { target: { value: string } }) => {
          const text = event.target.value;
          setDraft(text);
          if (column.freeform === false) {
            const filtered = filterLiteGridOptions(options, text);
            setHighlight(filtered.length ? 0 : -1);
          } else setHighlight(-1);
        },
        ref: fieldRef,
        role: 'combobox',
        spellCheck: false,
        value: draft,
      }),
      h('div', { key: 'list' }, listbox(comboOptions)),
    ];
  } else if (column.kind === 'longText' && style === undefined) {
    // Inside an auto-height cell: the text wraps in place and a hidden copy of the draft grows the row.
    content = [
      h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__editor-sizer', key: 'sizer' }, `${draft}\u200b`),
      h('textarea', {
        'aria-label': label,
        className: 'nidec-ui-lite-grid__editor-area',
        key: 'area',
        onChange: (event: { target: { value: string } }) => setDraft(event.target.value),
        ref: fieldRef,
        spellCheck: false,
        value: draft,
      }),
    ];
  } else if (column.kind === 'longText') {
    content = h('textarea', {
      'aria-label': label,
      className: 'nidec-ui-lite-grid__editor-textarea',
      'data-placement': placement,
      onChange: (event: { target: { value: string } }) => setDraft(event.target.value),
      ref: fieldRef,
      value: draft,
    });
  } else {
    content = h('input', {
      'aria-label': label,
      autoComplete: 'off',
      className: 'nidec-ui-lite-grid__editor-input',
      inputMode: column.kind === 'number' ? 'decimal' : undefined,
      onChange: (event: { target: { value: string } }) => setDraft(event.target.value),
      ref: fieldRef,
      spellCheck: false,
      value: draft,
    });
  }

  return h('div', {
    className: style === undefined ? 'nidec-ui-lite-grid__editor nidec-ui-lite-grid__editor--inline' : 'nidec-ui-lite-grid__editor',
    'data-align': column.align === 'end' ? 'end' : undefined,
    'data-editor': column.kind,
    onBlur,
    onKeyDown,
    ref: wrapperRef,
    style,
  }, content);
}

/**
 * Multiselect editor: the chosen values as removable tags over the cell and a
 * checklist below. Picks stay in the draft until Tab, Ctrl+Enter or leaving
 * the editor confirms them; Esc discards them.
 */
function MultiSelectEditor<Row>(props: EditorProps<Row>) {
  const { column, value, label, placement, style, listId, onCommit, onCancel } = props;
  const options = column.options ?? [];
  const done = useRef(false);
  const [draft, setDraft] = useState(() => splitLiteGridValues(value, options));
  const [highlight, setHighlight] = useState(() => {
    const first = options.findIndex(option => value.split(',').includes(option.value));
    return first < 0 ? 0 : first;
  });
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useExitFade(wrapperRef, style !== undefined);

  useLayoutEffect(() => { listRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[highlight] as HTMLElement | undefined;
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
  }, [highlight]);

  const finish = (move: Move) => {
    if (done.current) return;
    done.current = true;
    onCommit(splitLiteGridValues(draft.join(','), options).join(','), move);
  };
  const cancel = () => {
    if (done.current) return;
    done.current = true;
    onCancel();
  };
  const toggle = (item: string) => setDraft(current => current.includes(item)
    ? current.filter(entry => entry !== item)
    : splitLiteGridValues([...current, item].join(','), options));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const last = options.length - 1;
    switch (event.key) {
      case 'Escape': event.preventDefault(); return cancel();
      case 'Tab': event.preventDefault(); return finish(tabMove(event));
      case 'ArrowDown': event.preventDefault(); return setHighlight(index => Math.min(last, index + 1));
      case 'ArrowUp': event.preventDefault(); return setHighlight(index => Math.max(0, index - 1));
      case 'Home': event.preventDefault(); return setHighlight(0);
      case 'End': event.preventDefault(); return setHighlight(last);
      case 'Backspace': event.preventDefault(); return setDraft(current => current.slice(0, -1));
      case 'Enter':
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) return finish('down');
        if (options[highlight]) toggle(options[highlight].value);
        return undefined;
      case ' ':
        event.preventDefault();
        if (options[highlight]) toggle(options[highlight].value);
        return undefined;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const key = event.key.toLocaleLowerCase();
          const order = options.map((_, index) => (highlight + 1 + index) % options.length);
          const next = order.find(index => options[index]!.text.toLocaleLowerCase().startsWith(key));
          if (next !== undefined) setHighlight(next);
        }
        return undefined;
    }
  };

  return h('div', {
    className: style === undefined ? 'nidec-ui-lite-grid__editor nidec-ui-lite-grid__editor--inline' : 'nidec-ui-lite-grid__editor',
    'data-editor': 'multiselect',
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) finish('none');
    },
    onKeyDown,
    ref: wrapperRef,
    style,
  },
  h('div', {
    className: 'nidec-ui-lite-grid__editor-tags',
    onMouseDown: (event: MouseEvent) => {
      const remove = (event.target as Element).closest('[data-remove]');
      if (!remove) return;
      event.preventDefault();
      const item = remove.getAttribute('data-remove');
      setDraft(current => current.filter(entry => entry !== item));
    },
  }, renderTags(column, draft, Number.POSITIVE_INFINITY)),
  h('div', {
    'aria-activedescendant': options[highlight] ? `${listId}-o${highlight}` : undefined,
    'aria-label': label,
    'aria-multiselectable': true,
    className: 'nidec-ui-lite-grid__listbox',
    'data-placement': placement,
    id: listId,
    ref: listRef,
    role: 'listbox',
    tabIndex: 0,
  }, options.map((option, index) => h('div', {
    'aria-selected': draft.includes(option.value),
    className: 'nidec-ui-lite-grid__option nidec-ui-lite-grid__option--check',
    'data-active': index === highlight ? true : undefined,
    id: `${listId}-o${index}`,
    key: option.value,
    onClick: () => toggle(option.value),
    onMouseDown: (event: MouseEvent) => event.preventDefault(),
    onMouseEnter: () => setHighlight(index),
    role: 'option',
  }, option.text))));
}

/**
 * Lightweight editable grid with cell edit: spreadsheet-style, one cell at a
 * time, each change reported on its own as soon as the cell is left. Cells
 * render as plain text and only the cell being edited mounts an editor, drawn
 * by the grid so that it matches the row and the text does not move.
 *
 * Rows grow with their text by default (`rowHeight="auto"`, every row
 * rendered, a few hundred rows); a fixed height virtualises the rows for
 * thousands. Rows can be grouped under collapsible sections. For records
 * saved a whole row at a time, use LiteRowEditGrid.
 *
 * The consumer owns the data, validation rules, persistence and every
 * business meaning of a value.
 */
export function LiteEditableGrid<Row>({
  'aria-label': ariaLabel,
  columns,
  rows,
  getRowId,
  onCellChange,
  height = '28rem',
  rowHeight: rowHeightProp = 'auto',
  overscan = DEFAULT_OVERSCAN,
  onActiveRowChange,
  getRowGroup,
  collapsedGroups,
  defaultCollapsedGroups,
  onCollapsedGroupsChange,
  getGroupSummary,
  formatGroupCount = count => `${count} ${count === 1 ? 'row' : 'rows'}`,
  className,
  style,
  onFocus,
  ...props
}: LiteEditableGridProps<Row>) {
  if (!ariaLabel.trim()) throw new Error('LiteEditableGrid requires a non-empty aria-label.');
  // Auto rows have no fixed height, so every row is rendered and positions are measured.
  const auto = rowHeightProp === 'auto';
  const rowHeight = auto ? AUTO_ROW_MIN_HEIGHT : rowHeightProp;
  const gridId = useId().replaceAll(':', '');
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef(0);
  const [scrollRow, setScrollRow] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof height === 'number' ? height : 448);
  const [active, setActive] = useState<Cell | null>(null);
  const [editing, setEditing] = useState<(Cell & { seed: string | undefined }) | null>(null);
  const clickedActive = useRef(false);
  const [ownCollapsed, setOwnCollapsed] = useState<ReadonlySet<string>>(() => new Set(defaultCollapsedGroups ?? []));
  const collapsed = collapsedGroups ?? ownCollapsed;
  const layout = useMemo(() => buildLiteGridLayout(rows, getRowGroup, collapsed), [rows, getRowGroup, collapsed]);
  const itemCount = layout.count;
  const rowFor = (position: number) => {
    const index = layout.rowAt(position);
    return index < 0 ? undefined : rows[index];
  };
  const toggleGroup = (key: string) => {
    const next = new Set(collapsed);
    if (next.has(key)) next.delete(key); else next.add(key);
    if (!collapsedGroups) setOwnCollapsed(next);
    onCollapsedGroupsChange?.(next);
  };

  const prepared = useMemo(() => prepareLiteGridColumns(columns), [columns]);
  const totalWidth = prepared.reduce((sum, column) => sum + column.px, 0);
  const template = prepared.map(column => column.last ? `minmax(${column.px}px, 1fr)` : `${column.px}px`).join(' ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    setViewportHeight(root.clientHeight);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => setViewportHeight(root.clientHeight));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Keep the active cell inside the data when rows or columns shrink.
  useEffect(() => {
    setActive(cell => cell && (cell.row >= itemCount || cell.col >= prepared.length)
      ? (itemCount && prepared.length ? { row: Math.min(cell.row, itemCount - 1), col: Math.min(cell.col, prepared.length - 1) } : null)
      : cell);
    setEditing(cell => cell && (cell.row >= itemCount || cell.col >= prepared.length) ? null : cell);
  }, [itemCount, prepared.length]);

  const { start, end } = auto
    ? { start: 0, end: itemCount }
    : computeRenderRange(scrollRow * rowHeight, viewportHeight, itemCount, overscan, rowHeight);

  /** Top and height of a display row in body coordinates: computed for fixed rows, measured for auto rows. */
  const rowBox = useCallback((position: number) => {
    if (!auto) return { top: position * rowHeight, height: rowHeight };
    const element = rootRef.current?.querySelector<HTMLElement>(`.nidec-ui-lite-grid__body > .nidec-ui-lite-grid__window > [data-row="${position}"]`);
    return element ? { top: element.offsetTop, height: element.offsetHeight } : { top: position * rowHeight, height: rowHeight };
  }, [auto, rowHeight]);

  const onScroll = () => {
    const root = rootRef.current;
    if (!root || auto) return;
    const first = Math.floor(root.scrollTop / rowHeight);
    if (first !== firstRowRef.current) {
      firstRowRef.current = first;
      setScrollRow(first);
    }
  };

  const reveal = useCallback((cell: Cell) => {
    const root = rootRef.current;
    const column = prepared[cell.col];
    if (!root || !column) return;
    const { top, height: boxHeight } = rowBox(cell.row);
    const view = root.clientHeight - rowHeight;
    if (top < root.scrollTop) root.scrollTop = top;
    else if (top + boxHeight > root.scrollTop + view) root.scrollTop = top + boxHeight - view;
    const right = column.offset + column.px;
    if (column.offset < root.scrollLeft) root.scrollLeft = column.offset;
    else if (right > root.scrollLeft + root.clientWidth) root.scrollLeft = right - root.clientWidth;
  }, [prepared, rowHeight, rowBox]);

  const activeRow = active ? rowFor(active.row) : undefined;
  const activeRowId = activeRow === undefined ? undefined : getRowId(activeRow);
  const reportedRowId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (reportedRowId.current === activeRowId) return;
    reportedRowId.current = activeRowId;
    onActiveRowChange?.(activeRowId);
  }, [activeRowId, onActiveRowChange]);

  const activate = useCallback((cell: Cell) => {
    setActive(cell);
    reveal(cell);
  }, [reveal]);

  const move = (from: Cell, direction: Move): Cell => {
    const lastRow = itemCount - 1;
    const lastCol = prepared.length - 1;
    switch (direction) {
      case 'up': return { row: Math.max(0, from.row - 1), col: from.col };
      case 'down': return { row: Math.min(lastRow, from.row + 1), col: from.col };
      case 'left': return from.col > 0 ? { row: from.row, col: from.col - 1 }
        : from.row > 0 ? { row: from.row - 1, col: lastCol } : from;
      case 'right': return from.col < lastCol ? { row: from.row, col: from.col + 1 }
        : from.row < lastRow ? { row: from.row + 1, col: 0 } : from;
      default: return from;
    }
  };

  const change = (cell: Cell, value: string) => {
    const rowIndex = layout.rowAt(cell.row);
    const row = rows[rowIndex];
    const column = prepared[cell.col];
    if (rowIndex < 0 || row === undefined || !column || column.kind === 'none') return;
    if (readValue(column, row) === value) return;
    onCellChange(column.kind === 'multiselect'
      ? { rowId: getRowId(row), rowIndex, columnKey: column.key, value, values: value ? value.split(',') : [], row }
      : { rowId: getRowId(row), rowIndex, columnKey: column.key, value, row });
  };

  const startEdit = (cell: Cell, seed?: string) => {
    if (prepared[cell.col]?.kind === 'none' || rowFor(cell.row) === undefined) return;
    reveal(cell);
    setEditing({ ...cell, seed });
  };

  const commit = (value: string, direction: Move) => {
    if (!editing) return;
    change(editing, value);
    setEditing(null);
    const focusGrid = direction !== 'none' || rootRef.current?.ownerDocument.activeElement === rootRef.current
      || rootRef.current?.contains(rootRef.current.ownerDocument.activeElement) === true;
    if (direction !== 'none') activate(move(editing, direction));
    if (focusGrid) rootRef.current?.focus({ preventScroll: true });
  };

  const cancel = () => {
    setEditing(null);
    rootRef.current?.focus({ preventScroll: true });
  };

  const pageRows = Math.max(1, Math.floor((viewportHeight - rowHeight) / rowHeight) - 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !itemCount || !prepared.length) return;
    const cell = active ?? { row: 0, col: 0 };
    const kind = prepared[cell.col]?.kind;
    const ctrl = event.ctrlKey || event.metaKey;
    const section = layout.sectionAt(cell.row);
    if (section) {
      // A section row only toggles: Enter, Space or F2 flip it, Left collapses and Right expands.
      const toggleKeys = event.key === 'Enter' || event.key === ' ' || event.key === 'F2';
      if (toggleKeys || (event.key === 'ArrowLeft' && section.expanded) || (event.key === 'ArrowRight' && !section.expanded)) {
        event.preventDefault();
        toggleGroup(section.key);
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Delete' || event.key === 'Backspace'
        || (event.key.length === 1 && !ctrl && !event.altKey)) {
        event.preventDefault();
        return;
      }
    }
    let next: Cell | undefined;
    switch (event.key) {
      case 'ArrowUp': next = move(cell, 'up'); break;
      case 'ArrowDown': next = move(cell, 'down'); break;
      case 'ArrowLeft': next = { row: cell.row, col: Math.max(0, cell.col - 1) }; break;
      case 'ArrowRight': next = { row: cell.row, col: Math.min(prepared.length - 1, cell.col + 1) }; break;
      case 'Home': next = ctrl ? { row: 0, col: 0 } : { row: cell.row, col: 0 }; break;
      case 'End': next = ctrl ? { row: itemCount - 1, col: prepared.length - 1 } : { row: cell.row, col: prepared.length - 1 }; break;
      case 'PageDown': next = { row: Math.min(itemCount - 1, cell.row + pageRows), col: cell.col }; break;
      case 'PageUp': next = { row: Math.max(0, cell.row - pageRows), col: cell.col }; break;
      case 'Tab': {
        const target = move(cell, tabMove(event));
        if (target === cell) return;
        next = target;
        break;
      }
      case 'Enter':
      case 'F2':
        event.preventDefault();
        startEdit(cell);
        return;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        if (event.key === 'Backspace' && isTypedEditor(kind)) startEdit(cell, '');
        else change(cell, '');
        return;
      default:
        if (event.key.length === 1 && !ctrl && !event.altKey) {
          event.preventDefault();
          if (isTypedEditor(kind)) startEdit(cell, event.key);
          else if (kind === 'select' || kind === 'multiselect') startEdit(cell);
        }
        return;
    }
    event.preventDefault();
    activate(next);
  };

  const cellFromEvent = (event: MouseEvent): Cell | undefined => {
    const target = event.target as Element;
    if (target.closest('.nidec-ui-lite-grid__editor')) return undefined;
    const cellElement = target.closest('[data-col]');
    const rowElement = cellElement?.closest('[data-row]');
    if (!cellElement || !rowElement) return undefined;
    return { row: Number(rowElement.getAttribute('data-row')), col: Number(cellElement.getAttribute('data-col')) };
  };

  const onBodyMouseDown = (event: MouseEvent) => {
    const cell = cellFromEvent(event);
    if (!cell) return;
    if (layout.sectionAt(cell.row)) {
      clickedActive.current = false;
      setActive({ row: cell.row, col: active?.col ?? 0 });
      return;
    }
    const remove = (event.target as Element).closest('[data-remove]');
    if (remove) {
      // A tag's remove mark changes the value directly, without opening the editor.
      event.preventDefault();
      rootRef.current?.focus({ preventScroll: true });
      const row = rowFor(cell.row);
      const column = prepared[cell.col];
      if (row !== undefined && column) {
        const item = remove.getAttribute('data-remove');
        change(cell, splitLiteGridValues(readValue(column, row), column.options).filter(entry => entry !== item).join(','));
      }
      clickedActive.current = false;
      setActive(cell);
      return;
    }
    clickedActive.current = active?.row === cell.row && active.col === cell.col;
    setActive(cell);
  };

  const onBodyClick = (event: MouseEvent) => {
    const cell = cellFromEvent(event);
    if (!cell) return;
    const section = layout.sectionAt(cell.row);
    if (section) {
      toggleGroup(section.key);
      return;
    }
    const kind = prepared[cell.col]?.kind;
    if (clickedActive.current && (kind === 'select' || kind === 'combobox' || kind === 'multiselect')) startEdit(cell);
    clickedActive.current = false;
  };

  const onBodyDoubleClick = (event: MouseEvent) => {
    const cell = cellFromEvent(event);
    if (cell) startEdit(cell);
  };

  const onCopy = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !active) return;
    const row = rowFor(active.row);
    const column = prepared[active.col];
    if (row === undefined || !column) return;
    event.preventDefault();
    const value = readValue(column, row);
    event.clipboardData.setData('text/plain', column.kind === 'multiselect'
      ? splitLiteGridValues(value, column.options).map(item => displayText(column, item)).join(', ')
      : displayText(column, value));
  };

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !active) return;
    const column = prepared[active.col];
    if (!column || column.kind === 'none' || rowFor(active.row) === undefined) return;
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain').replace(/\r?\n$/, '');
    if (column.kind === 'multiselect') {
      const wanted = text.split(/[,;\r\n]+/).map(item => item.trim().toLocaleLowerCase()).filter(Boolean);
      const picked = (column.options ?? []).filter(option => wanted.includes(option.value.toLocaleLowerCase())
        || wanted.includes(option.text.toLocaleLowerCase()));
      change(active, picked.map(option => option.value).join(','));
      return;
    }
    if (column.kind === 'select' || (column.kind === 'combobox' && column.freeform === false)) {
      const option = column.options?.find(item => item.value === text || item.text.toLocaleLowerCase() === text.toLocaleLowerCase());
      if (option) change(active, option.value);
      return;
    }
    change(active, column.kind === 'longText' ? text : text.replace(/\r?\n/g, ' '));
  };

  let editor: ReactElement | null = null;
  if (editing) {
    const row = rowFor(editing.row);
    const column = prepared[editing.col];
    if (row !== undefined && column) {
      const root = rootRef.current;
      const { top: rowTop, height: boxHeight } = rowBox(editing.row);
      const popup = column.kind === 'longText' ? LONG_TEXT_POPUP_HEIGHT
        : column.kind === 'select' || column.kind === 'combobox' || column.kind === 'multiselect' ? LIST_POPUP_HEIGHT : 0;
      const viewTop = root?.scrollTop ?? 0;
      const viewBottom = viewTop + (root?.clientHeight ?? viewportHeight) - rowHeight;
      const below = viewBottom - (rowTop + boxHeight);
      const above = rowTop - viewTop;
      const placement = popup && below < popup && above > below ? 'above' : 'below';
      const editorStyle: CSSProperties | undefined = auto ? undefined : column.last
        ? { insetInlineStart: column.offset, insetInlineEnd: 0, top: rowTop }
        : { insetInlineStart: column.offset, top: rowTop, width: column.px };
      editor = h(column.kind === 'multiselect' ? MultiSelectEditor<Row> : CellEditor<Row>, {
        column,
        key: `${editing.row}:${editing.col}`,
        label: column.header,
        listId: `${gridId}-list`,
        onCancel: cancel,
        onCommit: commit,
        placement,
        seed: editing.seed,
        style: editorStyle,
        value: readValue(column, row),
      });
    }
  }

  const activeRendered = active && active.row >= start && active.row < end;
  const visibleRows: ReactElement[] = [];
  for (let index = start; index < end; index += 1) {
    const section = layout.sectionAt(index);
    if (section) {
      const summary = getGroupSummary?.(section);
      visibleRows.push(h('div', {
        'aria-rowindex': index + 2,
        className: 'nidec-ui-lite-grid__section',
        'data-level': section.level,
        'data-row': index,
        key: `section:${section.key}`,
        role: 'row',
      }, h('div', {
        'aria-colspan': prepared.length,
        'aria-expanded': section.expanded,
        'aria-label': `${section.label}, ${formatGroupCount(section.count)}${summary ? `, ${summary}` : ''}`,
        'aria-selected': active?.row === index ? true : undefined,
        className: 'nidec-ui-lite-grid__section-cell',
        'data-col': 0,
        id: cellId(gridId, index, active?.row === index ? active.col : 0),
        role: 'gridcell',
      },
      h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__section-chevron' }),
      h('span', { className: 'nidec-ui-lite-grid__section-label' }, section.label),
      summary ? h('span', { className: 'nidec-ui-lite-grid__section-summary' }, summary) : null)));
      continue;
    }
    const row = rows[layout.rowAt(index)] as Row;
    const editingHere = editing?.row === index;
    visibleRows.push(h(RowView<Row>, {
      activeCol: active?.row === index ? active.col : -1,
      columns: prepared,
      depth: layout.depthAt(index),
      editingCol: editingHere ? editing.col : -1,
      editor: auto && editingHere ? editor : null,
      gridId,
      key: getRowId(row),
      row,
      rowIndex: index,
    }));
  }

  const width = `max(100%, ${totalWidth}px)`;
  return h('div', {
    ...props,
    'aria-activedescendant': activeRendered && !editing ? cellId(gridId, active.row, active.col) : undefined,
    'aria-colcount': prepared.length,
    'aria-label': ariaLabel,
    'aria-rowcount': itemCount + 1,
    className: withClass('nidec-ui-lite-grid', className),
    'data-edit-mode': 'cell',
    'data-row-height': auto ? 'auto' : undefined,
    onCopy,
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && !active && itemCount && prepared.length) setActive({ row: 0, col: 0 });
      onFocus?.(event);
    },
    onKeyDown,
    onPaste,
    onScroll,
    ref: rootRef,
    role: 'grid',
    style: {
      ...style,
      blockSize: typeof height === 'number' ? `${height}px` : height,
      '--nidec-ui-lite-grid-columns': template,
      '--nidec-ui-lite-grid-row-height': `${rowHeight}px`,
    } as CSSProperties,
    tabIndex: 0,
  },
  h('div', { 'aria-rowindex': 1, className: 'nidec-ui-lite-grid__header', role: 'row', style: { width } },
    prepared.map((column, col) => h('div', {
      'aria-colindex': col + 1,
      className: 'nidec-ui-lite-grid__header-cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      key: column.key,
      role: 'columnheader',
      title: column.header,
    }, column.header))),
  h('div', {
    className: 'nidec-ui-lite-grid__body',
    onClick: onBodyClick,
    onDoubleClick: onBodyDoubleClick,
    onMouseDown: onBodyMouseDown,
    role: 'rowgroup',
    style: auto ? { width } : { blockSize: `${itemCount * rowHeight}px`, width },
  },
  h('div', {
    className: 'nidec-ui-lite-grid__window',
    role: 'presentation',
    style: auto ? undefined : { transform: `translateY(${start * rowHeight}px)` },
  }, visibleRows),
  auto ? null : editor));
}
