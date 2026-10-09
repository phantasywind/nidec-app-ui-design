Switch is an immediate two-state setting, controlled through `checked` and `onChange(event, data.checked)`.

Use it for a setting that takes effect at once. For choices that are submitted later with a form, use Checkbox or RadioGroup.

The consumer provides the label, the state and the handler. Changing a Switch in the interface is not the same as saving; asynchronous effects, and what happens when saving fails, belong to the application.

- Give it a visible label that names the setting, not "On/Off".
- Do not use it for a mixed or partial state.
