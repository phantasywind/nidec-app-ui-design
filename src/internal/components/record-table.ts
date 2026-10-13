import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  DataGridHeader as FluentDataGridHeader, TableCellLayout as FluentTableCellLayout, TableHeader as FluentTableHeader,
} from '@fluentui/react-components';
import type {
  DataGridHeaderProps as FluentDataGridHeaderProps, TableCellLayoutProps as FluentTableCellLayoutProps,
  TableHeaderProps as FluentTableHeaderProps,
} from '@fluentui/react-components';
import { withClass } from './with-class';

export type RecordIdentityCellLayoutProps = Omit<FluentTableCellLayoutProps,
  'appearance' | 'children' | 'description'> & {
  primary: ReactNode;
  /**
   * @deprecated One column shows one field in every table-type component.
   * Use only for an exception approved separately; put the field in its own column instead.
   */
  secondary?: ReactNode;
};

/**
 * Declares the single record identity within a consumer-owned Table/DataGrid row.
 * Navigable identities are supplied as a semantic Fluent Link in the primary slot.
 * The surrounding cell, row, columns and business meaning remain consumer-owned.
 */
export function RecordIdentityCellLayout({ primary, secondary, ...props }: RecordIdentityCellLayoutProps): ReactElement<FluentTableCellLayoutProps> {
  return createElement(FluentTableCellLayout, {
    ...props,
    appearance: 'primary',
    className: withClass('nidec-ui-record-identity-cell', props.className),
    ...(secondary === undefined ? {} : { description: { children: secondary } }),
  }, primary);
}

export type RecordTableHeaderProps = FluentTableHeaderProps;

/** Gives record tables a governed header hierarchy without owning their columns. */
export function RecordTableHeader({ className, ...props }: RecordTableHeaderProps): ReactElement<FluentTableHeaderProps> {
  return createElement(FluentTableHeader, {
    ...props,
    className: withClass('nidec-ui-record-table-header', className),
  });
}

export type RecordDataGridHeaderProps = FluentDataGridHeaderProps;

/** Gives record data grids the same governed header hierarchy. */
export function RecordDataGridHeader({ className, ...props }: RecordDataGridHeaderProps): ReactElement<FluentDataGridHeaderProps> {
  return createElement(FluentDataGridHeader, {
    ...props,
    className: withClass('nidec-ui-record-table-header', className),
  });
}
