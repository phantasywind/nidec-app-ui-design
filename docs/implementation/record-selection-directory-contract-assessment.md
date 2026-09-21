# Record-selection directory contract assessment

- Date: 2026-09-18
- Status: PROPOSED FOR A FUTURE VERSION / NOT IMPLEMENTED / NOT PUBLISHED
- Source requirement: a consumer Drawer combines an editor Form with a record list whose activation loads the selected record into that same Form
- Published baseline: `@phantasywind/nidec-app-ui-design@0.1.0-rc.2`

## Executive decision

The reported interaction is a distinct **single-record selection** pattern. It is not URL navigation and it is not an independent row command. The shared package should therefore add a governed record-selection DataGrid/directory variant in a future version instead of asking consumers to keep a page-local clickable-row implementation.

The existing navigation contract remains unchanged: a row that opens another page or record route uses one semantic identity `Link`; independent row commands use `TableCellActions`. The proposed selection variant must not contain a duplicate identity Link, `Open` button or Actions column when selection is the only row operation.

This assessment records the reusable contract only. It does not change the public API, package bytes, CPQ source, or the immutable `0.1.0-rc.2` release.

## Why this is not a generic clickable TableRow

A prop such as `clickable`, `onRowClick` or `interactive` would combine several incompatible meanings: navigation, command execution, multi-selection and in-context record loading. It would also permit a mouse-only `<tr onClick>` implementation without a stable selected state or keyboard model.

The future shared contract should express the actual semantics:

- the containing surface is a Fluent `DataGrid`, because the rows are interactive and expose selection state;
- selection mode is fixed to single selection;
- the consumer supplies a stable record ID and controlled selected state;
- activation proposes a selection change only;
- the consumer owns loading the record into the Form and may accept or reject the proposal because of dirty-state, authorization or asynchronous business rules;
- selection never implies navigation, persistence, save, API execution or lifecycle transition.

Plain `Table` remains presentation-oriented. It must not gain hidden row activation or `aria-selected` behavior.

## Proposed public surface

Names remain subject to implementation review, but the next-version slice should be bounded to the following responsibilities.

### `RecordSelectionRegion`

A layout-only composition for a Toolbar followed by the selectable record surface.

- accepts consumer-provided `toolbar` and `children` slots;
- renders no business commands and owns no data;
- applies the Fluent medium vertical spacing token between Toolbar and list/grid;
- introduces no raw application color, route or Drawer dependency.

### `RecordSelectionDataGrid`

A thin governed wrapper over the stable Fluent DataGrid selection API.

- requires a non-empty accessible name;
- requires consumer items, columns and a stable `getRowId`;
- fixes `selectionMode="single"`;
- accepts controlled upstream `selectedItems` and `onSelectionChange` contracts rather than inventing a second application event protocol;
- rejects a controlled set containing more than one selected ID;
- uses a supported composite focus model and the neutral Fluent selection appearance unless browser qualification justifies another supported theme role;
- must not expose props that change it into multi-select, navigation or an application-owned visual skin.

### `RecordSelectionDataGridRow`

A row wrapper used inside the governed grid.

- uses Fluent row selection for pointer activation and Space;
- adds Enter as an equivalent activation path through the same selection mechanism;
- exposes Fluent-generated row and `aria-selected` semantics;
- provides one row focus target and visible focus treatment;
- removes the default visible selection cell when whole-row selection has been qualified as the complete interaction;
- ignores row activation originating from an interactive descendant;
- does not expose a second row-level action callback.

The implementation must use only stable public Fluent exports. In particular, it must not publish or depend on `focusMode="row_unstable"`. If stable Fluent 9.74.7 cannot satisfy the required focus and keyboard contract, implementation stops and records the limitation rather than shipping a partial custom grid.

`RecordIdentityCellLayout` can be reused for the emphasized primary cell with plain text. In this mode its `primary` slot must not contain a Link unless that Link has a separate, genuine navigation purpose; if it does, the row-selection pattern is no longer the sole interaction and requires a new review.

## Visual contract

- Toolbar-to-grid separation uses the shared Fluent medium vertical spacing role.
- Rows use Fluent/theme-owned Hover, Focus, Pressed and Selected states; consumers do not layer legacy row skins over them.
- The selected row uses Fluent's neutral full-row selected state without an additional brand-colored leading bar.
- The primary record field may use the governed primary-cell semibold hierarchy.
- The primary field is plain text: no green link color, underline or pointer-only link affordance.
- Each row presents that one primary field only; supporting fields are not stacked beneath it in this compact selection directory.
- The row may use a pointer cursor only because the complete row is the declared selection target.
- No redundant `Open`, `Select` or Actions control is rendered when selection is the only operation.
- Header hierarchy continues to use `RecordDataGridHeader`.

## Accessibility and interaction contract

The future qualification must prove all of the following against the exact packed artifact:

1. Pointer, Enter and Space propose the same record ID through one callback path.
2. Space prevents page scrolling when it activates a focused row.
3. `aria-selected` follows the consumer-controlled selected set, including when the consumer rejects a proposed change.
4. A stable record ID, not an array index, survives sorting and filtering.
5. Focus remains visible and predictable after selection and after the upper Form rerenders.
6. Interactive descendants do not also trigger row selection. The intended first slice contains no such descendants.
7. There is no duplicate Link, hidden navigation target or redundant action button.
8. Screen-reader structure identifies the grid, headers, rows and selected state.
9. Selected, hover and focus states remain discernible in forced-colors/high-contrast checks and do not rely on color alone.
10. Actual 1440, 1280, 900 and 720 viewport checks cover bounded overflow and Drawer geometry.

Automatic scanning is supplemental evidence and does not by itself establish application acceptance.

## Consumer-owned behavior

The adopting application continues to own:

- selected record authority and initial selection;
- Form population and draft preservation;
- dirty-change confirmation or refusal to switch records;
- loading, empty, error and retry states;
- authorization, API requests, concurrency and persistence;
- sorting, filtering, pagination and virtualization;
- Drawer open/close behavior and focus restoration;
- business validation and independent application acceptance.

The shared callback reports selection intent; it does not load, save or mutate a business record.

## Technical integration Code

Whether a technical integration Code is visible is a content/form governance decision, not a Table or record-selection API.

Recommended default:

- the system owns and maintains the Code;
- ordinary business users do not receive an editable Code field by default;
- if operational visibility is explicitly required, show it as read-only secondary metadata or in an authorized diagnostics/administration section;
- do not make the Code the record-selection key merely because it is visible; selection uses the application's stable record ID;
- exact visibility, role access and support workflow remain `Business Rule Pending` for the owning application.

## Implementation and release gates

Before adding the public API:

1. create a business-neutral fixture with an editor region above the selectable grid;
2. add public type/negative tests that prevent multi-select, unstable focus props, duplicate callbacks and consumer appearance overrides;
3. add interaction tests for pointer, Enter, Space, rejected controlled selection and focus retention;
4. qualify actual host CSS, exact viewports, keyboard, accessibility, CSP and packed-consumer behavior;
5. document migration from an application-local adapter;
6. publish only as a new immutable version after the normal qualification and explicit release authorization.

The CPQ local adaptation is useful consumer evidence, but its tests do not qualify the future shared component and must not be copied into the package with CPQ business names or behavior.
