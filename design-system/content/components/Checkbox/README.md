Checkbox is for choosing several items independently, or for batch selection.

`checked` is `boolean | 'mixed'`, and events keep `data.checked`. `mixed` means a partial selection; it is not a Switch value. Use RadioGroup for one choice among several, and Switch for an immediate two-state setting.

The consumer provides the checked state and handler, and the label. Parent-child selection and select-all logic belong to the application.

- Draw the box in `text-muted` and the checked fill in `brand-strong`.
- Give every checkbox a visible label.
