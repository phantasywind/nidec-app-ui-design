LiteRowEditGrid is the row-edit sibling of LiteEditableGrid, for long lists of uniform records maintained one row at a time: master data such as components, cost tables, rate lists. Rows have one fixed height and only the rows in view are rendered, so it handles thousands of rows.

Use it inside the EditableGrid frame (status, toolbar, footer). For BOM templates, project BOMs and other lines with long text, tags or groups, use LiteEditableGrid (cell edit), which is the preferred editable grid.

- Row height `rowHeight` 32, 40 (default) or 48, chosen by the application. There is no auto height.
- Arrow keys, Page Up and Page Down, Ctrl+Home and Ctrl+End move the current row, which carries a brand left edge. Enter, F2 or a double-click edits it; a double-click focuses the clicked field.
- The editing row turns light green; its editable values stay where they are, in regular weight, and become fields without boxes. The focused field gets a 2px brand underline; a value that fails `validate` turns red with a red underline.
- There are no row actions. Leaving the row (another row, Tab out, a click outside the grid) or Enter saves it with one `onRowChange` carrying every draft value and the changed ones; Enter also moves to the next row. Esc discards the draft. Like cell edit, a value that fails validation is saved and stays marked for the application to resolve. Switching to another window does not save.
- `canEditRow` returning `false` keeps a row read-only. `onActiveRowChange` reports the current row, for toolbar commands such as delete. `height` (default `28rem`) or `maxHeight` sets the viewport.
- Column definitions and editors are those of LiteEditableGrid (`text`, `number`, `longText`, `select`, `combobox`, `multiselect`, `none`). Read-only cells show a lock mark on the editing row only, with their space kept in every row so numbers align. Rows are not grouped; use LiteEditableGrid for collapsible sections.

The consumer owns the rows, `onRowChange` handling, validation rules, number parsing, persistence, permissions and batch save.

- One column shows one field. Do not stack two fields in one column; an exception needs separate approval (shared rule, see the page selection guide).
