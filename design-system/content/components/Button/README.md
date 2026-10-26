Button is a text-only native button that defaults to `type="button"` and keeps the disabled, form and ref behaviour of a native button.

There are three button types and no others (Locke, 2026-10-26):

| Type | `appearance` | Use it for | Examples |
| --- | --- | --- | --- |
| Primary | `primary` | Moving the business process forward as normal, editing a record's properties, opening a form | Submit, Approve, Release, Edit, New record |
| Attention | `attention` | Commands the user should notice before running: starting a change or sending something back | Start change, Return, Send back for rework |
| Secondary | `secondary` (default) | Every other command | Cancel, Export, Refresh, Set not required |

- Attention is amber (Fluent Marigold) with dark text. It is never red; there is no danger button.
- A disabled button is the same neutral grey in all three types.
- `outline`, `subtle` and `transparent` are not accepted. ToggleButton, MenuButton and SplitButton are not part of the package; a low-frequency menu uses `MoreActionsMenu`.

For navigation use a Link. For a row command use `TableActionIconButton`, and for an icon-only command `IconButton`, both with an accessible label and a Tooltip.

The consumer provides the label, `onClick`, and any busy state. While saving, disable the button and show progress so it cannot submit twice.

- Primary fill is `brand-strong` with `on-brand-strong` text, not the lighter `brand`.
- Place buttons in a wrapping flex row with `space-s` between them. Keep them content width; do not use `width: 100%` or `flex: 1`, except for a deliberate full-width action such as sign-in.
- Do not add an icon, a polymorphic link, or a legacy skin over the button.
