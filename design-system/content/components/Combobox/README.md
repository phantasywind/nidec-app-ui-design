Combobox accepts typed text to match options, for searchable or long lists. The package re-exports Fluent's `Combobox` and uses its own `Option` for the green hover and selected colours. Use Dropdown for a short, fixed list.

Show a magnifier on the left for search, and the arrow on the right. Import `Combobox` and `Option` from the package entry. Use the shared `Option` so the option colours also reach the popup.

| Prop | Values | Default |
| --- | --- | --- |
| `value` / `defaultValue` | the text shown in the box | none |
| `selectedOptions` / `defaultSelectedOptions` | array of selected option `value` keys | none |
| `onOptionSelect` | `(event, data) => void`, with `data.optionValue`, `data.optionText`, `data.selectedOptions` | none |
| `onChange` | native change event of the typed text, for filtering | none |
| `multiselect` | allow several selections | `false` |
| `freeform` | allow text that matches no option | `false` |
| `clearable` | show an icon that clears the value | `false` |
| `placeholder` | text shown when nothing is selected | none |
| `size` | `small`, `medium`, `large` | `medium` |
| `open`, `defaultOpen`, `onOpenChange` | control the popup | closed |
| `positioning` | popup placement | `below` |

Option:

| Prop | Values |
| --- | --- |
| `value` | unique key of the option; defaults to its text |
| `text` | display text, when the children are not a plain string |
| `disabled` | cannot be selected, but can still be reached by keyboard |

- Typing is not selecting. Filtering the list, remote loading, and the choice of selected key are the application's. Decide what happens to the old selection when the text is changed or cleared. If you control `selectedOptions`, also control `value`.
- Read the choice from `data.optionValue` or `data.selectedOptions`. `value` is display text, never an internal ID.
- When nothing matches, render one disabled Option such as "No matching results".
- Do not style options with global `option` CSS or by changing neutral tokens.

```tsx
<Field label="Search records" style={{ width: '16rem' }}>
  <Combobox
    freeform
    selectedOptions={selected}
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    onOptionSelect={(_, data) => { setSelected(data.selectedOptions); setQuery(data.optionText ?? ''); }}
  >
    {filtered.map((r) => <Option key={r.id} value={r.id}>{r.name}</Option>)}
    {filtered.length === 0 && <Option disabled value="none">No matching results</Option>}
  </Combobox>
</Field>
```
