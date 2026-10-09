Menu holds secondary or low-frequency commands behind a trigger. It is built from `Menu`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem` and `MenuDivider`, re-exported from Fluent unchanged.

Use it for commands, not for choosing a field value; use Dropdown for a field. Put a row's less common commands in a Menu behind a labelled overflow trigger. Keep the popup opaque.

Menu:

| Prop | Values | Default |
| --- | --- | --- |
| `open` / `defaultOpen` | boolean | `false` |
| `onOpenChange` | `(event, data) => void`; `data.open` is the requested state | none |
| `openOnHover` | open on hover | `false` |
| `openOnContext` | open on right click only, removing other open interactions | `false` |
| `persistOnItemClick` | keep the menu open after an item is clicked | `false` |
| `positioning` | popup placement | none |
| `inline` | render in DOM order instead of on `document.body` | `false` |

MenuItem takes `onClick`, `disabled`, `persistOnClick` and `hasSubmenu`. MenuTrigger takes `disableButtonEnhancement`; set it when the child is already a button.

- The consumer provides the items, handlers, enabled state and permissions.
- Give an icon-only trigger an accessible name and a Tooltip.

```tsx
<Menu>
  <MenuTrigger disableButtonEnhancement><Button>Actions</Button></MenuTrigger>
  <MenuPopover><MenuList>
    <MenuItem onClick={duplicate}>Duplicate</MenuItem>
    <MenuItem onClick={archive}>Archive</MenuItem>
    <MenuDivider />
    <MenuItem onClick={exportRecord}>Export</MenuItem>
  </MenuList></MenuPopover>
</Menu>
```
