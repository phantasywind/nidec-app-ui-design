import { createElement as h, memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type {
  ClipboardEvent, ComponentPropsWithoutRef, CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, ReactElement,
} from 'react';
import { withClass } from './with-class';

/** Row and header height in px. Fixed so that virtual scrolling needs no measurement. */
export const LITE_GRID_ROW_HEIGHT = 32;
const DEFAULT_COLUMN_WIDTH = 160;
const DEFAULT_OVERSCAN = 10;
const LIST_POPUP_HEIGHT = 240;
const LONG_TEXT_POPUP_HEIGHT = 160;

export type LiteEditableGridEditor = 'text' | 'longText' | 'select' | 'combobox' | 'none';

export type LiteEditableGridOption = Readonly<{ value: string; text: string }>;

export type LiteEditableGridColumn<Row> = Readonly<{
  /** Stable column key; also the default property read from each row. */
  key: string;
  header: string;
  /** Width in px. Default 160. The last column stretches to fill spare width. */
  width?: number;
  /** Dedicated cell editor. Default `text`; `none` makes the column read-only. */
  editor?: LiteEditableGridEditor;
  align?: 'start' | 'end';
  /** Choices for `select` and `combobox`. A cell shows the text of the option whose value it holds. */
  options?: readonly LiteEditableGridOption[];
  /** `combobox` only: accept typed text that matches no option. Default true. */
  freeform?: boolean;
  /** Reads the cell value. Default `String(row[key] ?? '')`. */
  getValue?: (row: Row) => string;
  /** Returns a message when the value is invalid; the cell is then marked and the message is its tooltip. */
  validate?: (value: string, row: Row) => string | undefined;
}>;

export type LiteEditableGridCellChange<Row> = Readonly<{
  rowId: string;
  rowIndex: number;
  columnKey: string;
  value: string;
  row: Row;
}>;

export type LiteEditableGridProps<Row> = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'onChange' | 'onCopy' | 'onPaste'> & {
  'aria-label': string;
  /** Keep this array stable (module constant or useMemo); a new array re-renders every visible row. */
  columns: readonly LiteEditableGridColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  onCellChange: (change: LiteEditableGridCellChange<Row>) => void;
  /** Viewport block size: px number or any CSS length. Default `28rem`. */
  height?: number | string;
  /** Rows rendered beyond each edge of the viewport. Default 10. */
  overscan?: number;
};

type Cell = Readonly<{ row: number; col: number }>;
type Move = 'none' | 'up' | 'down' | 'left' | 'right';

type PreparedColumn<Row> = LiteEditableGridColumn<Row> & Readonly<{
  kind: LiteEditableGridEditor;
  px: number;
  offset: number;
  last: boolean;
  textByValue: ReadonlyMap<string, string> | undefined;
}>;

/** First (inclusive) and last (exclusive) row indices to render for a scroll position. */
export function computeRenderRange(scrollTop: number, viewportHeight: number, rowCount: number, overscan: number) {
  const first = Math.floor(Math.max(0, scrollTop) / LITE_GRID_ROW_HEIGHT);
  const visible = Math.ceil(Math.max(0, viewportHeight - LITE_GRID_ROW_HEIGHT) / LITE_GRID_ROW_HEIGHT) + 1;
  return {
    start: Math.max(0, Math.min(first, rowCount) - overscan),
    end: Math.min(rowCount, first + visible + overscan),
  };
}

/** Options whose text contains the query, case-insensitively; an empty query keeps all. */
export function filterLiteGridOptions(options: readonly LiteEditableGridOption[], query: string) {
  const needle = query.trim().toLocaleLowerCase();
  return needle ? options.filter(option => option.text.toLocaleLowerCase().includes(needle)) : options;
}

function readValue<Row>(column: LiteEditableGridColumn<Row>, row: Row) {
  if (column.getValue) return column.getValue(row);
  const raw = (row as Record<string, unknown>)[column.key];
  return raw === undefined || raw === null ? '' : String(raw);
}

function displayText<Row>(column: PreparedColumn<Row>, value: string) {
  return column.textByValue?.get(value) ?? value;
}

const cellId = (gridId: string, row: number, col: number) => `${gridId}-r${row}-c${col}`;

type RowViewProps<Row> = {
  row: Row;
  rowIndex: number;
  columns: readonly PreparedColumn<Row>[];
  activeCol: number;
  gridId: string;
};

function RowViewImpl<Row>({ row, rowIndex, columns, activeCol, gridId }: RowViewProps<Row>): ReactElement {
  return h('div', {
    'aria-rowindex': rowIndex + 2,
    className: 'nidec-ui-lite-grid__row',
    'data-row': rowIndex,
    role: 'row',
  }, columns.map((column, col) => {
    const value = readValue(column, row);
    const error = column.validate?.(value, row);
    const text = displayText(column, value);
    return h('div', {
      'aria-colindex': col + 1,
      'aria-invalid': error ? true : undefined,
      'aria-readonly': column.kind === 'none' ? true : undefined,
      'aria-selected': col === activeCol ? true : undefined,
      className: 'nidec-ui-lite-grid__cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      'data-col': col,
      'data-editor': column.kind,
      id: cellId(gridId, rowIndex, col),
      key: column.key,
      role: 'gridcell',
      title: error ?? (column.kind === 'longText' && text ? text : undefined),
    }, text);
  }));
}

const RowView = memo(RowViewImpl) as typeof RowViewImpl;

type EditorProps<Row> = {
  column: PreparedColumn<Row>;
  value: string;
  seed: string | undefined;
  label: string;
  placement: 'below' | 'above';
  style: CSSProperties;
  listId: string;
  onCommit: (value: string, move: Move) => void;
  onCancel: () => void;
};

function tabMove(event: KeyboardEvent): Move {
  return event.shiftKey ? 'left' : 'right';
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

  // React removes the editor at once; a detached copy of a popup editor fades out in its place.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !parent || column.kind === 'text' || column.kind === 'none') return undefined;
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
  }, [column.kind]);

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
    if (column.kind === 'text') {
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
      onChange: (event: { target: { value: string } }) => setDraft(event.target.value),
      ref: fieldRef,
      spellCheck: false,
      value: draft,
    });
  }

  return h('div', {
    className: 'nidec-ui-lite-grid__editor',
    'data-align': column.align === 'end' ? 'end' : undefined,
    'data-editor': column.kind,
    onBlur,
    onKeyDown,
    ref: wrapperRef,
    style,
  }, content);
}

/**
 * Lightweight spreadsheet-style grid for many editable rows. Cells render as
 * plain text; only the one cell being edited mounts a real editor, and only
 * the rows in view (plus overscan) are in the DOM. Rows have one fixed height.
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
  overscan = DEFAULT_OVERSCAN,
  className,
  style,
  onFocus,
  ...props
}: LiteEditableGridProps<Row>) {
  if (!ariaLabel.trim()) throw new Error('LiteEditableGrid requires a non-empty aria-label.');
  const gridId = useId().replaceAll(':', '');
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef(0);
  const [scrollRow, setScrollRow] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof height === 'number' ? height : 448);
  const [active, setActive] = useState<Cell | null>(null);
  const [editing, setEditing] = useState<(Cell & { seed: string | undefined }) | null>(null);
  const clickedActive = useRef(false);

  const prepared = useMemo(() => {
    if (new Set(columns.map(column => column.key)).size !== columns.length) {
      throw new Error('LiteEditableGrid column keys must be unique.');
    }
    let offset = 0;
    return columns.map((column, index): PreparedColumn<Row> => {
      const px = column.width ?? DEFAULT_COLUMN_WIDTH;
      const kind = column.editor ?? 'text';
      if ((kind === 'select' || kind === 'combobox') && !column.options) {
        throw new Error(`LiteEditableGrid column "${column.key}" needs options for its ${kind} editor.`);
      }
      const prepared = {
        ...column,
        kind,
        px,
        offset,
        last: index === columns.length - 1,
        textByValue: column.options ? new Map(column.options.map(option => [option.value, option.text])) : undefined,
      };
      offset += px;
      return prepared;
    });
  }, [columns]);
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
    setActive(cell => cell && (cell.row >= rows.length || cell.col >= prepared.length)
      ? (rows.length && prepared.length ? { row: Math.min(cell.row, rows.length - 1), col: Math.min(cell.col, prepared.length - 1) } : null)
      : cell);
    setEditing(cell => cell && (cell.row >= rows.length || cell.col >= prepared.length) ? null : cell);
  }, [rows.length, prepared.length]);

  const { start, end } = computeRenderRange(scrollRow * LITE_GRID_ROW_HEIGHT, viewportHeight, rows.length, overscan);

  const onScroll = () => {
    const root = rootRef.current;
    if (!root) return;
    const first = Math.floor(root.scrollTop / LITE_GRID_ROW_HEIGHT);
    if (first !== firstRowRef.current) {
      firstRowRef.current = first;
      setScrollRow(first);
    }
  };

  const reveal = useCallback((cell: Cell) => {
    const root = rootRef.current;
    const column = prepared[cell.col];
    if (!root || !column) return;
    const top = cell.row * LITE_GRID_ROW_HEIGHT;
    const view = root.clientHeight - LITE_GRID_ROW_HEIGHT;
    if (top < root.scrollTop) root.scrollTop = top;
    else if (top + LITE_GRID_ROW_HEIGHT > root.scrollTop + view) root.scrollTop = top + LITE_GRID_ROW_HEIGHT - view;
    const right = column.offset + column.px;
    if (column.offset < root.scrollLeft) root.scrollLeft = column.offset;
    else if (right > root.scrollLeft + root.clientWidth) root.scrollLeft = right - root.clientWidth;
  }, [prepared]);

  const activate = useCallback((cell: Cell) => {
    setActive(cell);
    reveal(cell);
  }, [reveal]);

  const move = (from: Cell, direction: Move): Cell => {
    const lastRow = rows.length - 1;
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
    const row = rows[cell.row];
    const column = prepared[cell.col];
    if (row === undefined || !column || column.kind === 'none') return;
    if (readValue(column, row) === value) return;
    onCellChange({ rowId: getRowId(row), rowIndex: cell.row, columnKey: column.key, value, row });
  };

  const startEdit = (cell: Cell, seed?: string) => {
    if (prepared[cell.col]?.kind === 'none' || rows[cell.row] === undefined) return;
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

  const pageRows = Math.max(1, Math.floor((viewportHeight - LITE_GRID_ROW_HEIGHT) / LITE_GRID_ROW_HEIGHT) - 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !rows.length || !prepared.length) return;
    const cell = active ?? { row: 0, col: 0 };
    const kind = prepared[cell.col]?.kind;
    const ctrl = event.ctrlKey || event.metaKey;
    let next: Cell | undefined;
    switch (event.key) {
      case 'ArrowUp': next = move(cell, 'up'); break;
      case 'ArrowDown': next = move(cell, 'down'); break;
      case 'ArrowLeft': next = { row: cell.row, col: Math.max(0, cell.col - 1) }; break;
      case 'ArrowRight': next = { row: cell.row, col: Math.min(prepared.length - 1, cell.col + 1) }; break;
      case 'Home': next = ctrl ? { row: 0, col: 0 } : { row: cell.row, col: 0 }; break;
      case 'End': next = ctrl ? { row: rows.length - 1, col: prepared.length - 1 } : { row: cell.row, col: prepared.length - 1 }; break;
      case 'PageDown': next = { row: Math.min(rows.length - 1, cell.row + pageRows), col: cell.col }; break;
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
        if (event.key === 'Backspace' && (kind === 'text' || kind === 'longText' || kind === 'combobox')) startEdit(cell, '');
        else change(cell, '');
        return;
      default:
        if (event.key.length === 1 && !ctrl && !event.altKey) {
          event.preventDefault();
          if (kind === 'text' || kind === 'longText' || kind === 'combobox') startEdit(cell, event.key);
          else if (kind === 'select') startEdit(cell);
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
    clickedActive.current = active?.row === cell.row && active.col === cell.col;
    setActive(cell);
  };

  const onBodyClick = (event: MouseEvent) => {
    const cell = cellFromEvent(event);
    if (!cell) return;
    const kind = prepared[cell.col]?.kind;
    if (clickedActive.current && (kind === 'select' || kind === 'combobox')) startEdit(cell);
    clickedActive.current = false;
  };

  const onBodyDoubleClick = (event: MouseEvent) => {
    const cell = cellFromEvent(event);
    if (cell) startEdit(cell);
  };

  const onCopy = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !active) return;
    const row = rows[active.row];
    const column = prepared[active.col];
    if (row === undefined || !column) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', displayText(column, readValue(column, row)));
  };

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !active) return;
    const column = prepared[active.col];
    if (!column || column.kind === 'none') return;
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain').replace(/\r?\n$/, '');
    if (column.kind === 'select' || (column.kind === 'combobox' && column.freeform === false)) {
      const option = column.options?.find(item => item.value === text || item.text.toLocaleLowerCase() === text.toLocaleLowerCase());
      if (option) change(active, option.value);
      return;
    }
    change(active, column.kind === 'longText' ? text : text.replace(/\r?\n/g, ' '));
  };

  let editor: ReactElement | null = null;
  if (editing) {
    const row = rows[editing.row];
    const column = prepared[editing.col];
    if (row !== undefined && column) {
      const root = rootRef.current;
      const rowTop = editing.row * LITE_GRID_ROW_HEIGHT;
      const popup = column.kind === 'longText' ? LONG_TEXT_POPUP_HEIGHT
        : column.kind === 'select' || column.kind === 'combobox' ? LIST_POPUP_HEIGHT : 0;
      const viewTop = root?.scrollTop ?? 0;
      const viewBottom = viewTop + (root?.clientHeight ?? viewportHeight) - LITE_GRID_ROW_HEIGHT;
      const below = viewBottom - (rowTop + LITE_GRID_ROW_HEIGHT);
      const above = rowTop - viewTop;
      const placement = popup && below < popup && above > below ? 'above' : 'below';
      const editorStyle: CSSProperties = column.last
        ? { insetInlineStart: column.offset, insetInlineEnd: 0, top: rowTop }
        : { insetInlineStart: column.offset, top: rowTop, width: column.px };
      editor = h(CellEditor<Row>, {
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
    const row = rows[index] as Row;
    visibleRows.push(h(RowView<Row>, {
      activeCol: active?.row === index ? active.col : -1,
      columns: prepared,
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
    'aria-rowcount': rows.length + 1,
    className: withClass('nidec-ui-lite-grid', className),
    onCopy,
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && !active && rows.length && prepared.length) setActive({ row: 0, col: 0 });
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
      '--nidec-ui-lite-grid-row-height': `${LITE_GRID_ROW_HEIGHT}px`,
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
    style: { blockSize: `${rows.length * LITE_GRID_ROW_HEIGHT}px`, width },
  },
  h('div', {
    className: 'nidec-ui-lite-grid__window',
    role: 'presentation',
    style: { transform: `translateY(${start * LITE_GRID_ROW_HEIGHT}px)` },
  }, visibleRows),
  editor));
}
