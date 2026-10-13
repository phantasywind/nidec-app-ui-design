SingleSelectDropdown picks one value from a fixed list and switches automatically between a Dropdown and a searchable Combobox depending on how many options there are.

Below `searchThreshold` options (default 12) it renders a Dropdown; at the threshold and above it renders a Combobox that filters as you type. It uses the shared Option, so hover is grey and the selected option light green. Import it from the package entry and wrap it in a Field.

| Prop | Values | Default |
| --- | --- | --- |
| `options` | array of `{ value, text, disabled? }`; `value` is the unique key | required |
| `selectedOption` / `defaultSelectedOption` | the selected `value`, or `null` for none | `null` |
| `onOptionSelect` | `(event, { optionValue, optionText }) => void` | none |
| `searchThreshold` | option count at which the Combobox takes over | `12` |
| `noMatchText` | disabled row shown when typing matches nothing | `No matches` |
| `placeholder`, `size`, `appearance`, `disabled` | as on Dropdown | Fluent defaults |

- Typing only filters. The selection changes when an option is chosen; closing the list restores the selected text.
- Fluent's Combobox fires a select event with no value when the typed text matches nothing, and can keep a filtered-out option active. SingleSelectDropdown ignores both, so the handler only ever receives a real option.
- A selected value that is not in `options` throws. For several values use MultiSelectDropdown; for free text use Combobox with `freeform`.
