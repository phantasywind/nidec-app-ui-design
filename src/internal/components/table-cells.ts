import { createElement, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Tooltip as FluentTooltip } from '@fluentui/react-components';
import { withClass } from './with-class';

export type TruncatedTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  children: string;
};

/**
 * One line of text that ends in an ellipsis when its column is too narrow. The
 * full text appears on hover only when the text is actually cut, so dense
 * tables keep one row height without hiding anything.
 */
export function TruncatedText({ children, className, ...props }: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  return createElement(FluentTooltip, {
    content: children,
    relationship: 'description',
    visible,
    onVisibleChange: (_event, data) => {
      const node = ref.current;
      setVisible(data.visible && node !== null && node.scrollWidth > node.clientWidth);
    },
  }, createElement('span', { ...props, ref, className: withClass('nidec-ui-truncated-text', className) }, children));
}

export type MatrixCellButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'children'> & {
  children?: ReactNode;
  /** The cell has a value (for example a rule applies); it shows the light brand fill. */
  matched?: boolean;
  /** The cell whose detail is open; it shows the brand outline. */
  selected?: boolean;
};

/**
 * The whole cell of a matrix table as one button that opens the cell's detail,
 * usually in a FormDrawer. Hover is neutral grey, a matched cell is light
 * green and the selected cell adds a brand outline. What a cell means and what
 * it opens stay with the application.
 */
export function MatrixCellButton({ children, matched = false, selected = false, className, ...props }: MatrixCellButtonProps) {
  return createElement('button', {
    ...props,
    'aria-current': selected ? 'true' : undefined,
    className: withClass('nidec-ui-matrix-cell', className),
    'data-matched': matched ? 'true' : undefined,
    type: 'button',
  }, children);
}
