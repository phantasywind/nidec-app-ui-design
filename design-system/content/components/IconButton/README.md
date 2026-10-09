IconButton is an icon-only command button that always needs an accessible name.

Pass the icon through `icon` and a non-empty `aria-label` (or `aria-labelledby`); add a Tooltip with the same name. The consumer supplies the Fluent icon, the handler and the label. For a row command in a table use TableActionIconButton. For commands with text use Button.

- It keeps the button's `type="button"` default.
- Do not rely on hover to reveal it.
