FactList shows read-only label and value pairs, such as a record's owner, dates and references, in a responsive grid: a small grey label above a semibold value.

Use it for summaries and record overviews. For values people edit, use a form with Field. Import `FactList` from the package entry and place it inside a WorkspaceSection.

| Prop | Values | Default |
| --- | --- | --- |
| `facts` | array of `{ label, value? }`; `label` is required text, `value` any content | required |
| `title` | optional group heading above the facts, in semibold body text | none |
| `headingLevel` | `2`, `3` or `4` for the group heading | `3` |
| `emptyValue` | shown, in grey regular text, for an undefined, null or empty value | `—` |
| `minColumnWidth` | narrowest column before the grid wraps to fewer columns | `12rem` |

- The pairs are a description list (`dl`, `dt`, `dd`), so screen readers keep each label with its value.
- Several groups in one section are several FactLists, each with its own `title`.
- Format dates, numbers and units before passing them; what a value means stays with the application. Never use colour alone for a state value; use a Badge with text.
