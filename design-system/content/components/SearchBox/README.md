SearchBox is a search entry with a magnifier and a clear button. The package re-exports Fluent's `SearchBox` unchanged; it accepts the same props as Input except `type`.

Give it a visible or accessible label (`aria-label`) and a stable, explicit width. Do not change only the placeholder and call it search: filtering, debouncing, cancelling requests and the meaning of the query belong to the application, and changing the query resets paging.

| Prop | Values | Default |
| --- | --- | --- |
| `value` / `defaultValue` | string; use one, not both | none |
| `onChange` | `(event, data) => void`, with `data.value` | none |
| `size` | `small`, `medium`, `large` | `medium` |
| `appearance` | `outline`, `underline`, `filled-darker`, `filled-lighter` | `outline` |
| `placeholder` | hint text | none |
| `contentBefore`, `dismiss` | override the magnifier and the clear control | defaults |

- When the clear button is clicked, `onChange` is called with a mouse event and an empty `data.value`. Handle both.

```tsx
<SearchBox
  aria-label="Search records"
  placeholder="Search records"
  value={query}
  onChange={(_, data) => { setQuery(data.value); setPage(0); }}
/>
```
