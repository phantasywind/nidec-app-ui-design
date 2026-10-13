import { createElement, useId } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { Dropdown as FluentDropdown, Tooltip as FluentTooltip, makeStyles, mergeClasses } from '@fluentui/react-components';
import type { SelectionEvents } from '@fluentui/react-components';
import { IconButton } from './button';
import { chevronLeftIcon, chevronRightIcon } from './icons';
import { Option } from './option';
import { withClass } from './with-class';

export type PaginationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'aria-label'> & {
  'aria-label': string;
  /** One-based page number. */
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement>, page: number) => void;
  /** Offer a page-size choice only when both this and onPageSizeChange are given. */
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (event: SelectionEvents, pageSize: number) => void;
  /** Range text; the default reads "26–50 of 60". */
  formatRange?: (start: number, end: number, totalCount: number) => string;
  previousLabel?: string;
  nextLabel?: string;
  pageSizeLabel?: string;
  disabled?: boolean;
};

// Fluent gives a Dropdown a 250px minimum width; a page size needs only a few digits.
const usePaginationStyles = makeStyles({
  pageSize: { minWidth: 'auto', width: '5.5rem' },
});

const defaultFormatRange = (start: number, end: number, totalCount: number) =>
  totalCount === 0 ? '0 of 0' : `${start}–${end} of ${totalCount}`;

/**
 * Page-by-page navigation that follows the results it governs: range text and
 * previous and next icon buttons, with an optional page-size choice. The query,
 * page state and loading stay with the application.
 */
export function Pagination({
  'aria-label': ariaLabel,
  page,
  pageSize,
  totalCount,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  formatRange = defaultFormatRange,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageSizeLabel = 'Rows per page',
  disabled = false,
  className,
  ...props
}: PaginationProps) {
  const pageSizeLabelId = useId();
  const styles = usePaginationStyles();
  if (!ariaLabel.trim()) throw new Error('Pagination requires a non-empty aria-label.');
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Pagination pageSize must be a positive integer.');
  if (!Number.isInteger(totalCount) || totalCount < 0) throw new Error('Pagination totalCount must be a non-negative integer.');
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error(`Pagination page must be between 1 and ${pageCount}.`);
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const showPageSize = pageSizeOptions !== undefined && pageSizeOptions.length > 0 && onPageSizeChange !== undefined;

  const step = (label: string, icon: () => ReturnType<typeof chevronLeftIcon>, target: number, enabled: boolean) =>
    createElement(FluentTooltip, { content: label, relationship: 'label', key: label },
      createElement(IconButton, {
        'aria-label': label,
        appearance: 'subtle',
        disabled: disabled || !enabled,
        icon: icon(),
        onClick: (event: MouseEvent<HTMLButtonElement>) => onPageChange(event, target),
        size: 'small',
      }));

  return createElement('nav', { ...props, 'aria-label': ariaLabel, className: withClass('nidec-ui-pagination', className) },
    showPageSize ? createElement('div', { className: 'nidec-ui-pagination__page-size' },
      createElement('span', { id: pageSizeLabelId }, pageSizeLabel),
      createElement(FluentDropdown, {
        'aria-labelledby': pageSizeLabelId,
        className: mergeClasses('nidec-ui-pagination__page-size-dropdown', styles.pageSize),
        disabled,
        onOptionSelect: (event, data) => {
          const next = Number(data.optionValue);
          if (data.optionValue !== undefined && next !== pageSize) onPageSizeChange(event, next);
        },
        selectedOptions: [String(pageSize)],
        size: 'small',
        value: String(pageSize),
      }, pageSizeOptions.map(option => createElement(Option, { key: option, text: String(option), value: String(option) }, String(option))))) : null,
    createElement('span', { 'aria-live': 'polite', className: 'nidec-ui-pagination__range' }, formatRange(start, end, totalCount)),
    createElement('div', { className: 'nidec-ui-pagination__steps' },
      step(previousLabel, chevronLeftIcon, page - 1, page > 1),
      step(nextLabel, chevronRightIcon, page + 1, page < pageCount)));
}
