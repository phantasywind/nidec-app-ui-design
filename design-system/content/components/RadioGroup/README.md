RadioGroup with Radio is one set of mutually exclusive choices, controlled through the group's `value` and `onChange(event, data.value)`.

Use it when the options are few or need short explanations and the user should see all of them. For a compact immediate mode switch use SegmentedControl, and for a long list use Dropdown or Combobox.

The consumer provides the group label, stable names and values, and the default selection. What each option means is an application decision.

- Always label the group.
- Use one Radio group per question.
