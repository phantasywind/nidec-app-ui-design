import { createElement } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import {
  Badge as FluentBadge, Button as FluentButton, CounterBadge as FluentCounterBadge, Link as FluentLink, Menu as FluentMenu,
  MenuItem as FluentMenuItem, MenuList as FluentMenuList, MenuPopover as FluentMenuPopover, MenuTrigger as FluentMenuTrigger,
  makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
import { chevronDownIcon } from './icons';
import { withClass } from './with-class';

// Fluent badge colour roles (theme roles, not paint values).
const brandRole = 'brand' as const;
const neutralRole = 'informative' as const;

type RecordLinkBase = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href' | 'onClick'> & {
  children: ReactNode;
  /** Semibold for the identity column of a list; regular inside running text. */
  weight?: 'regular' | 'semibold';
};

export type RecordLinkProps = RecordLinkBase & (
  | { href: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }
  | { href?: undefined; onClick: (event: MouseEvent<HTMLButtonElement>) => void }
);

/**
 * The one entry point of a record row: green and underlined whether it goes to
 * the record's page (`href`, a link) or opens it in a drawer (`onClick`, a
 * button), so both look the same in every list.
 */
const useRecordLinkStyles = makeStyles({
  semibold: { fontWeight: tokens.fontWeightSemibold },
});

export function RecordLink({ children, href, onClick, weight = 'regular', className, ...props }: RecordLinkProps) {
  const styles = useRecordLinkStyles();
  const classes = mergeClasses(`nidec-ui-record-link nidec-ui-record-link--${weight}`, weight === 'semibold' && styles.semibold, className);
  if (href !== undefined) {
    return createElement(FluentLink, { ...props, className: classes, href, inline: true, onClick }, children);
  }
  // The anchor-only attributes do not apply to a button; the drawer variant takes the shared ones.
  const { disabled: _disabled, ...buttonProps } = props as ComponentPropsWithoutRef<'button'>;
  return createElement(FluentLink, {
    ...buttonProps, as: 'button', className: classes, inline: true, onClick, type: 'button',
  }, children);
}

export type CountBadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  count: number;
  /** Small inside a Tab; medium after a module title. */
  size?: 'small' | 'medium';
};

/**
 * The number after a module title or tab label: a filled brand circle that
 * shows zero and never shortens to "99+". The surrounding title gives it
 * meaning; set `aria-label` when the number alone would be unclear.
 */
export function CountBadge({ count, size = 'medium', className, ...props }: CountBadgeProps) {
  if (!Number.isInteger(count) || count < 0) throw new Error('CountBadge count must be a non-negative integer.');
  return createElement(FluentCounterBadge, {
    ...props,
    appearance: 'filled',
    className: withClass('nidec-ui-count-badge', className),
    color: brandRole,
    count,
    overflowCount: Number.MAX_SAFE_INTEGER,
    showZero: true,
    size,
  });
}

export type ActiveBadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'> & {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
};

/** Active (light green) or Inactive (grey) state of a master-data record, shown at the end of its row. */
export function ActiveBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive', className, ...props }: ActiveBadgeProps) {
  return createElement(FluentBadge, {
    ...props,
    appearance: 'tint',
    className: withClass('nidec-ui-active-badge', className),
    color: active ? brandRole : neutralRole,
    shape: 'rounded',
    size: 'medium',
  }, active ? activeLabel : inactiveLabel);
}

export type RowEndStatusProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** The last column's own value. */
  children: ReactNode;
  /** The row's state, usually an ActiveBadge. */
  status: ReactNode;
};

/**
 * Last cell of a directory row with the row's state at its right end, so the
 * state needs no column of its own. The value keeps the start of the cell and
 * is cut with an ellipsis before it reaches the badge.
 */
export function RowEndStatus({ children, status, className, ...props }: RowEndStatusProps) {
  return createElement('div', { ...props, className: withClass('nidec-ui-row-end-status', className) },
    createElement('span', { className: 'nidec-ui-row-end-status__value' }, children),
    createElement('span', { className: 'nidec-ui-row-end-status__status' }, status));
}

export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  /** A next step, for example "Clear filters" or the module's primary command. */
  actions?: ReactNode;
};

/** What a list shows when it has no rows, or no rows match the search. */
export function EmptyState({ title, description, actions, className, ...props }: EmptyStateProps) {
  return createElement('div', { role: 'status', ...props, className: withClass('nidec-ui-empty-state', className) },
    createElement('p', { className: 'nidec-ui-empty-state__title' }, title),
    description === undefined ? null : createElement('p', { className: 'nidec-ui-empty-state__description' }, description),
    actions === undefined ? null : createElement('div', { className: 'nidec-ui-empty-state__actions' }, actions));
}

export type MoreActionsItem = Readonly<{
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Shown beside a disabled item, so the reason is never hidden. */
  disabledReason?: string;
}>;

export type MoreActionsMenuProps = {
  items: readonly MoreActionsItem[];
  label?: string;
  size?: 'small' | 'medium';
};

/** The less frequent commands of a record or module, behind one "More actions" button after the primary commands. */
export function MoreActionsMenu({ items, label = 'More actions', size = 'medium' }: MoreActionsMenuProps) {
  if (items.length === 0) throw new Error('MoreActionsMenu requires at least one item.');
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('MoreActionsMenu item ids must be unique.');
  return createElement(FluentMenu, {
    positioning: 'below-end',
    children: [
      createElement(FluentMenuTrigger, { key: 'trigger', disableButtonEnhancement: true },
        createElement(FluentButton, { className: 'nidec-ui-more-actions', icon: chevronDownIcon(), iconPosition: 'after', size }, label)),
      createElement(FluentMenuPopover, { key: 'popover' },
        createElement(FluentMenuList, null, items.map(item => createElement(FluentMenuItem, {
          key: item.id,
          disabled: item.disabled ?? false,
          onClick: item.onClick,
          ...(item.disabled && item.disabledReason ? { secondaryContent: item.disabledReason } : {}),
        }, item.label)))),
    ],
  });
}
