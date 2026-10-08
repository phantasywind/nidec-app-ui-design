# Versioned governance workspace layout

使用前请结合[组件目录与样例选择](component-catalog.md)和[应用接入与原 UI 替换要求](consumer-ui-adoption.md)。共享布局的字体、按钮尺寸、模块边界不能叠加原应用旧皮肤；本地预览中的候选调整不代表已发布版本发生变化。

Status: SHARED MAINLINE GOVERNANCE / NOT YET PUBLISHED OR ADOPTED

## Purpose

This layout governs a page where one stable object remains authoritative while users inspect or act on a governed version, revision or state. It standardizes information hierarchy and command placement without defining a lifecycle, approval model, publication algorithm or domain state machine.

## Required regions

1. `PageHeader` identifies the stable object and provides a concise purpose statement.
2. An identity/status region distinguishes stable object identity from current governed version or state.
3. A controlled command region contains explicit validation, review, advance or history actions supplied by the consumer.
4. Local navigation organizes content belonging to the same object and governed context.
5. One or more `WorkspaceSection` regions contain facts, Forms, Data Lists or evidence.
6. An optional context rail selects or summarizes peer records only when it directly supports the primary workspace.

Do not merge stable object identity, editable version identity and current status into one ambiguous title.

## Information hierarchy

- The page `h1` identifies the stable object or workspace.
- Version, revision, effective window and status appear as labelled facts in the same module as the controls they govern.
- Use status badges for concise state recognition; do not use color alone or invent cross-application state meanings.
- Local Tabs switch peer content for the same authority. They do not represent a lifecycle transition.
- `StageNavigator` is allowed only when users may directly select peer working stages.
- A business process indicator follows consumer-controlled progression. Reached stages may be selected to inspect their content, while upcoming stages remain non-interactive; viewing never changes the authoritative process stage and is not a substitute for Tabs.

## Command contract

- Keep at most one visually primary command within a command group.
- Place related secondary commands before the primary command and low-frequency commands in a labelled Menu.
- Disabled commands require consumer-owned reasons that can be communicated accessibly.
- A command must not become enabled solely because the layout displays a particular state.
- The shared layout never performs validation, publication, approval, rollback or version creation.

## Data List and context placement

- Put a governed Data List after its local heading, explanation and Toolbar.
- Independent records use one primary identity Link; same-surface selection uses the separate row-selection contract.
- Use a right context rail only for concise selection or summary that directly controls or explains the primary region.
- At 900 CSS pixels and below, the context rail moves above the primary region while preserving DOM and keyboard order.
- Do not put unrelated dashboards, long Forms or duplicate page commands in the rail.

## Layout and surfaces

- Use one white bounded module for each meaningful authority or content region.
- Keep status, version facts, local navigation and commands close to the content they govern.
- Avoid a gray canvas, heavy elevation and decorative nested Cards.
- A Card within a bounded module stays flat unless it is an independently identifiable object and no duplicate boundary is introduced.
- Domain complexity must not be hidden by adding more visual containers.

## States and accessibility

- Loading, unavailable and stale-version states identify the affected authority and preserve stable object context.
- Validation errors remain associated with their fields or governed section; an aggregate summary may link to those errors.
- Concurrent-change handling and recovery are consumer-owned and must not be represented as an ordinary success state.
- Preserve one `h1`, ordered headings, labelled regions, visible focus and logical reading order.
- Version and status facts require textual labels and values rather than color-only encoding.

Validate actual 1440, 1280, 900 and 720 CSS-pixel viewports, including long version identifiers and wrapped commands.

## Consumer responsibilities

The consumer owns stable-object and version identity, allowed transitions, command availability, RBAC, approval, validation, persistence, concurrency, effective dating, audit evidence, loading and failure recovery.

The consumer must not infer a lifecycle from the template, copy state names from a reference consumer, or place domain workflow code in the shared layout.

## Application-specific exclusions

Product-platform governance, quotation revisions, pricing publication, bill-of-material release, calculation-book rules and other domain processes are not shared contracts. A consumer may use this layout when it has the same stable-object/version relationship, but its states, roles, commands, evidence and transition rules remain entirely application-owned.
