# Next release: second-round feedback (draft)

Status: DRAFT, not released. The version number is set when the editable-grid study ends; Locke decided on 2026-10-26 that the next version waits for it. Nothing here is available from GitHub Packages until then.

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

## Held for the editable-grid study

Not in this release: row height and in-cell controls of `EditableGrid` and `LiteEditableGrid`, their viewport, selection and lock details. Applications keep their current editable-grid workarounds until the study is decided.

## What applications should do

- Update the exact pin when the version is released; dependencies are unchanged.
- Re-inspect Dropdown and Combobox width in forms and toolbars, Business Process Flows at 900px, and tables that use local sticky CSS.
- Remove the local workarounds listed above one at a time, checking the result each time.
