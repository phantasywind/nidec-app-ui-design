Textarea is a multi-line text entry with `onChange(event, data.value)`, and it supports ref, `readOnly` and `disabled`.

Use it for notes and descriptions that need several lines. Let it fill a bounded form region; do not force it to a single-line height. Wrap it in a Field.

The consumer provides the value, change handler, label and validation text.

- Read-only and disabled are different: do not turn read-only text into a non-focusable disabled control.
- Fluent's Textarea object ref has an upstream typing limit in the package's strict setup. Use a callback ref, or check your compiler settings before using an object ref.
