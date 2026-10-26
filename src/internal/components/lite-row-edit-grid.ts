import { createElement as h, memo, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import { lockIcon } from './icons';
import { computeRenderRange } from './lite-editable-grid';
import {
  displayText, filterLiteGridOptions, prepareLiteGridColumns, readValue, renderTags, splitLiteGridValues,
} from './lite-grid-shared';
import type { LiteEditableGridOption, LiteGridCommonProps, PreparedColumn } from './lite-grid-shared';
import { withClass } from './with-class';

const DEFAULT_OVERSCAN = 10;
const LIST_POPUP_HEIGHT = 240;

/** One saved row edit: every editable value of the draft and the ones that changed. */
export type LiteRowEditGridRowChange<Row> = Readonly<{
  rowId: string;
  rowIndex: number;
  row: Row;
  /** Every editable column's draft value by column key; multiselect values joined with commas. */
  values: Readonly<Record<string, string>>;
  /** The columns whose value changed, in column order. */
  changes: readonly Readonly<{ columnKey: string; value: string; values?: readonly string[] }>[];
}>;

export type LiteRowEditGridProps<Row> = LiteGridCommonProps<Row> & {
  /** Called once when an edited row is left (saved) with at least one changed value. */
  onRowChange: (change: LiteRowEditGridRowChange<Row>) => void;
  /** Fixed row height in px, chosen by the application. Default 40. */
  rowHeight?: 32 | 40 | 48;
  /**
   * Viewport block size: px number or any CSS length, such as `calc(100dvh - 16rem)`.
   * Default `28rem`, unless `maxHeight` is given.
   */
  height?: number | string;
  /** Caps the height instead: short collections stay as tall as their rows, long ones scroll. */
  maxHeight?: number | string;
  /** `false` keeps a row read-only. */
  canEditRow?: (row: Row) => boolean;
};

type Draft = Readonly<Record<string, string>>;

const editable = <Row,>(column: PreparedColumn<Row>) => column.kind !== 'none';

/**
 * The row with draft values written back under their column keys, so read-only
 * columns that compute from other columns (an amount from quantity and price)
 * follow the draft. Columns with their own `getValue` are not written back.
 */
function rowWithDraft<Row>(row: Row, columns: readonly PreparedColumn<Row>[], draft: Draft): Row {
  if (row === null || typeof row !== 'object') return row;
  const copy = { ...(row as Record<string, unknown>) };
  for (const column of columns) {
    if (!editable(column) || column.getValue || !(column.key in draft)) continue;
    const value = draft[column.key]!;
    copy[column.key] = column.kind === 'multiselect' && Array.isArray(copy[column.key]) ? (value ? value.split(',') : []) : value;
  }
  return copy as Row;
}

function cellText<Row>(column: PreparedColumn<Row>, value: string): ReactNode {
  if (column.kind === 'multiselect') return renderTags(column, splitLiteGridValues(value, column.options), column.maxVisibleTags ?? 2);
  return displayText(column, value);
}

function lockMark<Row>(column: PreparedColumn<Row>) {
  return column.kind === 'none' ? h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__lock' }, lockIcon()) : null;
}

const rowElementId = (gridId: string, position: number) => `${gridId}-r${position}`;

type ViewRowProps<Row> = {
  row: Row;
  rowId: string;
  position: number;
  current: boolean;
  locked: boolean;
  columns: readonly PreparedColumn<Row>[];
  gridId: string;
};

function ViewRowImpl<Row>({ row, rowId, position, current, locked, columns, gridId }: ViewRowProps<Row>): ReactElement {
  return h('div', {
    'aria-disabled': locked ? true : undefined,
    'aria-rowindex': position + 2,
    'aria-selected': current ? true : undefined,
    className: 'nidec-ui-lite-grid__row',
    'data-current': current ? true : undefined,
    'data-row': position,
    'data-row-id': rowId,
    id: rowElementId(gridId, position),
    role: 'row',
  },
  columns.map(column => {
    const value = readValue(column, row);
    const error = column.validate?.(value, row);
    return h('div', {
      'aria-invalid': error ? true : undefined,
      'aria-readonly': column.kind === 'none' ? true : undefined,
      className: 'nidec-ui-lite-grid__cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      'data-editor': column.kind,
      'data-key': column.key,
      key: column.key,
      role: 'gridcell',
      title: error ?? (column.kind === 'longText' && value ? value : undefined),
    }, h('span', { className: 'nidec-ui-lite-grid__text' }, cellText(column, value)), lockMark(column));
  }));
}

const ViewRow = memo(ViewRowImpl) as typeof ViewRowImpl;

type Placement = { top: number; left: number; width: number; above: boolean };

/** Where a fixed popup sits under (or over) a field; fixed so that no scroll container clips it. */
function placePopup(field: HTMLElement): Placement {
  const rect = field.getBoundingClientRect();
  const viewHeight = field.ownerDocument.defaultView?.innerHeight ?? 800;
  const below = viewHeight - rect.bottom;
  const above = below < LIST_POPUP_HEIGHT && rect.top > below;
  return { top: above ? rect.top : rect.bottom, left: rect.left, width: rect.width, above };
}

type ListFieldProps<Row> = {
  column: PreparedColumn<Row>;
  value: string;
  label: string;
  listId: string;
  onChange: (value: string) => void;
};

/**
 * Select, combobox and multiselect field of an editing row. The list opens on
 * click, Space, Alt+Down or typing; Enter picks, Esc closes it. Enter on a
 * closed field and Esc on a closed field belong to the row (confirm, cancel).
 */
function ListField<Row>({ column, value, label, listId, onChange }: ListFieldProps<Row>) {
  const options = column.options ?? [];
  const multi = column.kind === 'multiselect';
  const combo = column.kind === 'combobox';
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<Placement | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(-1);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const shown = combo && query !== null ? filterLiteGridOptions(options, query) : options;
  const picked = multi ? splitLiteGridValues(value, options) : [];

  const show = () => {
    if (!fieldRef.current) return;
    setPlace(placePopup(fieldRef.current));
    setOpen(true);
    const current = options.findIndex(option => (multi ? picked.includes(option.value) : option.value === value));
    setHighlight(current < 0 ? 0 : current);
  };
  const hide = () => { setOpen(false); setQuery(null); };

  // Follow the field while the page or a scroll container scrolls.
  useEffect(() => {
    if (!open) return undefined;
    const view = fieldRef.current?.ownerDocument.defaultView;
    if (!view) return undefined;
    const update = () => { if (fieldRef.current) setPlace(placePopup(fieldRef.current)); };
    view.addEventListener('scroll', update, true);
    view.addEventListener('resize', update);
    return () => { view.removeEventListener('scroll', update, true); view.removeEventListener('resize', update); };
  }, [open]);

  useEffect(() => {
    const item = listRef.current?.children[highlight] as HTMLElement | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [highlight, open]);

  const pick = (option: LiteEditableGridOption) => {
    if (multi) {
      const next = picked.includes(option.value) ? picked.filter(item => item !== option.value) : [...picked, option.value];
      onChange(splitLiteGridValues(next.join(','), options).join(','));
      return;
    }
    onChange(option.value);
    hide();
  };

  const resolveTyped = () => {
    if (query === null) return;
    const match = options.find(option => option.text.toLocaleLowerCase() === query.trim().toLocaleLowerCase());
    if (match) onChange(match.value);
    else if (column.freeform !== false) onChange(query);
    setQuery(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.nativeEvent.isComposing) return;
    const last = shown.length - 1;
    if (!open) {
      if ((event.key === 'ArrowDown' && event.altKey) || event.key === 'F4' || (event.key === ' ' && !combo)) {
        event.preventDefault();
        event.stopPropagation();
        show();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        show();
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault(); event.stopPropagation(); hide(); return;
      case 'ArrowDown':
        event.preventDefault(); setHighlight(index => Math.min(last, index + 1)); return;
      case 'ArrowUp':
        event.preventDefault(); setHighlight(index => Math.max(0, index - 1)); return;
      case 'Home': case 'End':
        if (combo) return;
        event.preventDefault(); setHighlight(event.key === 'Home' ? 0 : last); return;
      case 'Enter': case ' ': {
        if (event.key === ' ' && combo) return;
        event.preventDefault();
        event.stopPropagation();
        const option = shown[highlight];
        if (option) pick(option);
        else if (combo) { resolveTyped(); hide(); }
        if (multi && event.key === 'Enter') hide();
        return;
      }
      case 'Tab':
        if (combo) resolveTyped();
        hide();
        return;
      default:
    }
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (fieldRef.current?.contains(event.relatedTarget as Node | null)) return;
    if (combo) resolveTyped();
    hide();
  };

  const active = open && shown[highlight] ? `${listId}-o${highlight}` : undefined;
  const list = open && place ? h('div', {
    'aria-label': label,
    'aria-multiselectable': multi || undefined,
    className: 'nidec-ui-lite-grid__listbox nidec-ui-lite-grid__listbox--fixed',
    'data-placement': place.above ? 'above' : 'below',
    id: listId,
    onMouseDown: (event: MouseEvent) => event.preventDefault(),
    ref: listRef,
    role: 'listbox',
    style: place.above
      ? { bottom: `calc(100vh - ${place.top}px + 2px)`, left: place.left, minWidth: place.width }
      : { top: place.top + 2, left: place.left, minWidth: place.width },
  }, shown.length === 0
    ? h('div', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__option-empty' }, '—')
    : shown.map((option, index) => h('div', {
      'aria-selected': multi ? picked.includes(option.value) : option.value === value,
      className: multi ? 'nidec-ui-lite-grid__option nidec-ui-lite-grid__option--check' : 'nidec-ui-lite-grid__option',
      'data-active': index === highlight ? true : undefined,
      id: `${listId}-o${index}`,
      key: option.value,
      onClick: () => pick(option),
      onMouseEnter: () => setHighlight(index),
      role: 'option',
    }, option.text))) : null;

  const common = {
    'aria-activedescendant': active,
    'aria-controls': open ? listId : undefined,
    'aria-expanded': open,
    'aria-label': label,
    onBlur,
    onKeyDown,
    role: 'combobox',
  } as const;

  const control = combo
    ? h('input', {
      ...common,
      'aria-autocomplete': 'list',
      autoComplete: 'off',
      className: 'nidec-ui-lite-grid__field-input',
      'data-field-control': true,
      onChange: (event: { target: { value: string } }) => {
        setQuery(event.target.value);
        if (!open) show();
        setHighlight(column.freeform === false ? 0 : -1);
      },
      onClick: () => (open ? hide() : show()),
      spellCheck: false,
      value: query ?? displayText(column, value),
    })
    : h('div', {
      ...common,
      className: 'nidec-ui-lite-grid__field-value',
      'data-field-control': true,
      onClick: (event: MouseEvent) => {
        const remove = (event.target as Element).closest('[data-remove]');
        if (remove) {
          const item = remove.getAttribute('data-remove');
          onChange(picked.filter(entry => entry !== item).join(','));
          return;
        }
        if (open) hide(); else show();
      },
      tabIndex: 0,
    }, multi ? renderTags(column, picked, Number.POSITIVE_INFINITY) : displayText(column, value));

  return h('div', { className: 'nidec-ui-lite-grid__field-list', ref: fieldRef }, control,
    h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__field-chevron' }), list);
}

type EditRowProps<Row> = {
  row: Row;
  rowId: string;
  position: number;
  columns: readonly PreparedColumn<Row>[];
  draft: Draft;
  errors: Readonly<Record<string, string | undefined>>;
  gridId: string;
  style: CSSProperties | undefined;
  onField: (key: string, value: string) => void;
  onSave: (next: boolean) => void;
  onCancel: () => void;
  onLeave: () => void;
};

function EditRow<Row>({
  row, rowId, position, columns, draft, errors, gridId, style, onField, onSave, onCancel, onLeave,
}: EditRowProps<Row>): ReactElement {
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);
  const shownRow = rowWithDraft(row, columns, draft);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); onCancel(); return; }
    if (event.defaultPrevented || event.key !== 'Enter') return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' && !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    onSave(true);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Leaving the row saves it; switching to another window does not.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    if (!event.currentTarget.ownerDocument.hasFocus()) return;
    onLeave();
  };
  return h('div', {
    'aria-rowindex': position + 2,
    className: 'nidec-ui-lite-grid__row',
    'data-current': true,
    'data-editing': true,
    'data-row': position,
    'data-row-id': rowId,
    id: rowElementId(gridId, position),
    onBlur,
    onKeyDown,
    role: 'row',
    style,
  },
  columns.map(column => {
    const readOnly = !editable(column);
    const value = readOnly ? readValue(column, shownRow) : (draft[column.key] ?? '');
    const error = errors[column.key];
    const label = `${column.header}, ${rowId}`;
    let field: ReactElement | null = null;
    if (!readOnly) {
      const onFocus = () => setFocusedKey(column.key);
      const onFieldBlur = () => setFocusedKey(key => (key === column.key ? undefined : key));
      let control: ReactElement;
      if (column.kind === 'select' || column.kind === 'combobox' || column.kind === 'multiselect') {
        control = h(ListField<Row>, {
          column, label, listId: `${gridId}-${column.key}-list`, onChange: (next: string) => onField(column.key, next), value,
        });
      } else if (column.kind === 'longText') {
        control = h('textarea', {
          'aria-invalid': error ? true : undefined,
          'aria-label': label,
          className: 'nidec-ui-lite-grid__field-input nidec-ui-lite-grid__field-input--area',
          'data-field-control': true,
          onChange: (event: { target: { value: string } }) => onField(column.key, event.target.value),
          rows: 1,
          spellCheck: false,
          value,
          wrap: 'off',
        });
      } else {
        control = h('input', {
          'aria-invalid': error ? true : undefined,
          'aria-label': label,
          autoComplete: 'off',
          className: 'nidec-ui-lite-grid__field-input',
          'data-field-control': true,
          inputMode: column.kind === 'number' ? 'decimal' : undefined,
          onChange: (event: { target: { value: string } }) => onField(column.key, event.target.value),
          spellCheck: false,
          value,
        });
      }
      field = h('div', {
        'aria-invalid': error ? true : undefined,
        className: 'nidec-ui-lite-grid__field',
        'data-focused': focusedKey === column.key ? true : undefined,
        onBlur: onFieldBlur,
        onFocus,
        title: error,
      }, control);
    }
    return h('div', {
      'aria-invalid': error ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      className: 'nidec-ui-lite-grid__cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      'data-editor': column.kind,
      'data-key': column.key,
      key: column.key,
      role: 'gridcell',
    },
    // Keeps the cell's layout; the field is drawn over it.
    h('span', { 'aria-hidden': readOnly ? undefined : true, className: 'nidec-ui-lite-grid__text' }, cellText(column, value)),
    field,
    lockMark(column));
  }));
}

type Editing = Readonly<{ id: string; draft: Draft }>;

/**
 * Lightweight editable grid with row edit, for long lists of uniform records
 * such as master data and cost tables. Rows have one fixed height and only
 * the rows in view are rendered, so it handles thousands of rows.
 *
 * Arrow keys move the current row; Enter, F2 or a double-click edits it. The
 * editing row turns light green and its editable values become fields without
 * boxes; the focused field carries a brand underline. Leaving the row, or
 * Enter, saves it with one `onRowChange`; Esc discards the draft. Like cell
 * edit there is no confirm action: values that fail validation are saved and
 * marked, for the consumer to resolve.
 */
export function LiteRowEditGrid<Row>({
  'aria-label': ariaLabel,
  columns,
  rows,
  getRowId,
  onRowChange,
  rowHeight = 40,
  height,
  maxHeight,
  overscan = DEFAULT_OVERSCAN,
  canEditRow,
  onActiveRowChange,
  className,
  style,
  onFocus,
  ...props
}: LiteRowEditGridProps<Row>) {
  if (!ariaLabel.trim()) throw new Error('LiteRowEditGrid requires a non-empty aria-label.');
  const gridId = useId().replaceAll(':', '');
  const rootRef = useRef<HTMLDivElement>(null);
  const prepared = useMemo(() => prepareLiteGridColumns(columns), [columns]);
  const count = rows.length;
  const [scrollRow, setScrollRow] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof height === 'number' ? height : 448);
  const [active, setActive] = useState<number | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  // The latest editing state, read by the handlers that save or discard it, so that a
  // blur fired while focus moves after a save or cancel finds nothing left to save.
  const editingRef = useRef<Editing | null>(null);
  editingRef.current = editing;
  const focusRequest = useRef<string | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    setViewportHeight(root.clientHeight);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => setViewportHeight(root.clientHeight));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActive(position => (position === null || position < count ? position : count ? count - 1 : null));
  }, [count]);

  const editingIndex = editing ? rows.findIndex(row => getRowId(row) === editing.id) : -1;
  const editingRow = editingIndex < 0 ? undefined : rows[editingIndex];
  const errors: Record<string, string | undefined> = {};
  if (editing && editingRow !== undefined) {
    const shown = rowWithDraft(editingRow, prepared, editing.draft);
    for (const column of prepared) if (editable(column)) errors[column.key] = column.validate?.(editing.draft[column.key] ?? '', shown);
  }

  const activeRow = active === null ? undefined : rows[active];
  const activeRowId = activeRow === undefined ? undefined : getRowId(activeRow);
  const reportedRowId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (reportedRowId.current === activeRowId) return;
    reportedRowId.current = activeRowId;
    onActiveRowChange?.(activeRowId);
  }, [activeRowId, onActiveRowChange]);

  const reveal = (position: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = position * rowHeight;
    const view = root.clientHeight - rowHeight;
    if (top < root.scrollTop) root.scrollTop = top;
    else if (top + rowHeight > root.scrollTop + view) root.scrollTop = top + rowHeight - view;
  };
  const activate = (position: number) => {
    setActive(position);
    reveal(position);
  };

  const save = () => {
    const current = editingRef.current;
    if (!current) return;
    editingRef.current = null;
    setEditing(null);
    const rowIndex = rows.findIndex(row => getRowId(row) === current.id);
    const row = rows[rowIndex];
    if (row === undefined) return;
    const changes = prepared.filter(column => editable(column) && current.draft[column.key] !== readValue(column, row))
      .map(column => {
        const value = current.draft[column.key] ?? '';
        return column.kind === 'multiselect'
          ? { columnKey: column.key, value, values: value ? value.split(',') : [] }
          : { columnKey: column.key, value };
      });
    if (changes.length) onRowChange({ rowId: current.id, rowIndex, row, values: current.draft, changes });
  };
  const focusGrid = () => rootRef.current?.focus({ preventScroll: true });

  const start = (position: number, columnKey?: string) => {
    const row = rows[position];
    if (row === undefined || (canEditRow && !canEditRow(row)) || !prepared.some(editable)) return;
    const rowId = getRowId(row);
    if (editingRef.current?.id === rowId) return;
    save();
    activate(position);
    const key = columnKey && prepared.some(column => column.key === columnKey && editable(column)) ? columnKey : undefined;
    focusRequest.current = key ?? '';
    const next = { id: rowId, draft: Object.fromEntries(prepared.filter(editable).map(column => [column.key, readValue(column, row)])) };
    editingRef.current = next;
    setEditing(next);
  };

  const onField = (key: string, value: string) =>
    setEditing(current => (current ? { id: current.id, draft: { ...current.draft, [key]: value } } : current));

  // Focus the first (or the double-clicked) field when a row starts editing.
  useLayoutEffect(() => {
    const request = focusRequest.current;
    const rowElement = rootRef.current?.querySelector<HTMLElement>('[data-editing]');
    if (request === null || !rowElement) return;
    focusRequest.current = null;
    const cell = request ? Array.from(rowElement.querySelectorAll<HTMLElement>('[data-key]'))
      .find(element => element.getAttribute('data-key') === request) : rowElement;
    cell?.querySelector<HTMLElement>('[data-field-control]')?.focus({ preventScroll: true });
  });

  const pageRows = Math.max(1, Math.floor((viewportHeight - rowHeight) / rowHeight) - 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !count) return;
    const position = active ?? 0;
    const ctrl = event.ctrlKey || event.metaKey;
    let next: number | undefined;
    switch (event.key) {
      case 'ArrowUp': next = Math.max(0, position - 1); break;
      case 'ArrowDown': next = Math.min(count - 1, position + 1); break;
      case 'PageUp': next = Math.max(0, position - pageRows); break;
      case 'PageDown': next = Math.min(count - 1, position + pageRows); break;
      case 'Home': if (!ctrl && active !== null) return; next = 0; break;
      case 'End': if (!ctrl && active !== null) return; next = count - 1; break;
      case 'Enter':
      case 'F2':
        event.preventDefault();
        start(position);
        return;
      default:
        return;
    }
    event.preventDefault();
    activate(next);
  };

  const positionFromEvent = (event: MouseEvent) => {
    const rowElement = (event.target as Element).closest('[data-row]');
    return rowElement ? Number(rowElement.getAttribute('data-row')) : undefined;
  };

  const onBodyMouseDown = (event: MouseEvent) => {
    const target = event.target as Element;
    if (target.closest('[data-editing]')) {
      // A click on the editing row outside its fields keeps the focus, and the row, in edit.
      if (!target.closest('.nidec-ui-lite-grid__field')) event.preventDefault();
      return;
    }
    const position = positionFromEvent(event);
    if (position !== undefined) setActive(position);
  };

  const onBodyDoubleClick = (event: MouseEvent) => {
    const target = event.target as Element;
    if (target.closest('[data-editing]')) return;
    const position = positionFromEvent(event);
    if (position === undefined) return;
    start(position, target.closest('[data-key]')?.getAttribute('data-key') ?? undefined);
  };

  const onScroll = () => {
    const root = rootRef.current;
    if (!root) return;
    const first = Math.floor(root.scrollTop / rowHeight);
    if (first !== scrollRow) setScrollRow(first);
  };

  const { start: first, end } = computeRenderRange(scrollRow * rowHeight, viewportHeight, count, overscan, rowHeight);
  const editRow = (position: number, rowStyle: CSSProperties | undefined) => h(EditRow<Row>, {
    columns: prepared, draft: editing!.draft, errors, gridId, key: editing!.id,
    onCancel: () => { editingRef.current = null; setEditing(null); focusGrid(); },
    onField,
    onLeave: save,
    onSave: (next: boolean) => {
      save();
      focusGrid();
      if (next) activate(Math.min(count - 1, position + 1));
    },
    position, row: rows[position] as Row, rowId: editing!.id, style: rowStyle,
  });
  const visible: ReactElement[] = [];
  for (let position = first; position < end; position += 1) {
    const row = rows[position] as Row;
    const rowId = getRowId(row);
    visible.push(editing?.id === rowId
      ? h('div', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__row', key: rowId, role: 'presentation' })
      : h(ViewRow<Row>, {
        columns: prepared, current: active === position, gridId, key: rowId,
        locked: canEditRow ? !canEditRow(row) : false, position, row, rowId,
      }));
  }
  // The editing row is drawn in its own layer over an empty slot, so scrolling it out of the
  // rendered window never remounts it: its focus and draft survive and leaving it still saves.
  const editingLayer = editingIndex >= 0
    ? editRow(editingIndex, { insetBlockStart: editingIndex * rowHeight, insetInline: 0, position: 'absolute' })
    : null;

  const totalWidth = prepared.reduce((sum, column) => sum + column.px, 0);
  const template = prepared.map(column => (column.last ? `minmax(${column.px}px, 1fr)` : `${column.px}px`)).join(' ');
  const width = `max(100%, ${totalWidth}px)`;
  const activeRendered = active !== null && active >= first && active < end;
  const blockSize = height ?? (maxHeight === undefined ? '28rem' : undefined);

  return h('div', {
    ...props,
    'aria-activedescendant': activeRendered && !editing ? rowElementId(gridId, active) : undefined,
    'aria-colcount': prepared.length,
    'aria-label': ariaLabel,
    'aria-rowcount': count + 1,
    className: withClass('nidec-ui-lite-grid', className),
    'data-edit-mode': 'row',
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && active === null && count) setActive(0);
      onFocus?.(event);
    },
    onKeyDown,
    onScroll,
    ref: rootRef,
    role: 'grid',
    style: {
      ...style,
      ...(blockSize === undefined ? {} : { blockSize: typeof blockSize === 'number' ? `${blockSize}px` : blockSize }),
      ...(maxHeight === undefined ? {} : { maxBlockSize: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
      '--nidec-ui-lite-grid-columns': template,
      '--nidec-ui-lite-grid-row-height': `${rowHeight}px`,
    } as CSSProperties,
    tabIndex: 0,
  },
  h('div', { 'aria-rowindex': 1, className: 'nidec-ui-lite-grid__header', role: 'row', style: { width } },
    prepared.map(column => h('div', {
      className: 'nidec-ui-lite-grid__header-cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      key: column.key,
      role: 'columnheader',
      title: column.header,
    }, column.header))),
  h('div', {
    className: 'nidec-ui-lite-grid__body',
    onDoubleClick: onBodyDoubleClick,
    onMouseDown: onBodyMouseDown,
    role: 'rowgroup',
    style: { blockSize: `${count * rowHeight}px`, width },
  },
  // Offset with padding, not a transform, so the fixed list popups of the editing row stay fixed to the window.
  h('div', { className: 'nidec-ui-lite-grid__window', role: 'presentation', style: { paddingBlockStart: `${first * rowHeight}px` } }, visible),
  editingLayer));
}
