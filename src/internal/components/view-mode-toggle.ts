import { createElement } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactElement } from 'react';
import { Tooltip as FluentTooltip, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { IconButton } from './button';
import { withClass } from './with-class';

export type ViewMode = 'list' | 'card';

export type ViewModeToggleProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'onChange' | 'role'> & {
  'aria-label': string;
  value: ViewMode;
  onValueChange: (event: MouseEvent<HTMLButtonElement>, value: ViewMode) => void;
  listIcon: ReactElement;
  cardIcon: ReactElement;
  listLabel?: string;
  cardLabel?: string;
  disabled?: boolean;
};

const useViewModeToggleStyles = makeStyles({
  selected: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorBrandForeground1,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
      color: tokens.colorBrandForeground1,
    },
    '&:active': {
      backgroundColor: tokens.colorNeutralBackground3Pressed,
      color: tokens.colorBrandForeground1,
    },
  },
});

/** Compact mutually exclusive List/Card presentation switch; data semantics stay consumer-owned. */
export function ViewModeToggle({
  'aria-label': ariaLabel,
  value,
  onValueChange,
  listIcon,
  cardIcon,
  listLabel = 'List view',
  cardLabel = 'Card view',
  disabled = false,
  className,
  ...props
}: ViewModeToggleProps) {
  const styles = useViewModeToggleStyles();
  if (!ariaLabel.trim()) throw new Error('ViewModeToggle requires a non-empty aria-label.');
  if (!listLabel.trim() || !cardLabel.trim()) throw new Error('ViewModeToggle requires non-empty view labels.');
  if (value !== 'list' && value !== 'card') throw new Error('ViewModeToggle value must be list or card.');
  const option = (mode: ViewMode, label: string, icon: ReactElement) => createElement(FluentTooltip, {
    content: label,
    relationship: 'label',
  }, IconButton({
    'aria-label': label,
    'aria-pressed': value === mode,
    appearance: 'secondary',
    className: mergeClasses('nidec-ui-view-mode-toggle__button', value === mode && styles.selected),
    disabled,
    icon,
    onClick: event => { if (mode !== value) onValueChange(event, mode); },
    shape: 'rounded',
    size: 'medium',
  }));
  return createElement('div', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-view-mode-toggle', className),
    role: 'group',
  }, option('list', listLabel, listIcon), option('card', cardLabel, cardIcon));
}
