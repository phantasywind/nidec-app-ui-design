# Master-data and Form + List layout

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

Status: SHARED MAINLINE GOVERNANCE / NOT YET PUBLISHED OR ADOPTED

## Purpose

This layout governs a page where selecting one record loads or proposes loading that record into an editor on the same surface. It is intended for bounded master-data maintenance and similar administration tasks. It is not a navigation Directory.

## Required regions

1. `PageHeader` identifies the maintained record class and contains page-level actions only.
2. A Form region identifies the current record, its editable fields, validation and explicit save/cancel behavior.
3. A local Toolbar contains list search, filtering, refresh or an approved create action.
4. `RecordSelectionRegion` contains one `RecordSelectionDataGrid` or equivalent governed single-selection surface.
5. Loading, empty, error, dirty-state and save feedback remain associated with the region they affect.

The Form and list may be arranged vertically or as a bounded responsive workspace, but they must remain part of one clear maintenance task.

## Selection interaction contract

- The entire record row is the single selection target.
- Pointer, Enter and Space propose the same stable record identity through one controlled selection path.
- The primary record value is plain text, not a green navigation Link.
- Do not add a redundant Open, Select or Actions control when selection is the row's only operation.
- Do not stack a second descriptive field beneath the primary value in the compact selection list. Supporting values use their own columns when required.
- The selected row uses a neutral governed state without a brand-colored leading bar or application-local highlight skin.
- Interactive descendants are excluded from the initial selection-only row contract.

Selection proposes a change; it does not imply navigation, persistence or permission. The consumer may accept or reject the proposal when unsaved work, authorization or asynchronous loading requires it.

## Form interaction contract

- The Form declares the current record separately from the selection surface.
- Save, discard, validation and concurrency behavior stay explicit and consumer-owned.
- Switching records must not silently discard dirty work.
- Field order, required rules, data types and domain validation are not inferred by the layout.
- Create mode must be explicit; an empty selected set must not silently mean New Record unless the consumer declares that state.

## Layout and surfaces

- Use white bounded modules with governed padding and spacing.
- Avoid decorative Cards around every field group. Use headings and spacing to create form hierarchy.
- Keep the list header, Toolbar and rows aligned as one region.
- Constrain list overflow within its region.
- Do not duplicate the current record as a decorative Card merely to establish another border.

## Responsive behavior

- Preserve a logical order: page identity, editor, then selection list unless an approved workflow requires selection first.
- When columns collapse, maintain the same current record and dirty state.
- Actions wrap below their headings at narrow widths and remain in DOM order.
- Focus remains predictable after a selection proposal, accepted load, rejected load or editor rerender.

Validate 1440, 1280, 900 and 720 CSS-pixel viewports, including a long primary value and visible validation feedback.

## Accessibility contract

- The selection surface exposes a labelled grid, row structure and controlled `aria-selected` state.
- One row focus target supports the governed keyboard model.
- Space activation prevents page scrolling.
- The editor exposes associated labels, descriptions and errors.
- Save feedback and record-loading errors are announced without moving focus unexpectedly.

## Consumer responsibilities

The consumer owns stable IDs, selected-record authority, Form population, dirty-state decisions, validation, save/discard, API calls, permissions, concurrency, filtering, sorting, pagination and error recovery.

The consumer must not reinterpret row selection as navigation, introduce a duplicate identity Link, or copy another application's master-data fields and administration rules.

## Application-specific exclusions

Engineering configuration builders, calculation-rule editors, pricing matrices, bill-of-material editors and other domain authoring surfaces are not automatically master-data templates. They may reuse the selection or Form compositions only if the same-surface single-record maintenance contract genuinely applies.
