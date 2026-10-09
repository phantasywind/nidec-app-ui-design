MessageBar shows a status message with a title, body and optional actions. The package re-exports Fluent's `MessageBar`, `MessageBarBody`, `MessageBarTitle` and `MessageBarActions` unchanged.

Use it for status or errors near what they affect. An important error must also appear next to its field, not only here. The intent carries an icon, so colour is not the only cue. What counts as a warning, success or error is an application decision.

| Prop | Values | Default |
| --- | --- | --- |
| `intent` | `info`, `success`, `warning`, `error` | `info` |
| `shape` | `rounded` for component-level messages, `square` for page-level messages | `rounded` |
| `layout` | `singleline`, `multiline`, `auto` | `auto` |
| `politeness` | `polite`, `assertive`; how screen readers announce it | not set |

- Put the title and text in `MessageBarBody`. Put buttons in `MessageBarActions`; its `containerAction` slot holds the dismiss button.
- The consumer provides the intent, the text and any actions, and removes the bar when dismissed.

```tsx
<MessageBar intent="warning">
  <MessageBarBody>
    <MessageBarTitle>Warning</MessageBarTitle>
    Some values are outside the usual range.
  </MessageBarBody>
</MessageBar>
```
