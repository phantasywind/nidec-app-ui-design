import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { withClass } from './with-class';

export type CollectionListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ReactNode;
  density?: 'compact' | 'comfortable';
};

/** Stable list semantics with Fluent-theme composition; selection stays explicit. */
export function CollectionList({ children, density = 'comfortable', className, ...props }: CollectionListProps) {
  return createElement('ul', { ...props, className: withClass(`nidec-ui-collection-list nidec-ui-collection-list--${density}`, className) }, children);
}

export type CollectionListItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
  primary: ReactNode;
  secondary?: ReactNode;
  selection?: ReactNode;
  leading?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
};

/** Slot layout only; consumers supply labelled Fluent selection and business actions. */
export function CollectionListItem({ primary, secondary, selection, leading, metadata, actions, className, ...props }: CollectionListItemProps) {
  return createElement('li', { ...props, className: withClass('nidec-ui-collection-list__item', className) },
    selection === undefined && leading === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__leading' }, selection, leading),
    createElement('span', { className: 'nidec-ui-collection-list__content' },
      createElement('span', { className: 'nidec-ui-collection-list__primary' }, primary),
      secondary === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__secondary' }, secondary)),
    metadata === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__metadata' }, metadata),
    actions === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__actions' }, actions));
}
