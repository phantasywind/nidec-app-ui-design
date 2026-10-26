# Editable Grid

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

`EditableGrid` is the governed high-density editing pattern for line collections that are large and changed repeatedly. Typical consumer-owned examples include BOM lines, quote lines, allocation lines and similar tabular work. The shared pattern does not define any of those business records.

## Use when

- The primary task is scanning and changing many peer rows in one working session.
- Users benefit from keyboard movement, compact rows, multi-selection and batch commands.
- Several changes should be reviewed and validated before one controlled save.
- Opening a separate Form or Sheet for every row would make the task materially slower.

### What counts as an editable grid (Locke, 2026-10-26)

A table is an editable grid only when its cells take **typed or chosen input**: text, numbers, a choice from a list, a date. Tables whose cells are only clicked stay a plain `Table` / `DataGrid` with standard controls and are not covered by this page or by LiteEditableGrid:

- **Field matrix** (each cell a toggle): `Table` with a `Switch` or `Checkbox` per cell, inside `TableScrollRegion`.
- **Selection matrix** (each cell a button or link that opens a drawer): `Table` with `MatrixCellButton` or `RecordLink` per cell, editing in `FormDrawer`. See [table viewport](table-viewport.md).

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

- `EditableGrid` provides title, description, status, toolbar, scrollable grid viewport and footer slots. `title` and `toolbar` are optional: leave `title` out when the page already names the grid (the header is then drawn only for `status`), and leave `toolbar` out for no toolbar strip at all. `density="compact"` tightens the header, toolbar and footer for a grid inside a form or drawer.
- `maxHeight` (px or a CSS length such as `calc(100vh - 320px)`) caps the viewport so the rows scroll under a sticky column header; use a `calc()` against the window height to let the grid follow the window.
- The viewport owns horizontal overflow. The application page must not grow wider than its content module.
- Place Actions in the final table column and mark both the Actions `TableHeaderCell` and each leaf-row action `TableCell` with `nidec-ui-editable-grid__action-column`. Only the marked column is pinned (2026-10-26; before, the final header cell was pinned whatever it held). The shared style keeps that header and its cells visible at the viewport's right edge during horizontal scrolling, with themed opaque surfaces and right padding. This applies equally to plain and grouped Editable Grid; a group disclosure row spans columns and must not be treated as an action cell.
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
- `LiteEditableGrid` with `editMode="row"`: the recommended body (see below).
- Fluent `Table` or `DataGrid` with Fluent inputs in the active row: still supported, **not recommended** for new grids (Locke, 2026-10-26). Fixed-size Fluent controls do not follow the row height, the text shifts and shrinks when a row starts editing, and an auto-height row collapses to the control's height.

For an inherently hierarchical collection, [Grouped Table and Grouped Editable Grid](grouped-table.md) adds disclosure-only section rows without changing the leaf-row editing contract.

## Lightweight grid (recommended body)

`LiteEditableGrid` is the body of every editable table (decision, Locke, 2026-10-26). Cells are plain text and the cell draws its own editor, so the editor always matches the row height and the text does not move when a row starts editing. It has two edit modes.

### Which mode (Locke, 2026-10-26)

- **Row edit** (`editMode="row"`): each row is one complete record that is checked and confirmed as a whole, often with row actions such as delete or more, up to about 300 rows. Examples: quote lines, BOM lines of one document.
- **Cell edit** (`editMode="cell"`): fast bulk entry or maintenance of values that stand on their own; each cell takes effect when it is confirmed and the keyboard drives the work. Any volume with fixed rows. Examples: price lists, parameter tables.

| | `editMode="row"` | `editMode="cell"` (default) |
| --- | --- | --- |
| Model | One row edits at a time; the edit action or a double-click starts it, Enter or the check confirms the whole row, Esc or the cross cancels | Spreadsheet: arrow keys move an active cell, Enter, F2, double-click or typing edits one cell |
| Callback | `onRowChange({ rowId, rowIndex, row, values, changes })`, once per confirmed row with at least one change | `onCellChange` per cell |
| Row height | `rowHeight` 32, 40 (default), 48 or `auto` | `rowHeight` 32 (default), 40, 48 or `auto` |
| Rendering | Every row is rendered; keep it to about 300 rows | Fixed rows: only the rows in view (virtual scrolling), thousands of rows. `auto`: every row is rendered, about 300 rows |
| Height | Grows with its rows; `maxHeight` caps it under a sticky header, `height` fixes it | `height`, default `28rem` |

Row mode look (Locke, 2026-10-26): no per-cell boxes, fills or frames. The editing row keeps the light green row background and the brand left edge; its editable values turn semibold (neutral text; the green text was dropped on Locke's review); the focused field gets a 2px brand underline; a list field shows a chevron. A value that fails `validate` turns red with a red underline and disables the check until fixed. Read-only cells show the lock only on the editing row, with its space reserved in every row so numbers stay aligned. Unconfirmed changes keep their row in edit: starting another row returns focus to the open row.

Cell mode look (Locke, 2026-10-26, chosen in the comparison prototype): the editor draws no frame. With fixed rows it is a white field over the cell with a 2px brand underline ("no frame, focus only"); with `auto` rows it is a white field without a frame drawn inside the cell, its text at the top where the cell text was, and long text wraps in place so the row grows while typing ("white fill, no frame"). The row of the cell being edited turns light green and carries the brand edge.

Row mode extras: `editingRowId` with `onEditingRowChange` (controlled), `canEditRow(row)` returning `false` or a reason shown on the disabled edit action, `renderRowActions(row)` for more display-only actions before the edit action, `actionsHeader` and `formatRowActionLabel` for the actions column.

Editors per column: `text`, `number` (decimal keyboard, end-aligned by default; parsing stays with the application), `longText`, `select`, `combobox`, `multiselect`, `none` (read-only). Editable cells use only these editors; badges, links and row-end actions are display-only. A date editor is deferred to a later round.

Grouping (`getRowGroup`, one or two levels) works in both modes. In cell mode the layout is computed once per change of `rows`, `getRowGroup` or the collapsed set, so keep `getRowGroup` stable; with thousands of rows the cost is one pass over the rows, not one per scroll frame. In cell mode the `data-row` attribute on a row is its display position (after grouping and collapsing), not the index in `rows`; use `getRowId` for identity.

Neither mode has sorting, column resizing or multi-cell selection. In cell mode IME input starts after Enter, F2 or a double-click; in row mode fields are ordinary inputs and IME works directly. The consumer still owns rows, validation rules, parsing, persistence and save.

Cell mode performance, measured in Chromium (cloud container) for 2,000 rows by 5 columns: LiteEditableGrid mounts in about 17 ms with 154 elements, a Fluent Table with plain text cells in about 450 ms with 12,003 elements, and a Fluent Table with an Input in every cell in about 1.9 s with 32,003 elements. Scrolling the 20,000-row preview 20 rows per frame keeps a median frame of 16.7 ms (p95 19.1 ms) with 35 rows in the DOM.
