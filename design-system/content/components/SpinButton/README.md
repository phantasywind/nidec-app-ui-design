SpinButton edits an exact number by typing, with the arrow keys, or with step buttons. The package re-exports Fluent's `SpinButton` unchanged.

Use it for quantities and other exact values. For an estimate within a range use Slider. Keep it in a Field with a visible label, and bound the width to about 12rem.

| Prop | Values | Default |
| --- | --- | --- |
| `value` / `defaultValue` | number, or `null` for no value; use one, not both | none |
| `onChange` | `(event, data) => void`, with `data.value` and `data.displayValue` | none |
| `min`, `max` | limits; no limit if omitted | none |
| `step` | difference between adjacent values | `1` |
| `stepPage` | larger step for Page Up and Page Down | `1` |
| `precision` | decimal places to round to | taken from `step` |
| `displayValue` | text shown for a controlled value, such as `"$1.00"` for `1` | the number |
| `size` | `small`, `medium` | `medium` |
| `appearance` | `outline`, `underline`, `filled-darker`, `filled-lighter` | `outline` |

- `onChange` fires when the committed value changes: the step buttons, the arrow keys, or leaving the field or pressing Enter after typing. It does not fire on every keystroke.
- `value` and `displayValue` are for controlled use. In uncontrolled use `displayValue` is ignored.
- Units, precision rules, limits and validation belong to the application. Show the unit in the label or next to the field.

```tsx
<Field label="Quantity (ea)" style={{ width: '12rem' }}>
  <SpinButton min={0} max={100} value={qty} onChange={(_, data) => setQty(data.value ?? null)} />
</Field>
```
