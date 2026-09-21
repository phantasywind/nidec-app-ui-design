# Record Management Workspace Governance

Status: SHARED MAINLINE CONTRACT / NOT YET PUBLISHED OR ADOPTED

## Purpose

This contract governs reusable record-management pages that combine a page header, one primary work area, an optional contextual record selector or summary rail, and a Data List. It standardizes information hierarchy and placement without importing an application's routing, API, lifecycle, authorization, selection, persistence or business state.

The application shell remains application-owned. Global navigation, environment indicators, account controls and sign-out do not belong to this composition.

## Required page hierarchy

1. Use one `PageHeader` as the page identity. It contains one `h1`, an optional short purpose statement and an optional action area.
2. Use one `RecordManagementWorkspace` for the primary record-management region. Supply a non-empty accessible name.
3. Use `WorkspaceSection` for each meaningful region inside the primary area. A section may contain status, metadata, tabs, a local Toolbar and a Data List, but it is not automatically a Card.
4. Add a context rail only when its content selects, summarizes or directly supports the record shown in the primary area.

Do not reproduce the application title in multiple visible heading levels. Breadcrumbs describe location; the page title identifies the current page; section titles identify local content.

## Page-header actions

- Keep at most one visually primary page action. Place it last in reading order so it appears at the far end of the action group on wide layouts.
- Place secondary actions before the primary action. Move low-frequency commands into a labelled overflow Menu.
- Actions must remain explicit Fluent controls. Do not make the header or its surrounding Card clickable.
- At narrow widths, actions wrap below the title and remain in DOM order.

The consumer owns command availability, confirmation, RBAC, effects and errors.

## Primary content and surface use

- The primary work area is the page's dominant region and receives the flexible width.
- Do not wrap the entire page or every section in nested Cards. Spacing, headings and neutral dividers establish page hierarchy.
- Use a Card only when the content represents an independently identifiable, selectable or actionable object, or when it must be visually separable from adjacent objects.
- Status, version, metadata, Tabs and local actions should appear in the same section as the content they govern.

## Data List placement

- Put a Data List after its local section title, short explanation and Toolbar. Do not place unrelated page commands inside the table.
- Apply the existing record-entry contract: `RecordTableHeader` or `RecordDataGridHeader`, one semantic identity `Link` for navigation, and `TableActionIconButton` plus Tooltip for direct row actions.
- Keep columns, sorting, selection, pagination, virtualization, loading and business meaning application-owned.
- Constrain horizontal overflow to the Data List region. A wide table must not increase the page or workspace width.
- A same-surface editor/directory uses the separate controlled `RecordSelectionRegion` and `RecordSelectionDataGrid` contract.

## Context rail and Card placement

Use the context rail when a compact collection controls or explains the primary work area, for example selecting which record is displayed or showing the current record's concise status summary.

- The rail is on the visual right at widths above 900 CSS pixels and is limited to a useful supporting width. The primary region remains flexible.
- The rail precedes the primary region in DOM order. At 900 CSS pixels and below it moves above the primary region, preserving a logical reading and keyboard order.
- Give the rail a visible title inside its content and a non-empty `contextRailLabel` on the workspace.
- Cards in the rail must represent distinct objects or summaries. Do not use decorative Cards merely to create borders.
- Use `CollectionList` for a compact semantic list. Use `CardGallery` only for peer Cards in the primary content area; it is not the one-column context-rail selector.
- Do not put unrelated dashboards, long forms, full Data Lists or duplicate page actions in the rail.

The consumer owns which record is selected, whether a proposed selection can replace dirty work, and how content is loaded.

## Responsive and accessibility requirements

- Validate the complete page at actual 1440, 1280, 900 and 720 CSS-pixel viewports.
- At 900 and below, the context rail becomes one full-width row before the primary content.
- At 720 and below, page and section actions wrap below their headings and align to the reading start.
- Preserve one `h1`, ordered section headings, visible focus, logical Tab order and labelled regions.
- A layout reflow must not change application state, duplicate controls or hide the current selection.

## Consumer example

```tsx
<RecordManagementWorkspace
  aria-label="Record management"
  header={
    <PageHeader
      title="Records"
      description="Maintain governed records."
      actions={<><Button>Secondary action</Button><Button appearance="primary">New record</Button></>}
    />
  }
  contextRailLabel="Available records"
  contextRail={<YourRecordSelector />}
  primary={
    <WorkspaceSection
      title="Current record"
      description="Review the selected record and its governed data."
      actions={<YourLocalToolbar />}
    >
      <YourDataList />
    </WorkspaceSection>
  }
/>
```

The example names are illustrative. Applications must not infer routes, states, commands or lifecycle behavior from this document.
