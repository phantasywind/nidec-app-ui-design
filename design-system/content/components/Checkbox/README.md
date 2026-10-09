Checkbox chooses one or more items independently, or selects rows in a batch. The package re-exports Fluent's `Checkbox` unchanged.

Use RadioGroup for one choice among several and Switch for an immediate two-state setting. Checkbox has no children: give the label through `label`.

| Prop | Values | Default |
| --- | --- | --- |
| `checked` / `defaultChecked` | `true`, `false`, or `'mixed'` | `false` |
| `onChange` | `(event, data) => void`, with `data.checked` as `true`, `false` or `'mixed'` | none |
| `label` | text beside the box | none |
| `labelPosition` | `after`, `before` | `after` |
| `size` | `medium`, `large` (there is no small size) | `medium` |
| `shape` | `square`, `circular` | `square` |
| `disabled` | boolean | `false` |

- `'mixed'` means a partial selection, such as a parent whose children are only partly selected. It is not a Switch value. Computing it, and the select-all behaviour, belongs to the application.
- Use `circular` only for checklist-style task lists, where it cannot be mistaken for a radio button.
- Give every checkbox a visible label. A checkbox without one needs an `aria-label` that names the row, such as "Select line 003".
- A checked box fills with the brand colour, using the theme.

```tsx
<Checkbox
  label="Show supporting details"
  checked={show}
  onChange={(_, data) => setShow(data.checked === true)}
/>
```
