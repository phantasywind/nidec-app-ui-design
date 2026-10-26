import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { Tooltip as FluentTooltip } from '@fluentui/react-components';
import { TableActionIconButton } from './button';
import type { TableActionIconButtonProps } from './button';
import { withClass } from './with-class';

export type EditableGridProps = Omit<ComponentPropsWithoutRef<'section'>,
  'children' | 'title'> & {
  'aria-label': string;
  /** Visible heading. Leave out when the page already titles the grid; the header is then omitted unless `status` is set. */
  title?: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  /** Leave out for no toolbar; no empty strip is drawn. */
  toolbar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** `compact` tightens the header, toolbar and footer padding for grids placed inside a form or drawer. */
  density?: 'default' | 'compact';
  /**
   * Caps the viewport height (px or a CSS length such as `calc(100vh - 320px)`);
   * the rows scroll under a sticky column header.
   */
  maxHeight?: number | string;
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
  density = 'default',
  maxHeight,
  className,
  ...props
}: EditableGridProps) {
  if (!ariaLabel.trim()) throw new Error('EditableGrid requires a non-empty aria-label.');
  const hasCopy = title !== undefined || description !== undefined;
  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-editable-grid', className),
    'data-density': density === 'compact' ? 'compact' : undefined,
  },
  hasCopy || status !== undefined ? createElement('header', { className: 'nidec-ui-editable-grid__header' },
    hasCopy ? createElement('div', { className: 'nidec-ui-editable-grid__copy' },
      title === undefined ? null : createElement('h2', { className: 'nidec-ui-editable-grid__title' }, title),
      description === undefined ? null : createElement('div', { className: 'nidec-ui-editable-grid__description' }, description))
      : createElement('div', { className: 'nidec-ui-editable-grid__copy' }),
    status === undefined ? null : createElement('div', { className: 'nidec-ui-editable-grid__status' }, status)) : null,
  toolbar === undefined || toolbar === null ? null : createElement('div', { className: 'nidec-ui-editable-grid__toolbar' }, toolbar),
  createElement('div', {
    'aria-label': `${ariaLabel} rows`,
    className: 'nidec-ui-editable-grid__viewport',
    'data-max-height': maxHeight === undefined ? undefined : true,
    role: 'region',
    style: maxHeight === undefined ? undefined : { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight },
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
