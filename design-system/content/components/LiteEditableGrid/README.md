LiteEditableGrid is the body of every editable table: cells are plain text and draw their own editor, so the editor always matches the row height and the text does not move when editing starts.

Use it inside the EditableGrid frame (status, toolbar, footer). A Fluent Table with Fluent inputs in the active row is still supported but not recommended for new grids.

Two edit modes, chosen with `editMode`:

- `row`: one row edits at a time. The edit action or a double-click starts it; Enter or the check confirms the whole row through `onRowChange`, Esc or the cross cancels. Row height `rowHeight` 32, 40 (default), 48 or `auto` (long text and tags wrap and the row grows). Every row is rendered, so keep it to about 300 rows; `maxHeight` caps the height under a sticky header. Unconfirmed changes keep their row in edit. `canEditRow` can disable a row's edit action with a reason; `renderRowActions` adds display-only actions before it.
- `cell` (default): the spreadsheet model below, with virtual scrolling for thousands of rows and `rowHeight` 32 (default), 40 or 48.

Row mode look: no per-cell boxes, fills or frames. The editing row keeps the light green row and the brand left edge; editable values turn brand green and semibold; the focused field gets a 2px brand underline. An invalid value turns red with a red underline and the check stays disabled. Locks show only on the editing row, with their space kept in every row so numbers align.

Column editors, chosen per column with `editor` (editable cells use only these; badges, links and row-end actions are display-only):

- `text`: single-line input. In cell mode Enter confirms and moves down, Tab moves right, Esc cancels.
- `number`: single-line input with a decimal keyboard, end-aligned by default. Parsing stays with the application.
- `longText`: multi-line text in a larger panel over the cell. Enter adds a line, Ctrl+Enter or Tab confirms. The cell shows one line with an ellipsis and the full text as its tooltip.
- `select`: fixed choice list. Arrow keys or a typed letter highlight, Enter or a click picks. The cell shows the option text.
- `combobox`: typing filters the list. With `freeform` (default) any typed text is accepted; with `freeform: false` only an option is.
- `multiselect`: several values from a fixed list, shown in the cell as tags with a leading remove mark (click it to remove that value without opening the editor) and a `+N` count tag beyond `maxVisibleTags` (default 2). The editor is a checklist: Space or Enter toggles, Backspace removes the last tag, Tab or Ctrl+Enter confirms, Esc discards. `onCellChange` passes `values` as an array; option values must not contain a comma.
- `none`: read-only. Read-only cells keep the normal background and show a small lock mark at the end of the cell, with a default cursor; the mark is decorative and `aria-readonly` tells assistive technology. This applies only inside LiteEditableGrid, not to other inputs; editable cells show a thin border and a text or pointer cursor on hover.

Cell-mode keyboard: arrow keys, Home and End, Ctrl+Home and Ctrl+End, Page Up and Page Down move the active cell; Enter, F2, double-click or typing starts editing; Delete clears; Ctrl+C and Ctrl+V copy and paste one cell. Clicking an active select or combobox cell opens its list.

Scrollbars are light (grey thumb on a white track) whatever the host page's colour scheme. Visual states follow the shared rules: grey row hover, light-green active cell and selected option, in cell mode a red outline and tooltip message for a value that fails `validate`. The active cell and editor use a thin brand border close to the table lines. Lists and the long-text panel fade and slide in and fade out; reduced motion turns this off.

Limits that keep it light: rows of one grid share one height (except `auto` in row mode), there is no sorting, column resizing or multi-cell selection, and in cell mode Chinese and other IME input starts after Enter, F2 or a double-click. A date editor comes in a later round. Pass a stable `columns` array.

The consumer owns the rows, `onCellChange` or `onRowChange` handling, validation rules, unit and number parsing, persistence, permissions and batch save.

- One column shows one field. Do not stack two fields in one column; an exception needs separate approval (shared rule, see the page selection guide).
