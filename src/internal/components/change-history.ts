import { createElement, Fragment } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Table as FluentTable, TableBody as FluentTableBody, TableCell as FluentTableCell, TableHeaderCell as FluentTableHeaderCell,
  TableRow as FluentTableRow,
} from '@fluentui/react-components';
import { RecordTableHeader } from './record-table';
import { EmptyState } from './record-patterns';
import { withClass } from './with-class';

export type ChangeHistoryFieldChange = Readonly<{
  field: string;
  /** Omitted when the field was empty before. */
  from?: ReactNode;
  /** Omitted when the field was cleared. */
  to?: ReactNode;
}>;

export type ChangeHistoryEntry = Readonly<{
  id: string;
  /** When it happened, already formatted by the application. */
  at: string;
  actor: string;
  /** Readable action name; the application maps its own codes to words. */
  action: string;
  changes?: readonly ChangeHistoryFieldChange[];
  reason?: string;
}>;

export type ChangeHistoryTableProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  'aria-label': string;
  /** Newest first. */
  entries: readonly ChangeHistoryEntry[];
  labels?: Partial<Readonly<{ at: string; actor: string; action: string; changes: string; reason: string; empty: string }>>;
};

const defaultLabels = { at: 'When', actor: 'By', action: 'Action', changes: 'Changes', reason: 'Reason', empty: 'No changes recorded yet.' };

/**
 * Audit trail of one record: when, who, what action, each changed field as
 * old value (struck through) → new value, and the reason. It usually sits in a
 * FormDrawer behind a "History" button rather than on the page itself.
 */
export function ChangeHistoryTable({ 'aria-label': ariaLabel, entries, labels, className, ...props }: ChangeHistoryTableProps) {
  if (!ariaLabel.trim()) throw new Error('ChangeHistoryTable requires a non-empty aria-label.');
  const text = { ...defaultLabels, ...labels };
  if (entries.length === 0) {
    return createElement('div', { ...props, className: withClass('nidec-ui-change-history', className) },
      createElement(EmptyState, { title: text.empty }));
  }
  const change = (item: ChangeHistoryFieldChange, index: number) => createElement('li', { key: `${item.field}-${index}` },
    createElement('span', { className: 'nidec-ui-change-history__field' }, `${item.field}: `),
    item.from === undefined ? null : createElement(Fragment, null,
      createElement('del', { className: 'nidec-ui-change-history__from' }, item.from), ' → '),
    item.to === undefined ? null : createElement('span', { className: 'nidec-ui-change-history__to' }, item.to));
  return createElement('div', { ...props, className: withClass('nidec-ui-change-history', className) },
    createElement(FluentTable, { 'aria-label': ariaLabel, size: 'small' },
      createElement(RecordTableHeader, null, createElement(FluentTableRow, null,
        createElement(FluentTableHeaderCell, { className: 'nidec-ui-change-history__at' }, text.at),
        createElement(FluentTableHeaderCell, { className: 'nidec-ui-change-history__actor' }, text.actor),
        createElement(FluentTableHeaderCell, { className: 'nidec-ui-change-history__action' }, text.action),
        createElement(FluentTableHeaderCell, null, text.changes),
        createElement(FluentTableHeaderCell, null, text.reason))),
      createElement(FluentTableBody, null, entries.map(entry => createElement(FluentTableRow, { key: entry.id },
        createElement(FluentTableCell, null, entry.at),
        createElement(FluentTableCell, null, entry.actor),
        createElement(FluentTableCell, null, entry.action),
        createElement(FluentTableCell, null, entry.changes === undefined || entry.changes.length === 0 ? null
          : createElement('ul', { className: 'nidec-ui-change-history__changes' }, entry.changes.map(change))),
        createElement(FluentTableCell, null, entry.reason === undefined ? null
          : createElement('span', { className: 'nidec-ui-change-history__reason' }, entry.reason)))))));
}
