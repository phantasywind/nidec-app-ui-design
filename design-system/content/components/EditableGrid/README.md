EditableGrid is the high-density pattern for line collections that are large and changed repeatedly. It is a structural frame (optional title and description, status, optional toolbar, scrollable viewport and footer) and owns no data or commands. Put LiteEditableGrid (cell edit, preferred: BOM templates, project BOMs) or LiteRowEditGrid (row edit: long uniform master data and cost tables) inside it; Fluent Table or DataGrid with Fluent inputs is still supported but not recommended for new grids.

Leave `title` out when the page already names the grid and `toolbar` out when there is none: nothing empty is drawn. `density="compact"` tightens the frame inside a form or drawer. `maxHeight` (px or a CSS length such as `calc(100vh - 320px)`) caps a Table viewport under a sticky header; give LiteEditableGrid its own `height`, or LiteRowEditGrid its `height` or `maxHeight`, instead.

Only tables whose cells take typed or chosen input (text, numbers, list choices, dates) are editable grids. A field matrix of toggles and a selection matrix of buttons or links that open a drawer stay a plain Table with standard controls.

Use it when users scan and change many peer rows in one session and benefit from keyboard movement and batch commands. Do not use it for a short form, occasional single-record edits, record navigation or lifecycle decisions.

Model: edits go into the consumer's draft batch (a cell when it is left, a row when it is left) and one page-level save persists the batch after validation. The lightweight grids need no row actions. A Table-based grid still activates one row explicitly and confirms or cancels it with EditableGridRowActionGroup (transparent 24 by 24 icon actions with labels and Tooltips).

- Active row: a themed surface and a slim brand edge, not a heavy fill. Dirty row: one subtle marker by the row identifier plus an accessible label and a status summary. Invalid field: `aria-invalid`, a visible error and an associated message, with an issue count in the toolbar. Selection is separate from the active row.
- With a Table, put actions in the last column and mark the Actions header cell and each action cell with `nidec-ui-editable-grid__action-column`, so it stays visible at the right edge during horizontal scroll; only that marked column is pinned. The viewport owns the horizontal overflow.
- Every editable field needs a row-specific accessible name. Document and test the keyboard model.

The consumer owns columns, units, calculations, validation, permissions, save and conflict handling, paging and virtualisation, and what happens when a row, filter or route changes with unsaved work.

- One column shows one field. Do not stack two fields in one column; an exception needs separate approval (shared rule, see the page selection guide).
