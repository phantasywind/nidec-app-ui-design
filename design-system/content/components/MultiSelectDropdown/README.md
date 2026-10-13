MultiSelectDropdown picks several values from a fixed list. It is Fluent's `Dropdown` in multiselect mode, with the shared `Option` and the selected values shown as tags in the trigger.

Use it when a field takes several values from a short, fixed list, such as categories or regions. For a single value use Dropdown; to search a long list use Combobox with `multiselect`; when people should see every choice at once use Checkbox. Import `MultiSelectDropdown` from the package entry and wrap it in a Field.

| Prop | Values | Default |
| --- | --- | --- |
| `options` | array of `{ value, text, disabled? }`; `value` is the unique key, `text` the label | required |
| `selectedOptions` / `defaultSelectedOptions` | array of selected option `value` keys | none |
| `onOptionSelect` | `(event, data) => void`, with `data.optionValue` (the toggled key) and `data.selectedOptions` (the whole selection) | none |
| `maxVisibleTags` | tags shown in the trigger before the rest collapse into a count tag | `2` |
| `formatOverflowText` | `(hiddenCount) => string`, the count tag's text | `+N` |
| `placeholder` | text shown when nothing is selected | none |
| `size` | `small`, `medium`, `large` | `medium` |
| `disabled`, `open`, `defaultOpen`, `onOpenChange`, `positioning` | as Dropdown | |

- The popup stays open while people tick options. Each option shows a check box; a hovered option uses the shared neutral grey hover with `brand-strong` text and a selected option uses `brand-soft` with `brand-strong` text.
- The trigger shows the selected values as `brand` tags, extra-small, in the order of `options`. Selections beyond `maxVisibleTags` collapse into one count tag. The tags are not buttons: people remove a value by unticking it in the list. Screen readers hear the full comma-separated list.
- The selection and its meaning are the application's: which keys are valid, limits on how many, defaults, and what is submitted. Read the whole selection from `data.selectedOptions`. Every selected key must be one of the `options`; the component throws otherwise, as it does for duplicate or empty values.
- Bound the width as for Dropdown: about 16rem for short options, with `max-width: 100%` and `min-width: 0`. Raise `maxVisibleTags` only if the field is wide enough to show the tags without truncation.
- `clearable` is not supported in multiselect mode. Offer a separate action if people need to clear everything at once.

```tsx
<Field label="Categories" style={{ width: '16rem', maxWidth: '100%', minWidth: 0 }}>
  <MultiSelectDropdown
    placeholder="Select categories"
    options={categories.map((c) => ({ value: c.id, text: c.name }))}
    selectedOptions={selected}
    onOptionSelect={(_, data) => setSelected(data.selectedOptions)}
  />
</Field>
```

## Tags below the trigger

Set `tagPlacement="below"` when people pick many values or need to remove them one by one. The trigger stays one line and shows `formatSelectionSummary` (default "3 selected"), and every selected value appears under it as a small removable tag that wraps onto more lines, followed by a Clear all action.

| Prop | Values | Default |
| --- | --- | --- |
| `tagPlacement` | `trigger` or `below` | `trigger` |
| `searchable` | type to filter the list, with a "no matches" row; only with `below` | `false` |
| `formatSelectionSummary` | `(count) => string` for the trigger | `N selected` |
| `selectionLabel` | accessible name of the tag list | `Selected values` |
| `formatRemoveLabel` | `(text) => string`, each tag's remove button name | `Remove <text>` |
| `clearAllLabel`, `noMatchText` | localised labels | `Clear all`, `No matches` |

Removing a tag or clearing all calls `onOptionSelect` with the new `selectedOptions`; `optionValue` is the removed value, or undefined for Clear all. Hover and selected colours are the same as single selection: grey hover, light-green selected option.
