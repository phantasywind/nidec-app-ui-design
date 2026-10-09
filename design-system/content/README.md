The Nidec Engineering Design System is a shared, versioned UI foundation for Nidec applications, built on Fluent UI React. It owns tokens, reusable components, page layouts and their documentation. Business workflows, roles, API contracts and domain state always stay with the consuming application. When a rule depends on one, write it as `Business Rule Pending` and name the owning application.

## Content fundamentals

- Write interface copy in English. Use sentence case: "Change type", "Commercial change", "Edit details".
- Label buttons with a short verb, text only: "Save", "Example action". Buttons carry no icon and no link behaviour; use a Link for navigation.
- Put hints, required marks and errors inside the Field next to the input. Never put an important error only in a Tooltip.
- Name empty and failed states in words ("No matches"), next to where they happen.
- Every icon-only control needs a non-empty accessible label and a Tooltip.

## Visual foundations

- **Light theme only.** Dark mode is out of scope; do not add dark tokens, dark previews or dark acceptance criteria.
- **Colour.** Page ground is `canvas`; every module sits on white `surface` with one boundary. Do not nest a second border or shadow inside a bordered module. Text is `text`, `text-secondary`, then `text-muted`; use `text-muted` only on `surface` or `canvas`.
- **Green.** Fill primary actions with `brand-strong` and `on-brand-strong` text. Use `brand` only for graphics and markers, and `brand-soft` for hover and selected fills. Never put white text on `brand`.
- **Boundaries.** `border` and `border-strong` are decorative. Draw the edge of an input or other actionable control in `text-muted`.
- **Status.** `success`, `warning`, `danger` and `info` always come with a word or icon. They are presentation roles only; which business state maps to which role is the application's decision.
- **Focus.** Use the white-inside, `focus`-blue-outside ring supplied by the theme. Do not recolour it to green.
- **Type.** Use the Fluent roles in `tokens.json` (`caption1`, `body1`, `subtitle2`, `subtitle1`, `title2`, `title1`) in Fluent's font stack. No custom font ships with the package. Module headings are regular weight; page headings and selected primary identities are semibold. Do not apply old rem scaling, global bold or native heading defaults over controls.
- **Size.** Choose each control's own Fluent size. Forms default to medium and dense row editing to small. SegmentedControl defaults to small (24px items) and TableActionIconButton is always small. Do not give every control one height.
- **Spacing and radius.** Use the `space-*` and `radius-*` tokens: 8px between adjacent actions, 16px between fields, 24px between modules, 4px on controls and 6px on cards and popovers.
- **Width.** Component size is not width. Bound fields in the container: about 16rem for short codes and dates, 12rem for quantities, up to 28rem for names. Add `max-width: 100%` and `min-width: 0`. Buttons stay content width in a wrapping row; only a deliberate exception, such as a sign-in submit, fills its row.
- **Overlays.** Surfaces are opaque. Keep Dialog and Drawer inside the Provider tree and use the default portal and focus handling. The application decides what happens when the user closes with unsaved changes.
- **Migrated regions.** Remove the old skin entirely: legacy backgrounds, pseudo-elements, heights, bold rules and selected styles. Never layer the old look over a Fluent control, and never hide a Fluent affordance to cover a duplicate decoration.

## Iconography

The package does not define an icon set or ship icon files. Consumers supply Fluent icons and the approved List and Card icons for ViewModeToggle. Size icons with the control's own Fluent treatment, and always give an icon-only control an accessible name.

## Brand assets

The Logos group holds four Nidec Elevator lockups as PNG: stacked and horizontal, each with a black field and with black text. Use them unaltered, on `surface` or `canvas`, one per screen; `assets/Logos/README.md` says which file fits which space. Never redraw, recolour or retype the mark. The repository does not state that the Nidec Elevator lockup is approved for every Nidec application, and ADR-0006 leaves brand-asset approval open, so confirm the lockup with the brand owner before an application adopts it.

## Using it

- Install exact versions of the package, Fluent and React. Do not use `latest`, `^`, `~`, a range, a Git URL or `main`. Read the documentation at the matching release tag, not on `main`.
- Wrap the application in `NidecProvider` with `nidecLightTheme` and import `styles.css`. Import layouts from `/layouts` and `DatePicker` from `/date-picker`; never import `dist` paths.
- Pick a page by task using the page selection guide: authentication entry, directory, work queue, record workspace, master data (form plus list), or versioned governance. Row semantics decide the archetype, not how the page looks. A directory row opens one record through a single identity link. A same-surface editor uses whole-row selection with no Open button.
- Switching between List and Card never resets the query, filters, sort, page or selection.

## Components

Every single component in the repository's catalogue has a guideline page and a live preview rendered by the real package component: Input, Textarea, Field, DatePicker, RadioGroup, Checkbox, Switch, Dropdown, Combobox, SpinButton, Slider, Button, IconButton, TableActionIconButton, Menu, SegmentedControl, InlineModeTabs, MessageBar, Badge, Tag, Spinner, Skeleton, Tooltip, InfoLabel, Popover, Dialog, OverlayDrawer, ApplicationTopBar, ApplicationNavigation, Breadcrumb, PageHeader, WorkspaceSection, Tabs, Toolbar, SearchBox, ViewModeToggle, CollectionList, Table, DataGrid, CardGallery, StageNavigator, BusinessProcessFlow, EditableGrid, GroupedTableSectionRow. Fluent sub-parts such as MenuItem or DialogSurface are covered on the page of the component they belong to.

Page layouts are compositions, so they have no component page: ApplicationFrame, DirectoryWorkspace, RecordManagementWorkspace, VersionedWorkspaceLayout and AuthenticationLayout are described in the page selection guide, under Layout reference. Choose a page layout first with that guide, then compose the components it lists.

## Not synced

- `components/bundle.js` is built from the repository's own source (`@phantasywind/nidec-app-ui-design` {{PACKAGE_VERSION}}, source `{{SOURCE_REF}}`, with `@fluentui/react-components` 9.74.7) as one script that includes React 19.2.7, so previews do not load React separately. It is a documentation build for this system, not the published package; applications install the exact package version.
- {{UNRELEASED_NOTE}}
- The previews call the components with sample data written for this system; no repository demo data is used.
- Input, Textarea, Checkbox, RadioGroup, Switch, Combobox, SpinButton, Slider, IconButton, Menu, MessageBar, Badge, Tag, Spinner, Skeleton, Tooltip, InfoLabel, Popover, Breadcrumb, Tabs, Toolbar, SearchBox, Table and DataGrid have no dedicated document in the repository. Their pages are built from the component catalogue and the shared rules, so they state purpose, boundaries and responsibilities and no further specifics.
- The `colorSpace: srgb` source values were converted to the hex values in `src/internal/light-palette.mjs`.
- Fluent type roles, spacing and radius values are the Fluent 9 defaults the package inherits; the repository does not redefine them.
- `on-brand-strong` and the `space-*`, `radius-*` and `caption1` to `title1` names are defined here for readability. The repository uses Fluent's token names directly.
