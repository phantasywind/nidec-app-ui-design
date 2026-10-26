import { createElement as h, memo, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import { Tooltip as FluentTooltip } from '@fluentui/react-components';
import { TableActionIconButton } from './button';
import { EditableGridRowActionGroup } from './editable-grid';
import { checkIcon, dismissIcon, editIcon, lockIcon } from './icons';
import {
  buildLiteGridLayout, displayText, filterLiteGridOptions, prepareLiteGridColumns, readValue, renderTags, splitLiteGridValues,
} from './lite-grid-shared';
import type { LiteEditableGridBaseProps, LiteEditableGridOption, PreparedColumn, Section } from './lite-grid-shared';
import { withClass } from './with-class';

const AUTO_ROW_MIN_HEIGHT = 40;
const ACTIONS_WIDTH = 80;
const LIST_POPUP_HEIGHT = 240;

export type LiteEditableGridRowActionLabel = 'edit' | 'confirm' | 'cancel';

/** One confirmed row edit: every editable value of the draft and the ones that changed. */
export type LiteEditableGridRowChange<Row> = Readonly<{
  rowId: string;
  rowIndex: number;
  row: Row;
  /** Every editable column's draft value by column key; multiselect values joined with commas. */
  values: Readonly<Record<string, string>>;
  /** The columns whose value changed, in column order. */
  changes: readonly Readonly<{ columnKey: string; value: string; values?: readonly string[] }>[];
}>;

/** Props of the row edit mode: one row edits at a time and is confirmed or cancelled as a whole. */
export type LiteEditableGridRowModeProps<Row> = LiteEditableGridBaseProps<Row> & {
  editMode: 'row';
  /** Called once when a row is confirmed with at least one changed value. */
  onRowChange: (change: LiteEditableGridRowChange<Row>) => void;
  /**
   * Row height in px, default 40. `auto` lets long text and tags wrap and the
   * row grow with them; every row is rendered, so keep such grids to a few
   * hundred rows.
   */
  rowHeight?: 32 | 40 | 48 | 'auto';
  /**
   * Caps the grid's height (px or a CSS length such as `calc(100vh - 320px)`):
   * short collections stay as tall as their rows, long ones scroll under the sticky header.
   */
  maxHeight?: number | string;
  /** Controlled id of the row being edited; `null` edits none. Leave undefined to let the grid own it. */
  editingRowId?: string | null;
  onEditingRowChange?: (rowId: string | null) => void;
  /** `false` or a reason disables the row's edit action; a reason is shown on hover and focus. */
  canEditRow?: (row: Row) => boolean | string;
  /** More actions for a row that is not being edited, placed before its edit action. Keep the function stable. */
  renderRowActions?: (row: Row) => ReactNode;
  /** Header of the actions column. Default `Actions`. */
  actionsHeader?: string;
  /** Accessible names of the row actions. Default `Edit row <id>`, `Confirm row <id>`, `Cancel row <id>`. */
  formatRowActionLabel?: (action: LiteEditableGridRowActionLabel, rowId: string) => string;
};

const defaultActionLabel = (action: LiteEditableGridRowActionLabel, rowId: string) =>
  `${action === 'edit' ? 'Edit' : action === 'confirm' ? 'Confirm' : 'Cancel'} row ${rowId}`;

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

type Api<Row> = {
  start: (row: Row, columnKey?: string) => void;
};

type ViewRowProps<Row> = {
  row: Row;
  rowId: string;
  position: number;
  depth: number;
  columns: readonly PreparedColumn<Row>[];
  api: { current: Api<Row> };
  canEditRow: ((row: Row) => boolean | string) | undefined;
  renderRowActions: ((row: Row) => ReactNode) | undefined;
  formatRowActionLabel: (action: LiteEditableGridRowActionLabel, rowId: string) => string;
};

function ViewRowImpl<Row>({
  row, rowId, position, depth, columns, api, canEditRow, renderRowActions, formatRowActionLabel,
}: ViewRowProps<Row>): ReactElement {
  const allowed = canEditRow ? canEditRow(row) : true;
  const label = formatRowActionLabel('edit', rowId);
  const reason = typeof allowed === 'string' ? allowed : undefined;
  const editButton = h(TableActionIconButton, {
    'aria-label': label,
    className: 'nidec-ui-lite-grid__edit-action',
    disabled: allowed !== true,
    ...(reason ? { disabledReason: reason } : {}),
    icon: editIcon(),
    onClick: () => api.current.start(row),
  });
  return h('div', {
    'aria-rowindex': position + 2,
    className: 'nidec-ui-lite-grid__row',
    'data-depth': depth || undefined,
    'data-row-id': rowId,
    onDoubleClick: allowed === true ? (event: MouseEvent) => {
      const key = (event.target as Element).closest('[data-key]')?.getAttribute('data-key') ?? undefined;
      api.current.start(row, key);
    } : undefined,
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
  }),
  h('div', { className: 'nidec-ui-lite-grid__cell nidec-ui-lite-grid__actions', role: 'gridcell' },
    renderRowActions?.(row),
    reason ? editButton : h(FluentTooltip, { content: label, relationship: 'label' }, editButton)));
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
  depth: number;
  columns: readonly PreparedColumn<Row>[];
  draft: Draft;
  errors: Readonly<Record<string, string | undefined>>;
  auto: boolean;
  gridId: string;
  onField: (key: string, value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  formatRowActionLabel: (action: LiteEditableGridRowActionLabel, rowId: string) => string;
};

function EditRow<Row>({
  row, rowId, position, depth, columns, draft, errors, auto, gridId, onField, onConfirm, onCancel, formatRowActionLabel,
}: EditRowProps<Row>): ReactElement {
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);
  const shownRow = rowWithDraft(row, columns, draft);
  const invalid = Object.values(errors).some(Boolean);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    // Checked before defaultPrevented: a visible Fluent tooltip (the confirm action under the
    // pointer) prevents Escape at document level, which must not swallow the row's cancel.
    if (event.key === 'Escape') { event.preventDefault(); onCancel(); return; }
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (event.key !== 'Enter' || target.closest('button')) return;
    if (target.tagName === 'TEXTAREA' && !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    onConfirm();
  };
  return h('div', {
    'aria-rowindex': position + 2,
    className: 'nidec-ui-lite-grid__row',
    'data-depth': depth || undefined,
    'data-editing': true,
    'data-row-id': rowId,
    onKeyDown,
    role: 'row',
  },
  columns.map(column => {
    const readOnly = !editable(column);
    const value = readOnly ? readValue(column, shownRow) : (draft[column.key] ?? '');
    const error = errors[column.key];
    const label = `${column.header}, ${rowId}`;
    let field: ReactElement | null = null;
    if (!readOnly) {
      const onFocus = () => setFocusedKey(column.key);
      const onBlur = () => setFocusedKey(key => (key === column.key ? undefined : key));
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
          wrap: auto ? 'soft' : 'off',
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
        onBlur,
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
    // In flow: gives the cell the height of the draft text; the field is drawn over it.
    h('span', { 'aria-hidden': readOnly ? undefined : true, className: 'nidec-ui-lite-grid__text' }, cellText(column, value)),
    field,
    lockMark(column));
  }),
  h('div', { className: 'nidec-ui-lite-grid__cell nidec-ui-lite-grid__actions', role: 'gridcell' },
    h(EditableGridRowActionGroup, {
      cancelIcon: dismissIcon(),
      cancelLabel: formatRowActionLabel('cancel', rowId),
      confirmDisabled: invalid,
      confirmIcon: checkIcon(),
      confirmLabel: formatRowActionLabel('confirm', rowId),
      onCancel,
      onConfirm,
    })));
}

function SectionRow({ section, position, summary, formatGroupCount, onToggle }: {
  section: Section; position: number; summary: string | undefined; formatGroupCount: (count: number) => string;
  onToggle: (key: string) => void;
}) {
  return h('div', {
    'aria-rowindex': position + 2,
    className: 'nidec-ui-lite-grid__section',
    'data-level': section.level,
    onClick: () => onToggle(section.key),
    role: 'row',
  }, h('div', {
    'aria-expanded': section.expanded,
    'aria-label': `${section.label}, ${formatGroupCount(section.count)}${summary ? `, ${summary}` : ''}`,
    className: 'nidec-ui-lite-grid__section-cell',
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onToggle(section.key);
    },
    role: 'gridcell',
    tabIndex: 0,
  },
  h('span', { 'aria-hidden': true, className: 'nidec-ui-lite-grid__section-chevron' }),
  h('span', { className: 'nidec-ui-lite-grid__section-label' }, section.label),
  summary ? h('span', { className: 'nidec-ui-lite-grid__section-summary' }, summary) : null));
}

/**
 * Row edit mode of LiteEditableGrid. Rows render as plain text. The edit
 * action (or a double-click) turns one row into an editing row: its editable
 * values stay where they are, in semibold, and become fields
 * without boxes; the focused field carries a brand underline. Enter or the
 * check confirms the whole row, Esc or the cross cancels it.
 */
export function RowEditGrid<Row>({
  'aria-label': ariaLabel,
  columns,
  rows,
  getRowId,
  onRowChange,
  rowHeight = 40,
  height,
  maxHeight,
  editingRowId,
  onEditingRowChange,
  canEditRow,
  renderRowActions,
  actionsHeader = 'Actions',
  formatRowActionLabel = defaultActionLabel,
  getRowGroup,
  collapsedGroups,
  defaultCollapsedGroups,
  onCollapsedGroupsChange,
  getGroupSummary,
  formatGroupCount = count => `${count} ${count === 1 ? 'row' : 'rows'}`,
  className,
  style,
  editMode: _editMode,
  ...props
}: LiteEditableGridRowModeProps<Row>) {
  if (!ariaLabel.trim()) throw new Error('LiteEditableGrid requires a non-empty aria-label.');
  const gridId = useId().replaceAll(':', '');
  const rootRef = useRef<HTMLDivElement>(null);
  const prepared = useMemo(() => prepareLiteGridColumns(columns), [columns]);
  const [ownCollapsed, setOwnCollapsed] = useState<ReadonlySet<string>>(() => new Set(defaultCollapsedGroups ?? []));
  const collapsed = collapsedGroups ?? ownCollapsed;
  const layout = useMemo(() => buildLiteGridLayout(rows, getRowGroup, collapsed), [rows, getRowGroup, collapsed]);
  const toggleGroup = (key: string) => {
    const next = new Set(collapsed);
    if (next.has(key)) next.delete(key); else next.add(key);
    if (!collapsedGroups) setOwnCollapsed(next);
    onCollapsedGroupsChange?.(next);
  };

  const [ownEditing, setOwnEditing] = useState<string | null>(null);
  const editingId = editingRowId !== undefined ? editingRowId : ownEditing;
  const editingIndex = editingId === null ? -1 : rows.findIndex(row => getRowId(row) === editingId);
  const editingRow = editingIndex < 0 ? undefined : rows[editingIndex];
  const initialDraft = (row: Row): Draft =>
    Object.fromEntries(prepared.filter(editable).map(column => [column.key, readValue(column, row)]));
  const [draftState, setDraftState] = useState<{ id: string | null; values: Draft }>({ id: null, values: {} });
  let draft = draftState.values;
  if (draftState.id !== editingId) {
    // A new editing row (also when the parent sets `editingRowId`) starts from its current values.
    const fresh = { id: editingId, values: editingRow === undefined ? {} : initialDraft(editingRow) };
    setDraftState(fresh);
    draft = fresh.values;
  }
  const errors: Record<string, string | undefined> = {};
  if (editingRow !== undefined) {
    const shown = rowWithDraft(editingRow, prepared, draft);
    for (const column of prepared) if (editable(column)) errors[column.key] = column.validate?.(draft[column.key] ?? '', shown);
  }
  const dirty = editingRow !== undefined
    && prepared.some(column => editable(column) && draft[column.key] !== readValue(column, editingRow));

  const focusRequest = useRef<{ rowId: string; target: string } | null>(null);
  const setEditing = (rowId: string | null) => {
    if (editingRowId === undefined) setOwnEditing(rowId);
    onEditingRowChange?.(rowId);
  };

  const start = (row: Row, columnKey?: string) => {
    const rowId = getRowId(row);
    if (editingId !== null && editingRow !== undefined && rowId !== editingId && dirty) {
      // One row at a time: unconfirmed changes keep their row in edit.
      focusRequest.current = { rowId: editingId, target: 'field' };
      rootRef.current?.querySelector<HTMLElement>(`[data-editing] [data-field-control]`)?.focus();
      return;
    }
    const allowed = canEditRow ? canEditRow(row) : true;
    if (allowed !== true) return;
    const key = columnKey && prepared.some(column => column.key === columnKey && editable(column)) ? columnKey : undefined;
    focusRequest.current = { rowId, target: key ?? 'field' };
    setEditing(rowId);
  };
  const api = useRef<Api<Row>>({ start });
  api.current = { start };

  const finish = () => {
    if (editingId !== null) focusRequest.current = { rowId: editingId, target: 'edit' };
    setEditing(null);
  };
  const confirm = () => {
    if (editingRow === undefined || editingId === null) return;
    if (Object.values(errors).some(Boolean)) return;
    const changes = prepared.filter(column => editable(column) && draft[column.key] !== readValue(column, editingRow))
      .map(column => {
        const value = draft[column.key] ?? '';
        return column.kind === 'multiselect'
          ? { columnKey: column.key, value, values: value ? value.split(',') : [] }
          : { columnKey: column.key, value };
      });
    if (changes.length) onRowChange({ rowId: editingId, rowIndex: editingIndex, row: editingRow, values: draft, changes });
    finish();
  };
  const onField = (key: string, value: string) =>
    setDraftState(current => ({ id: current.id, values: { ...current.values, [key]: value } }));

  // Focus the first (or the double-clicked) field when a row starts editing, and its edit action when it ends.
  useLayoutEffect(() => {
    const request = focusRequest.current;
    const root = rootRef.current;
    if (!request || !root) return;
    const rowElement = Array.from(root.querySelectorAll<HTMLElement>('[data-row-id]'))
      .find(element => element.getAttribute('data-row-id') === request.rowId);
    if (!rowElement) return;
    focusRequest.current = null;
    const target = request.target === 'edit'
      ? rowElement.querySelector<HTMLElement>('.nidec-ui-lite-grid__edit-action')
      : request.target === 'field'
        ? rowElement.querySelector<HTMLElement>('[data-field-control]')
        : Array.from(rowElement.querySelectorAll<HTMLElement>('[data-key]'))
          .find(element => element.getAttribute('data-key') === request.target)?.querySelector<HTMLElement>('[data-field-control]');
    target?.focus({ preventScroll: false });
  });

  const auto = rowHeight === 'auto';
  const totalWidth = prepared.reduce((sum, column) => sum + column.px, 0) + ACTIONS_WIDTH;
  const template = `${prepared.map(column => (column.last ? `minmax(${column.px}px, 1fr)` : `${column.px}px`)).join(' ')} ${ACTIONS_WIDTH}px`;
  const width = `max(100%, ${totalWidth}px)`;

  const body: ReactElement[] = [];
  for (let position = 0; position < layout.count; position += 1) {
    const section = layout.sectionAt(position);
    if (section) {
      body.push(h(SectionRow, {
        formatGroupCount, key: `section:${section.key}`, onToggle: toggleGroup, position, section, summary: getGroupSummary?.(section),
      }));
      continue;
    }
    const row = rows[layout.rowAt(position)] as Row;
    const rowId = getRowId(row);
    body.push(rowId === editingId
      ? h(EditRow<Row>, {
        auto, columns: prepared, depth: layout.depthAt(position), draft, errors, formatRowActionLabel, gridId, key: rowId,
        onCancel: finish, onConfirm: confirm, onField, position, row, rowId,
      })
      : h(ViewRow<Row>, {
        api, canEditRow, columns: prepared, depth: layout.depthAt(position), formatRowActionLabel, key: rowId, position,
        renderRowActions, row, rowId,
      }));
  }

  return h('div', {
    ...props,
    'aria-colcount': prepared.length + 1,
    'aria-label': ariaLabel,
    'aria-rowcount': layout.count + 1,
    className: withClass('nidec-ui-lite-grid', className),
    'data-edit-mode': 'row',
    'data-row-height': auto ? 'auto' : undefined,
    ref: rootRef,
    role: 'grid',
    style: {
      ...style,
      ...(height === undefined ? {} : { blockSize: typeof height === 'number' ? `${height}px` : height }),
      ...(maxHeight === undefined ? {} : { maxBlockSize: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
      '--nidec-ui-lite-grid-columns': template,
      '--nidec-ui-lite-grid-row-height': `${auto ? AUTO_ROW_MIN_HEIGHT : rowHeight}px`,
    } as CSSProperties,
  },
  h('div', { 'aria-rowindex': 1, className: 'nidec-ui-lite-grid__header', role: 'row', style: { width } },
    prepared.map(column => h('div', {
      className: 'nidec-ui-lite-grid__header-cell',
      'data-align': column.align === 'end' ? 'end' : undefined,
      key: column.key,
      role: 'columnheader',
      title: column.header,
    }, column.header)),
    h('div', { className: 'nidec-ui-lite-grid__header-cell nidec-ui-lite-grid__actions', role: 'columnheader' }, actionsHeader)),
  h('div', { className: 'nidec-ui-lite-grid__body', role: 'rowgroup', style: { width } }, body));
}
