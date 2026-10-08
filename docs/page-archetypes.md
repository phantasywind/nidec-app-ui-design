# Shared page archetypes and template selection

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

Status: SHARED MAINLINE GOVERNANCE / NOT YET PUBLISHED OR ADOPTED

## Purpose

This document classifies reusable application pages by user purpose and interaction model. It prevents a consumer from choosing a layout only because another page looks similar, and prevents a domain-specific application screen from becoming a shared template.

The Design System owns reusable page hierarchy, layout, presentation and interaction boundaries. Each application owns its routes, data, permissions, state, commands, validation, persistence and acceptance.

## Classification matrix

| Archetype | Purpose and primary task | Required regions | Entry and interaction model | Use when | Do not use when |
| --- | --- | --- | --- | --- | --- |
| Authentication entry | Establish or restore an authenticated session | Brand, one page heading, concise instruction, authentication Form, error/status region, optional assistance | Submit one authentication intent; identity provider, session and redirect remain consumer-owned | A user must authenticate before entering the application | The task is account administration, profile editing or application navigation |
| Directory | Find, compare and open independent records | Page header, optional scope, search/filter/sort Toolbar, results, optional view switch, pagination or loading state | Table uses one identity Link; Card view uses one whole-card entry target | Records have their own destination or contextual detail surface | Selecting a row only updates an editor already on the same page |
| Work queue | Review a bounded set of tasks and take explicit commands | Page header, scope or queue status, filter/sort Toolbar, results, status and row commands | Identity navigation remains separate from explicit commands; low-frequency commands use a Menu | Users process assigned, pending or exception work | The page is a general record catalogue without queue meaning |
| Record workspace | Understand and work on one stable record | Record identity header, status/metadata, page actions, local navigation, content sections, optional context rail | Local Tabs or a selectable Stage Navigator organize peer views; commands stay explicit | One record remains the page authority while its sections change | The user is primarily searching across many records |
| Master data / Form + List | Select one record and edit it on the same surface | Page header, editor Form, local Toolbar, single-selection list/grid, loading/error region | Whole-row selection loads or proposes the record; it is not navigation and has no duplicate Open action | Selection and editing are intentionally co-located | Selecting a record should open a separate route or Sheet |
| Versioned governance workspace | Manage one stable object whose governed versions or states change | Stable identity, current status/version facts, controlled commands, local navigation, governed content, optional history or selector | Commands are explicit and availability is consumer-owned; version identity is never inferred by layout | Users review, validate or advance governed revisions while preserving object identity | The object has no meaningful version/state authority or the page is only a simple editor |
| Dashboard / overview | Summarize several concerns and route users to detail | Page identity, clearly labelled summary regions and destination links | Summary content is read-oriented; each destination remains explicit | Repeated cross-application evidence establishes a stable shared information hierarchy | A collection, record workspace or work queue would state the primary task more clearly |

Dashboard/overview is a documented archetype only. It is not part of the first public page-layout API.

## Template selection decision table

Apply the first matching rule:

| Decision | Select |
| --- | --- |
| Is the user establishing an application session? | Authentication entry |
| Is the primary task finding an independent record that opens elsewhere? | Directory |
| Is the primary task processing assigned, pending or exception work? | Work queue |
| Does one record remain authoritative while the user moves among its sections? | Record workspace |
| Does selecting a row load an editor that remains on the same page? | Master data / Form + List |
| Does one stable object expose an authoritative current version/state and controlled advancement commands? | Versioned governance workspace |
| Is the page only a summary across several concerns with no stronger primary task? | Dashboard / overview, after separate review |
| Does none of the above describe the page without domain terminology? | Treat it as application-specific; compose shared elements without creating a shared page template |

Visual resemblance does not override the decision table. For example, both a Directory and a Form + List page may contain a table, but their row semantics are different.

## Shared interaction assignments

- An independent table record opens through one semantic identity Link in its primary column. The row is not a hidden navigation target.
- An independent card with one destination uses one whole-card link or button target. It does not repeat that target as an inner title Link.
- A same-surface editor uses controlled whole-row selection. The primary value is plain text, and the row has no redundant Open or Select control.
- Direct row commands use an icon-only action with an accessible name and Tooltip. Multiple or low-frequency commands use an overflow Menu.
- `StageNavigator` is for directly selectable peer workspaces, including preparation ahead of a workflow. A business process indicator reflects application-controlled progression; it may navigate only to reached stage content, never to future stages or directly change process state.
- Switching List and Card presentation does not reset query, filtering, sorting, pagination, selection or loaded data.

## Shared versus consumer responsibility

The shared package governs:

- region order, spacing, responsive relationships and accessible landmarks;
- the correct shared elements and interaction pattern for each archetype;
- neutral visual hierarchy, module boundaries and state presentation;
- public layout slots that accept consumer content without owning that content.

The consumer governs:

- route and record destination;
- domain labels, fields, data, commands and business validation;
- identity, permissions, lifecycle, concurrency and persistence;
- loading, empty, failure and authorization outcomes;
- independent application acceptance and deployment.

## Domain-specific exclusions

Do not promote an entire screen into the shared system when its purpose depends on a consumer-specific configuration builder, quotation lifecycle, pricing, revision process, bill of materials, calculation rule editor, cost management workflow, role model, API contract or state machine.

Such screens may compose the shared application frame, sections, navigation, Data Lists, Forms and action patterns. Their domain workflow, field meanings and command sequence remain application-owned. Reference consumers provide evidence; they do not define the permanent consumer boundary.

## Evidence rule

Source-code repetition, placement in primary navigation and plausible cross-application reuse may establish a common candidate. Without product analytics, the Design System must not describe that candidate as empirically frequent. A representative running page verifies computed layout and interaction, but a legacy or conflicting presentation is not automatically promoted into governance.
