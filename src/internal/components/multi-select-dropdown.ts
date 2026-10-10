import { createElement, useState } from 'react';
import type { ReactElement } from 'react';
import { Dropdown as FluentDropdown, Tag as FluentTag, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { DropdownProps as FluentDropdownProps } from '@fluentui/react-components';
import { Option } from './option';
import { withClass } from './with-class';

export type MultiSelectDropdownOption = Readonly<{
  value: string;
  text: string;
  disabled?: boolean;
}>;

export type MultiSelectDropdownProps = Omit<FluentDropdownProps,
  'children' | 'multiselect' | 'clearable' | 'value' | 'defaultValue' | 'button'> & {
  options: readonly MultiSelectDropdownOption[];
  /** Selected options shown as tags in the trigger before the rest collapse into a count tag. */
  maxVisibleTags?: number;
  /** Text of the count tag for the selected options that are not shown. */
  formatOverflowText?: (hiddenCount: number) => string;
};

const useMultiSelectDropdownStyles = makeStyles({
  values: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    minWidth: 0,
    overflow: 'hidden',
  },
  // An extra-small tag is 20px; the small trigger's text line is 16px. The
  // negative block margin keeps the small control height unchanged.
  valuesSmall: {
    marginBlock: '-2px',
  },
  tag: {
    flexShrink: 1,
    minWidth: 0,
  },
  tagText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  overflowTag: {
    flexShrink: 0,
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
  },
});

const defaultOverflowText = (hiddenCount: number) => `+${hiddenCount}`;

/** Fluent multiselect Dropdown over a fixed option list; selected values show as tags in the trigger. */
export function MultiSelectDropdown({
  options,
  maxVisibleTags = 2,
  formatOverflowText = defaultOverflowText,
  selectedOptions,
  defaultSelectedOptions,
  onOptionSelect,
  size,
  className,
  ...props
}: MultiSelectDropdownProps): ReactElement<FluentDropdownProps> {
  const styles = useMultiSelectDropdownStyles();
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>(() => [...(defaultSelectedOptions ?? [])]);
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('MultiSelectDropdown option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.text.trim())) throw new Error('MultiSelectDropdown options require non-empty values and text.');
  if (!Number.isInteger(maxVisibleTags) || maxVisibleTags < 1) throw new Error('MultiSelectDropdown maxVisibleTags must be a positive integer.');

  const selection = selectedOptions ?? uncontrolledSelection;
  const known = new Set(options.map(option => option.value));
  const unknown = selection.filter(value => !known.has(value));
  if (unknown.length > 0) throw new Error(`MultiSelectDropdown selected values must match an option: ${unknown.join(', ')}.`);

  // Show the selection in option order so the trigger is stable whatever the click order.
  const selected = options.filter(option => selection.includes(option.value));
  const visible = selected.slice(0, maxVisibleTags);
  const hiddenCount = selected.length - visible.length;
  const tag = (key: string, text: string, tagClassName: string) => createElement(FluentTag, {
    key,
    appearance: 'brand',
    className: tagClassName,
    primaryText: { className: styles.tagText },
    shape: 'rounded',
    size: 'extra-small',
  }, text);
  // The tags are visual; assistive technology reads the full list from the hidden text.
  const triggerContent = selected.length === 0 ? undefined : [
    createElement('span', { key: 'values', 'aria-hidden': true, className: mergeClasses('nidec-ui-multi-select-dropdown__values', styles.values, size === 'small' && styles.valuesSmall) },
      ...visible.map(option => tag(option.value, option.text, mergeClasses('nidec-ui-multi-select-dropdown__tag', styles.tag))),
      ...(hiddenCount > 0 ? [tag('overflow', formatOverflowText(hiddenCount), mergeClasses('nidec-ui-multi-select-dropdown__overflow', styles.overflowTag))] : [])),
    createElement('span', { key: 'text', className: styles.visuallyHidden }, selected.map(option => option.text).join(', ')),
  ];

  return createElement(FluentDropdown, {
    ...props,
    ...(size === undefined ? {} : { size }),
    ...(triggerContent === undefined ? {} : { button: { children: triggerContent } }),
    className: withClass('nidec-ui-multi-select-dropdown', className),
    multiselect: true,
    selectedOptions: selection,
    onOptionSelect: (event, data) => {
      if (selectedOptions === undefined) setUncontrolledSelection(data.selectedOptions);
      onOptionSelect?.(event, data);
    },
  }, options.map(option => createElement(Option, {
    key: option.value,
    value: option.value,
    text: option.text,
    ...(option.disabled ? { disabled: true } : {}),
  }, option.text)));
}
