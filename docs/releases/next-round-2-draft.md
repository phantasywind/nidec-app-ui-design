# Next release: second-round feedback (draft)

Status: DRAFT, not released. The editable-grid study ended on 2026-10-26 and its changes are listed below; the version number is set at release. Nothing here is available from GitHub Packages until then.

## Change type

Expected minor: new exports and new props on existing components, plus visual fixes. No export is removed and the exact Fluent, React and date-picker versions are unchanged.

## Fixes

| Component | Change | Application workaround this lets you remove |
| --- | --- | --- |
| Dropdown, Combobox, `SingleSelectDropdown`, `MultiSelectDropdown` | Opening the popup no longer scrolls the page when `html` or `body` is 100% tall. | Local `scrollIntoView` patches or removing `height: 100%`. |
| Same | The control shrinks to its field (`--nidec-ui-select-width`, default 250px, 100% inside `FormGrid`) and the selected text ends in an ellipsis; the arrow stays visible. | Local `min-width: 0` / width overrides on the Fluent root and button. |
| `BusinessProcessFlow` | Stage names break only between words; narrow stages hide the marker so names stay whole. | Local `word-break` or font-size overrides. |
| `Badge` | No wrapping inside the package scope. | Local `white-space: nowrap`. |
| `BusinessDatePicker` | Typed text that cannot be read or is outside min/max sets `aria-invalid` and calls `onInvalidInput` with the text, reason and parsed date. | Local parsing wrappers to detect rejected input. |

## New exports and props

| Export or prop | Replaces in applications |
| --- | --- |
| `TableScrollRegion` `pinnedScrollbar`, `maxHeight`, `frozenColumns` | Local `TableScroll` / `ScrollTable`, sticky header and sticky first-column CSS, grouped-section label overrides. |
| `TruncatedText`, `numericColumnClassName`, `MatrixCellButton` | Local `oneLine` classes, right-aligned number classes, matrix cell buttons. |
| `RecordLink`, `CountBadge`, `ActiveBadge`, `RowEndStatus`, `EmptyState`, `MoreActionsMenu` | Local `RecordLink` / `RecordButtonLink`, count bubbles, Active badges, end-of-row status layouts, empty messages and overflow menus. |
| `Button` `disabledReason`, `disabledReasonDisplay` | Local tooltip wrappers around disabled buttons. |
| `WorkspaceSection` `count`, `countLabel`, `headerContent` | Title-count markup and title-row font-size overrides. |
| `SectionNavigation` item `total`, `countLabel`, `sticky` | Borrowed `ApplicationNavigation` with overridden internal classes. |
| `FormGrid`, `FormGridItem` | Local form grid CSS. |
| `BusinessNumberInput` | `Input type="number"` and local number parsing. |
| `ChangeHistoryTable` | Local history tables. |
| `UnsavedChangesProvider`, `useUnsavedChanges`, `useConfirmDiscard`, `StickySaveBar` | Local `beforeunload` handlers, discard dialogs and sticky save bars. |

## Editable grids (study decided 2026-10-26)

Locke decided on 2026-10-26 that every editable table uses one of two lightweight grids: LiteEditableGrid (cell edit, preferred, for BOM templates and project BOMs) or the new LiteRowEditGrid (row edit, for long uniform data such as component master and cost management). A Fluent Table with Fluent inputs inside `EditableGrid` still works but is no longer recommended.

| Export or prop | Change | Replaces in applications |
| --- | --- | --- |
| New `LiteRowEditGrid` (`onRowChange`, `rowHeight` 32/40/48, `height`, `maxHeight`, `canEditRow`, `onActiveRowChange`) | Row edit: Enter, F2 or a double-click edits the current row; leaving the row or Enter saves it with one `onRowChange`, Esc discards. No actions column. Fixed rows with virtual scrolling for thousands of rows; no groups. The editing row is light green with regular-weight values and an underline on the focused field, without per-cell boxes. | Table rows with Fluent `Input` / `Dropdown` in the active row and their confirm and cancel actions, local row-height and control-size overrides. |
| `LiteEditableGrid` `rowHeight` default **`auto`** (was 32), also 32/40/48; `onActiveRowChange` | **Behaviour change:** without a `rowHeight`, rows now wrap their text and every row is rendered (about 300 rows). **Grids with thousands of rows must pass a fixed `rowHeight`** to keep virtual scrolling. The editor is a white field without a frame, and the edited row turns light green. | Local row-height overrides. |
| Column `editor: 'number'` | Decimal keyboard, end-aligned. | `text` columns with local alignment. |
| `EditableGrid` `title` and `toolbar` optional, `density="compact"`, `maxHeight` | No empty header or toolbar strip; compact frame; sticky header under a capped height that can follow the window. | Empty-title workarounds, CSS hiding the empty toolbar, local sticky-header CSS. |
| `EditableGrid` action column | Only the header cell marked `nidec-ui-editable-grid__action-column` is pinned, no longer whatever header is last. **Applications using a Table must add the class to their Actions `TableHeaderCell`.** The editing-row action cell colour is limited to EditableGrid. | Local overrides that un-pinned the last column. |

A date editor inside the grid comes in a later round.

## What applications should do

- Update the exact pin when the version is released; dependencies are unchanged.
- Pass `rowHeight={32}` to any existing LiteEditableGrid with more than a few hundred rows before updating. Move editable tables to LiteEditableGrid (BOM-type lines) or LiteRowEditGrid (long uniform data) one at a time, and add `nidec-ui-editable-grid__action-column` to the Actions header of any Table kept inside `EditableGrid`.
- Re-inspect Dropdown and Combobox width in forms and toolbars, Business Process Flows at 900px, and tables that use local sticky CSS.
- Remove the local workarounds listed above one at a time, checking the result each time.
