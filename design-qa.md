# Data Table primary-link design QA

- Source visual truth: `D:\Documents\Nidec Elevator CPQ\Enquiry Page Design.png`
- Implementation screenshot: `D:\Documents\ChatGPT\GitHub Nidec App UI Design\.tmp\pre-release-design-audit\12-primary-link-underlined.png`
- Focused comparison: `D:\Documents\ChatGPT\GitHub Nidec App UI Design\.tmp\pre-release-design-audit\13-link-qa-comparison-final.png`
- State: Nidec light theme, Data Table at rest, direct row actions visible
- Browser viewport: 1181 x 1165 CSS pixels, device pixel ratio 1.5; the in-app capture API produced a normalized 1166 x 1151 PNG
- Source pixels: 1586 x 992
- Comparison pixels: 1100 x 812; both focused Data Table regions were proportionally resized to the same 1100-pixel width before stacking

## Full-view and focused evidence

The source is a complete CPQ record page while the implementation is a consumer-neutral composite-pattern gallery, so full-page shell fidelity is intentionally out of scope. The focused comparison evaluates the governed Data Table surfaces shared by both: header/data hierarchy, one linked primary identity, secondary metadata, status, and row-end secondary actions.

No raster or decorative assets are part of the shared Data Table region. Fluent UI owns the Link, Menu, Tooltip, Badge and icon rendering; the shared light theme supplies the approved demonstration palette.

## Required fidelity surfaces

- Fonts and typography: Fluent typography remains in force. The linked identity uses the table's inherited size and a supported persistent underline rather than page-specific font CSS.
- Spacing and layout rhythm: The primary link and supporting metadata remain within one `TableCellLayout`; ordinary cells retain regular weight and the header remains visibly separated.
- Colors and visual tokens: The link resolves through the shared theme to the Nidec demonstration green. No Data Table raw color was introduced.
- Image quality and asset fidelity: No image asset is required. The More icon comes from Fluent System Icons rather than a custom drawing or text glyph.
- Copy and content: Fixture copy stays consumer-neutral. The interaction wording distinguishes record navigation from the separate More actions menu.

## Comparison history

1. Initial implementation used a Fluent Link but had no persistent underline at rest. This was a P2 discoverability mismatch against the selected source.
2. The fixture and public example were changed to the supported `Link inline` behavior. The final computed style reports the theme green foreground and `text-decoration-line: underline`.
3. The duplicate row-end Open action was replaced by a distinct More actions menu. Its icon button measures 24 x 24 CSS pixels, opens a visible menu, closes with Escape, and returns focus to the trigger.

## Findings

No actionable P0, P1 or P2 mismatch remains within the approved shared Data Table scope.

The source also contains application-owned selection, row highlight, next-action wording, sorting, pagination and a details panel. Those are not copied into the shared package because their data, routing and business semantics remain consumer responsibilities.

## Implementation checklist

- Use exactly one Fluent `Link inline` as the navigable record identity.
- Do not make the whole table row a hidden navigation target.
- Do not repeat the same Open action in the row-end action area.
- Keep distinct direct actions visible and move secondary choices into a Fluent Menu.
- Preserve consumer ownership of routes, authorization, selection, sorting, pagination and business effects.

## Stage semantics design QA

- Circle-navigation source truth: `D:\Documents\ChatGPT\GitHub Nidec App UI Design\.tmp\pre-release-design-audit\15-cpq-stage-navigator-reference.png`
- Arrow-process source truth: `D:\Documents\ChatGPT\GitHub Nidec App UI Design\.tmp\pre-release-design-audit\14-cpq-stage-reference.png`
- Shared implementation: `D:\Documents\ChatGPT\GitHub Nidec App UI Design\.tmp\pre-release-design-audit\17-stage-patterns-compact.png`
- Browser viewport: 1280 x 720 CSS pixels
- Source and implementation captures: both 1265 x 712 pixels from the same in-app browser density; no density resampling was required
- Reviewed state: Nidec light theme; `StageNavigator` at rest and after direct activation; `BusinessProcessFlow` at rest

The reference and implementation screenshots were inspected together. The two resulting patterns preserve the source distinction: a thin connector with separately clickable numbered markers for workspace navigation, and contiguous chevrons with completed/current/upcoming treatment for server-driven lifecycle progress. The shared implementation intentionally uses neutral example labels rather than copying CPQ Quote states.

### Fidelity and behavior

- `StageNavigator` keeps the interactive area on each Fluent button's content rather than the complete stage column. Its connector does not pass through a marker and the transparent hover surface cannot cover the connector.
- Pointer activation of the third navigator item updated the live result to `Activated Confirm`; focus remained on the activated native button. Button semantics provide Enter/Space parity, while a disabled stage remains unavailable.
- `BusinessProcessFlow` contains zero buttons and exposes no stage-switch callback. Its current stage has `aria-current="step"`; all four steps remain an ordered list.
- The BPF container computes `overflow-x: auto` and owns the 42rem minimum track width, so constrained consumers receive local horizontal scrolling rather than whole-page expansion or reordered stages.
- Typography, spacing, status fills and foregrounds resolve through Fluent theme tokens. No raw component color or legacy skin was introduced.

### Compact-height iteration

1. The first shared arrow implementation rendered at approximately 76 CSS pixels because its 3.75rem minimum height did not include vertical padding. User review classified this as visually too tall.
2. The stage now uses border-box sizing, a 3.25rem governed height, XS vertical padding and a 1.75rem marker. The browser reports a 52px arrow and 28px marker at the 1280 x 720 comparison viewport.
3. The revised capture was compared with the CPQ source in the same visual review. It restores the compact lifecycle density without changing arrow geometry, text hierarchy, semantic colors, local overflow or the callback-free interaction contract.

No actionable P0, P1 or P2 mismatch remains in this shared scope. Application state transitions, routing, permissions, validation and persistence remain explicitly outside visual-component ownership.

final result: passed
