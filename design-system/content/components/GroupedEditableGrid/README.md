Grouped Editable Grid is LiteEditableGrid with collapsible section rows: thousands of lines grouped into one or two levels, still rendered as plain text with only the rows in view in the DOM.

Pass `getRowGroup(row)` returning one label (one level) or two labels (section and subsection). Sections appear in the order of their first row and show a chevron, a semibold label, an optional text summary from `getGroupSummary` (for example "2 modified") and a count badge. A group key is its labels joined with ` / `; collapse state is uncontrolled (`defaultCollapsedGroups`) or controlled (`collapsedGroups` with `onCollapsedGroupsChange`), which also supports expand-all and collapse-all commands. Keep `getRowGroup` stable, because the layout is rebuilt whenever it changes.

- A section row is never editable or selectable as data. Click it, or press Enter, Space or F2 on it, to collapse or expand it; Left collapses and Right expands. Arrow keys move through sections and data rows alike.
- Collapsing hides descendants only and never discards an edit or a value. Counts include collapsed rows. Show hidden changes or validation issues through the summary text, not colour alone.
- The first column of grouped rows is indented by level. All editors, read-only styling and states are those of LiteEditableGrid.

`Business Rule Pending` for each application: whether counts mean total or filtered rows, and how hidden validation issues are handled at save. The consumer owns group identity and membership, rows, validation and persistence.
