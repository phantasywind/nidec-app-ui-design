Switch is an immediate two-state setting. The package re-exports Fluent's `Switch` unchanged.

Use it for a setting that takes effect at once. For choices that are submitted later with a form, use Checkbox or RadioGroup. For a partial state use Checkbox with `'mixed'`.

| Prop | Values | Default |
| --- | --- | --- |
| `checked` / `defaultChecked` | boolean | `false` |
| `onChange` | `(event, data) => void`, with `data.checked` as a boolean | none |
| `label` | text beside the switch | none |
| `labelPosition` | `after`, `before`, `above` | `after` |
| `size` | `small`, `medium` | `medium` |
| `disabled` | boolean | `false` |
| `disabledFocusable` | keeps a disabled switch in the tab order, for a consistent keyboard and screen reader order | `false` |

- Changing the switch in the interface is not the same as saving. Sending the change to a server, and what to do when that fails, belong to the application.
- Name the setting in the label ("Email notifications"), not "On" or "Off".

```tsx
<Switch label="Email notifications" checked={on} onChange={(_, data) => setOn(data.checked)} />
```
