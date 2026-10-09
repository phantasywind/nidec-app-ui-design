InfoLabel is a field label with an information button that reveals a short explanation. The package re-exports Fluent's `InfoLabel` unchanged.

Use it for brief field help. Longer or critical guidance belongs in a hint under the field. Pass it as the Field's `label` so the label stays tied to the control.

| Prop | Values |
| --- | --- |
| `info` | the content shown in the information popover |
| native label props | applied to the label, for example `htmlFor` |

- Inside Field, render it through the label render function so Field's props reach it, as in the example.
- The consumer provides the label text and the help content.

```tsx
<Field label={{ children: (_, slotProps) => (
  <InfoLabel {...slotProps} info="Letters, digits and hyphens.">Order code</InfoLabel>
) }}>
  <Input />
</Field>
```
