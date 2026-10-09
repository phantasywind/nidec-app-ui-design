Skeleton is a content placeholder shown while data loads. The package re-exports Fluent's `Skeleton` and `SkeletonItem` unchanged.

Use it so the layout keeps its shape while loading, then swap it for the real content. For an inline wait use Spinner.

Skeleton:

| Prop | Values | Default |
| --- | --- | --- |
| `animation` | `wave`, `pulse` | `wave` |
| `appearance` | `opaque`, `translucent` | `opaque` |
| `width` | number or CSS length | `100%` |
| `size` | height in pixels applied to its items | none |
| `shape` | `circle`, `square`, `rectangle` | none |

SkeletonItem takes `size`, `shape`, `animation` and `appearance`, and overrides the Skeleton's values.

- Give the Skeleton an `aria-label` that says what is loading.
- The consumer decides how many placeholder rows to show.

```tsx
<Skeleton aria-label="Loading records">
  <SkeletonItem size={16} style={{ width: '60%' }} />
  <SkeletonItem size={12} />
</Skeleton>
```
