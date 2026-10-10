import { createElement } from 'react';
import type { MouseEvent, ReactElement } from 'react';
import { Button as FluentButton, TableCell as FluentTableCell, TableRow as FluentTableRow } from '@fluentui/react-components';

export type GroupedTableSectionRowProps = {
  label: string;
  count: number;
  columnSpan: number;
  level: 0 | 1;
  expanded: boolean;
  icon: ReactElement;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  summary?: string;
  countLabel?: string;
};

/** One full-width disclosure row within a Fluent Table, never an editable data row. */
export function GroupedTableSectionRow({
  label,
  count,
  columnSpan,
  level,
  expanded,
  icon,
  onToggle,
  summary,
  countLabel,
}: GroupedTableSectionRowProps) {
  if (!label.trim() || !Number.isInteger(count) || count < 0 || !Number.isInteger(columnSpan) || columnSpan < 1) {
    throw new Error('GroupedTableSectionRow requires a label, non-negative count and positive columnSpan.');
  }
  const accessibleCount = countLabel?.trim() || `${count} ${count === 1 ? 'row' : 'rows'}`;
  return createElement(FluentTableRow, {
    className: `nidec-ui-grouped-table__section-row nidec-ui-grouped-table__section-row--level-${level}`,
  }, createElement(FluentTableCell, { colSpan: columnSpan, style: { overflow: 'visible' } },
    createElement(FluentButton, {
      'aria-label': `${label}, ${accessibleCount}${summary ? `, ${summary}` : ''}`,
      'aria-expanded': expanded,
      appearance: 'transparent',
      as: 'button',
      className: 'nidec-ui-grouped-table__section-button',
      icon,
      onClick: onToggle,
      size: 'small',
      style: {
        justifyContent: 'flex-start',
        overflow: 'visible',
        ...(level === 1 ? { paddingInlineStart: 'var(--spacingHorizontalXXL)' } : {}),
      },
      type: 'button',
    },
    createElement('span', { className: 'nidec-ui-grouped-table__section-label' }, label),
    summary ? createElement('span', { className: 'nidec-ui-grouped-table__section-summary' }, summary) : null,
    createElement('span', { className: 'nidec-ui-grouped-table__section-count', 'aria-hidden': 'true' }, count))));
}
