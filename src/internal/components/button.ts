import { createElement } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Button as FluentButton } from '@fluentui/react-components';
import type { ButtonProps as FluentButtonProps } from '@fluentui/react-components';
import { withClass } from './with-class';

/** Text-labelled native action with Fluent appearance; theme belongs to Provider. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
} & Pick<FluentButtonProps, 'appearance' | 'size' | 'shape' | 'icon' | 'iconPosition'>;

export function Button({ children, type = 'button', disabled = false, className, ref, ...props }: ButtonProps) {
  // Bridge object refs through a callback: Fluent's event-derived ref type can
  // infer never with exact optional properties. No public ref type is narrowed.
  const forwardedRef = typeof ref === 'function' ? ref : ref ? (node: HTMLButtonElement | null) => {
    ref.current = node;
  } : null;
  return createElement(FluentButton, {
    ...props,
    as: 'button',
    disabled,
    ref: forwardedRef,
    type,
    className: ['nidec-ui-button', className].filter(Boolean).join(' '),
  }, children);
}

/** Icon actions have an explicit accessible name; business meaning stays with the caller. */
export type IconButtonProps = Omit<ButtonProps, 'children' | 'icon' | 'aria-label' | 'aria-labelledby'> & {
  icon: ReactElement;
  'aria-label': string;
  children?: never;
};

export function IconButton({ icon, 'aria-label': label, ...props }: IconButtonProps) {
  if (!label.trim()) throw new Error('IconButton requires a non-empty aria-label.');
  return Button({ ...props, icon, 'aria-label': label, children: '' });
}

export type TableActionIconButtonProps = Omit<IconButtonProps, 'appearance' | 'size' | 'shape'>;

/** Compact secondary action for a Table/DataGrid row; icon meaning stays consumer-owned. */
export function TableActionIconButton({ icon, 'aria-label': label, className, ...props }: TableActionIconButtonProps) {
  return IconButton({
    ...props,
    icon,
    'aria-label': label,
    className: withClass('nidec-ui-table-action-icon-button', className),
    appearance: 'transparent',
    size: 'small',
    shape: 'rounded',
  });
}
