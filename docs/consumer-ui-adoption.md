# Application adoption and legacy UI replacement

This guide targets `0.1.0`, including typography, compact sizing, Dropdown and preview improvements since rc.4. Check the [release record](releases/0.1.0.md) for publication status before installation. Installing the package does not complete a migration: each region must satisfy the shared presentation contract and application-level acceptance.

## Versions and documentation

Pin exact package, Fluent and React versions. Fluent peer dependency: `9.74.7`; DatePicker peer dependency: `0.6.39`. Use the same exact 19.2.x version for React and ReactDOM. Do not use ranges, latest or Git main. Keep tokens in existing user/CI credential mechanisms, never in the repository.

The npm package contains dist and its README, not the full docs. Read documentation at the matching immutable tag or Release. The rc.4 embedded README has a stale version reference; the [release record](releases/0.1.0-rc.4.md) is authoritative. Candidate documentation does not change rc.4.

## Minimal setup

```tsx
import { NidecProvider, nidecLightTheme, Button, Field, Input } from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/styles.css';

export function Example() {
  return <NidecProvider theme={nidecLightTheme}>
    <form onSubmit={event => event.preventDefault()}>
      <Field label="Name" style={{ width: '28rem', maxWidth: '100%', minWidth: 0 }}>
        <Input />
      </Field>
      <div className="record-actions">
        <Button type="submit" appearance="primary">Save</Button>
      </div>
    </form>
  </NidecProvider>;
}
```

```css
/* Composition only: do not override internal control appearance. */
.record-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacingHorizontalS);
  margin-block-start: var(--spacingVerticalM);
}
```

Import layouts from `/layouts` and dates from `/date-picker`, never internal dist paths. NidecProvider supplies the explicit theme; import static styles, while Griffel owns Fluent runtime styles. Repeated Providers or layers of !important are not a legacy-skin fix.

## Width is not component size

The supported small/medium size controls typography and control geometry, not the available field width. The application owns the composition container. A Field in a full-width Grid may stretch even when the control itself has no width:100%.

| Context | Recommended composition | Avoid |
| --- | --- | --- |
| Short code, date or short Dropdown | Bounded field, typically 16rem, max-width:100% | Filling the entire workspace |
| Quantity or unit value | Bounded field, typically 12rem | A page-wide numeric editor |
| Name or longer selection | Wider field or bounded form column, typically up to 28rem | Fixed desktop widths that overflow mobile |
| Multiline notes | Fill a bounded form region | Forcing a fixed single-line height |
| Search and toolbar filters | Stable explicit width; allow toolbar wrapping | Focus/clear buttons moving adjacent actions |
| Ordinary buttons | Content width in a wrapping action row | width:100%, flex:1 or implicit Grid stretching |
| Explicit full-width entry | Only where designed, such as a login submit action | Applying the exception globally |

These are example composition widths, not new package defaults or mandatory pixel sizes. Adjust for expected content, units and localization; retain responsive bounds. Grid children require min-width:0, and narrow containers may also require a supported root style to remove a control minimum width.

```css
.form-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacingVerticalM) var(--spacingHorizontalL);
  width: 48rem;
  max-width: 100%;
  min-width: 0;
}
.short-field { width: 16rem; max-width: 100%; min-width: 0; justify-self: start; }
.number-field { width: 12rem; max-width: 100%; min-width: 0; justify-self: start; }
@media (max-width: 720px) {
  .form-columns { grid-template-columns: minmax(0, 1fr); }
}
```

Copy the required container styles along with JSX. These classes belong to the example/application, not the shared package. Filling a field column is different from making every input or button full-page width. Do not add global input/button width rules.

## Remove legacy appearance in migrated regions

1. Inventory resets, themes, legacy classes, inline styles, pseudo-elements and global button/input/h1/h2/table/* rules.
2. Remove old decorations, typography, heights, shadows, backgrounds and selected skins from migrated controls. Keep application events and business state.
3. During gradual migration, scope old styles to unmigrated regions, such as .legacy-region button. Migrated content must not live inside that scope. Retain only verified, non-conflicting resets.
4. Import order alone is insufficient: selector specificity, inline styles, CSS layers and !important affect the result. NidecProvider is a theme context, not Shadow DOM; it does not isolate arbitrary host CSS.
5. Keep one module boundary: no nested summary-card border or shadow inside an already bordered module. Preserve the approved white canvas and navigation.

## Typography and actions

Use Fluent typography roles. Do not reintroduce legacy rem scaling, global bold rules or native heading defaults across controls. The candidate uses regular secondary module headings while page headings and selected primary identities retain semibold. Follow the exact version contract.

Inspect button width, min-width and flex as well as parent Grid tracks, Flex direction and stretch alignment. The directory example reserves 15rem for search so its clear button cannot shift adjacent controls. This is layout, not a replacement control skin.

## Overlays and closing

Use Dialog Trigger/Surface/Title/Content/Actions and OverlayDrawer Header/Body/Footer. Keep overlays in the correct Provider logical tree and use the default portal/focus mechanisms.

```tsx
<Dialog open={open} onOpenChange={(_, data) => {
  if (!data.open && (busy || dirty)) return; // Present an application-owned discard prompt.
  setOpen(data.open);
}}>
  <DialogTrigger disableButtonEnhancement><Button>Open</Button></DialogTrigger>
  <DialogSurface><DialogBody>
    <DialogTitle>Edit details</DialogTitle>
    <DialogContent>Application-owned fields and state.</DialogContent>
    <DialogActions><Button disabled={busy} onClick={requestClose}>Close</Button></DialogActions>
  </DialogBody></DialogSurface>
</Dialog>
```

The application implements open, busy, dirty and requestClose. Apply one closing policy to every entry point. Prevent duplicate submission and accidental closing while saving. Check initial focus, Tab containment, Escape, backdrop closing and returned focus. Verify custom portals and CSP separately.

## Acceptance and troubleshooting

| Symptom | Inspect | Completion criterion |
| --- | --- | --- |
| Stretched buttons or fields | Own width/min-width/flex, parent tracks and stretch, legacy classes | Content-sized actions and intentionally bounded fields |
| Large or bold text | Computed family/size/weight/line-height, inherited and matched rules | Matches the same preview version and size |
| Repeated borders/backgrounds | Old classes, pseudo-elements, nested Cards, shadows | One module boundary and one state treatment |
| Transparent or inconsistent overlays | Provider, portal, tokens and global styles | Opaque surfaces with correct typography and focus |
| Inconsistent selection | Legacy active/selected skin over shared states | Shared appearance with intact business state |

Compare a minimal same-version page with the actual application container, using computed styles and matched rules. If both reproduce the issue, inspect shared defaults; if only the application does, inspect host layout/styles. Do not assign responsibility without evidence. If undocumented overrides are necessary, clarify the contract or fix the package.

Verify 1440, 1280, 900 and 720px layouts, actions, fields, module spacing, table scrolling, frozen action columns, hover, focus, selection, disabled, loading, empty and error states. Check directory links, whole-card entry and same-page row selection. Application acceptance also requires real save/readback, permissions and business regression.

Shared preview checks are not application acceptance. This guidance does not claim compatibility with arbitrary legacy CSS or introduce an automatic style-conflict system.
