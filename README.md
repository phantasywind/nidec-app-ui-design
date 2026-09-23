# Nidec App UI Design

Shared, versioned UI design system for Nidec applications.

This private repository is the source of truth for the Nidec Engineering Design System package `@phantasywind/nidec-app-ui-design`. It owns reusable UI foundations and their build, verification, documentation, and release mechanisms. Each adopting application retains ownership of its integration and business behavior.

CPQ and EPM are the initial reference consumers used to establish and verify the first compatibility contract. Future Nidec applications may adopt qualified versions after completing the same application-specific compatibility assessment; compatibility is not assumed solely because an application belongs to Nidec.

## Governance

- [Agent governance and responsibility boundary](AGENTS.md)
- [ADR-0001: Repository and distribution governance](docs/decisions/0001-repository-and-distribution-governance.md)
- [Gated delivery roadmap](docs/roadmap.md)

The current immutable pre-release is `0.1.0-rc.3`. Its matching Git tag, GitHub Package, GitHub Release, qualified `.tgz`, checksum and release record have been published and read back. The earlier `0.1.0-rc.2` and `0.1.0-rc.1` releases remain immutable and available for controlled rollback. No pre-release is the future stable `0.1.0`, independent application acceptance, deployment approval or Production approval.

## Fluent React package

The finite React surface covers governed forms, dialogs/drawers, feedback, navigation, menus, tables/data grids, cards, status/content controls, shared page layouts, and the `CollectionList`, `CardGallery`, `StageNavigator`, and `BusinessProcessFlow` compositions. `ProcessStageIndicator` remains only as a deprecated compatibility export. Upstream Fluent contracts are preserved where components are directly exported; consumer business workflows remain outside this package. See [ADR-0003](docs/decisions/0003-fluent-ui-foundation.md), [batch scope](docs/decisions/0005-batched-form-components.md), and the most recently completed [`0.1.0-rc.3` release record](docs/releases/0.1.0-rc.3.md).

React consumers explicitly install the exact qualified `@fluentui/react-components@9.74.7` alongside the exact shared-package version. React/React DOM and Fluent are external optional peers; optional means token-only consumers can omit them, not that React consumers can omit them. Commit the application lockfile to freeze transitive dependencies.

```tsx
import { NidecProvider, Button, nidecLightTheme } from '@phantasywind/nidec-app-ui-design';

// Explicit shared light theme; application adoption remains separately approved.
<NidecProvider theme={nidecLightTheme}>
  <Button onClick={handleAction}>Example action</Button>
</NidecProvider>
```

The light-theme palette basis is approved in [ADR-0006](docs/decisions/0006-color-governance.md); the [central mapping record](docs/implementation/nidec-light-theme-record.md) distinguishes source colors from derived UI states and tracks verification. Raw values live in one internal configuration; consumers use the public theme, never internal paths. A Nidec dark theme is not provided.

Button remains a text-only native-button interface, defaults to `type="button"`, preserves disabled/form/ref behavior and composes the `nidec-ui-button` class. There is no polymorphic link or new business behavior. Input/Field/Dialog preserve their upstream public protocols. NidecProvider requires a complete explicit theme and excludes upstream unstable styling options.

The post-`0.1.0-rc.3` mainline also governs Fluent DatePicker through the isolated `@phantasywind/nidec-app-ui-design/date-picker` subpath. Its exact compat peer is required only when that subpath is consumed. See the [Date Picker usage contract](docs/date-picker.md) for date-only semantics, formatting/parsing, boundaries and consumer-owned business rules. This source capability is not part of immutable `0.1.0-rc.3` and is not consumable until a future version is separately qualified and published.

`tokens.css`, `styles.css` and `tokens.json` are framework-neutral entrypoints generated from the governed ADR-0006 light-theme input. Nidec static CSS is explicitly imported; Fluent runtime styles are managed by its Provider/Griffel mechanism and do not require `styles.css` to activate. CSP, portal isolation and application acceptance remain separate qualification gates. No custom fonts, icon package contract or global reset is introduced.

## Segmented mode-selection contract

Use `SegmentedControl` only for a compact choice between two or more mutually exclusive peer modes, views or presentation variants when switching is immediate. It is not a workflow stage, persistent multi-select, boolean setting, navigation across unrelated destinations or a substitute for ordinary form radio options with long explanatory text. The application owns the option values, current value and business effect; the shared component owns the Fluent radio-toolbar semantics, geometry, selection hierarchy and focus behavior.

The control requires an accessible group label, at least two unique text-labelled options, a controlled value and `onValueChange`. It deliberately renders one subtle neutral boundary around all segments, uses the shared Nidec light-theme brand roles for the selected segment, and keeps every medium item at the Fluent-governed 32px control height. Applications must not place a legacy selected-button skin over it or restyle individual segments with raw colors.

```tsx
<SegmentedControl
  aria-label="Change type"
  options={[
    { value: 'commercial', label: 'Commercial change' },
    { value: 'engineering', label: 'Engineering change' },
  ]}
  value={changeType}
  onValueChange={(_, value) => setChangeType(value)}
/>
```

## List and Card view toggle

Use `ViewModeToggle` for a compact presentation-only switch between the List/Table and Card/Gallery renderings of the same collection. It uses two separate 32px icon buttons with a 4px internal gap, accessible labels, Tooltips and controlled `aria-pressed` state; it deliberately avoids the larger text-labelled `SegmentedControl` treatment. Keep the group 12px from an adjacent count, sort or filter control. See the complete [List and Card view toggle governance](docs/view-mode-toggle.md).

```tsx
<InlineModeTabs
  aria-label="P1 parameter source"
  options={[
    { value: 'field', label: 'Field' },
    { value: 'fixed', label: 'Fixed' },
  ]}
  value={parameterSource}
  onValueChange={(_, value) => setParameterSource(value)}
/>
```

## Inline editor mode contract

Use `InlineModeTabs` for a short, repeated choice that changes the mode and visible panel of one nearby editor. It is a dedicated compact pill rather than the higher-level `SegmentedControl`: one content-sized circular track contains 20px-high Fluent tabs, with a 2px neutral inset separating the selected tab from the outer boundary. The current mode uses the shared brand background, on-brand text and a light theme shadow. An unselected hover uses a subtle neutral surface with brand text; Fluent pending and selected underlines are deliberately suppressed. The compact geometry keeps repeated data rows light while preserving an unmistakable current value.

The component is controlled and uses Fluent tab-list keyboard behavior. Every option declares a unique `tabId` and `panelId`; the consumer renders the visible adjacent `tabpanel` with the matching `id` and `aria-labelledby`. A compact composition uses the Fluent `spacingVerticalXS` token between the pill and panel, aligns their inline starts, and keeps inactive-mode draft values in consumer state. Repeated editor rows must use one stable constrained editor-column width so different panel controls cannot move the pill. The pill owns no external margin, validation, saving or side effect.

Use application/page Tabs for record, page or workspace navigation. Use `SegmentedControl` for a more prominent mutually exclusive business mode, and `RadioGroup` or another qualified choice composition when options need explanations or become numerous. Do not use `InlineModeTabs` for navigation, workflow stages, boolean settings, destructive commands, permissions, immediate submission or as a compact substitute for those patterns. The package currently exports Fluent `TabList`/`Tab`; it does not claim a separate `WorkspaceTabs` public component.

See the complete [Inline Mode Tabs governance](docs/inline-mode-tabs.md), including layout, panel association, value preservation and prohibited uses.

## Record-management workspace contract

Use `PageHeader`, `RecordManagementWorkspace` and `WorkspaceSection` together for a record-management page with one page identity, one primary work area and an optional contextual selector or summary rail. The global application shell, routing, selection authority, commands, APIs and business states remain application-owned.

The context rail is visually placed on the right at wide widths but precedes the primary content in DOM order. At 900 CSS pixels and below it moves above the primary content. `WorkspaceSection` establishes the standard white bordered module with heading, explanation, local actions and content hierarchy. Data Lists follow the record-entry rules below; `CardGallery` is for peer cards in primary content, not for a one-column context selector.

The complete Header, Data List, Card-placement and responsive rules are in the [Record Management Workspace Governance](docs/record-management-workspace.md) contract.

```tsx
<RecordManagementWorkspace
  aria-label="Record management"
  header={<PageHeader title="Records" description="Maintain governed records." actions={<PageActions />} />}
  contextRailLabel="Available records"
  contextRail={<RecordSelector />}
  primary={<WorkspaceSection title="Current record"><RecordTable /></WorkspaceSection>}
/>
```

## Page layouts and template selection (`0.1.0-rc.3` candidate)

Import page-level structure from the dedicated `@phantasywind/nidec-app-ui-design/layouts` subpath. It contains `ApplicationFrame`, `ApplicationTopBar`, `ApplicationNavigation`, `ApplicationNavigationGroup`, `ApplicationNavigationItem`, `AuthenticationLayout`, `DirectoryWorkspace` and `VersionedWorkspaceLayout`. These layouts own region order, responsive relationships and accessible structure; consumers continue to own routes, permissions, data, commands, loading, errors and business state.

Choose the page archetype by user task rather than visual resemblance. The [page archetype matrix](docs/page-archetypes.md) distinguishes Authentication, Directory/Work Queue, Record Workspace, Master Data/Form + List and Versioned Governance. The supporting contracts cover the [application frame](docs/application-frame-layout.md), [Directory and Work Queue](docs/directory-and-work-queue-layout.md), [Master Data/Form + List](docs/master-data-form-list-layout.md) and [Versioned Governance](docs/versioned-governance-layout.md).

The packaged composite consumer exercises the shared UI-material inventory and all five business-neutral template recipes. Release qualification binds its exact production build to the candidate archive; these demonstrations are structural examples rather than application routes, data contracts or business workflows.

`CardGalleryItem` is display-only. Use `ActionableCardGalleryItem` when one whole Card is the sole link or command entry; do not nest another Link or Button inside it. A Data Table continues to use one green semantic identity Link, while Form + List uses whole-row selection with plain primary text.

This page-layout API is included in the `0.1.0-rc.3` candidate. It does not authorize consumer adoption until the immutable version and its matching release evidence are published and independently adopted by the consumer.

## Record-entry interaction contract

An adopting application declares the meaning of a record collection; it does not choose raw Fluent navigation modes or invent a page-specific click convention. For every rendered collection, the application must identify whether the content is static, whether opening a record is URL navigation or an application command, whether records are selectable, and whether each item contains secondary actions. Routing, authorization and business effects remain application-owned.

Use the following presentation rules:

| Surface and semantics | Required record-entry interaction |
| --- | --- |
| Static collection | No row action, pointer cursor, action hover or keyboard action target. |
| `CollectionList` with one record-opening action and no interactive descendants | The complete item is the single primary action. Mouse activation and keyboard activation must have the same result. |
| `CollectionList` with selection or secondary actions | Keep selection and secondary controls independent. `Space` is reserved for selection and `Enter` for the primary action. Use composite keyboard behavior; do not implement this with a raw `<li onClick>`. |
| `Table` or `DataGrid` containing records | Use `RecordTableHeader` or `RecordDataGridHeader` to distinguish the header from data rows. Put the navigable record identity in the one primary cell as a semantic `Link`. The row itself is not a hidden navigation target. |
| Same-surface editor plus a record directory | Use `RecordSelectionRegion`, `RecordSelectionDataGrid` and `RecordSelectionDataGridRow`. The controlled single selected row loads the editor; whole-row pointer, Enter and Space activation are equivalent. The emphasized identity is plain text, not a Link, and there is no duplicate Actions control. |
| Dialog, drawer or non-navigation command | Use an explicitly labelled button or menu action rather than presenting the command as a link. |

Each record has exactly one primary entry mechanism. In a navigable Data Table/DataGrid, render that mechanism as a theme-governed Fluent `Link` with `inline` in the primary identity cell so it remains visibly underlined and distinct from ordinary data. That navigable primary cell contains the single record-identity link only: do not stack an owner, description, status or other field beneath it. Put supporting fields in their own governed columns. Do not combine whole-row activation, a duplicate identity link and a duplicate `Open` button on the same record. Row-end buttons and menus are secondary actions only and must not trigger the record-entry action.

Data Table and DataGrid direct row actions use `TableActionIconButton` inside Fluent `TableCellActions`; they do not use the text-labelled `Button`. `TableActionIconButton` fixes each direct row action to Fluent `appearance="transparent"`, `size="small"` and the standard rounded shape. With the pinned Fluent `9.74.7` baseline, this is a 24 x 24 CSS pixel target with a 20 x 20 icon: there is no persistent border, text label or filled backplate, while Fluent retains its hover, pressed, focus-visible and disabled states. Applications must not recreate the control with raw CSS or layer a legacy button skin over it.

Every icon action requires both a non-empty `aria-label` and a visible-on-hover/focus `Tooltip` carrying the same plain-language action wording. The icon itself and the action meaning remain application-owned. `type="button"` remains the default, so a row action cannot submit a surrounding form unless the application explicitly declares that behavior. Keep direct row actions visibly present by setting `TableCellActions visible`; do not make discovery depend on pointer hover. Shared styling keeps the action group one XS spacing role away from the table's inline-end boundary, so consumers must not position the icon flush against the border. If several actions are present, keep them within `TableCellActions` and move lower-priority actions into an overflow `Menu`; action priority, authorization, confirmation and destructive business effects remain consumer responsibilities.

The current shared `CollectionList` is a stable semantic/layout composition rather than a re-export of Fluent List. The Fluent List dependency resolved by the pinned Fluent `9.74.7` baseline still carries an upstream non-production-ready notice, so consumers must not import it through internal package paths or recreate its behavior with ungoverned click handlers. Until a qualified shared actionable-list API is published, use the semantic identity `Link` for record navigation and treat the surrounding `CollectionListItem` as non-actionable. This section governs the next package version; it does not retroactively add an interaction API to immutable `0.1.0-rc.1`.

```tsx
<Table aria-label="Records">
  <RecordTableHeader>
    <TableRow>
      <TableHeaderCell>Record</TableHeaderCell>
      <TableHeaderCell>Status</TableHeaderCell>
      <TableHeaderCell>Actions</TableHeaderCell>
    </TableRow>
  </RecordTableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <RecordIdentityCellLayout
          primary={<Link inline href="/records/REC-1042">Example record</Link>}
        />
      </TableCell>
      <TableCell>
        <TableCellActions visible>
          <Tooltip content="More actions" relationship="description">
            <TableActionIconButton aria-label="More actions" icon={<YourMoreIcon />} />
          </Tooltip>
        </TableCellActions>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

`RecordTableHeader` and `RecordDataGridHeader` preserve their corresponding Fluent header props and add only the shared visual hierarchy: neutral background, semibold labels and a stronger neutral bottom boundary. Data rows retain the upstream Fluent presentation; applications must not reproduce this distinction with page-specific raw colors or typography overrides.

`RecordSelectionDataGrid` is deliberately controlled and single-select. It requires a stable `getRowId`, fixes the stable Fluent composite focus model and neutral selection appearance, and rejects more than one selected ID. `RecordSelectionDataGridRow` removes the redundant visible selection cell and adds Enter to Fluent's pointer/Space selection path. The consumer owns whether a proposed selection may replace the current editor record, including dirty-change confirmation, record loading, errors and persistence. Do not use this variant for URL navigation, multi-selection or rows containing secondary interactive controls.

## Stage navigation and business-process contract

The package deliberately exposes two different stage presentations. Applications must select the component from the interaction meaning, not from the preferred shape.

Adopting teams should use the consumer-facing [阶段呈现模式选择规范](docs/stage-pattern-selection.md) before implementation. It includes the decision rule, permitted scenarios, prohibited combinations, responsibility boundary and migration path from the deprecated compatibility component.

| Component | Use when | Interaction contract | Application ownership |
| --- | --- | --- | --- |
| `StageNavigator` | The numbered stages are sibling workspaces or views that a user may visit directly, similar to a tab set. | Every enabled stage is a real Fluent button. `onStageSelect` is required; pointer, Enter and Space activate the same consumer callback. | Selected/current state, navigation, availability, routing and any unsaved-change guard. It does not imply lifecycle progression. |
| `BusinessProcessFlow` | The arrows report a true business lifecycle controlled by process state. | Read-only ordered progress. It exposes no stage activation callback and renders no stage button. The component never advances, reverses or skips a stage. | Authoritative state, permitted transitions, commands, validation, RBAC, persistence and APIs. |

`ProcessStageIndicator` is retained temporarily so existing consumers continue to compile, but it is deprecated and must not be used for new work. Existing usages migrate to `StageNavigator` when direct switching is valid, or to `BusinessProcessFlow` when only the business process may move the stage. Do not add click handlers, pointer cursors or hidden links around `BusinessProcessFlow` arrows.

Both components accept only consumer-provided labels, descriptions and explicit statuses. They do not infer order or transition rules. `BusinessProcessFlow` uses a bounded horizontal scroll region at narrow widths rather than wrapping or changing the lifecycle order.

```tsx
<StageNavigator
  aria-label="Configuration workspaces"
  stages={workspaceStages}
  onStageSelect={(_, stage) => navigateToWorkspace(stage.id)}
/>

<BusinessProcessFlow
  aria-label="Approval process"
  stages={serverReportedStages}
/>
```

## Authentication entry pattern

A dedicated sign-in surface uses the governed [Authentication entry pattern](docs/authentication-entry-pattern.md): one quiet themed background, one bounded centered panel, a consumer-supplied brand area, labelled Fluent credential fields and one full-width primary submit action. The shared system governs presentation and accessibility structure only. SSO, MFA, password policy, recovery, sessions, APIs, RBAC and security messages remain application-owned.

The unified local showcase includes an `Authentication sample`. It uses synthetic, non-submitting values and does not claim a reusable authentication protocol or successful application acceptance.

## Application shell and module layout

Authenticated desktop pages follow the governed [application shell and module layout](docs/application-shell-and-module-layout.md): white left navigation and top utility bar, grouped icon-and-text destinations without filled navigation tiles or shadows, a restrained active marker, and a white right-side page composed from bordered rounded modules. `PageHeader` and `WorkspaceSection` provide the standard module surfaces. Cards nested inside those modules stay flat without another border or elevation shadow. Applications retain route structure, labels, permissions, runtime identity and account behavior.

## Exact-version consumption

Configure the private GitHub Packages registry through the application's credential-managed npm setup, then install exact versions:

```ini
@phantasywind:registry=https://npm.pkg.github.com
save-exact=true
```

```powershell
npm install --save-exact @phantasywind/nidec-app-ui-design@0.1.0-rc.3 @fluentui/react-components@9.74.7
```

The application must already use a qualified exact React/React DOM 19.2.x pair. Do not use `latest`, ranges, Git URLs, or `main`. A built application does not contact GitHub at runtime.

## Consumer-owned adoption method

Locke forwards the version-specific method below to each adopting application's own task. The application performs and records all work in its own repository and conversation; this Design System repository does not create per-application deployment files.

1. Read the target application's governance and confirm authorization, branch/checkout policy, current HEAD, dirty work, occupied files and rollback point before changing anything.
2. Confirm compatibility with the published peers: exact Fluent `9.74.7` and one exact compatible React/React DOM 19.2.x pair. Record unresolved application semantics as `Business Rule Pending`; do not move API, RBAC, routing or state-machine behavior into the shared package.
3. Configure credential-managed access to GitHub Packages without recording a token, install the two exact versions shown above, and commit the consumer lockfile. Never install from `main`, a Git URL, a dist-tag, a version range or an old local candidate.
4. Verify the resolved package version, lockfile identity and single React/React DOM/Fluent resolution. For a first adoption of a release, compare the installed package content with the matching GitHub Release archive and SHA-256 record.
5. Replace coherent UI regions using Fluent-owned appearance and states. Exclude legacy decorations at the integration boundary; do not layer the old skin over Fluent. Preserve application-owned events, values, focus, submission, permissions, requests and recovery behavior.
6. Run the application's typecheck, tests and production build, then validate actual host CSS and pseudo-elements, 1440/1280/900/720 layouts, keyboard paths including Tab/Shift+Tab/Escape, dialogs/portals, CSP and relevant resource/size changes.
7. Keep self-test, independent acceptance, deployment and Production approval as separate gates. Report the exact version, scope, evidence, limitations and rollback to Locke before advancing.
8. If a shared component or contract is deficient, return the smallest reproducible public-contract issue to this repository. Do not hide it with a permanent application-only override; a shared correction requires a new immutable package version.

The published release record supplies the authoritative source commit, artifact name, checksum and known package-level limits. Each application remains responsible for its own compatibility and acceptance evidence.
