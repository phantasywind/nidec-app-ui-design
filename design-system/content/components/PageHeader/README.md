PageHeader gives a page its identity: one title, an optional eyebrow and short description, and the page-level actions.

Use exactly one PageHeader and one main heading per page. Keep row-level commands in their rows, not in the header.

The consumer provides `title` (any content), and optionally `titleAdornment`, `description`, `eyebrow` and `actions` (usually Buttons). `titleAdornment` sits beside the title, for example a status Badge, and wraps under it on narrow screens. Routes, permissions and which actions appear belong to the application.

- Set the title in a semibold Fluent heading role and the description in `body1` with `text-secondary`.
- Put page actions in a wrapping row with `space-s` between them, content width, with at most one primary action.
- Sit the header on `canvas` above white modules; do not add a second border around it.
