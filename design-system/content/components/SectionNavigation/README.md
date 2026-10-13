SectionNavigation moves among the sections of one record or page. It is not application navigation and never changes the route.

Two layouts share one component. `horizontal` (default) is a row of semibold 16 px links under the record header, with a divider below; clicking scrolls smoothly to the section with that `id`. `vertical` is a list of section groups, each with an optional count and status marker, for example the field groups of a long form. Import it from the package entry.

| Prop | Values | Default |
| --- | --- | --- |
| `aria-label` | name of the navigation landmark | required |
| `items` | array of `{ id, label, count?, status?, href? }`; `id` is the target section's element id | required |
| `orientation` | `horizontal` or `vertical` | `horizontal` |
| `currentId` | the current section; without it, the last clicked one | none |
| `onSectionSelect` | `(event, id) => void`, called before scrolling; call `event.preventDefault()` to handle it yourself | none |

- The current item is brand-coloured with a short brand bar (under it when horizontal, beside it when vertical) and `aria-current="location"`, so colour is not the only cue. Hover is the shared grey.
- Scrolling respects reduced motion. Give each target section a heading and an `id`.
- Use Tabs instead when only one section is shown at a time, and ApplicationNavigation for destinations in the application.
