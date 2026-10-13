ApplicationNavigation is the white, flat navigation surface of the application frame.

Place the consumer's brand first, then short group labels, each followed by icon-and-text destinations. Use Fluent icons from an approved consumer dependency; do not draw mismatched CSS glyphs. The current destination uses the brand foreground, semibold text, a narrow leading marker and the current-location semantics, so colour is not the only cue. Hover, press and focus come from Fluent and the theme.

Do not use persistent filled tiles, shadows, decorative cards or a legacy navigation skin.

- `footer` pins content to the bottom of the navigation, above a light divider: system destinations, the version or an environment note. The navigation is one viewport tall and sticky, so the footer stays in view on long pages.
- `badge` on ApplicationNavigationItem adds a trailing count or status, for example a `CounterBadge`. In the compact icon rail it shrinks onto the icon's corner.

The consumer provides labels, icons, order, routes, visibility and authorization. For a true resource hierarchy use Tree; for ordinary peer pages do not.
