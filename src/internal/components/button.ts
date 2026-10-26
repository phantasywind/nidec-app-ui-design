import { createElement, useId } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Button as FluentButton, Tooltip as FluentTooltip, makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components';
import type { ButtonProps as FluentButtonProps } from '@fluentui/react-components';
import { withClass } from './with-class';

/**
 * The three button types (Locke, 2026-10-26). `primary` advances the business
 * process, edits a record's properties or opens a form; `attention` (amber, never
 * red) starts a change or sends something back; `secondary` is every other command.
 */
export type ButtonAppearance = 'primary' | 'attention' | 'secondary';

/** Text-labelled native action with Fluent appearance; theme belongs to Provider. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
  /** Defaults to `secondary`. */
  appearance?: ButtonAppearance;
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
} & Pick<FluentButtonProps, 'size' | 'shape' | 'icon' | 'iconPosition'>;

/** Fluent's own looks, kept for the borderless icon buttons that components fix internally. */
type InternalButtonProps = Omit<ButtonProps, 'appearance'> & { appearance?: ButtonAppearance | 'subtle' | 'transparent' };

// Amber from Fluent's Marigold palette with dark text; the Fluent secondary
// shape, focus and disabled states stay unchanged underneath.
const useAttentionStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorPaletteMarigoldBackground3,
    ...shorthands.borderColor(tokens.colorPaletteMarigoldBackground3),
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorPaletteMarigoldForeground1,
      ...shorthands.borderColor(tokens.colorPaletteMarigoldForeground1),
      color: tokens.colorNeutralForeground1,
    },
    ':hover:active': {
      backgroundColor: tokens.colorPaletteMarigoldForeground1,
      ...shorthands.borderColor(tokens.colorPaletteMarigoldForeground2),
      color: tokens.colorNeutralForeground1,
    },
  },
});

/** The Fluent secondary button with the amber attention surface; it takes the same props. */
const AttentionButton = ((props: FluentButtonProps) => {
  const styles = useAttentionStyles();
  return createElement(FluentButton, { ...props, className: mergeClasses(props.className, styles.root) });
}) as typeof FluentButton;

/** A disabled command with its reason written under it; the reason also describes the button. */
function ButtonWithInlineReason({ reason, button }: { reason: string; button: (reasonId: string) => ReactElement }) {
  const reasonId = useId();
  return createElement('span', { className: 'nidec-ui-button-with-reason' },
    button(reasonId),
    createElement('span', { className: 'nidec-ui-button-with-reason__text', id: reasonId }, reason));
}

export function Button(props: ButtonProps) {
  return renderButton(props);
}

function renderButton({
  children, type = 'button', disabled = false, disabledReason, disabledReasonDisplay = 'tooltip', className, ref, appearance, ...props
}: InternalButtonProps) {
  // Bridge object refs through a callback: Fluent's event-derived ref type can
  // infer never with exact optional properties. No public ref type is narrowed.
  const forwardedRef = typeof ref === 'function' ? ref : ref ? (node: HTMLButtonElement | null) => {
    ref.current = node;
  } : null;
  const reason = disabled ? disabledReason?.trim() || undefined : undefined;
  // A disabled attention button is the same neutral grey as any disabled button.
  const attention = appearance === 'attention' && !disabled;
  const render = (reasonId?: string) => createElement(attention ? AttentionButton : FluentButton, {
    ...props,
    ...(appearance === undefined ? {} : { appearance: appearance === 'attention' ? 'secondary' as const : appearance }),
    ...(reasonId ? { 'aria-describedby': [props['aria-describedby'], reasonId].filter(Boolean).join(' ') } : {}),
    as: 'button',
    // A disabled button takes no pointer or focus events, so a reason could never be shown.
    ...(reason ? { disabledFocusable: true } : { disabled }),
    ref: forwardedRef,
    type,
    className: ['nidec-ui-button', attention ? 'nidec-ui-button--attention' : null, className].filter(Boolean).join(' '),
  }, children);
  if (reason === undefined) return render();
  // With a reason the button is wrapped; the public element type stays the plain button's.
  const wrapped = disabledReasonDisplay === 'inline'
    ? createElement(ButtonWithInlineReason, { reason, button: render })
    : createElement(FluentTooltip, { content: reason, relationship: 'description' }, render());
  return wrapped as unknown as ReturnType<typeof render>;
}

/** Icon actions have an explicit accessible name; business meaning stays with the caller. */
export type IconButtonProps = Omit<ButtonProps, 'children' | 'icon' | 'aria-label' | 'aria-labelledby' | 'appearance'> & {
  icon: ReactElement;
  'aria-label': string;
  /** Defaults to `secondary`; an icon-only command is never an attention action. */
  appearance?: 'primary' | 'secondary';
  children?: never;
};

export function IconButton(props: IconButtonProps) {
  return renderIconButton(props);
}

/**
 * Borderless icon button for the fixed places a component owns: table row
 * actions, the drawer close, paging steps and the navigation toggle. Not
 * exported from the package; applications use IconButton.
 */
export function QuietIconButton(props: Omit<IconButtonProps, 'appearance'> & { appearance: 'subtle' | 'transparent' }) {
  return renderIconButton(props);
}

function renderIconButton({ icon, 'aria-label': label, ...props }: Omit<IconButtonProps, 'appearance'> & Pick<InternalButtonProps, 'appearance'>) {
  if (!label.trim()) throw new Error('IconButton requires a non-empty aria-label.');
  return renderButton({ ...props, icon, 'aria-label': label, children: '' });
}

export type TableActionIconButtonProps = Omit<IconButtonProps, 'appearance' | 'size' | 'shape'>;

/** Compact secondary action for a Table/DataGrid row; icon meaning stays consumer-owned. */
export function TableActionIconButton({ icon, 'aria-label': label, className, ...props }: TableActionIconButtonProps) {
  return QuietIconButton({
    ...props,
    icon,
    'aria-label': label,
    className: withClass('nidec-ui-table-action-icon-button', className),
    appearance: 'transparent',
    size: 'small',
    shape: 'rounded',
  });
}
