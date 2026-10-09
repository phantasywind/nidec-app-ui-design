Button is a text-only native button that defaults to `type="button"` and keeps the disabled, form and ref behaviour of a native button.

Use it for commands: `appearance="primary"` for the one main action in a region, the default appearance for the rest. For navigation use a Link. For a row command use `TableActionIconButton`, and for an icon-only command `IconButton`, both with an accessible label and a Tooltip.

The consumer provides the label, `onClick`, and any busy state. While saving, disable the button and show progress so it cannot submit twice.

- Primary fill is `brand-strong` with `on-brand-strong` text, not the lighter `brand`.
- Place buttons in a wrapping flex row with `space-s` between them. Keep them content width; do not use `width: 100%` or `flex: 1`, except for a deliberate full-width action such as sign-in.
- Do not add an icon, a polymorphic link, or a legacy skin over the button.
