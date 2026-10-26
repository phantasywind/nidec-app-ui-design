IconButton is an icon-only command button that always has an accessible name. It is the package's own wrapper over Fluent's `Button`.

Use it for a command whose meaning is clear from the icon, such as refresh or add. A command that needs text uses Button. For a row command in a table use TableActionIconButton. Add a Tooltip with the same text as the accessible name.

| Prop | Values | Default |
| --- | --- | --- |
| `icon` | required; a Fluent icon element | none |
| `aria-label` | required; non-empty text | none |
| `appearance` | `secondary`, `primary` | `secondary` |
| `size` | `small`, `medium`, `large` | `medium` |
| `shape` | `rounded`, `circular`, `square` | `rounded` |
| `disabled` | boolean | `false` |
| `disabledFocusable` | keep a disabled button focusable | `false` |
| `onClick`, `type`, native button props | as on a native button | `type="button"` |

- It throws if `aria-label` is empty, and it takes no children.
- An icon-only command is never an attention action; give that command a text Button.
- The borderless icon buttons are fixed inside components and cannot be chosen: table row actions (`TableActionIconButton`), the FormDrawer close, the Pagination steps, the application frame's navigation toggle and icon-only ToolbarButtons. They count as the icon form of a secondary button.
- The consumer supplies the icon, the label and the handler, and decides what the command does and who may run it.
- Do not rely on hover to reveal it.

```tsx
<Tooltip content="Refresh" relationship="label">
  <IconButton aria-label="Refresh" icon={<ArrowClockwiseRegular />} onClick={reload} />
</Tooltip>
```
