import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import {
  Input, Popover, PopoverSurface, SearchBox, Spinner, Table, TableBody, TableCell,
  TableHeader, TableHeaderCell, TableRow, Text, makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
import type { PositioningVirtualElement } from '@fluentui/react-components';
import { Button, IconButton } from './button';
import { dismissIcon, searchIcon } from './icons';
import { EmptyState } from './record-patterns';
import { SegmentedControl } from './segmented-control';

export type LookupAnchor = PositioningVirtualElement;

/** Builds a virtual Popover anchor from a rectangle, e.g. a table cell bounding box. */
export const createLookupAnchor = (rect: DOMRect): LookupAnchor => ({
  getBoundingClientRect: () => rect,
});

export type LookupColumn<TItem> = Readonly<{
  /** Unique column key, also used to track sort state. */
  key: string;
  /** Column header text. */
  header: string;
  /** Optional fixed CSS width (for example '9.5rem' or '120px'). */
  width?: string;
  /** Whether clicking the header sorts by this column (default true). */
  sortable?: boolean;
  /** Extracts the sortable/text value from an item. */
  getValue: (item: TItem) => string | number | null | undefined;
  /** Optional custom cell renderer; defaults to getValue(item). */
  renderCell?: (item: TItem) => ReactNode;
  /** Optional tooltip title extractor; defaults to stringified getValue(item). */
  getTitle?: (item: TItem) => string | undefined;
}>;

export type LookupSortState = Readonly<{
  key: string;
  ascending: boolean;
}>;

export type LookupManualModeConfig = Readonly<{
  /** Accessible name for the mode SegmentedControl (default 'Selection source'). */
  switcherLabel?: string;
  /** Label for the searchable list tab (default 'From the list'). */
  searchLabel?: string;
  /** Label for the manual/custom tab (default 'Enter manually'). */
  manualLabel?: string;
  /** Start directly in manual mode when the window opens. */
  defaultActive?: boolean;
  /** Custom fields rendered inside the fixed-height manual panel. */
  content: ReactNode;
  /** Optional left-aligned footer note shown while in manual mode. */
  footerNote?: ReactNode;
  /** Primary button label in manual mode (default 'Use'). */
  confirmLabel?: string;
  /** Whether manual confirmation is currently disabled. */
  confirmDisabled?: boolean;
  /** Explanation shown via Button disabledReason when confirmDisabled is true. */
  confirmDisabledReason?: string;
  /** Called when the user confirms manual entry. */
  onConfirm: () => void;
}>;

export type LookupSearchWindowProps<TItem> = {
  /** Element or virtual anchor (createLookupAnchor) to position the window next to. */
  target: HTMLElement | LookupAnchor | null;
  /** Header title and accessible dialog name. */
  title: string;
  /** Initial search text seeded when the window opens (e.g. a typed character). */
  initialQuery?: string;
  /** Controlled search query; omit to let the window manage query text internally. */
  query?: string;
  /** Called when the search text changes (debounced by debounceMs, default 250ms). */
  onQueryChange?: (query: string) => void;
  /** Debounce delay in milliseconds before invoking onQueryChange (default 250). */
  debounceMs?: number;
  /** Accessible name for the SearchBox (defaults to `Search ${title.toLowerCase()}`). */
  searchLabel?: string;
  /** Placeholder text for the SearchBox. */
  searchPlaceholder?: string;
  /** Optional secondary filter control or fixed scope caption placed beside the SearchBox. */
  filterSlot?: ReactNode;
  /** Columns rendered in the sortable results table. */
  columns: readonly LookupColumn<TItem>[];
  /** Loaded rows matching the current search and filters. */
  items: readonly TItem[];
  /** Unique key extractor for each item. */
  getItemKey: (item: TItem) => string;
  /** Currently chosen item key, highlighted and scrolled into view. */
  selectedKey?: string | null;
  /** Initial sort column and direction (defaults to the first sortable column ascending). */
  defaultSort?: LookupSortState;
  /** Total match count across the dataset (defaults to items.length). */
  totalCount?: number;
  /** True while matching rows are loading. */
  loading?: boolean;
  /** Spinner label while loading (default 'Searching...'). */
  loadingLabel?: string;
  /** Empty state title when no items match. */
  emptyTitle?: string;
  /** Optional empty state description. */
  emptyDescription?: string;
  /** Accessible name for the results table (default 'Matching records'). */
  tableLabel?: string;
  /** Primary confirm button label in list mode (default 'Select'). */
  selectLabel?: string;
  /** Secondary cancel button label (default 'Cancel'). */
  cancelLabel?: string;
  /** Accessible label for the header close button (default 'Close'). */
  closeLabel?: string;
  /** Formats the left-aligned match count summary in the footer. */
  formatMatchCount?: (listedCount: number, totalCount: number) => string;
  /** Optional manual / custom entry mode toggled via SegmentedControl. */
  manualMode?: LookupManualModeConfig;
  /** Called when the user confirms a row (double-click, Enter, or Select). */
  onSelect: (item: TItem) => void;
  /** Called when the window is dismissed (Esc, outside click, Cancel, or Close). */
  onClose: () => void;
  className?: string;
};

export type LookupProps<TItem> = Omit<
  LookupSearchWindowProps<TItem>,
  'target' | 'initialQuery' | 'onClose' | 'onSelect' | 'className'
> & {
  /** Currently selected record key, or null when empty. */
  value: string | null;
  /** Display text rendered inside the read-only lookup input. */
  displayValue: string;
  /** Called when a record is selected from the search window. */
  onSelect: (item: TItem) => void;
  /** Called when the user clears the current value with Delete or Backspace. */
  onClear?: () => void;
  /** Optional notification when the anchored search window opens or closes. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  className?: string;
  /** Optional className applied to the PopoverSurface of the search window. */
  windowClassName?: string;
};

const useLookupStyles = makeStyles({
  box: {
    cursor: 'pointer',
    minWidth: 0,
    width: '100%',
  },
  input: {
    cursor: 'pointer',
    textOverflow: 'ellipsis',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  surface: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: 'border-box',
    display: 'grid',
    gap: tokens.spacingVerticalS,
    maxWidth: 'calc(100vw - 32px)',
    padding: tokens.spacingHorizontalL,
    width: '760px',
  },
  head: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginInlineEnd: 'auto',
  },
  filters: {
    alignItems: 'center',
    display: 'grid',
    gap: tokens.spacingHorizontalS,
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  filtersSplit: {
    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
    '@media (max-width: 560px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  // Both list and manual modes share the same height so switching does not jump the footer buttons.
  results: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    height: '300px',
    overflowY: 'auto',
  },
  loadingWrap: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalL,
  },
  manual: {
    alignContent: 'start',
    boxSizing: 'border-box',
    display: 'grid',
    gap: tokens.spacingVerticalM,
    height: '300px',
    overflowY: 'auto',
    paddingBlock: tokens.spacingVerticalS,
  },
  table: {
    tableLayout: 'fixed',
    width: '100%',
  },
  stickyHeader: {
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  row: {
    cursor: 'default',
  },
  current: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  cell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  foot: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'space-between',
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginInlineStart: 'auto',
  },
});

/** Sorts lookup rows using the active column definition without mutating the source array. */
export function sortLookupItems<TItem>(
  items: readonly TItem[],
  columns: readonly LookupColumn<TItem>[],
  sort: LookupSortState | null,
): TItem[] {
  const copy = [...items];
  if (!sort) return copy;
  const column = columns.find(candidate => candidate.key === sort.key);
  if (!column || column.sortable === false) return copy;
  const direction = sort.ascending ? 1 : -1;
  copy.sort((left, right) => {
    const a = column.getValue(left);
    const b = column.getValue(right);
    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * direction;
    }
    const textA = a === null || a === undefined ? '' : String(a).toLocaleLowerCase();
    const textB = b === null || b === undefined ? '' : String(b).toLocaleLowerCase();
    return textA.localeCompare(textB) * direction;
  });
  return copy;
}

/** Moves the active highlighted key up or down by step, clamped to the visible list bounds. */
export function moveLookupKey<TItem>(
  items: readonly TItem[],
  getItemKey: (item: TItem) => string,
  currentKey: string | null,
  step: number,
): string | null {
  if (items.length === 0) return null;
  const index = currentKey === null ? -1 : items.findIndex(item => getItemKey(item) === currentKey);
  const nextIndex = Math.min(items.length - 1, Math.max(0, index < 0 ? 0 : index + step));
  return getItemKey(items[nextIndex]!);
}

/** Resolves which item Enter should confirm: active row, sole match, or exact key match to query. */
export function resolveLookupSelection<TItem>(
  items: readonly TItem[],
  getItemKey: (item: TItem) => string,
  currentKey: string | null,
  query: string,
): TItem | undefined {
  if (currentKey !== null) {
    const active = items.find(item => getItemKey(item) === currentKey);
    if (active) return active;
  }
  if (items.length === 1) return items[0];
  const normalized = query.trim().toUpperCase();
  if (!normalized) return undefined;
  return items.find(item => getItemKey(item).toUpperCase() === normalized);
}

/** Default footer summary describing listed vs total match counts. */
export function defaultFormatLookupMatchCount(listedCount: number, totalCount: number): string {
  if (totalCount > listedCount) {
    return `${totalCount} matches: the first ${listedCount} are listed, add words to narrow down`;
  }
  return `${totalCount} match${totalCount === 1 ? '' : 'es'}`;
}

function defaultSortForColumns<TItem>(columns: readonly LookupColumn<TItem>[]): LookupSortState | null {
  const firstSortable = columns.find(column => column.sortable !== false);
  return firstSortable ? { key: firstSortable.key, ascending: true } : null;
}

/**
 * Anchored multi-column lookup search window. Opens next to its trigger or a
 * virtual cell anchor (`createLookupAnchor`), supports debounced search, optional
 * secondary filters, sortable columns, arrow-key navigation, double-click
 * selection, and an optional equal-height manual entry tab.
 */
export function LookupSearchWindow<TItem>({
  target,
  title,
  initialQuery = '',
  query,
  onQueryChange,
  debounceMs = 250,
  searchLabel,
  searchPlaceholder = 'Type to search...',
  filterSlot,
  columns,
  items,
  getItemKey,
  selectedKey = null,
  defaultSort,
  totalCount,
  loading = false,
  loadingLabel = 'Searching...',
  emptyTitle = 'No matching records. Try fewer or other words.',
  emptyDescription,
  tableLabel = 'Matching records',
  selectLabel = 'Select',
  cancelLabel = 'Cancel',
  closeLabel = 'Close',
  formatMatchCount = defaultFormatLookupMatchCount,
  manualMode,
  onSelect,
  onClose,
  className,
}: LookupSearchWindowProps<TItem>): ReactElement {
  const styles = useLookupStyles();
  const [mode, setMode] = useState<'search' | 'manual'>(manualMode?.defaultActive ? 'manual' : 'search');
  const [uncontrolledText, setUncontrolledText] = useState(initialQuery);
  const text = query === undefined ? uncontrolledText : query;
  const [sort, setSort] = useState<LookupSortState | null>(() => defaultSort ?? defaultSortForColumns(columns));
  const [currentKey, setCurrentKey] = useState<string | null>(selectedKey);
  const bodyRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;

  useEffect(() => {
    if (query !== undefined || !onQueryChangeRef.current) return undefined;
    if (debounceMs <= 0) {
      onQueryChangeRef.current(uncontrolledText);
      return undefined;
    }
    const timer = setTimeout(() => onQueryChangeRef.current?.(uncontrolledText), debounceMs);
    return () => clearTimeout(timer);
  }, [query, uncontrolledText, debounceMs]);

  const rows = useMemo(() => sortLookupItems(items, columns, sort), [items, columns, sort]);
  const effectiveTotal = totalCount ?? rows.length;

  // Move focus directly to the search input (or first manual field) instead of the header Close button.
  useEffect(() => {
    const timer = setTimeout(() => {
      surfaceRef.current?.querySelector<HTMLInputElement>('input[type="search"], input')?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [mode]);

  // Keep the highlighted row visible as data loads or arrow keys move selection.
  useEffect(() => {
    const row = bodyRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    row?.scrollIntoView?.({ block: 'nearest' });
  }, [currentKey, rows]);

  const handleSearchChange = (nextValue: string) => {
    if (query === undefined) {
      setUncontrolledText(nextValue);
    } else {
      onQueryChange?.(nextValue);
    }
  };

  const handleChoose = () => {
    const chosen = resolveLookupSelection(rows, getItemKey, currentKey, text);
    if (chosen) onSelect(chosen);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentKey(prev => moveLookupKey(rows, getItemKey, prev, event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleChoose();
    }
  };

  const canSelect = currentKey !== null && rows.some(item => getItemKey(item) === currentKey);
  const effectiveMode = manualMode ? mode : 'search';

  const headerNode = createElement('div', { className: styles.head },
    createElement(Text, { className: styles.title }, title),
    manualMode ? createElement(SegmentedControl, {
      size: 'small',
      'aria-label': manualMode.switcherLabel ?? 'Selection source',
      value: effectiveMode,
      onValueChange: (_, value) => setMode(value as 'search' | 'manual'),
      options: [
        { value: 'search', label: manualMode.searchLabel ?? 'From the list' },
        { value: 'manual', label: manualMode.manualLabel ?? 'Enter manually' },
      ],
    }) : null,
    createElement(IconButton, {
      size: 'small',
      icon: dismissIcon(),
      'aria-label': closeLabel,
      onClick: onClose,
    }),
  );

  const listBody = createElement('div', { className: styles.results, ref: bodyRef },
    rows.length === 0
      ? (loading
        ? createElement('div', { className: styles.loadingWrap },
          createElement(Spinner, { size: 'tiny', label: loadingLabel }))
        : createElement(EmptyState, {
          title: emptyTitle,
          ...(emptyDescription !== undefined ? { description: emptyDescription } : {}),
        }))
      : createElement(Table, {
        'aria-label': tableLabel,
        size: 'small',
        sortable: true,
        className: styles.table,
      },
      createElement(TableHeader, { className: styles.stickyHeader },
        createElement(TableRow, null,
          ...columns.map(column => {
            const isSortable = column.sortable !== false;
            const sortDirection = isSortable && sort?.key === column.key
              ? (sort.ascending ? 'ascending' : 'descending')
              : undefined;
            return createElement(TableHeaderCell, {
              key: column.key,
              ...(column.width ? { style: { width: column.width } } : {}),
              ...(sortDirection ? { sortDirection } : {}),
              ...(isSortable ? {
                onClick: () => setSort(prev => ({
                  key: column.key,
                  ascending: prev?.key === column.key ? !prev.ascending : true,
                })),
              } : {}),
            }, column.header);
          }),
        ),
      ),
      createElement(TableBody, null,
        ...rows.map(item => {
          const itemKey = getItemKey(item);
          const isCurrent = itemKey === currentKey;
          return createElement(TableRow, {
            key: itemKey,
            className: mergeClasses(styles.row, isCurrent && styles.current),
            'aria-selected': isCurrent,
            onClick: () => setCurrentKey(itemKey),
            onDoubleClick: () => onSelect(item),
          },
          ...columns.map(column => {
            const raw = column.getValue(item);
            const fallbackText = raw === null || raw === undefined ? '' : String(raw);
            const titleAttr = column.getTitle ? column.getTitle(item) : (fallbackText || undefined);
            return createElement(TableCell, {
              key: column.key,
              className: styles.cell,
              ...(titleAttr ? { title: titleAttr } : {}),
            }, column.renderCell ? column.renderCell(item) : fallbackText);
          }));
        }),
      )),
  );

  const searchContent = [
    createElement('div', {
      key: 'filters',
      className: mergeClasses(styles.filters, Boolean(filterSlot) && styles.filtersSplit),
    },
    createElement(SearchBox, {
      'aria-label': searchLabel ?? `Search ${title.toLowerCase()}`,
      placeholder: searchPlaceholder,
      value: text,
      onChange: (_, data) => handleSearchChange(data.value),
      onKeyDown: handleSearchKeyDown,
    }),
    filterSlot ?? null),
    createElement('div', { key: 'results' }, listBody),
  ];

  const manualContent = manualMode
    ? createElement('div', { className: styles.manual }, manualMode.content)
    : null;

  const footerNode = createElement('div', { className: styles.foot },
    createElement(Text, { className: styles.muted },
      effectiveMode === 'manual'
        ? (manualMode?.footerNote ?? '')
        : formatMatchCount(rows.length, effectiveTotal),
    ),
    createElement('div', { className: styles.actions },
      createElement(Button, { onClick: onClose, children: cancelLabel }),
      effectiveMode === 'search'
        ? createElement(Button, {
          appearance: 'primary',
          disabled: !canSelect,
          onClick: handleChoose,
          children: selectLabel,
        })
        : createElement(Button, {
          appearance: 'primary',
          disabled: Boolean(manualMode?.confirmDisabled),
          ...(manualMode?.confirmDisabledReason !== undefined ? { disabledReason: manualMode.confirmDisabledReason } : {}),
          onClick: () => manualMode?.onConfirm(),
          children: manualMode?.confirmLabel ?? 'Use',
        }),
    ),
  );

  return createElement(Popover, {
    open: true,
    trapFocus: true,
    onOpenChange: (_, data) => {
      if (!data.open) onClose();
    },
    positioning: {
      target,
      position: 'below',
      align: 'start',
      fallbackPositions: ['above-start', 'below-end', 'above-end'],
    },
    children: createElement(PopoverSurface, {
      className: mergeClasses('nidec-ui-lookup-window', styles.surface, className),
      'aria-label': title,
    },
    createElement('div', { ref: surfaceRef, style: { display: 'contents' } },
      headerNode,
      effectiveMode === 'search' ? searchContent : manualContent,
      footerNode)),
  });
}

/**
 * Governed Lookup field: a read-only input with a magnifying glass icon that
 * opens an anchored `LookupSearchWindow` on click, Enter, F4, ArrowDown, Space,
 * or typing any printable character (passing that character into the search box).
 * Delete or Backspace clears the chosen value without opening the window.
 */
export function Lookup<TItem>({
  value,
  displayValue,
  onSelect,
  onClear,
  onOpenChange,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  placeholder = 'Click to search',
  size,
  disabled,
  className,
  windowClassName,
  manualMode,
  selectedKey,
  ...windowProps
}: LookupProps<TItem>): ReactElement {
  const styles = useLookupStyles();
  const fieldRef = useRef<HTMLDivElement>(null);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);

  const openWindow = (seed: string) => {
    if (disabled) return;
    setInitialQuery(seed);
    onOpenChange?.(true);
  };

  const closeWindow = () => {
    setInitialQuery(null);
    onOpenChange?.(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === 'F4' || event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault();
      openWindow('');
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      if (value !== null) onClear?.();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      openWindow(event.key);
    }
  };

  const wrappedManualMode: LookupManualModeConfig | undefined = manualMode
    ? {
      ...manualMode,
      onConfirm: () => {
        manualMode.onConfirm();
        closeWindow();
      },
    }
    : undefined;

  return createElement('div', {
    ref: fieldRef,
    className: mergeClasses('nidec-ui-lookup', styles.box, className),
  },
  createElement(Input, {
    ...(id !== undefined ? { id } : {}),
    className: styles.box,
    input: { className: styles.input },
    readOnly: true,
    ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {}),
    ...(ariaDescribedBy !== undefined ? { 'aria-describedby': ariaDescribedBy } : {}),
    ...(ariaInvalid !== undefined ? { 'aria-invalid': ariaInvalid } : {}),
    ...(ariaRequired !== undefined ? { 'aria-required': ariaRequired } : {}),
    'aria-haspopup': 'dialog',
    'aria-expanded': initialQuery !== null,
    placeholder,
    ...(size !== undefined ? { size } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    value: displayValue,
    ...(displayValue ? { title: displayValue } : {}),
    contentAfter: createElement('span', { className: styles.muted, 'aria-hidden': true }, searchIcon(20)),
    onClick: () => openWindow(''),
    onKeyDown: handleKeyDown,
  }),
  initialQuery !== null
    ? createElement(LookupSearchWindow<TItem>, {
      ...windowProps,
      target: fieldRef.current,
      initialQuery,
      selectedKey: selectedKey === undefined ? value : selectedKey,
      ...(wrappedManualMode !== undefined ? { manualMode: wrappedManualMode } : {}),
      ...(windowClassName !== undefined ? { className: windowClassName } : {}),
      onSelect: (item: TItem) => {
        closeWindow();
        onSelect(item);
      },
      onClose: closeWindow,
    })
    : null);
}
