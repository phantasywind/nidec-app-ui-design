# Lookup & LookupSearchWindow

Import from `@phantasywind/nidec-app-ui-design`:

```ts
import { Lookup, LookupSearchWindow, createLookupAnchor } from '@phantasywind/nidec-app-ui-design';
```

## Purpose

Use `Lookup` when a user picks a record from a large or multi-attribute catalog (for example hundreds or thousands of parts, suppliers, or master records) where a single-column `Dropdown` or `Combobox` cannot show enough context.

- **`Lookup<TItem>`**: A read-only input with a magnifying glass icon (`aria-haspopup="dialog"`). Clicking it, pressing `Enter` / `F4` / `ArrowDown` / `Space`, or typing any printable character opens an anchored `LookupSearchWindow` next to the field (seeding any typed character into the search box). Pressing `Delete` or `Backspace` calls `onClear` without opening the window.
- **`LookupSearchWindow<TItem>`**: Can also be rendered directly next to a table cell or custom trigger using `createLookupAnchor(rect)`.
- **Equal-height optional manual mode**: When `manualMode` is supplied, the header shows a `SegmentedControl` toggling between list lookup and custom manual entry. Both panels keep a `300px` body height so the footer actions stay stationary while switching modes.

## Keyboard & Selection Contract

| Gesture | Behavior |
| --- | --- |
| Click, `Enter`, `F4`, `ArrowDown`, `Space` on `Lookup` | Opens `LookupSearchWindow` anchored below (with automatic four-corner fallback). |
| Printable character on `Lookup` | Opens `LookupSearchWindow` with that character pre-filled in `SearchBox`. |
| `Delete` / `Backspace` on `Lookup` | Calls `onClear()` when `value !== null` without opening the window. |
| `ArrowUp` / `ArrowDown` in `SearchBox` | Moves the highlighted row and scrolls it into view. |
| `Enter` in `SearchBox` | Selects the highlighted row, the sole matching row, or an exact key match to the typed query. |
| Click row / Double-click row | Single click highlights the row; double-click or clicking the primary `Select` button confirms and closes. |
| `Escape` / outside click / `Cancel` / close icon | Closes without changing selection. |

## Ownership Boundary

- **Design System owns**: trigger visual shell, magnifying glass glyph, anchored `PopoverSurface` geometry (`760px` max responsive width, `300px` scrollable table body, sticky headers), column sorting UI, keyboard navigation, highlight tokens, empty/loading layouts, and optional manual-mode switcher chrome.
- **Adopting application owns**: data fetching, caching, remote pagination/limits, display text formatting (`displayValue`), secondary filter controls (`filterSlot`), manual-mode fields and validation (`manualMode`), and persistence.
