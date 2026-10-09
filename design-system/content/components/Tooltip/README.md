Tooltip gives a short name or hint to a control on hover and focus. The package re-exports Fluent's `Tooltip` unchanged.

Every icon-only control needs one whose text is the same as its accessible name. Do not put an important error, or anything needed to finish a task, only in a Tooltip. Use Popover for richer content.

| Prop | Values | Default |
| --- | --- | --- |
| `content` | the tooltip text | none |
| `relationship` | required: `label` (names the control), `description` (describes it), `inaccessible` (visual only) | none |
| `positioning` | placement | `above` |
| `appearance` | `normal`, `inverted` | `normal` |
| `withArrow` | show an arrow | `false` |
| `showDelay`, `hideDelay` | milliseconds | `250`, `250` |
| `visible`, `onVisibleChange` | control visibility | `false` |

- Use `relationship="label"` for an icon-only control, and `description` for extra information about a control that already has a name.
- The single child is the trigger.

```tsx
<Tooltip content="Refresh" relationship="label">
  <IconButton aria-label="Refresh" icon={<ArrowClockwiseRegular />} />
</Tooltip>
```
