import { createElement, useId } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Button as FluentButton, Tooltip as FluentTooltip } from '@fluentui/react-components';
import type { ButtonProps as FluentButtonProps } from '@fluentui/react-components';
import { withClass } from './with-class';

/** Text-labelled native action with Fluent appearance; theme belongs to Provider. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
  /**
   * Why the command is unavailable. With `disabled`, the button stays greyed
   * out but can still take keyboard focus, so everyone can read the reason.
   * Commands are disabled, not hidden.
   */
  disabledReason?: string;
  /**
   * Where the reason shows: on hover and focus (default), or as a line under
   * the button for a key command such as Approve or Submit.
   */
  disabledReasonDisplay?: 'tooltip' | 'inline';
} & Pick<FluentButtonProps, 'appearance' | 'size' | 'shape' | 'icon' | 'iconPosition'>;

/** A disabled command with its reason written under it; the reason also describes the button. */
function ButtonWithInlineReason({ reason, button }: { reason: string; button: (reasonId: string) => ReactElement }) {
  const reasonId = useId();
  return createElement('span', { className: 'nidec-ui-button-with-reason' },
    button(reasonId),
    createElement('span', { className: 'nidec-ui-button-with-reason__text', id: reasonId }, reason));
}

export function Button({
  children, type = 'button', disabled = false, disabledReason, disabledReasonDisplay = 'tooltip', className, ref, ...props
}: ButtonProps) {
  // Bridge object refs through a callback: Fluent's event-derived ref type can
  // infer never with exact optional properties. No public ref type is narrowed.
  const forwardedRef = typeof ref === 'function' ? ref : ref ? (node: HTMLButtonElement | null) => {
    ref.current = node;
  } : null;
  const reason = disabled ? disabledReason?.trim() || undefined : undefined;
  const render = (reasonId?: string) => createElement(FluentButton, {
    ...props,
    ...(reasonId ? { 'aria-describedby': [props['aria-describedby'], reasonId].filter(Boolean).join(' ') } : {}),
    as: 'button',
    // A disabled button takes no pointer or focus events, so a reason could never be shown.
    ...(reason ? { disabledFocusable: true } : { disabled }),
    ref: forwardedRef,
    type,
    className: ['nidec-ui-button', className].filter(Boolean).join(' '),
  }, children);
  if (reason === undefined) return render();
  // With a reason the button is wrapped; the public element type stays the plain button's.
  const wrapped = disabledReasonDisplay === 'inline'
    ? createElement(ButtonWithInlineReason, { reason, button: render })
    : createElement(FluentTooltip, { content: reason, relationship: 'description' }, render());
  return wrapped as unknown as ReturnType<typeof render>;
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
