import { createElement } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactElement } from 'react';
import {
  Toolbar as FluentToolbar, ToolbarRadioButton as FluentToolbarRadioButton, ToolbarRadioGroup as FluentToolbarRadioGroup,
  makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
import type { ToolbarProps as FluentToolbarProps } from '@fluentui/react-components';
import { withClass } from './with-class';

export type SegmentedControlOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type SegmentedControlProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'onChange' | 'role'> & {
  'aria-label': string;
  options: readonly SegmentedControlOption[];
  value: string;
  onValueChange: (event: MouseEvent | KeyboardEvent, value: string) => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
};

const segmentedControlName = 'nidec-segmented-control';
const useSegmentedControlStyles = makeStyles({
  item: {
    '&[aria-checked="true"]': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      fontWeight: tokens.fontWeightSemibold,
    },
    '&[aria-checked="true"]:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '&[aria-checked="true"]:active': {
      backgroundColor: tokens.colorBrandBackgroundPressed,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

/** Controlled, mutually exclusive mode selection backed by Fluent toolbar radio behavior. */
export function SegmentedControl({
  'aria-label': ariaLabel,
  options,
  value,
  onValueChange,
  size = 'small',
  disabled = false,
  className,
  ...props
}: SegmentedControlProps): ReactElement<FluentToolbarProps> {
  const styles = useSegmentedControlStyles();
  if (!ariaLabel.trim()) throw new Error('SegmentedControl requires a non-empty aria-label.');
  if (options.length < 2) throw new Error('SegmentedControl requires at least two options.');
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('SegmentedControl option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.label.trim())) throw new Error('SegmentedControl options require non-empty values and labels.');
  if (!options.some(option => option.value === value)) throw new Error('SegmentedControl value must match an option.');

  return createElement(FluentToolbar, {
    ...props,
    'aria-label': ariaLabel,
    checkedValues: { [segmentedControlName]: [value] },
    className: withClass('nidec-ui-segmented-control', className),
    onCheckedValueChange: (event, data) => {
      const nextValue = data.checkedItems[0];
      if (data.name === segmentedControlName && nextValue !== undefined && nextValue !== value) {
        onValueChange(event, nextValue);
      }
    },
    size,
  }, createElement(FluentToolbarRadioGroup, {
    'aria-label': ariaLabel,
    className: 'nidec-ui-segmented-control__group',
  }, options.map(option => createElement(FluentToolbarRadioButton, {
    appearance: 'subtle',
    className: mergeClasses('nidec-ui-segmented-control__item', styles.item),
    ...((disabled || option.disabled) ? { disabled: true } : {}),
    key: option.value,
    name: segmentedControlName,
    value: option.value,
  }, option.label))));
}
