Slider adjusts a continuous value within a range. The package re-exports Fluent's `Slider` unchanged.

Use it for an estimate within a range. For an exact value use SpinButton. Wrap it in a Field with a label, and show the current value and its unit as text; the thumb position alone is not enough.

| Prop | Values | Default |
| --- | --- | --- |
| `value` / `defaultValue` | number; use one, not both | none |
| `onChange` | `(event, data) => void`, with `data.value`; called on every individual step | none |
| `min`, `max` | range limits | `0`, `100` |
| `step` | amount per step | `1` |
| `size` | `small`, `medium` | `medium` |
| `vertical` | vertical orientation, smallest value at the bottom | `false` |
| `disabled` | boolean | `false` |

- `onChange` fires continuously while dragging. Do not save or call a server from it; commit on release or with an explicit action.
- Range, unit and precision belong to the application.

```tsx
<Field label={`Opacity: ${value}%`}>
  <Slider min={0} max={100} value={value} onChange={(_, data) => setValue(data.value)} />
</Field>
```
