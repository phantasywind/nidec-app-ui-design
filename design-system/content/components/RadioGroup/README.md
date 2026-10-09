RadioGroup with Radio is one set of mutually exclusive choices. The package re-exports Fluent's `RadioGroup` and `Radio` unchanged.

Use it when the options are few, or each needs a short explanation, and people should see all of them at once. For a compact immediate mode switch use SegmentedControl; for a long list use Dropdown or Combobox. Label the group by wrapping it in a Field.

RadioGroup:

| Prop | Values | Default |
| --- | --- | --- |
| `value` / `defaultValue` | the `value` of the selected Radio | none |
| `onChange` | `(event, data) => void`, with `data.value` as the new selection | none |
| `layout` | `vertical`, `horizontal`, `horizontal-stacked` | `vertical` |
| `name` | shared name of the group | generated |
| `disabled` | disables every Radio in the group | `false` |
| `required` | adds `required` to every Radio | `false` |

Radio:

| Prop | Values | Default |
| --- | --- | --- |
| `value` | what the group's `value` becomes when this Radio is selected | none |
| `label` | text beside the indicator | none |
| `labelPosition` | `after`, `below` | `after`; `below` inside `horizontal-stacked` |
| `disabled` | boolean | `false` |

- Handle changes on the RadioGroup. A Radio's own `onChange` fires only when it becomes selected, never when it is deselected.
- The options' values, meanings and the default selection belong to the application. Use stable values, not display text.

```tsx
<Field label="Delivery">
  <RadioGroup value={delivery} onChange={(_, data) => setDelivery(data.value)}>
    <Radio value="standard" label="Standard" />
    <Radio value="extended" label="Extended" />
  </RadioGroup>
</Field>
```
