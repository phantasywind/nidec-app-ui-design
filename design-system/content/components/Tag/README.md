Tag is a compact label for an attribute or a chosen value, grouped with `TagGroup`. The package re-exports Fluent's `Tag` and `TagGroup` unchanged.

Use it for categories, filters and selected values. It is not a status Badge and not a command. Keep every tag labelled in text.

Tag:

| Prop | Values |
| --- | --- |
| `value` | identifies the tag in group callbacks |
| `appearance` | `filled`, `outline`, `brand` |
| `size` | `extra-small`, `small`, `medium` |
| `shape` | `rounded`, `circular` |
| `dismissible` | show a dismiss control |
| `selected`, `disabled` | boolean |

TagGroup:

| Prop | Values |
| --- | --- |
| `onDismiss` | called with the dismissed tag's `value` |
| `selectedValues` / `defaultSelectedValues`, `onTagSelect` | selection of tags |
| `size`, `appearance`, `dismissible`, `disabled` | applied to every tag in the group |

- Give each Tag a `value`. When tags are dismissible, `TagGroup` `onDismiss` tells you which one; removing it from the list is the application's job.

```tsx
<TagGroup onDismiss={(_, data) => remove(data.value)}>
  {filters.map((f) => <Tag key={f} value={f} dismissible appearance="outline">{f}</Tag>)}
</TagGroup>
```
