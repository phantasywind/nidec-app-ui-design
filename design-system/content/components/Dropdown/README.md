Dropdown picks one value from a fixed list. Combobox accepts typed text to match options, for searchable or long lists.

Use Dropdown for short lists, with the arrow kept and no free text. Use Combobox for search: show the magnifier on the left and the arrow on the right. Import `Dropdown`, `Combobox` and `Option` from the package entry. Use the shared `Option` so option styling reaches the portal; do not use `Select` for new pages.

The consumer provides the option keys and labels, the selected key, filtering and any remote loading. Read the choice from `data.optionValue` or `data.selectedOptions` in `onOptionSelect`; `value` is display text, never an internal ID. Show a disabled "No matching results" option when nothing matches, and decide what happens to the old selection when the query is cleared.

- The list panel is white; hover and selected options use `brand-soft` with `brand-strong` text and a check mark.
- Bound the width to about 16rem for short options, with `max-width: 100%` and `min-width: 0`.
- Do not style options with global `option` CSS or by changing neutral tokens.
