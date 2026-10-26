/**
 * Fluent date-only selection surface.
 *
 * Formatting, parsing, date boundaries, localization and business-calendar
 * rules remain explicit consumer inputs. See docs/date-picker.md.
 */
import { createElement, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { DatePicker as FluentDatePicker } from '@fluentui/react-datepicker-compat';
import type { DatePickerProps as FluentDatePickerProps } from '@fluentui/react-datepicker-compat';

export {
  DatePicker,
  datePickerClassNames,
  defaultDatePickerErrorStrings,
  defaultDatePickerStrings,
} from '@fluentui/react-datepicker-compat';

export type {
  DatePickerErrorType,
  DatePickerProps,
  DatePickerValidationResultData,
} from '@fluentui/react-datepicker-compat';


const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (value: number) => String(value).padStart(2, '0');

/** Calendar date without time zone, as `yyyy-MM-dd`. */
export type BusinessDateValue = string;

/** Local calendar date for a `yyyy-MM-dd` value, or null when the value is not a real date. */
export function businessDateToDate(value: BusinessDateValue): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

/** `yyyy-MM-dd` for the local calendar day of a Date; never shifted through UTC. */
export function dateToBusinessDate(date: Date): BusinessDateValue {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Default display format: `22 Oct 2026`. */
export function formatBusinessDate(date: Date): string {
  return `${date.getDate()} ${monthNames[date.getMonth()]!.slice(0, 3)} ${date.getFullYear()}`;
}

/** Accepts `2026-10-22`, `22 Oct 2026` and `22 October 2026`. Returns null for anything else. */
export function parseBusinessDate(text: string): Date | null {
  const trimmed = text.trim();
  const iso = businessDateToDate(trimmed);
  if (iso) return iso;
  const match = /^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})$/.exec(trimmed);
  if (!match) return null;
  const name = match[2]!.toLowerCase();
  const month = monthNames.findIndex(candidate => candidate.toLowerCase() === name || (name.length === 3 && candidate.toLowerCase().startsWith(name)));
  if (month < 0) return null;
  return businessDateToDate(`${match[3]}-${pad(month + 1)}-${pad(Number(match[1]))}`);
}

/** Why typed text was not accepted: it is not a date, or it falls outside `minDate` / `maxDate`. */
export type BusinessDateInvalidReason = 'invalid-input' | 'out-of-bounds';

export type BusinessDateInvalidInput = Readonly<{
  /** The text as the user typed it. */
  text: string;
  reason: BusinessDateInvalidReason;
  /** The parsed date for an out-of-bounds entry, so the message can name it; null when the text is not a date. */
  value: BusinessDateValue | null;
}>;

export type BusinessDatePickerProps = Omit<FluentDatePickerProps, 'value' | 'onSelectDate'> & {
  /** `yyyy-MM-dd`, or null for no date. */
  value: BusinessDateValue | null;
  onValueChange: (value: BusinessDateValue | null) => void;
  /**
   * Typed text was rejected. The value is unchanged, and the field is marked
   * invalid until an accepted date replaces the text. Show the reason, for
   * example in the surrounding Field's `validationMessage`.
   */
  onInvalidInput?: (input: BusinessDateInvalidInput) => void;
};

/**
 * DatePicker preset for a business date with no time zone. The value is a
 * `yyyy-MM-dd` string; the field shows `22 Oct 2026`, accepts typed ISO or
 * display dates, and starts weeks on Monday. Every DatePicker prop, including
 * `formatDate`, `parseDateFromString`, `firstDayOfWeek` and `strings`, can
 * still be overridden for another locale.
 *
 * Fluent ignores a typed date outside `minDate` / `maxDate` without saying so:
 * the text stays while the value does not change. Here the field is marked
 * invalid and `onInvalidInput` reports the text, so the form never saves the
 * old value silently. `calendar={{ maxDate }}` only greys out calendar days.
 */
export function BusinessDatePicker({
  value, onValueChange, onInvalidInput, onValidationResult, parseDateFromString = parseBusinessDate, ...props
}: BusinessDatePickerProps): ReactElement {
  const date = value === null ? null : businessDateToDate(value);
  if (value !== null && date === null) throw new Error(`BusinessDatePicker value must be a real yyyy-MM-dd date: ${value}.`);
  const [invalid, setInvalid] = useState(false);
  const lastParsed = useRef<{ text: string; date: Date | null }>({ text: '', date: null });
  return createElement(FluentDatePicker, {
    allowTextInput: true,
    // Fluent DayOfWeek.Monday.
    firstDayOfWeek: 1 as NonNullable<FluentDatePickerProps['firstDayOfWeek']>,
    formatDate: (input?: Date) => (input ? formatBusinessDate(input) : ''),
    placeholder: 'e.g. 22 Oct 2026',
    ...props,
    ...(invalid ? { 'aria-invalid': true } : {}),
    parseDateFromString: (text: string) => {
      const parsed = parseDateFromString(text);
      lastParsed.current = { text, date: parsed && !Number.isNaN(parsed.getTime()) ? parsed : null };
      return parsed;
    },
    onValidationResult: data => {
      onValidationResult?.(data);
      const reason = data.error === 'invalid-input' || data.error === 'out-of-bounds' ? data.error : undefined;
      setInvalid(reason !== undefined);
      if (reason === undefined) return;
      const parsed = reason === 'out-of-bounds' ? lastParsed.current.date : null;
      onInvalidInput?.({ text: lastParsed.current.text, reason, value: parsed ? dateToBusinessDate(parsed) : null });
    },
    onSelectDate: (selected: Date | null | undefined) => {
      setInvalid(false);
      onValueChange(selected ? dateToBusinessDate(selected) : null);
    },
    value: date,
  });
}
