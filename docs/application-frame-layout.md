# Application frame layout

Status: SHARED MAINLINE GOVERNANCE / NOT YET PUBLISHED OR ADOPTED

## Purpose

The application frame provides the stable authenticated shell around page templates. It governs the relationship among application branding, primary navigation, the top utility region and page content without owning routing, permissions, runtime identity or account behavior.

Use this contract with `ApplicationFrame`, `ApplicationTopBar`, `ApplicationNavigation`, `ApplicationNavigationGroup` and `ApplicationNavigationItem`. The existing visual principles in `docs/application-shell-and-module-layout.md` remain authoritative.

## Required structure

1. A navigation region contains the consumer-supplied brand and grouped destinations.
2. A top bar identifies the current location and may contain environment, help, account and sign-out slots.
3. A main region contains exactly one page template and its single `h1`.
4. Mobile navigation controls remain programmatically associated with the navigation surface.

The frame does not insert a second page title, business Toolbar or global loading state on behalf of the consumer.

## Navigation presentation

- Keep the navigation surface white and flat, separated by one light neutral border.
- Use short group labels followed by icon-and-text destinations.
- Keep destinations free of persistent filled tiles, shadows and decorative Cards.
- Indicate the current destination with the governed brand foreground, semibold text and a narrow leading marker. Do not rely on color alone; expose current-location semantics.
- Consumers provide labels, icons, order, routes, visibility and authorization.
- Administration or system destinations may be separated at the bottom when the information architecture requires it; the shared layout does not infer that requirement.

## Top bar presentation

- Keep the top bar white, flat and visually subordinate to the current page header.
- Place location or breadcrumb content before utility and account content in reading order.
- Environment information must be explicit text when shown; color alone must not communicate the environment.
- Help, account and sign-out controls require accessible names and consumer-owned behavior.
- Do not duplicate page actions or record status in the top bar.

## Main content and module relationship

- Keep the page canvas white. Hierarchy comes from spacing and discrete white modules with one light boundary, not from a gray application canvas.
- The first page module is normally `PageHeader`; subsequent content uses `WorkspaceSection` or a governed page layout.
- Maintain one module boundary. Nested Cards inside an already bounded module stay flat unless the Card is an independently identifiable object and no duplicate decorative boundary is introduced.
- Frame spacing must not be overridden per page merely to imitate another application.

## Responsive behavior

- Wide desktop: persistent navigation, top bar and full content area.
- Compact desktop: navigation may collapse to an accessible icon presentation while preserving destination names and current state. Supply `compactBrand` when the full brand lockup cannot fit the compact rail; do not squeeze, rotate or clip brand text into that rail.
- Single-column workspace: secondary rails move before the primary content in DOM and visual order as defined by the consuming layout.
- Narrow view: navigation becomes an accessible overlay or equivalent collapsed surface; page and section actions wrap below headings.
- Reflow must not change route, record selection, dirty state, authentication or business state.

Validate actual 1440, 1280, 900 and 720 CSS-pixel viewports. These are qualification viewports, not permission to encode consumer-specific breakpoint behavior into the shared API.

## Accessibility contract

- Provide distinct navigation, banner/top-bar and main landmarks.
- Preserve one page `h1` below the frame.
- Preserve logical DOM and keyboard order when regions move visually.
- Maintain visible focus and labelled icon-only controls.
- A collapsed navigation must retain all authorized destinations and expose its expanded state.

## Consumer responsibilities

The consumer owns route matching, navigation transitions, breadcrumbs, branding assets, account/session data, environment identity, authorization, sign-out, mobile open state and failure handling.

The consumer must not:

- copy a reference application's routes, navigation groups, roles or account model;
- apply legacy filled navigation skins over shared navigation items;
- place domain workflows or API calls inside the frame components;
- add page-specific shadows, gray canvases or nested decorative borders that contradict the shared module hierarchy.

## Application-specific exclusions

The frame does not govern configuration builders, quotation navigation, pricing workspaces, revision processes, bill-of-material flows, calculation-rule tools or other domain information architecture. Those experiences may use the frame, but their destinations, visibility and workflow remain application-owned.
