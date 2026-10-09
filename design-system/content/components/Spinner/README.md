Spinner shows that something is loading. The package re-exports Fluent's `Spinner`, and `ProgressBar` for measured progress, unchanged.

Use Spinner for an unknown wait, Skeleton for a content placeholder and ProgressBar when progress is known. Keep the surrounding layout stable while loading. For a busy Button, the application disables the button and shows progress so it cannot be submitted twice.

| Prop | Values | Default |
| --- | --- | --- |
| `label` | text shown with the spinner; also its accessible name | none |
| `labelPosition` | `above`, `below`, `before`, `after` | `after` |
| `size` | `extra-tiny`, `tiny`, `extra-small`, `small`, `medium`, `large`, `extra-large`, `huge` | `medium` |
| `appearance` | `primary`, `inverted` | `primary` |
| `delay` | milliseconds before it appears | `0` |

- Set `delay` for short waits so a spinner does not flash.
- The consumer decides which region is loading and gives the spinner a text label.

```tsx
<Spinner size="tiny" label="Loading records" />
<ProgressBar value={0.65} aria-label="Import progress" />
```
