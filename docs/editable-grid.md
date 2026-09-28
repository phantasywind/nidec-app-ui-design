# Editable Grid

`EditableGrid` is the governed high-density editing pattern for line collections that are large and changed repeatedly. Typical consumer-owned examples include BOM lines, quote lines, allocation lines and similar tabular work. The shared pattern does not define any of those business records.

## Use when

- The primary task is scanning and changing many peer rows in one working session.
- Users benefit from keyboard movement, compact rows, multi-selection and batch commands.
- Several changes should be reviewed and validated before one controlled save.
- Opening a separate Form or Sheet for every row would make the task materially slower.

Do not use it for a short Form, occasional single-record changes, record navigation, lifecycle decisions or a directory whose main task is opening records.

## Selected interaction model

The governed default is a compact browse grid with one active edit row:

1. Inactive rows stay compact and readable.
2. An explicit edit affordance activates one row; applications may additionally support documented keyboard or double-click entry.
3. The active row exposes its editable fields in place without becoming a nested Card.
4. Confirm and cancel use `EditableGridRowActionGroup`, which composes the governed 24 x 24 transparent `TableActionIconButton` with consumer-supplied icons, non-empty accessible names and Tooltips. Do not replace these with filled square buttons or text buttons.
5. Confirming the active row updates the consumer-owned draft batch. It does not imply server persistence.
6. One page-level save command persists the controlled batch after validation.

## Required visible states

- Active edit row: restrained themed surface plus a slim brand edge; avoid a heavy full-row brand fill.
- Dirty row: show one subtle marker beside its stable line identifier, with an accessible modified label and a visible status summary. Keep the marker out of numeric cells and input fields. Color alone is insufficient.
- Invalid field: `aria-invalid`, a visible error boundary and an associated explanation. The toolbar or header exposes the total issue count and a way to reach errors when practical.
- Selected rows: selection is distinct from the active editing row. Selection drives bulk actions; editing changes field values.
- Saving, saved, empty, loading, disabled and concurrency-conflict states remain explicit.

## Layout contract

- `EditableGrid` provides title, description, status, toolbar, scrollable grid viewport and footer slots.
- The viewport owns horizontal overflow. The application page must not grow wider than its content module.
- Keep the row action cell padded from the right boundary.
- Rows-per-page belongs in the center area of the footer; previous/next use governed icon buttons.
- Freeze identity columns and use a sticky header when the chosen grid implementation supports them.
- For large datasets, consumers own server paging or virtualization and must preserve stable row identity.

## Consumer responsibilities

The adopting application owns columns, units, calculations, lookup values, row identity, validation rules, edit permission, save semantics, optimistic concurrency, conflict recovery, undo/redo history, paging, sorting, filtering, virtualization and API calls. A built consumer must not require GitHub at runtime.

The application must also decide what happens when users change row, filter, page, route or close the browser with an unconfirmed active row or unsaved batch. Those decisions are business and data-integrity rules, not Design System defaults.

## Accessibility and keyboard boundary

- Every editable field requires a row-specific accessible name.
- Confirm and cancel require non-empty labels even though only icons are visible.
- Tab order, arrow-key movement, edit-entry keys and escape behavior must be documented and tested for the selected grid library.
- Focus must remain visible; validation must not move focus without an announced reason.
- Do not rely on hover-only actions or color-only dirty/error indicators.

## Public API

- `EditableGrid`: neutral structural frame; it does not own data or commands.
- `EditableGridRowActionGroup`: governed confirm/cancel icon actions for the single active row.
- Fluent `Table` or `DataGrid`: consumer-composed rows and cells under the above contract.

For an inherently hierarchical collection, [Grouped Table and Grouped Editable Grid](grouped-table.md) adds disclosure-only section rows without changing the leaf-row editing contract.
