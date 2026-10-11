export type CatalogEntry = { id: string; group: string; title: string; components: string; use: string; guidance: string; demo: string; related: string };
export const groups = ['Forms', 'Page building blocks', 'Specialized components', 'Examples'] as const;
export const catalog: CatalogEntry[] = [
  {
    "id": "text",
    "group": "Forms",
    "title": "Text inputs and fields",
    "components": "Input · Textarea · Field",
    "use": "Names, identifiers, descriptions and field validation",
    "guidance": "Use Textarea for long notes; keep labels, hints and errors in Field.",
    "demo": "Text input",
    "related": "form"
  },
  {
    "id": "date",
    "group": "Forms",
    "title": "Date selection",
    "components": "DatePicker",
    "use": "Date-only input, allowed ranges and disabled dates",
    "guidance": "The application owns date meaning, timezone, format and allowed range.",
    "demo": "Date selection",
    "related": "form"
  },
  {
    "id": "choice",
    "group": "Forms",
    "title": "Choices and switches",
    "components": "RadioGroup · Checkbox · Switch",
    "use": "Exclusive choices, multiple selections and immediate toggles",
    "guidance": "Use Radio for exclusive choices, Checkbox for selection and Switch for immediate binary settings.",
    "demo": "Choice controls",
    "related": "form"
  },
  {
    "id": "select",
    "group": "Forms",
    "title": "Dropdown and searchable selection",
    "components": "Dropdown · MultiSelectDropdown · Combobox · Option",
    "use": "Choose from fixed or larger option sets",
    "guidance": "Use Dropdown for fixed choices, MultiSelectDropdown for several fixed choices and Combobox for searchable matching.",
    "demo": "select",
    "related": "form"
  },
  {
    "id": "number",
    "group": "Forms",
    "title": "Numbers and sliders",
    "components": "SpinButton · Slider",
    "use": "Precise quantities or bounded continuous adjustments",
    "guidance": "Use SpinButton for exact values and Slider for estimates; units and precision are application-owned.",
    "demo": "number",
    "related": "form"
  },
  {
    "id": "actions",
    "group": "Forms",
    "title": "Buttons and icon actions",
    "components": "Button · IconButton · TableActionIconButton · Menu",
    "use": "Primary, secondary, row and overflow actions",
    "guidance": "Use Link for navigation; icon buttons need accessible names and Tooltips.",
    "demo": "Actions and disclosure",
    "related": "directory"
  },
  {
    "id": "modes",
    "group": "Forms",
    "title": "Segmented and inline modes",
    "components": "SegmentedControl · InlineModeTabs",
    "use": "Peer modes and local input-source switching",
    "guidance": "Use inline modes for local editors and Tabs for content navigation.",
    "demo": "Compact selection",
    "related": "form"
  },
  {
    "id": "feedback",
    "group": "Forms",
    "title": "Feedback and status",
    "components": "MessageBar · Badge · Tag · Spinner · Skeleton",
    "use": "Status, contextual feedback, loading and progress",
    "guidance": "Keep errors near their cause; badges are not buttons; preserve layout while loading.",
    "demo": "Feedback and status",
    "related": "form"
  },
  {
    "id": "hints",
    "group": "Forms",
    "title": "Hints and popovers",
    "components": "Tooltip · InfoLabel · Popover",
    "use": "Short explanations, field help and contextual information",
    "guidance": "Do not hide important errors in hover content; use a Sheet for complex editing.",
    "demo": "hints",
    "related": "form"
  },
  {
    "id": "overlays",
    "group": "Forms",
    "title": "Dialog and Sheet",
    "components": "Dialog · OverlayDrawer",
    "use": "Confirm focused tasks or edit without leaving a directory",
    "guidance": "Use Dialog for confirmation and Sheet for details; handle focus and unsaved changes.",
    "demo": "overlays",
    "related": "directory"
  },
  {
    "id": "login",
    "group": "Forms",
    "title": "Login form",
    "components": "AuthenticationLayout · Field · Input",
    "use": "Authentication fields, errors and submitting states",
    "guidance": "Presentation only; the application owns SSO, MFA, credentials and redirects.",
    "demo": "login",
    "related": "authentication"
  },
  {
    "id": "shell",
    "group": "Page building blocks",
    "title": "Application frame and navigation",
    "components": "ApplicationFrame · ApplicationTopBar · ApplicationNavigation",
    "use": "Enterprise applications with side navigation and a stable top bar",
    "guidance": "Use white flat navigation, route-aligned current items and mobile navigation on narrow screens.",
    "demo": "shell",
    "related": "directory"
  },
  {
    "id": "breadcrumb",
    "group": "Page building blocks",
    "title": "Breadcrumb",
    "components": "Breadcrumb · BreadcrumbItem",
    "use": "Location of a record within its parent directory",
    "guidance": "The current item is not a duplicate navigation link; breadcrumbs do not express workflow status.",
    "demo": "breadcrumb",
    "related": "record"
  },
  {
    "id": "header",
    "group": "Page building blocks",
    "title": "Page Header",
    "components": "PageHeader",
    "use": "Page identity, short description and page-level actions",
    "guidance": "One main heading per page; keep row actions in their corresponding rows.",
    "demo": "header",
    "related": "directory"
  },
  {
    "id": "layout",
    "group": "Page building blocks",
    "title": "Modules and columns",
    "components": "WorkspaceSection · RecordManagementWorkspace · DirectoryWorkspace · VersionedWorkspaceLayout",
    "use": "White modules, primary content and supporting information",
    "guidance": "Avoid repeated nested borders; move supporting content below the primary task on narrow screens.",
    "demo": "layout",
    "related": "master-data"
  },
  {
    "id": "tabs",
    "group": "Page building blocks",
    "title": "Tabs",
    "components": "TabList · Tab",
    "use": "Peer content views of the same object",
    "guidance": "Tabs are not workflow steps; associate each tab with its content panel.",
    "demo": "tabs",
    "related": "record"
  },
  {
    "id": "toolbar",
    "group": "Page building blocks",
    "title": "Toolbar, search and pagination",
    "components": "Toolbar · SearchBox · ViewModeToggle",
    "use": "Collection search, filters, refresh and paging",
    "guidance": "Reset the page when queries change; preserve query, filters and paging across view switches.",
    "demo": "toolbar",
    "related": "directory"
  },
  {
    "id": "collection",
    "group": "Page building blocks",
    "title": "Collection List",
    "components": "CollectionList · CollectionListItem",
    "use": "Compact summaries of a small record set",
    "guidance": "Use Table for column comparisons; avoid competing primary entry points.",
    "demo": "Collection list",
    "related": "governance"
  },
  {
    "id": "table",
    "group": "Page building blocks",
    "title": "Data Table / DataGrid",
    "components": "Table · DataGrid · RecordIdentityCellLayout · RecordSelectionDataGrid",
    "use": "Column comparison, record entry or same-page editing selection",
    "guidance": "Use a primary-column link in directories and whole-row selection for Form + List.",
    "demo": "Data table",
    "related": "master-data"
  },
  {
    "id": "cards",
    "group": "Page building blocks",
    "title": "Cards and List/Card",
    "components": "CardGallery · ActionableCardGalleryItem · ViewModeToggle",
    "use": "Record summaries and alternative views of one collection",
    "guidance": "Navigation cards have one whole-card entry; nested display cards have no repeated border or shadow.",
    "demo": "Cards and responsive gallery",
    "related": "directory"
  },
  {
    "id": "stage",
    "group": "Specialized components",
    "title": "Stage Navigator",
    "components": "StageNavigator",
    "use": "Peer preparation workspaces, including future stages",
    "guidance": "The outer ring marks the viewed stage without changing its own status fill.",
    "demo": "Stage Navigator",
    "related": "record"
  },
  {
    "id": "bpf",
    "group": "Specialized components",
    "title": "Business Process Flow",
    "components": "BusinessProcessFlow · BusinessProcessStageDetail",
    "use": "Stages with actual business progression and a detail card per reached stage",
    "guidance": "Only reached stages can be viewed; viewing must not change actual process progress. Checks and actions in the detail card stay consumer-owned.",
    "demo": "Business Process Flow",
    "related": "governance"
  },
  {
    "id": "editable-grid",
    "group": "Specialized components",
    "title": "Editable Grid",
    "components": "EditableGrid · EditableGridRowActionGroup",
    "use": "Many lines, frequent changes and batch saving",
    "guidance": "The application owns columns, validation, selection, drafts, persistence and conflicts; row actions stay frozen.",
    "demo": "editable-grid",
    "related": "directory"
  },
  {
    "id": "grouped-table",
    "group": "Specialized components",
    "title": "Grouped Table and editing",
    "components": "GroupedTableSectionRow · EditableGrid",
    "use": "Naturally grouped collections and frequent line editing",
    "guidance": "Groups control disclosure only; selection and editing belong to leaf rows; collapsing preserves drafts.",
    "demo": "grouped-table",
    "related": "directory"
  },
  {
    "id": "directory",
    "group": "Examples",
    "title": "Enterprise directory",
    "components": "DirectoryWorkspace",
    "use": "Find, filter, compare and open records",
    "guidance": "A primary link or whole card opens a Sheet; returning preserves directory state.",
    "demo": "directory",
    "related": "form"
  },
  {
    "id": "form",
    "group": "Examples",
    "title": "Complete entry form",
    "components": "Field · WorkspaceSection",
    "use": "Sectioned entry, validation, submission and feedback",
    "guidance": "Synthetic local data only; APIs, business validation and persistence are application-owned.",
    "demo": "form",
    "related": "directory"
  },
  {
    "id": "master-data",
    "group": "Examples",
    "title": "Form + List maintenance",
    "components": "RecordManagementWorkspace",
    "use": "Select and maintain definitions on one surface",
    "guidance": "Handle unsaved changes before switching records; the list is not hidden navigation.",
    "demo": "master-data",
    "related": "form"
  },
  {
    "id": "record",
    "group": "Examples",
    "title": "Record workspace",
    "components": "RecordManagementWorkspace · StageNavigator",
    "use": "Multiple work areas around one record",
    "guidance": "Viewed stage and node status are independent; supporting information serves the primary task.",
    "demo": "record",
    "related": "directory"
  },
  {
    "id": "governance",
    "group": "Examples",
    "title": "Versioned governance",
    "components": "VersionedWorkspaceLayout · BusinessProcessFlow",
    "use": "Stable object identity, versions and process information",
    "guidance": "The application owns version algorithms, approvals and publishing; examples are not business rules.",
    "demo": "governance",
    "related": "directory"
  },
  {
    "id": "authentication",
    "group": "Examples",
    "title": "Login page",
    "components": "AuthenticationLayout",
    "use": "Standalone application entry",
    "guidance": "Synthetic demonstration only; no real credentials or identity service.",
    "demo": "login",
    "related": "directory"
  }
];
export function resolveView(value: string | null) { return catalog.some(item => item.id === value) ? value! : 'text'; }
