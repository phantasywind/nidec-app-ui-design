BusinessDatePicker is the DatePicker preset for a calendar date with no time zone, such as a due date: the value is a `yyyy-MM-dd` string and the field shows `22 Oct 2026`.

Import it from the `/date-picker` entry, like DatePicker, and wrap it in a Field.

| Prop | Values | Default |
| --- | --- | --- |
| `value` | `yyyy-MM-dd` or `null`; anything else throws | required |
| `onValueChange` | `(value) => void`, with a `yyyy-MM-dd` string or `null` | required |
| `allowTextInput` | typing accepts `2026-10-22`, `22 Oct 2026` and `22 October 2026` | `true` |
| `firstDayOfWeek` | Fluent `DayOfWeek` | Monday |
| `placeholder` | example of the format | `e.g. 22 Oct 2026` |
| `size` | `small`, `medium`, `large`; use `small` in dense table rows | `medium` |

- The value never passes through UTC, so it does not move by a day in other time zones. The same entry exports `businessDateToDate`, `dateToBusinessDate`, `formatBusinessDate` and `parseBusinessDate` for use elsewhere in the application.
- The default texts are English. Override `formatDate`, `parseDateFromString` and `strings` for another language; every other DatePicker prop passes through.
- Date limits, holidays and what the date means stay with the application.
