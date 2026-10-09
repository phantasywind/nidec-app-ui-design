Toolbar groups the tools of a collection: search, filters, sort, refresh and paging. It is built from `Toolbar`, `ToolbarButton`, `ToolbarDivider` and `ToolbarGroup`, re-exported from Fluent unchanged.

Compose actions by task and do not insert a field's business state. Changing the query resets the page number; switching view with ViewModeToggle keeps search, filters and paging. Give the search a stable, explicit width so its clear button does not move neighbouring controls, and let groups wrap on narrow screens without changing their order.

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `small`, `medium`, `large` | `medium` |
| `vertical` | vertical layout | `false` |
| `checkedValues`, `defaultCheckedValues`, `onCheckedValueChange` | state of toggle items | none |

ToolbarButton takes the same `appearance` values as a button (`primary`, `subtle`, `transparent`) and an `icon`. An icon-only ToolbarButton needs an `aria-label` and a Tooltip.

- Give the Toolbar an `aria-label`.
- The consumer provides every control and its behaviour.

```tsx
<Toolbar aria-label="Directory tools">
  <SearchBox aria-label="Search records" placeholder="Search records" />
  <Tooltip content="Refresh" relationship="label">
    <ToolbarButton aria-label="Refresh" icon={<ArrowClockwiseRegular />} />
  </Tooltip>
</Toolbar>
```
