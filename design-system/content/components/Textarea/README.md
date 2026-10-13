Textarea is a multi-line text entry. The package re-exports Fluent's `Textarea` unchanged.

Use it for notes and descriptions. Let it fill a bounded form region; do not force it to a single-line height. Wrap it in a Field.

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `small`, `medium`, `large` | `medium` |
| `appearance` | `outline`, `filled-darker`, `filled-lighter` | `outline` |
| `resize` | `none`, `horizontal`, `vertical`, `both` | `none` |
| `rows` | number of visible lines, as on a native textarea | browser default |
| `value` / `defaultValue` | string; use one, not both | none |
| `onChange` | `(event, data) => void`, with `data.value` as the new string | none |
| `readOnly`, `disabled` | boolean | `false` |

- Read-only and disabled differ. Keep copyable text read-only, not disabled, so it stays focusable.
- Keep Fluent's minimum height (40px small, 52px medium). A single-line box needs at least line height plus padding plus border plus 2px, or display scaling can round the content past the box and show a scrollbar: 28px for small, 36px for medium.
- `resize` is `none` by default. Turn on `vertical` only where the layout can grow with it.
- Fluent's Textarea object ref has an upstream typing limit under strict compiler settings (`exactOptionalPropertyTypes`, TypeScript 7). Use a callback ref, or check your compiler settings before using an object ref. The shared package does not hide or rewrite the upstream type.
- The consumer provides the value, handler, label and validation text. Length limits and counters are application rules.

```tsx
<Field label="Notes" hint="Multi-line text">
  <Textarea rows={4} value={notes} onChange={(_, data) => setNotes(data.value)} />
</Field>
```
