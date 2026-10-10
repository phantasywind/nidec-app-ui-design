import { createContext, createElement } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactElement, ReactNode } from 'react';
import { DataGrid as FluentDataGrid, DataGridRow as FluentDataGridRow } from '@fluentui/react-components';
import type {
  DataGridProps as FluentDataGridProps, DataGridRowProps as FluentDataGridRowProps, TableRowId,
} from '@fluentui/react-components';
import { withClass } from './with-class';

export type RecordSelectionRegionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  toolbar: ReactNode;
  children: ReactNode;
};

/** Standard spacing between consumer-owned directory tools and a record-selection grid. */
export function RecordSelectionRegion({ toolbar, children, className, ...props }: RecordSelectionRegionProps): ReactElement<ComponentPropsWithoutRef<'section'>> {
  return createElement('section', {
    ...props,
    className: withClass('nidec-ui-record-selection-region', className),
  }, toolbar, children);
}

export type RecordSelectionDataGridProps = Omit<FluentDataGridProps,
  'defaultSelectedItems' | 'focusMode' | 'selectionAppearance' | 'selectionMode' | 'subtleSelection'> & {
  'aria-label': string;
  getRowId: NonNullable<FluentDataGridProps['getRowId']>;
  onSelectionChange: NonNullable<FluentDataGridProps['onSelectionChange']>;
  selectedItems: Set<TableRowId>;
};

type RecordSelectionContextValue = {
  onSelectionChange: NonNullable<FluentDataGridProps['onSelectionChange']>;
};

const RecordSelectionContext = createContext<RecordSelectionContextValue | null>(null);

/** Controlled single-record selection for loading content in the current surface; never navigation. */
export function RecordSelectionDataGrid({
  'aria-label': ariaLabel,
  className,
  getRowId,
  onSelectionChange,
  selectedItems,
  ...props
}: RecordSelectionDataGridProps): ReactElement {
  if (!ariaLabel.trim()) throw new Error('RecordSelectionDataGrid requires a non-empty aria-label.');
  if (selectedItems.size > 1) throw new Error('RecordSelectionDataGrid supports exactly zero or one selected record.');
  return createElement(RecordSelectionContext.Provider, { value: { onSelectionChange } },
    createElement(FluentDataGrid, {
      ...props,
      'aria-label': ariaLabel,
      className: withClass('nidec-ui-record-selection-grid', className),
      focusMode: 'composite',
      getRowId,
      onSelectionChange,
      selectedItems,
      selectionAppearance: 'neutral',
      selectionMode: 'single',
      subtleSelection: false,
    }));
}

export type RecordSelectionDataGridRowProps<TItem = unknown> = Omit<FluentDataGridRowProps<TItem>,
  'appearance' | 'aria-selected' | 'onClick' | 'onKeyDown' | 'onKeyDownCapture' | 'selectionCell' | 'tabIndex'> & {
  recordId: TableRowId;
};

/** Whole-row selection with Enter added to Fluent's pointer and Space behavior. */
export function RecordSelectionDataGridRow<TItem = unknown>({
  className,
  recordId,
  ...props
}: RecordSelectionDataGridRowProps<TItem>): ReactElement {
  return createElement(RecordSelectionContext.Consumer, {
    children: (context: RecordSelectionContextValue | null) => {
      if (!context) throw new Error('RecordSelectionDataGridRow must be rendered inside RecordSelectionDataGrid.');
      const onKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Enter') return;
        const target = event.target as EventTarget & { closest?: (selector: string) => Element | null };
        const interactiveTarget = target !== event.currentTarget && target.closest?.(
          'a, button, input, select, textarea, [role="button"], [role="checkbox"], [role="link"], [role="menuitem"], [role="switch"]',
        );
        if (interactiveTarget) return;
        event.preventDefault();
        context.onSelectionChange(event, { selectedItems: new Set([recordId]) });
      };
      return createElement(FluentDataGridRow, {
        ...props,
        className: withClass('nidec-ui-record-selection-row', className),
        onKeyDownCapture,
        selectionCell: null,
      } as FluentDataGridRowProps<unknown>);
    },
  });
}
