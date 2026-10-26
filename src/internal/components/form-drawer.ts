import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  DrawerBody as FluentDrawerBody, DrawerFooter as FluentDrawerFooter, DrawerHeader as FluentDrawerHeader,
  DrawerHeaderTitle as FluentDrawerHeaderTitle, OverlayDrawer as FluentOverlayDrawer, makeStyles, mergeClasses,
} from '@fluentui/react-components';
import type { OverlayDrawerProps as FluentOverlayDrawerProps } from '@fluentui/react-components';
import { QuietIconButton } from './button';
import { dismissIcon } from './icons';
import { withClass } from './with-class';

const useFormDrawerStyles = makeStyles({
  footer: { justifyContent: 'flex-end' },
});

export type FormDrawerProps = Omit<FluentOverlayDrawerProps,
  'children' | 'open' | 'onOpenChange' | 'position' | 'size' | 'title'> & {
  open: boolean;
  /**
   * Called for the close button, Escape and a backdrop click. Close the drawer
   * here, or first ask about unsaved work and keep it open.
   */
  onDismiss: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Footer commands in reading order, with the primary command last. */
  actions?: ReactNode;
  closeLabel?: string;
  size?: 'medium' | 'large';
};

/**
 * Right-hand sheet for viewing or editing one record without leaving the
 * page: a title with a close icon button, a scrolling body and right-aligned
 * footer commands. Fluent traps focus while it is open and returns focus to
 * the trigger when it closes. Fields, validation and saving stay with the
 * application.
 */
export function FormDrawer({
  open,
  onDismiss,
  title,
  children,
  actions,
  closeLabel = 'Close',
  size = 'medium',
  className,
  ...props
}: FormDrawerProps) {
  const styles = useFormDrawerStyles();
  if (!closeLabel.trim()) throw new Error('FormDrawer requires a non-empty closeLabel.');
  return createElement(FluentOverlayDrawer, {
    ...props,
    className: withClass('nidec-ui-form-drawer', className),
    onOpenChange: (_event, data) => {
      if (!data.open) onDismiss();
    },
    open,
    position: 'end',
    size,
  },
  createElement(FluentDrawerHeader, { className: 'nidec-ui-form-drawer__header' },
    createElement(FluentDrawerHeaderTitle, {
      action: createElement(QuietIconButton, { 'aria-label': closeLabel, appearance: 'subtle', icon: dismissIcon(), onClick: onDismiss }),
    }, title)),
  createElement(FluentDrawerBody, { className: 'nidec-ui-form-drawer__body' }, children),
  actions === undefined ? null : createElement(FluentDrawerFooter, { className: mergeClasses('nidec-ui-form-drawer__footer', styles.footer) }, actions));
}
