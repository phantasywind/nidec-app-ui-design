# Grouped Table and Grouped Editable Grid

Use this pattern when one tabular collection has meaningful parent sections and users need to hide or reveal their descendant rows while retaining the table's columns. The source example was a read-only hierarchical BOM view, but BOM terminology and business structure are not part of the shared API.

## Two presentations, one disclosure contract

- **Grouped Table** composes Fluent `Table`, the governed `RecordTableHeader`, `GroupedTableSectionRow` and ordinary data rows. It is for scanning grouped information without editing.
- **Grouped Editable Grid** uses the same section row inside `EditableGrid`. Group rows only disclose descendants. Leaf rows may carry checkboxes and one active inline editor with `EditableGridRowActionGroup`.
- This is not a record-detail expander: opening a section reveals more rows in the collection, not a Form for the section itself.

The current shared slice supports a top-level section and one indented subsection level. The consumer declares group identity, membership, order, counts and expanded state. Do not treat a section row as a selectable or editable record, or add checkboxes and save actions to its disclosure button.

## State and behavior

1. The disclosure button spans the table width, shows a chevron, label and count, and exposes `aria-expanded`. Enter and Space use the same toggle as pointer activation.
2. Closing a parent hides all descendants; sibling sections remain unchanged. Closing one subsection hides only its own leaf rows. The count remains visible and does not change merely because rows are hidden.
3. Expansion is independent of search, selection, active editing and the draft batch. Closing a group must not discard a draft, deselect hidden rows or suppress validation. Reopening restores the same state.
4. A collapsed group with modified, invalid or actively edited descendants exposes a concise text summary on its section row. Do not communicate these states by color alone. In the preview, search temporarily reveals matching groups without overwriting the stored expansion preferences.
5. The header checkbox's selection scope must be named. The preview selects all filtered leaf rows, including those in collapsed groups; each consumer must document and test its own scope before adoption.
6. Group rows, ordinary data rows and active edit rows must preserve table column alignment. Horizontal overflow stays inside the table/grid viewport, not the page.
7. When the editable variant reserves a leading checkbox column, the read-only variant aligns its Line header and values to the same inset. Group labels use semibold text at both supported depths; the compact brand-colored circular count badge sits at the end of the disclosure row in both variants, after any state summary, and remains visible during horizontal scrolling. The full count remains in the accessible button label.

## Public API

`GroupedTableSectionRow` provides the presentation for one section: `label`, `count`, `columnSpan`, `level`, `expanded`, consumer-supplied chevron `icon`, `onToggle`, and optional text `summary` / accessible `countLabel`. It does not own rows, hierarchy, expansion state or filtering. `level` is currently `0 | 1`; deeper trees require a separate visual and accessibility review.

For frequent batch editing, compose it with `EditableGrid` and the [Editable Grid contract](editable-grid.md). Confirm/cancel remain the governed transparent 24 × 24 icon actions on the active **leaf** row. The application owns editable fields, calculations, validation, persistence, authorization, concurrency, paging and virtualization.

The grouped editable variant inherits the plain grid's final Actions-column contract: its leaf-row action cells remain visible at the right edge during horizontal scrolling. Group rows add disclosure and optional summary only; they do not receive an Actions cell or change the leaf-row edit model.

## Consumer decisions pending

`Business Rule Pending` for each adopting application: whether group counts mean total or filtered rows; which bulk commands may include hidden selected rows; what happens when a user closes a group containing an unconfirmed edit; and how to handle hidden validation issues at save time. The preview demonstrates one reversible local behavior, not an application decision.

## Evidence boundary

The reference CPQ page was quote-controlled and read-only. Browser interaction confirmed the two-level disclosure and unchanged sibling groups, not any CPQ editing or saving behavior. Locke accepted the shared, business-neutral preview on 2026-09-28; that visual decision does not establish CPQ editing behavior or separate consumer acceptance.
