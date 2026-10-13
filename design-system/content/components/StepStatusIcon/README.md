StepStatusIcon shows the status of one independent step in a list of steps: done (filled green tick), pending (hollow circle) or not applicable (minus).

Use it for checklists and production steps where each step is done or not on its own. For a sequential business process with one current stage, use BusinessProcessFlow. Import it from the package entry.

| Prop | Values | Default |
| --- | --- | --- |
| `status` | `done`, `pending`, `notApplicable` | required |
| `label` | accessible name, for example "Painting: done on 22 Oct 2026" | required |
| `tooltip` | optional detail shown on hover and keyboard focus, such as the date | none |
| `size` | `small` (16 px) or `medium` (20 px) | `medium` |

- The icon is an image with a name, so screen readers read the status; keep a visible step name next to it.
- With a tooltip the icon becomes focusable so keyboard users can reach the detail.
- What counts as done or not applicable is an application rule.
