import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { withClass } from './with-class';

export type TableScrollRegionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'aria-label'> & {
  'aria-label': string;
  children: ReactNode;
};

/**
 * Horizontal scroll container for a wide Table or DataGrid. It scrolls
 * sideways only: the vertical axis is clipped, so a horizontal scrollbar never
 * adds a second, vertical one. It is focusable so keyboard users can scroll it.
 */
export function TableScrollRegion({ 'aria-label': ariaLabel, children, className, ...props }: TableScrollRegionProps) {
  if (!ariaLabel.trim()) throw new Error('TableScrollRegion requires a non-empty aria-label.');
  return createElement('div', {
    tabIndex: 0,
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-table-scroll-region', className),
    role: 'region',
  }, children);
}
