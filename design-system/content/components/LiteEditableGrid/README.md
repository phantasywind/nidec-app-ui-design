LiteEditableGrid is a lightweight spreadsheet-style grid for editing thousands of rows smoothly: cells are plain text, only the rows in view are rendered, and only the one cell being edited mounts an editor.

Use it inside the EditableGrid frame (title, status, toolbar, footer) when a line collection is long or slow with Table and per-row Fluent inputs. Keep EditableGrid with Table for short collections that need rich cell content such as badges, icons or row actions.

Column editors, chosen per column with `editor`:

- `text`: single-line input. Enter confirms and moves down, Tab moves right, Esc cancels.
- `longText`: multi-line text in a larger panel over the cell. Enter adds a line, Ctrl+Enter or Tab confirms. The cell shows one line with an ellipsis and the full text as its tooltip.
- `select`: fixed choice list. Arrow keys or a typed letter highlight, Enter or a click picks. The cell shows the option text.
- `combobox`: typing filters the list. With `freeform` (default) any typed text is accepted; with `freeform: false` only an option is.
- `none`: read-only.

Keyboard: arrow keys, Home and End, Ctrl+Home and Ctrl+End, Page Up and Page Down move the active cell; Enter, F2, double-click or typing starts editing; Delete clears; Ctrl+C and Ctrl+V copy and paste one cell. Clicking an active select or combobox cell opens its list.

Visual states follow the shared rules: grey row hover, light-green active cell and selected option, a red outline and tooltip message for a value that fails `validate`.

Limits that keep it light: every row has the same 32px height, there is no sorting, grouping, column resizing or multi-cell selection, and Chinese and other IME input starts after Enter, F2 or a double-click. Pass a stable `columns` array.

The consumer owns the rows, `onCellChange` handling, validation rules, unit and number parsing, persistence, permissions and batch save.
