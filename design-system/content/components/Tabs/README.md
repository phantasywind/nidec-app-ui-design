Tabs switch peer views of the same object. The package re-exports Fluent's `TabList` and `Tab` unchanged.

Do not use them for workflow stages or as a lifecycle transition. For a mode switch inside a field use InlineModeTabs, and for a compact mode choice use SegmentedControl.

TabList:

| Prop | Values | Default |
| --- | --- | --- |
| `selectedValue` / `defaultSelectedValue` | the `value` of the selected Tab | none |
| `onTabSelect` | `(event, data) => void`, with `data.value` | none |
| `appearance` | `transparent`, `subtle`, `subtle-circular`, `filled-circular` | `transparent` |
| `size` | `small`, `medium`, `large` | `medium` |
| `vertical` | arrange tabs vertically | `false` |
| `selectTabOnFocus` | selecting happens on focus | `false` |
| `reserveSelectedTabSpace` | keep tab width stable between states | `true` |
| `disabled` | disables all tabs | `false` |

Tab takes `value` and `disabled`.

- Bind each Tab to a content panel with matching ids, `role="tabpanel"` and `aria-labelledby`, and render only the selected panel.
- The consumer provides the tab values, the selected value and the panels.

```tsx
<TabList selectedValue={tab} onTabSelect={(_, data) => setTab(data.value)}>
  <Tab value="overview">Overview</Tab>
  <Tab value="history">History</Tab>
</TabList>
```
