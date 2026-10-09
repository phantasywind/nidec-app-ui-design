Input is a single-line text entry. The package re-exports Fluent's `Input` unchanged, so its props, events and ref behave as in Fluent 9.74.7.

Use it for names, codes and other short text. For several lines use Textarea, for choosing from options use Dropdown or Combobox, for dates use DatePicker, and for numbers use SpinButton. Always wrap it in a Field so the label, hint and error stay attached; a placeholder is not a label.

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `small`, `medium`, `large` | `medium` |
| `appearance` | `outline`, `underline`, `filled-darker`, `filled-lighter` | `outline` |
| `type` | `text`, `email`, `password`, `search`, `tel`, `url`, `date`, `datetime-local`, `month`, `number`, `time`, `week` | `text` |
| `value` / `defaultValue` | string; use one, not both | none |
| `onChange` | `(event, data) => void`, with `data.value` as the new string | none |
| `contentBefore`, `contentAfter` | node shown inside the border, before or after the text | none |
| `readOnly`, `disabled` | boolean, as on a native input | `false` |

- Fluent applies no special styling to other `type` values, and the browser may show its own control. For dates use DatePicker and for numbers use SpinButton.
- Pass `className` and `style` to the outer wrapper. Every other native prop, and `ref`, goes to the inner `<input>`.
- Use `readOnly` for data people may copy. `disabled` means the control cannot be used; do not use it to fake read-only.
- Controlled use reads `data.value`, not `event.target.value`:

```tsx
const [name, setName] = useState('');
<Field label="Record name" hint="Concise supporting guidance">
  <Input value={name} onChange={(_, data) => setName(data.value)} />
</Field>
```

- Draw the edge in `text-muted`, not `border`. Bound the width with `max-width: 100%` and `min-width: 0`; an Input fills whatever its container gives it. Use `size="small"` in dense row editing and give the Field `size="small"` as well, so the label matches.
- The consumer provides the value, the handler, the label and the validation message. Required-ness and validation rules belong to the application.
