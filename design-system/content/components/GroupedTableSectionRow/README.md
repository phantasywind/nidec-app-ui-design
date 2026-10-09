GroupedTableSectionRow is one disclosure row of a grouped collection. In a Grouped Table or a Grouped Editable Grid, it hides or reveals the rows under a meaningful parent section while keeping the table's columns.

Props: `label`, `count`, `columnSpan`, `level` (`0` or `1`), `expanded`, a consumer-supplied chevron `icon`, `onToggle`, and optional text `summary` and `countLabel`. It owns no rows, hierarchy, expansion state or filtering. It supports one top level and one indented sublevel.

- The button spans the table width, shows chevron, label and count, and exposes `aria-expanded`; Enter and Space match pointer activation. A section row is not selectable or editable and has no checkbox or save action.
- Closing a group hides its descendants only; sibling groups do not change. Counts stay visible. Expansion is independent of search, selection, active editing and drafts, so closing never discards a draft or deselects rows.
- A collapsed group with modified, invalid or active descendants shows a text summary, not colour alone. Group labels are semibold; the count sits at the end of the row in a compact circular brand badge.
- Keep columns aligned and horizontal overflow inside the table viewport.

`Business Rule Pending` for each application: whether counts mean total or filtered rows, which bulk commands may include hidden selected rows, what happens when a group with an unconfirmed edit is closed, and how hidden validation issues are handled at save.
