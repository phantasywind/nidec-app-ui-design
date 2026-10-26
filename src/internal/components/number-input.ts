import { createElement, useState } from 'react';
import type { ReactElement } from 'react';
import { Input as FluentInput } from '@fluentui/react-components';
import type { InputProps as FluentInputProps } from '@fluentui/react-components';
import { withClass } from './with-class';

export type BusinessNumberInvalidInput = Readonly<{
  /** The text as typed. */
  text: string;
  reason: 'invalid-input' | 'out-of-range';
}>;

export type BusinessNumberInputProps = Omit<FluentInputProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode' | 'contentAfter' | 'min' | 'max'> & {
  /** The number, or null for an empty field. */
  value: number | null;
  /** Called only with numbers the field accepts, or null when it is emptied. */
  onValueChange: (value: number | null) => void;
  /** Most digits after the decimal point; 0 for whole numbers. Default 2. */
  decimals?: number;
  /** Always show `decimals` digits when not editing, for amounts. Default false. */
  fixedDecimals?: boolean;
  min?: number;
  max?: number;
  /** Unit shown inside the field after the number, such as `kg` or `CNY`. */
  unit?: string;
  /** Thousands separators while not editing. Default true. */
  thousandsSeparator?: boolean;
  /**
   * Text that could not be used when the field lost focus. The field goes
   * back to the last accepted value; show the reason if it helps.
   */
  onInvalidInput?: (input: BusinessNumberInvalidInput) => void;
};

const parse = (text: string): number | null | undefined => {
  const plain = text.replaceAll(',', '').trim();
  if (plain === '') return null;
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(plain)) return undefined;
  const number = Number(plain);
  return Number.isFinite(number) ? number : undefined;
};

/**
 * Number field for business values: empty allowed, decimals, a range, a unit
 * inside the field and thousands separators. While typing it keeps the text
 * as typed, so "0.", "1.7" and "-" are not reset, and reports only numbers it
 * can use. On leaving the field, text it cannot use returns to the last value.
 * Fluent `SpinButton` stays for small whole-number steppers.
 */
export function BusinessNumberInput({
  value,
  onValueChange,
  decimals = 2,
  fixedDecimals = false,
  min,
  max,
  unit,
  thousandsSeparator = true,
  onInvalidInput,
  onFocus,
  onBlur,
  className,
  ...props
}: BusinessNumberInputProps): ReactElement {
  if (!Number.isInteger(decimals) || decimals < 0) throw new Error('BusinessNumberInput decimals must be a non-negative integer.');
  const format = (number: number | null, grouping: boolean) => (number === null ? '' : number.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: fixedDecimals ? decimals : 0,
    useGrouping: grouping,
  }));
  const [editing, setEditing] = useState<string | null>(null);
  const inRange = (number: number) => (min === undefined || number >= min) && (max === undefined || number <= max);
  // While editing, an outside change of value replaces the text only when the text is an accepted number that means something else.
  const typed = editing === null ? undefined : parse(editing);
  const text = typed !== undefined && typed !== value && (typed === null || inRange(typed)) ? format(value, false) : editing;
  const allowed = new RegExp(`^${min !== undefined && min >= 0 ? '' : '-?'}[\\d,]*${decimals > 0 ? `(\\.\\d{0,${decimals}})?` : ''}$`);

  return createElement(FluentInput, {
    ...props,
    className: withClass('nidec-ui-number-input', className),
    ...(unit === undefined ? {} : { contentAfter: createElement('span', { className: 'nidec-ui-number-input__unit' }, unit) }),
    inputMode: decimals > 0 ? 'decimal' : 'numeric',
    value: text ?? format(value, thousandsSeparator),
    onFocus: event => {
      setEditing(format(value, false));
      onFocus?.(event);
    },
    onChange: (_event, data) => {
      // Keystrokes that could never become an accepted number are ignored.
      if (!allowed.test(data.value)) return;
      setEditing(data.value);
      const number = parse(data.value);
      if (number === null || (number !== undefined && inRange(number))) {
        if (number !== value) onValueChange(number);
      }
    },
    onBlur: event => {
      const typed = text ?? '';
      const number = parse(typed);
      if (number === undefined) onInvalidInput?.({ text: typed, reason: 'invalid-input' });
      else if (number !== null && !inRange(number)) onInvalidInput?.({ text: typed, reason: 'out-of-range' });
      setEditing(null);
      onBlur?.(event);
    },
  });
}
