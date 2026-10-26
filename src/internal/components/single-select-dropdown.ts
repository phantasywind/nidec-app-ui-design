import { createElement, useState } from 'react';
import type { ReactElement } from 'react';
import { Combobox as FluentCombobox, Dropdown as FluentDropdown, makeStyles, mergeClasses } from '@fluentui/react-components';
import type {
  ComboboxProps as FluentComboboxProps, DropdownProps as FluentDropdownProps, SelectionEvents,
} from '@fluentui/react-components';
import { Option } from './option';

/**
 * Fluent fixes Dropdown and Combobox at 250px minimum, so in a narrow table
 * column or form grid cell they overflow into the next column and the arrow is
 * cut off. Here the control is 250px wide where there is room and shrinks to its
 * container otherwise; the typed text and the selected text end in an ellipsis.
 * A `className` or `style` width (for example `100%` in a form grid) still wins.
 */
export const useShrinkableSelectStyles = makeStyles({
  // A fixed default width rather than a percentage minimum: a percentage of a
  // shrink-to-fit parent (a Field in a flex row) would collapse to the text.
  root: {
    maxWidth: '100%',
    minWidth: 0,
    // FormGrid sets the variable so the control fills its field.
    width: 'var(--nidec-ui-select-width, 250px)',
  },
  input: {
    minWidth: 0,
    textOverflow: 'ellipsis',
  },
  // The value column may shrink below its text, so the expand arrow keeps its place.
  button: {
    gridTemplateColumns: '[content] minmax(0, 1fr) [icon] auto [end]',
    minWidth: 0,
  },
  buttonText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export type SingleSelectDropdownOption = Readonly<{
  value: string;
  text: string;
  disabled?: boolean;
}>;

export type SingleSelectDropdownSelectData = Readonly<{ optionValue: string; optionText: string }>;

type SharedTriggerProps = Pick<FluentDropdownProps,
  'id' | 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-invalid' | 'aria-required'
  | 'appearance' | 'size' | 'disabled' | 'placeholder' | 'className' | 'style' | 'name'>;

export type SingleSelectDropdownProps = SharedTriggerProps & {
  options: readonly SingleSelectDropdownOption[];
  /** Controlled selection: the selected option's value, or null for none. */
  selectedOption?: string | null;
  defaultSelectedOption?: string | null;
  onOptionSelect?: (event: SelectionEvents, data: SingleSelectDropdownSelectData) => void;
  /** At this many options or more the control becomes a type-to-filter Combobox. */
  searchThreshold?: number;
  /** Disabled row shown when typing matches no option. */
  noMatchText?: string;
};

const noMatchValue = 'nidec-ui-single-select-no-match';

/**
 * Picks one value from a fixed list. Short lists render a Dropdown; at
 * `searchThreshold` options (default 12) and above the same control renders a
 * Combobox that filters as the user types. Typing never changes the selection
 * on its own, and Combobox select events without an option value are ignored.
 */
export function SingleSelectDropdown({
  options,
  selectedOption,
  defaultSelectedOption = null,
  onOptionSelect,
  searchThreshold = 12,
  noMatchText = 'No matches',
  className,
  ...props
}: SingleSelectDropdownProps): ReactElement {
  const shrinkable = useShrinkableSelectStyles();
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultSelectedOption);
  const [query, setQuery] = useState<string | null>(null);
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('SingleSelectDropdown option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.text.trim())) throw new Error('SingleSelectDropdown options require non-empty values and text.');
  if (!Number.isInteger(searchThreshold) || searchThreshold < 1) throw new Error('SingleSelectDropdown searchThreshold must be a positive integer.');

  const selection = selectedOption === undefined ? uncontrolled : selectedOption;
  const selected = selection === null ? undefined : options.find(option => option.value === selection);
  if (selection !== null && selected === undefined) throw new Error(`SingleSelectDropdown selected value must match an option: ${selection}.`);

  const select = (event: SelectionEvents, optionValue: string | undefined) => {
    const option = options.find(candidate => candidate.value === optionValue);
    // Fluent Combobox reports a selection with no value when the typed text matches nothing.
    if (option === undefined || option.disabled) return;
    if (selectedOption === undefined) setUncontrolled(option.value);
    setQuery(null);
    onOptionSelect?.(event, { optionValue: option.value, optionText: option.text });
  };
  const renderOption = (option: SingleSelectDropdownOption) => createElement(Option, {
    key: option.value,
    value: option.value,
    text: option.text,
    ...(option.disabled ? { disabled: true } : {}),
  }, option.text);
  const shared = {
    ...props,
    className: mergeClasses('nidec-ui-single-select-dropdown', shrinkable.root, className),
    selectedOptions: selected === undefined ? [] : [selected.value],
  };

  if (options.length < searchThreshold) {
    return createElement(FluentDropdown, {
      ...shared,
      value: selected?.text ?? '',
      button: selected === undefined ? { className: shrinkable.button } : {
        className: shrinkable.button,
        children: createElement('span', { className: shrinkable.buttonText }, selected.text),
      },
      onOptionSelect: (event, data) => select(event, data.optionValue),
    }, options.map(renderOption));
  }

  const needle = query?.trim().toLocaleLowerCase() ?? '';
  const visible = needle === '' ? options : options.filter(option => option.text.toLocaleLowerCase().includes(needle));
  return createElement(FluentCombobox, {
    ...shared,
    value: query ?? selected?.text ?? '',
    input: { className: shrinkable.input },
    onChange: event => setQuery(event.target.value),
    onOpenChange: (_event, data) => {
      if (!data.open) setQuery(null);
    },
    // Fluent can keep a filtered-out option active and select it on Tab; accept only what is shown.
    onOptionSelect: (event, data) => select(event, visible.some(option => option.value === data.optionValue) ? data.optionValue : undefined),
  } satisfies FluentComboboxProps, visible.length > 0 ? visible.map(renderOption) : createElement(Option, {
    key: noMatchValue, value: noMatchValue, text: noMatchText, disabled: true,
  }, noMatchText));
}
