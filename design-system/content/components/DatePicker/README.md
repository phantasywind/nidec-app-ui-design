DatePicker selects one calendar date, such as an effective date, due date or planned date. It keeps Fluent's input, calendar popover, keyboard and focus behaviour.

Import it from `@phantasywind/nidec-app-ui-design/date-picker`. The application must install the exact `@fluentui/react-datepicker-compat` version named in the release record.

Do not use it for date and time, time zones, shifts or durations; for date ranges (use two separate fields and validate their order in the application); or for read-only display (use plain text).

The consumer provides the label (in a Field), formatting and parsing, the allowed range, and localised text. Use `Date | null` for a controlled value, never `undefined`.

- Send dates across APIs or URLs as `YYYY-MM-DD`. Do not call `toISOString()` on a local date and cut it, which can change the calendar day.
- If typing is allowed, provide both `formatDate` and `parseDateFromString` and show the expected format.
- Selecting, typing or clearing a date must not save anything by itself.
- Holidays, financial periods and freeze dates are application rules, not package defaults.
