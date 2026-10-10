import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { Tooltip as FluentTooltip } from '@fluentui/react-components';
import { TableActionIconButton } from './button';
import type { TableActionIconButtonProps } from './button';
import { withClass } from './with-class';

export type EditableGridProps = Omit<ComponentPropsWithoutRef<'section'>,
  'children' | 'title'> & {
  'aria-label': string;
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * High-density batch-editing frame for many frequently changed rows. It owns
 * layout and state presentation only; columns, data, validation, persistence,
 * authorization, calculations and concurrency remain consumer-owned.
 */
export function EditableGrid({
  'aria-label': ariaLabel,
  title,
  description,
  status,
  toolbar,
  children,
  footer,
  className,
  ...props
}: EditableGridProps) {
  if (!ariaLabel.trim()) throw new Error('EditableGrid requires a non-empty aria-label.');
  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-editable-grid', className),
  },
  createElement('header', { className: 'nidec-ui-editable-grid__header' },
    createElement('div', { className: 'nidec-ui-editable-grid__copy' },
      createElement('h2', { className: 'nidec-ui-editable-grid__title' }, title),
      description === undefined ? null : createElement('div', { className: 'nidec-ui-editable-grid__description' }, description)),
    status === undefined ? null : createElement('div', { className: 'nidec-ui-editable-grid__status' }, status)),
  createElement('div', { className: 'nidec-ui-editable-grid__toolbar' }, toolbar),
  createElement('div', {
    'aria-label': `${ariaLabel} rows`,
    className: 'nidec-ui-editable-grid__viewport',
    role: 'region',
    tabIndex: 0,
  }, children),
  footer === undefined ? null : createElement('footer', { className: 'nidec-ui-editable-grid__footer' }, footer));
}

export type EditableGridRowActionGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  confirmIcon: ReactElement;
  confirmLabel: string;
  cancelIcon: ReactElement;
  cancelLabel: string;
  onConfirm: NonNullable<TableActionIconButtonProps['onClick']>;
  onCancel: NonNullable<TableActionIconButtonProps['onClick']>;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
};

/** Governed transparent icon actions for accepting or abandoning one active edit row. */
export function EditableGridRowActionGroup({
  confirmIcon,
  confirmLabel,
  cancelIcon,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
  className,
  ...props
}: EditableGridRowActionGroupProps) {
  if (!confirmLabel.trim() || !cancelLabel.trim()) {
    throw new Error('EditableGridRowActionGroup requires non-empty action labels.');
  }
  return createElement('div', {
    ...props,
    className: withClass('nidec-ui-editable-grid__row-actions', className),
  },
  createElement(FluentTooltip, { content: confirmLabel, relationship: 'label' },
    createElement(TableActionIconButton, {
      'aria-label': confirmLabel,
      className: 'nidec-ui-editable-grid__confirm-action',
      disabled: confirmDisabled,
      icon: confirmIcon,
      onClick: onConfirm,
    })),
  createElement(FluentTooltip, { content: cancelLabel, relationship: 'label' },
    createElement(TableActionIconButton, {
      'aria-label': cancelLabel,
      disabled: cancelDisabled,
      icon: cancelIcon,
      onClick: onCancel,
    })));
}
