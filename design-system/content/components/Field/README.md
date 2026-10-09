Field wraps an Input, Textarea, Dropdown or other control with its label, hint, required mark and validation message in one place.

Use it for every labelled form control so the label, hint and error stay attached to the input. Use Textarea for multi-line text; its height follows its content and is not fixed to a single row.

The consumer provides the label, the control, the validation state and the message text. Validation rules, required-ness and error wording belong to the application.

- Show the error under the control, in `danger` text with a word, not colour alone.
- Draw the input edge in `text-muted`, not `border`.
- Bound the width: about 16rem for short codes and dates, 12rem for quantities, up to 28rem for names, each with `max-width: 100%` and `min-width: 0`. A Field in a Grid stretches unless you bound it.
- Use `readOnly` for copyable data; do not use `disabled` to fake it.
