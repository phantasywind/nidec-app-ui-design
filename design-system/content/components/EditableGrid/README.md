EditableGrid is the high-density pattern for line collections that are large and changed repeatedly. It is a structural frame (title, description, status, toolbar, scrollable viewport and footer) composed with Fluent Table or DataGrid, and owns no data or commands.

Use it when users scan and change many peer rows in one session and benefit from keyboard movement and batch commands. Do not use it for a short form, occasional single-record edits, record navigation or lifecycle decisions.

Model: compact rows with one active edit row. An explicit affordance activates the row; confirm and cancel use EditableGridRowActionGroup (transparent 24 by 24 icon actions with labels and Tooltips). Confirming updates the consumer's draft batch only; one page-level save persists the batch after validation.

- Active row: a themed surface and a slim brand edge, not a heavy fill. Dirty row: one subtle marker by the row identifier plus an accessible label and a status summary. Invalid field: `aria-invalid`, a visible error and an associated message, with an issue count in the toolbar. Selection is separate from the active row.
- Put actions in the last column and mark each action cell with `nidec-ui-editable-grid__action-column`, so it stays visible at the right edge during horizontal scroll. The viewport owns the horizontal overflow.
- Every editable field needs a row-specific accessible name. Document and test the keyboard model.

The consumer owns columns, units, calculations, validation, permissions, save and conflict handling, paging and virtualisation, and what happens when a row, filter or route changes with unsaved work.
