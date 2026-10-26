import { createElement, useState } from 'react';
import type { ChangeEvent, MouseEvent, ReactElement } from 'react';
import {
  Button as FluentButton, Combobox as FluentCombobox, Dropdown as FluentDropdown, Tag as FluentTag, TagGroup as FluentTagGroup,
  makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
import type {
  ComboboxProps as FluentComboboxProps, DropdownProps as FluentDropdownProps, OptionOnSelectData, SelectionEvents,
} from '@fluentui/react-components';
import { Option } from './option';
import { useShrinkableSelectStyles } from './single-select-dropdown';
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
  /**
   * `trigger` (default) shows the selection as tags inside the trigger.
   * `below` keeps the trigger short and lists every selected value as a
   * removable tag under it, wrapping onto more lines, with a Clear all action.
   */
  tagPlacement?: 'trigger' | 'below';
  /** Type to filter the list (a multiselect Combobox). Only with `tagPlacement="below"`. */
  searchable?: boolean;
  /** Trigger text when values are selected and the tags are below. */
  formatSelectionSummary?: (selectedCount: number) => string;
  /** Accessible name of the tag list below the trigger. */
  selectionLabel?: string;
  clearAllLabel?: string;
  /** Accessible name of each tag's remove button. */
  formatRemoveLabel?: (text: string) => string;
  noMatchText?: string;
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
const defaultSelectionSummary = (selectedCount: number) => `${selectedCount} selected`;
const defaultRemoveLabel = (text: string) => `Remove ${text}`;
const noMatchValue = 'nidec-ui-multi-select-no-match';

const useBelowStyles = makeStyles({
  root: {
    display: 'grid',
    rowGap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  selection: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalS,
    rowGap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalXS,
    rowGap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  tag: {
    maxWidth: '100%',
  },
  trigger: {
    minWidth: 0,
  },
});

/** Fluent multiselect Dropdown over a fixed option list; selected values show as tags in the trigger. */
export function MultiSelectDropdown({
  options,
  maxVisibleTags = 2,
  formatOverflowText = defaultOverflowText,
  tagPlacement = 'trigger',
  searchable = false,
  formatSelectionSummary = defaultSelectionSummary,
  selectionLabel = 'Selected values',
  clearAllLabel = 'Clear all',
  formatRemoveLabel = defaultRemoveLabel,
  noMatchText = 'No matches',
  selectedOptions,
  defaultSelectedOptions,
  onOptionSelect,
  size,
  className,
  ...props
}: MultiSelectDropdownProps): ReactElement {
  const styles = useMultiSelectDropdownStyles();
  const belowStyles = useBelowStyles();
  const shrinkable = useShrinkableSelectStyles();
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>(() => [...(defaultSelectedOptions ?? [])]);
  const [query, setQuery] = useState('');
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('MultiSelectDropdown option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.text.trim())) throw new Error('MultiSelectDropdown options require non-empty values and text.');
  if (!Number.isInteger(maxVisibleTags) || maxVisibleTags < 1) throw new Error('MultiSelectDropdown maxVisibleTags must be a positive integer.');
  if (searchable && tagPlacement !== 'below') throw new Error('MultiSelectDropdown searchable requires tagPlacement="below".');

  const selection = selectedOptions ?? uncontrolledSelection;
  const known = new Set(options.map(option => option.value));
  const unknown = selection.filter(value => !known.has(value));
  if (unknown.length > 0) throw new Error(`MultiSelectDropdown selected values must match an option: ${unknown.join(', ')}.`);

  // Show the selection in option order so the trigger is stable whatever the click order.
  const selected = options.filter(option => selection.includes(option.value));
  const renderOption = (option: MultiSelectDropdownOption) => createElement(Option, {
    key: option.value,
    value: option.value,
    text: option.text,
    ...(option.disabled ? { disabled: true } : {}),
  }, option.text);

  if (tagPlacement === 'below') {
    const change = (event: SelectionEvents, next: string[], toggled?: MultiSelectDropdownOption) => {
      if (selectedOptions === undefined) setUncontrolledSelection(next);
      const data: OptionOnSelectData = { optionValue: toggled?.value, optionText: toggled?.text, selectedOptions: next };
      onOptionSelect?.(event, data);
    };
    const summary = selected.length === 0 ? '' : formatSelectionSummary(selected.length);
    const needle = query.trim().toLocaleLowerCase();
    const visible = needle === '' ? options : options.filter(option => option.text.toLocaleLowerCase().includes(needle));
    const onSelect = (event: SelectionEvents, data: OptionOnSelectData) => {
      const toggled = options.find(option => option.value === data.optionValue);
      if (toggled === undefined || toggled.disabled) return;
      change(event, data.selectedOptions.filter(value => known.has(value)), toggled);
    };
    const trigger = searchable
      ? createElement(FluentCombobox, {
        ...props,
        ...(size === undefined ? {} : { size }),
        className: mergeClasses('nidec-ui-multi-select-dropdown__trigger', shrinkable.root, belowStyles.trigger),
        input: { className: shrinkable.input },
        multiselect: true,
        selectedOptions: selection,
        value: query,
        placeholder: summary || props.placeholder,
        onChange: (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
        onOpenChange: (_event: unknown, data: { open: boolean }) => {
          if (!data.open) setQuery('');
        },
        onOptionSelect: onSelect,
      } as unknown as FluentComboboxProps, visible.length > 0 ? visible.map(renderOption) : createElement(Option, {
        key: noMatchValue, value: noMatchValue, text: noMatchText, disabled: true,
      }, noMatchText))
      : createElement(FluentDropdown, {
        ...props,
        ...(size === undefined ? {} : { size }),
        className: mergeClasses('nidec-ui-multi-select-dropdown__trigger', shrinkable.root, belowStyles.trigger),
        button: summary === '' ? { className: shrinkable.button } : {
          className: shrinkable.button,
          children: createElement('span', { className: shrinkable.buttonText }, summary),
        },
        multiselect: true,
        selectedOptions: selection,
        value: summary,
        onOptionSelect: onSelect,
      }, options.map(renderOption));
    return createElement('div', {
      className: mergeClasses(withClass('nidec-ui-multi-select-dropdown nidec-ui-multi-select-dropdown--tags-below', className), belowStyles.root),
    },
    trigger,
    selected.length === 0 ? null : createElement('div', { className: mergeClasses('nidec-ui-multi-select-dropdown__selection', belowStyles.selection) },
      createElement(FluentTagGroup, {
        'aria-label': selectionLabel,
        className: belowStyles.tags,
        onDismiss: (event, data) => {
          const removed = options.find(option => option.value === data.value);
          // A tag dismiss is a click or key press on the tag, which onOptionSelect's event type already covers at runtime.
          change(event as unknown as SelectionEvents, selection.filter(value => value !== data.value), removed);
        },
        size: 'extra-small',
      }, selected.map(option => createElement(FluentTag, {
        key: option.value,
        appearance: 'brand',
        className: belowStyles.tag,
        dismissible: !props.disabled,
        dismissIcon: { 'aria-label': formatRemoveLabel(option.text) },
        primaryText: { className: styles.tagText },
        shape: 'rounded',
        value: option.value,
      }, option.text))),
      props.disabled ? null : createElement(FluentButton, {
        appearance: 'transparent',
        className: 'nidec-ui-multi-select-dropdown__clear',
        onClick: (event: MouseEvent<HTMLButtonElement>) => change(event, []),
        size: 'small',
      }, clearAllLabel)));
  }

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
    button: triggerContent === undefined ? { className: shrinkable.button } : { className: shrinkable.button, children: triggerContent },
    className: mergeClasses('nidec-ui-multi-select-dropdown', shrinkable.root, className),
    multiselect: true,
    selectedOptions: selection,
    onOptionSelect: (event, data) => {
      if (selectedOptions === undefined) setUncontrolledSelection(data.selectedOptions);
      onOptionSelect?.(event, data);
    },
  }, options.map(renderOption));
}
