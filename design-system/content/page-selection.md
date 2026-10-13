# Page selection guide

Choose the page layout by the user's main task, then compose the listed components. Apply the first rule that matches. Row behaviour decides the archetype, not how the page looks: a directory and a Form + List page can both contain a table.

| Question | Page type |
| --- | --- |
| Is the user starting an application session? | Authentication entry |
| Is the main task finding independent records that open elsewhere? | Directory |
| Is the main task processing assigned, pending or exception work? | Work queue |
| Does one record stay authoritative while the user moves among its sections? | Record workspace |
| Does selecting a row load an editor that stays on the same page? | Master data (Form + List) |
| Is the main task creating or editing one record through a form on its own page? | Form page |
| Does one stable object have a current version or state and controlled commands to advance it? | Versioned governance workspace |
| Is the page only a summary across several concerns, with no stronger task? | Dashboard (a documented type only, not yet a shared layout; needs separate review) |
| None of the above, once domain words are removed? | Application-specific page: compose the shared components and do not create a shared template |

## Authentication entry

- **Use for:** the sign-in page before the application shell.
- **Components:** AuthenticationLayout, Field, Input, Button (one full-width primary submit).
- **Rules:** one heading and a real `form`; every field has a visible label; errors near the field in words; failure keeps a valid user name; nothing unrelated beside the form.
- **The application owns:** SSO, MFA, password rules, recovery, sessions, API calls, error wording and routing.

## Directory

- **Use for:** finding, comparing and opening independent records, each with its own destination or a contextual Sheet.
- **Components:** PageHeader, Toolbar with SearchBox, optional ViewModeToggle, then Table or CardGallery, pagination, and optionally OverlayDrawer. Wrap the whole in DirectoryWorkspace.
- **Rules:** one identity Link in the table's primary column; a whole-card target for a card with one destination; icon-only row actions or a Menu; switching List and Card keeps the query, filters, sort, page and selection.
- **Do not use when:** selecting a row only updates an editor already on the same page.

## Work queue

- **Use for:** reviewing a bounded set of tasks and taking explicit commands.
- **Components:** the Directory set, with the scope and status made more prominent.
- **Rules:** opening a work item and running a command are separate interactions; low-frequency commands go into a Menu. The layout does not infer ownership, urgency, deadlines, approval authority or lifecycle.
- **Do not use when:** the page is a general catalogue of records with no queue meaning. Use Directory.

## Record workspace

- **Use for:** understanding and working on one stable record while its sections change.
- **Components:** PageHeader, RecordManagementWorkspace, WorkspaceSection, Tabs or StageNavigator for peer views, and an optional context rail with CollectionList.
- **Rules:** one `h1`; at most one primary header action; the rail sits right above 900 px and moves above the content at 900 px and below; Tabs are not workflow.

## Master data (Form + List)

- **Use for:** selecting one record and editing it on the same surface.
- **Components:** PageHeader, a Form built from WorkspaceSection and Field, a local Toolbar, and RecordSelectionRegion with RecordSelectionDataGrid.
- **Rules:** the whole row is the one selection target; the primary value is plain text, not a link; no Open or Select control; a neutral selected state; switching records must not silently discard unsaved work; create mode is explicit.
- **Order:** page identity, editor, then the list.

## Form page

- **Use for:** creating or editing one record on a dedicated page, with a single submit.
- **Components:** PageHeader, WorkspaceSection for each group of fields, Field with Input, Textarea, Dropdown, MultiSelectDropdown, Combobox, DatePicker, SpinButton, RadioGroup, Checkbox or Switch, MessageBar for submission feedback, and Button for the actions.
- **Rules:** a real `form`; one heading; fields grouped into titled sections; every field has a visible label and required fields are marked; errors appear next to the field in words, and a failed submit may add a summary at the start of the form; the actions sit at the end of the form, with the one primary submit first and Cancel or Reset after it; a busy submit disables duplicate submission and keeps the label; leaving with unsaved work asks first.
- **Do not use when:** selecting a row loads the editor on the same page (Master data), or the page also has sections, tabs and a status to track (Record workspace).
- **The application owns:** fields, validation rules, defaults, persistence, permissions and what happens after saving.

## Versioned governance workspace

- **Use for:** one stable object whose governed versions or states change, such as reviewing or advancing revisions.
- **Components:** PageHeader, an identity and status region (labelled facts and Badge), commands (Button, Menu), Tabs, WorkspaceSection, and optionally StageNavigator or BusinessProcessFlow.
- **Rules:** keep the object, version and status as separate labelled facts; at most one primary command per group; disabled commands explain why; never colour alone for state.
- **The application owns:** transitions, permissions, approval, validation, persistence and audit.

## Page layout patterns

These rules apply to every page type above. They cover where things go, not what they mean.

**Region order, top to bottom:** page identity (the single `h1` in PageHeader); page-level feedback (MessageBar); the primary work area built from WorkspaceSection modules; an optional context rail. Put status and metadata in the same section as the content they govern.

**Where actions go**

| Action | Place |
| --- | --- |
| Page-level (create, edit, export) | PageHeader actions: at most one primary, placed last; secondary before it; low-frequency in a Menu |
| Section-level | That WorkspaceSection's actions |
| Row-level | In the row: icon-only buttons with a name and Tooltip, or a Menu for several |
| Form submit and cancel | End of the form: primary first, then Cancel or Reset (Form page) |
| Destructive | In a Menu, then a confirmation Dialog that names the object; never the primary action |

Do not repeat the same action in the header and the form footer. A disabled action says why.

**Feedback**
- Loading keeps the layout and the query controls (Skeleton or Spinner). Empty and error states stay in the region they replace and keep the query context.
- Success and failure of a page action appear in a MessageBar at the start of the page area. Field errors stay at the field. Never rely on colour alone.
- A Tooltip or Popover never holds the only copy of an important message.

**Choosing a surface**
- Dialog: a short confirmation or one decision, with focus returning to its trigger.
- Sheet (OverlayDrawer): detailed viewing or editing of a record without leaving a list; guard closing with unsaved work.
- Dedicated page: a flow that needs its own route, sections and submit.

**Reflow:** moving regions at 900 px and below must not change route, selection, unsaved work or business state.

## Choosing a stage component

| Question | Use |
| --- | --- |
| A click only changes what the user is looking at, among peer workspaces. | StageNavigator |
| The current stage comes from the server or a state machine, and users only look back at reached stages. | BusinessProcessFlow |
| It is unclear whether a click changes business state. | Do not integrate yet; record `Business Rule Pending` with the owning application. |

Put commands that advance or return a process in separate, clearly labelled Buttons or Menu items.

## Dense editing and grouped data

- Many rows edited repeatedly in one session, with batch save: EditableGrid.
- Hundreds to thousands of rows edited cell by cell (text, long text, select, combobox): LiteEditableGrid inside the EditableGrid frame.
- A naturally grouped collection with show and hide: GroupedTableSectionRow, in a Grouped Table or a Grouped Editable Grid.
- A few records to scan or compare: Table. A compact short list: CollectionList.

## Always

- Keep the application shell white and flat, and build pages from white modules with one light border. No grey canvas, no nested borders or shadows.
- Keep one page `h1`, ordered headings, labelled regions and visible focus.
- Reflow must not change the route, selection, unsaved work or business state. Check 1440, 1280, 900 and 720 px with long content.
- Domain screens (configuration builders, pricing, revision workflows, calculation-rule tools and similar) are not shared templates. They may use the frame, sections, tables, forms and actions, while their fields, commands and rules stay with the application.

## Layout reference

The page layouts are compositions, not single components. Each is a package export that arranges regions you supply. Their rules are kept here.

### ApplicationFrame

ApplicationFrame is the stable authenticated shell: a navigation region, a top bar and a main region that holds exactly one page template and its single `h1`.

It uses ApplicationTopBar and ApplicationNavigation (with ApplicationNavigationGroup and ApplicationNavigationItem). The frame does not insert a second page title, a business Toolbar or a global loading state, and it owns no routing, permissions or account behaviour.

- Keep the navigation and top bar white and flat, separated from the content by one light border. The page area is white too; hierarchy comes from spacing and discrete white modules, not a grey canvas.
- Wide desktop shows persistent navigation. Compact desktop may collapse navigation to an accessible icon rail, keeping names and the current state; pass `compactBrand` when the full brand does not fit. Narrow screens use an accessible overlay.
- Provide distinct navigation, banner and main landmarks, one page `h1`, and a logical keyboard order when regions move.
- Reflow must not change route, selection, dirty state or authentication.

The consumer provides the brand, destinations, routes, breadcrumbs, account data, environment name, authorization, sign-out and the mobile open state. Do not copy another application's routes or roles, apply a legacy filled navigation skin, or put workflows or API calls in the frame. Check actual 1440, 1280, 900 and 720 px widths.

### DirectoryWorkspace

DirectoryWorkspace is the layout for finding, comparing and opening independent records, or for processing a bounded work queue.

Regions in order: PageHeader (at most one primary action); an optional scope; a Toolbar with search, filters, sort, refresh and an optional ViewModeToggle; one results region (Table, CardGallery, or an explicit loading, empty or error state); pagination; and an optional contextual Sheet. Put no unrelated summary cards between the Toolbar and its results.

- A table has one identity Link in its primary column; the row itself is not a hidden link. A card with one destination is a single whole-card target with no inner link; use a non-whole-card presentation when a record needs several direct actions.
- Direct row commands are icon-only buttons; several or low-frequency ones go into a Menu.
- A work queue is not a directory with different wording. Its scope is an assignment, pending or exception set the consumer owns, and opening an item stays separate from running a command.
- Switching List and Card keeps search, filters, sort, page, selection and loaded data.
- Keep search labelled, and keep the query controls visible while loading. Empty and failure states keep the query context.

The consumer provides the collection, routes, query, paging, Sheet content, permissions and commands. Check long content at 1440, 1280, 900 and 720 px.

### VersionedWorkspaceLayout

VersionedWorkspaceLayout is for a page where one stable object stays authoritative while users inspect or act on a governed version, revision or state.

Regions: PageHeader for the stable object; an identity and status region that separates the object, the current version and the state; a command region; local navigation (Tabs); and WorkspaceSection regions with facts, forms, data lists or evidence. An optional context rail only when it directly supports the primary area.

- The `h1` names the stable object. Version, revision and status are labelled facts in the same module as the controls they govern; do not merge them into one title.
- Tabs switch peer content for the same authority; they are not a lifecycle transition. StageNavigator is only for directly selectable peer stages; BusinessProcessFlow follows consumer-controlled progress.
- At most one primary command per group; disabled commands need an accessible reason; a command never becomes enabled just because a state is shown.
- Never use colour alone for a state; give version and status text labels and values.

The consumer provides identities, allowed transitions, permissions, validation, persistence, concurrency, audit and failure recovery. Do not infer a lifecycle from the layout or copy another application's state names. Test long version identifiers and wrapped commands.

### RecordManagementWorkspace

RecordManagementWorkspace is the primary region of a record-management page: a page header, one dominant work area and an optional context rail.

Give it a non-empty accessible name. Use PageHeader first, then WorkspaceSection for each meaningful region (status, metadata, tabs, a local Toolbar, a Data List). Add the rail only when it selects, summarises or supports the record in the primary area, and give it a visible title and a non-empty `contextRailLabel`.

- The primary area takes the flexible width. The rail sits on the right above 900 px, precedes the primary region in DOM order, and moves above it at 900 px and below.
- Header actions: at most one primary action, placed last; secondary ones before it; low-frequency ones in a Menu.
- Use CollectionList for the compact rail list. Use CardGallery only for peer cards in the primary area. Do not put long forms, full data lists, dashboards or duplicate page actions in the rail.
- Keep each Data List's horizontal overflow inside its region.

The consumer provides the selected record, whether a selection may replace unsaved work, loading, routes and permissions.

### AuthenticationLayout

AuthenticationLayout is the layout of a dedicated sign-in page: one centred panel on a quiet page ground.

Use it for the entry surface that comes before the application shell. It is a layout only. It has no authentication technology: SSO, MFA, password rules, recovery, rate limiting, sessions, API calls, security logging, error wording and routing belong to the application, which records unresolved items as `Business Rule Pending`.

Anatomy: a bounded panel, the application's own brand area, one title and an optional sentence, labelled fields (Field and Input), and one full-width primary submit action.

- Every field has a visible label; a placeholder is not a label.
- Use a real `form` so Enter follows the submit path; loading disables duplicate submission and keeps the label.
- Failed sign-in keeps a valid user name and does not move focus unexpectedly.
- Show errors near the field or at the start of the form, in words.
- Do not add unrelated dashboards or promotions beside the form, and do not embed another application's logo.
- On narrow screens the panel fills the width with page padding and never scrolls sideways.
