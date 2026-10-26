# Directory and work-queue layout

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

Status: SHARED MAINLINE GOVERNANCE / NOT YET PUBLISHED OR ADOPTED

## Purpose

This layout governs pages whose primary task is finding independent records or processing a bounded queue. It standardizes region order and entry semantics without owning queries, record routes, assignments, service calls or workflow commands.

## Required regions

1. `PageHeader` identifies the collection and contains at most one visually primary page action.
2. An optional scope region changes the declared collection or queue, not an unrelated application state.
3. A Toolbar contains search, filters, sorting, refresh and an optional governed List/Card view switch.
4. One results region contains a Data Table, Card Gallery or an explicit loading, empty or error state.
5. Pagination or incremental-loading controls follow the results they govern.
6. An optional contextual Sheet may show concise detail or a bounded create/edit task while retaining the directory context.

Do not insert unrelated summary Cards between the Toolbar and its results.

## Directory interaction contract

- A Data Table declares one semantic record-identity Link in its primary column. Ordinary fields, status, metadata and row actions remain separate columns.
- The row itself is not a hidden navigation target. Clicking ordinary cells must not open the record.
- A Card Gallery record with one destination uses the entire Card as the single entry target. Do not retain an inner green title Link for the same destination.
- Navigation-type Cards use real link semantics. Command-type Cards use button semantics and support pointer, Enter and Space activation.
- Initial whole-card entries contain no nested links or buttons. When a record requires multiple direct operations, use a non-whole-card presentation with explicit actions or an overflow Menu.
- Direct row commands use governed icon-only action buttons. Multiple or low-frequency commands collapse into a labelled overflow Menu (`MoreActionsMenu`).
- Each row has exactly one entry: the identity `RecordLink` in the primary column. Do not add a second Open button, a clickable status or a linked secondary field for the same record.
- The default order is the one users scan by (usually identity or most recent change), stated in the column header's sort indicator; pages hold 25 rows by default with `Pagination` below the results.
- Boolean fields edited in place use `Switch`; Active / Inactive shown read-only uses `ActiveBadge`.
- Controls edited inside a row use the small size and share one height (Input, Dropdown, Combobox, SpinButton, date and number fields are all 24px), so a row does not change height when one cell enters editing. Editable grids follow their own contract, under separate review.

## Work-queue distinction

A work queue is not merely a Directory with different wording.

- Scope communicates an assignment, pending state or exception set owned by the consumer.
- Status and next-action information may be more prominent than general metadata.
- Opening the work item and executing a command remain distinct interactions.
- The shared layout does not infer ownership, urgency, SLA, approval authority or lifecycle transition.

If the page only catalogs independent records, use the Directory contract and omit queue-specific semantics.

## List/Card view switching

- Use `ViewModeToggle` only when Table/List and Card presentations expose the same collection and record identities.
- Changing presentation must not reset search text, filters, sorting, pagination, selection, loaded data or errors.
- Table and Card views must expose equivalent destinations and command availability even when metadata is arranged differently.
- A consumer must not use the switch to alternate between different business datasets or workflows.

## Layout and surfaces

- Place page header and results in discrete white modules separated by governed vertical spacing.
- A results module establishes the boundary. Cards inside it remain flat, without a second border or shadow.
- A standalone Card may establish its own boundary only when no surrounding module provides one.
- Keep horizontal Table overflow inside the results region.
- Avoid a gray page canvas, heavy elevation and nested decorative Cards.

## States and accessibility

- Search controls require a visible or accessible label. Debouncing, request cancellation and query semantics remain consumer-owned.
- Loading must identify the affected results region and must not erase the user's query controls.
- Empty states explain that no result is available for the current scope and offer only consumer-approved recovery actions.
- Failure states preserve the query context and expose a clear retry when retry is valid.
- The current page, sort and filters remain perceivable without relying only on color.
- Preserve one page `h1`, ordered section headings, labelled results and visible focus.

## Responsive behavior

- At wide widths, the Toolbar may share one row while retaining readable groups and a clear gap before the view switch or page actions.
- At compact widths, Toolbar groups wrap without changing their meaning or order.
- At narrow widths, Card or bounded horizontal Table presentation may be selected by the consumer, but responsive layout must not silently alter the chosen mode or dataset.
- A contextual Sheet follows its own focus, Escape and focus-return contract.

Validate 1440, 1280, 900 and 720 CSS-pixel viewports with realistic long content.

## Consumer responsibilities

The consumer owns collection definition, route destinations, query encoding, filtering, sorting, pagination, virtualization, selection, Sheet content, permissions, commands, loading, errors and record authority.

The consumer must not copy a reference application's entity names, scopes, statuses, page-size rules or API behavior into the shared layout.

## Application-specific exclusions

Quotation lifecycles, approval queues, pricing review, configuration search, revision management and other domain-specific collection semantics are not shared. They may consume this layout only when their interaction still satisfies the Directory or work-queue contract.
