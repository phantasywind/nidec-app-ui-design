# Editable Grid

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

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
- Place Actions in the final table column and mark each leaf-row action `TableCell` with `nidec-ui-editable-grid__action-column`. The shared style keeps that cell and the final header cell visible at the viewport's right edge during horizontal scrolling, with themed opaque surfaces and right padding. This applies equally to plain and grouped Editable Grid; a group disclosure row spans columns and must not be treated as an action cell.
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

## Lightweight grid for long collections

`LiteEditableGrid` (unpublished, 2026-10-13) is the lightweight body for the same frame when a collection is long. It renders cells as plain text, keeps only the rows in view (plus a small overscan) in the DOM, and mounts one native editor for the cell being edited. Columns choose a dedicated editor: `text`, `longText` (multi-line panel over the cell), `select` (fixed list), `combobox` (filtered list, freeform by default), `multiselect` (checklist; values shown as tags with a remove mark) or `none` (read-only: normal background with a trailing lock mark; Locke, 2026-10-13, grid only). Rows have one fixed 32px height.

Use it inside `EditableGrid` instead of a Table with per-row Fluent inputs when the collection has hundreds or thousands of rows. Keep the Table model for short collections that need badges, icons or row actions inside cells. It has no sorting, grouping, column resizing or multi-cell selection; IME input starts after Enter, F2 or a double-click. The consumer still owns rows, `onCellChange`, validation rules, parsing, persistence and save.

Measured in Chromium (cloud container) for 2,000 rows by 5 columns: LiteEditableGrid mounts in about 17 ms with 154 elements, a Fluent Table with plain text cells in about 450 ms with 12,003 elements, and a Fluent Table with an Input in every cell in about 1.9 s with 32,003 elements. Scrolling the 20,000-row preview 20 rows per frame keeps a median frame of 16.7 ms (p95 19.1 ms) with 35 rows in the DOM.
