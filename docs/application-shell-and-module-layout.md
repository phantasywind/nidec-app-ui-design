# Application shell and module layout

## Purpose

This pattern governs the shared presentation of authenticated desktop application pages. It standardizes the visual relationship among the left navigation, top utility bar and right-side content modules without owning routes, permissions, runtime identity, account behavior or business navigation structure.

## Global shell

- Use a white application background. Do not use a full-page gray canvas to separate content.
- Keep the left navigation and top utility bar white, separated from content by a light neutral border.
- The left navigation remains visually stable across page changes. At desktop widths it occupies a bounded column; at narrower widths the application chooses an accessible collapsed or overlay treatment.
- The top bar identifies the current location and may host environment, help, account and sign-out controls. The consumer owns their content and behavior.

## Left navigation hierarchy

- Place the consumer-supplied application brand at the top. The shared package does not embed or reconstruct application logos.
- Divide destinations into short, uppercase group labels followed by icon-and-text navigation items.
- Use Fluent icons from an approved consumer dependency; do not create mismatched CSS glyphs.
- Navigation items stay on the white navigation surface without persistent filled tiles or shadows. The current destination uses a semibold brand-colored label and a narrow brand-green leading indicator.
- Hover, pressed and focus-visible states come from Fluent and the explicit theme. Do not overlay a legacy navigation skin.
- Keep system-level destinations such as administration separated at the bottom when the information architecture requires it.

Routes, labels, grouping, ordering, visibility and RBAC remain application-owned. The Design System governs only the visual and interaction presentation.

## Right-side content modules

- Build the page from discrete modules rather than one undifferentiated canvas.
- `PageHeader` is the first module. It contains the page identity, concise description and page-level actions.
- `WorkspaceSection` is the standard content module for forms, directories, tabs, lists, facts and supporting regions.
- Every module uses a white background, one light neutral border, the shared large radius and consistent internal padding.
- Peer modules are 12px apart (`spacingVerticalM`). Wrap them in `WorkspaceStack` rather than setting margins or a page-level gap per page.
- Use vertical whitespace between peer modules. Do not introduce a gray page background, heavy shadows or nested decorative borders to create hierarchy.
- A `Card` inside a bordered module represents a distinct object or summary but stays flat: no second border and no elevation shadow. `CardGalleryItem` applies this nested treatment by default. A standalone Card may establish its own boundary only when there is no surrounding module boundary.
- Data tables may meet the inner content edges according to the Data Table contract, but their horizontal overflow remains inside the module.

## Responsive and accessibility requirements

- Validate actual 1440, 1280, 900 and 720 CSS-pixel viewports.
- Navigation collapse must preserve the same destinations, accessible names, current-location state and keyboard reachability.
- At narrow widths, module actions move below headings and modules retain readable inline padding.
- Preserve one page `h1`, ordered section headings, visible focus and logical reading order.
- Layout reflow must not alter route, selection, authentication or business state.

The unified local showcase demonstrates this shell and module relationship with synthetic pages. It is presentation evidence only, not application acceptance.
