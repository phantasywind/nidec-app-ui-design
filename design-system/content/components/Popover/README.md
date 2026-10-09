Popover shows richer, context-specific information anchored to a trigger. It is built from `Popover`, `PopoverTrigger` and `PopoverSurface`, re-exported from Fluent unchanged.

Use it for short supporting detail. Do not use it for complex editing; use a Sheet (OverlayDrawer). Keep the surface opaque.

| Prop | Values | Default |
| --- | --- | --- |
| `open` / `defaultOpen`, `onOpenChange` | control the open state | `false` |
| `openOnHover` | open when the trigger is hovered | `false` |
| `openOnContext` | open as a context menu only | `false` |
| `positioning` | placement | none |
| `size` | `small`, `medium`, `large` | `medium` |
| `withArrow` | show an arrow | `false` |
| `trapFocus` | trap focus inside the surface | `false` |
| `inline` | render in DOM order instead of on `document.body` | `false` |
| `appearance` | `brand`, `inverted` | none |

- Put exactly a `PopoverTrigger` and a `PopoverSurface` inside. Set `disableButtonEnhancement` on the trigger when its child is already a button.
- By default the first focusable element in the surface receives focus when it opens.
- The consumer provides the trigger, the content and, if controlled, the open state.

```tsx
<Popover>
  <PopoverTrigger disableButtonEnhancement><Button>Show details</Button></PopoverTrigger>
  <PopoverSurface>Contextual information remains consumer-owned.</PopoverSurface>
</Popover>
```
