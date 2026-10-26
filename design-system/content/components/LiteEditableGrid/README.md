LiteEditableGrid is the body of every editable table: cells are plain text and draw their own editor, so the editor always matches the row height and the text does not move when editing starts.

Use it inside the EditableGrid frame (status, toolbar, footer). A Fluent Table with Fluent inputs in the active row is still supported but not recommended for new grids.

LiteEditableGrid edits one cell at a time, and each change is reported through `onCellChange` as soon as the cell is left. It is the preferred editable grid, for BOM templates, project BOMs and other lines with long text, tags or groups. For long lists of uniform records maintained a row at a time (component master, cost tables), use LiteRowEditGrid.

- Row height `rowHeight`: `auto` (default) wraps long text and tags and the row grows with them (40px minimum); every row is rendered, so keep it to about 300 rows. A fixed 32, 40 or 48 turns on virtual scrolling for thousands of rows.
- Rows can be grouped under collapsible sections (see Grouped Editable Grid).

Look: the editor has no frame. With auto rows it is a white field drawn inside the cell, as tall as the row, with its text at the top, and long text wraps in place; with fixed rows it is a white field with a 2px brand underline. The row being edited turns light green.

Column editors, chosen per column with `editor` (editable cells use only these; badges, links and row-end actions are display-only):

- `text`: single-line input. Enter confirms and moves down, Tab moves right, Esc cancels.
- `number`: single-line input with a decimal keyboard, end-aligned by default. Parsing stays with the application.
- `longText`: multi-line text in a larger panel over the cell. Enter adds a line, Ctrl+Enter or Tab confirms. The cell shows one line with an ellipsis and the full text as its tooltip.
- `select`: fixed choice list. Arrow keys or a typed letter highlight, Enter or a click picks. The cell shows the option text.
- `combobox`: typing filters the list. With `freeform` (default) any typed text is accepted; with `freeform: false` only an option is.
- `multiselect`: several values from a fixed list, shown in the cell as tags with a leading remove mark (click it to remove that value without opening the editor) and a `+N` count tag beyond `maxVisibleTags` (default 2). The editor is a checklist: Space or Enter toggles, Backspace removes the last tag, Tab or Ctrl+Enter confirms, Esc discards. `onCellChange` passes `values` as an array; option values must not contain a comma.
- `none`: read-only. Read-only cells keep the normal background and show a small lock mark at the end of the cell, with a default cursor; the mark is decorative and `aria-readonly` tells assistive technology. This applies only inside LiteEditableGrid, not to other inputs; editable cells show a thin border and a text or pointer cursor on hover.

Keyboard: arrow keys, Home and End, Ctrl+Home and Ctrl+End, Page Up and Page Down move the active cell; Enter, F2, double-click or typing starts editing; Delete clears; Ctrl+C and Ctrl+V copy and paste one cell. Clicking an active select or combobox cell opens its list.

Scrollbars are light (grey thumb on a white track) whatever the host page's colour scheme. Visual states follow the shared rules: grey row hover, light-green active cell and selected option, a red outline and tooltip message for a value that fails `validate`. The active cell uses a thin brand border close to the table lines. Lists and the long-text panel fade and slide in and fade out; reduced motion turns this off.

Limits that keep it light: fixed rows of one grid share one height, there is no sorting, column resizing or multi-cell selection, and Chinese and other IME input starts after Enter, F2 or a double-click. A date editor comes in a later round. Pass a stable `columns` array.

The consumer owns the rows, `onCellChange` handling, validation rules, unit and number parsing, persistence, permissions and batch save.

- One column shows one field. Do not stack two fields in one column; an exception needs separate approval (shared rule, see the page selection guide).
