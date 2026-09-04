import { createElement } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Button as FluentButton, FluentProvider } from '@fluentui/react-components';
import type { FluentProviderProps, Theme } from '@fluentui/react-components';

/** Text-labelled button backed by Fluent; no approved brand theme is supplied. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
};

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

export type NidecProviderProps = Omit<FluentProviderProps,
  'theme' | 'customStyleHooks_unstable' | 'overrides_unstable'> & { theme: Theme };

/** Explicit theme required. The caller owns its approved theme values. */
export function NidecProvider(props: NidecProviderProps) {
  const hostProps = { ...props, 'data-nidec-ui': '' };
  return createElement(FluentProvider, hostProps);
}

export {
  Input, Field, Dialog, DialogTrigger, DialogSurface, DialogBody,
  DialogTitle, DialogContent, DialogActions,
} from '@fluentui/react-components';
export type {
  InputProps, FieldProps, DialogProps, DialogTriggerProps, DialogSurfaceProps,
  DialogBodyProps, DialogTitleProps, DialogContentProps, DialogActionsProps,
} from '@fluentui/react-components';
