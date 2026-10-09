Badge is a small status or count label. It is not an action. The package re-exports Fluent's `Badge`, `CounterBadge` and `PresenceBadge` unchanged.

Use Badge for a short state word, CounterBadge for a number and PresenceBadge for a presence status. The consumer chooses the text and decides what each state means. Always put a word or icon in the badge; colour alone is not enough. A Badge must not be clickable.

Badge:

| Prop | Values | Default |
| --- | --- | --- |
| `appearance` | `filled`, `tint`, `outline`, `ghost` | `filled` |
| `color` | `brand`, `danger`, `important`, `informative`, `severe`, `subtle`, `success`, `warning` | `brand` |
| `shape` | `circular`, `rounded`, `square` | `circular` |
| `size` | `tiny`, `extra-small`, `small`, `medium`, `large`, `extra-large` | `medium` |
| `icon`, `iconPosition` | an icon, `before` or `after` the text | `before` |

CounterBadge: `count` (default `0`), `overflowCount` (default `99`), `showZero` (default `false`), `dot` (default `false`), `color` (`brand`, `danger`, `important`, `informative`), `appearance` (`filled`, `ghost`), `shape` (`circular`, `rounded`).

PresenceBadge: `status` (default `available`) and `outOfOffice`.

- For statuses in tables and lists, `appearance="tint"` with a semantic `color` keeps the label readable. Map business states to colours in the application, not here.

```tsx
<Badge appearance="tint" color="success">Ready</Badge>
<CounterBadge count={5} color="brand" />
```
