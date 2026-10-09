Input is a single-line text entry that keeps Fluent's upstream props and ref behaviour.

Use it for names, codes and short text. Use Textarea for long text, Dropdown or Combobox for choosing from options, DatePicker for dates, and SpinButton for numbers. Wrap it in a Field so the label, hint and error stay attached.

The consumer provides the value, the change handler, the label, and any validation text. Validation rules and required-ness belong to the application.

- Choose the Fluent size: medium by default, small for dense row editing.
- Draw the edge in `text-muted`. Bound the width with `max-width: 100%` and `min-width: 0`; an Input does not fill the page unless its container does.
- Use `readOnly` for copyable data and `disabled` only for controls that cannot be used. Do not use `disabled` to fake read-only.
- A placeholder is not a label.
