import { createElement } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { withClass } from './with-class';

export type FormGridProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Fields per row at full width; rows wrap to fewer columns when the space is narrow. Default 1. */
  columns?: 1 | 2 | 3;
  /** Width of every field in the group. Default `20rem`, the FormDrawer field width. */
  fieldWidth?: string;
};

/**
 * One group of form fields with the same width, top-aligned so a hint or
 * error under one field never pushes its neighbour down. Inputs, dropdowns and
 * date pickers fill their field; long text spans the row with FormGridItem.
 */
export function FormGrid({ children, columns = 1, fieldWidth = '20rem', className, style, ...props }: FormGridProps) {
  return createElement('div', {
    ...props,
    className: withClass('nidec-ui-form-grid', className),
    style: { ...style, '--nidec-ui-form-grid-columns': String(columns), '--nidec-ui-form-grid-field-width': fieldWidth } as CSSProperties,
  }, children);
}

export type FormGridItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Spans the whole row, for long text such as notes. */
  wide?: boolean;
};

export function FormGridItem({ children, wide = false, className, ...props }: FormGridItemProps) {
  return createElement('div', {
    ...props,
    className: withClass(`nidec-ui-form-grid__item${wide ? ' nidec-ui-form-grid__item--wide' : ''}`, className),
  }, children);
}
