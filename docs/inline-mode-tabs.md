# Inline Mode Tabs Governance

Status: SHARED MAINLINE CONTRACT / NOT INCLUDED IN IMMUTABLE `0.1.0-rc.2`

## Purpose

`InlineModeTabs` switches the editing mode and visible panel of one nearby local editor without changing the surrounding page, record or business state. It is business-neutral: option labels, values, validation, draft data, saving, authorization and side effects remain consumer-owned.

## Selection rule

Use this component only when all of the following are true:

- two or a small number of short options describe alternative ways to edit the same property;
- the surrounding context remains unchanged;
- switching changes only the adjacent editor panel;
- no save, submit, route change or lifecycle transition occurs on selection.

Use a higher-level `SegmentedControl` when the mutually exclusive mode needs stronger page or section prominence. Use page/workspace Tabs for navigation. Use `RadioGroup` or another qualified choice composition for many, long or explanatory options. Do not use `InlineModeTabs` for workflow state, RBAC, destructive commands, boolean settings or immediate business effects.

## Visual contract

- The neutral circular track uses theme tokens, a thin neutral border and `spacingVerticalXXS` inset.
- The track uses `width: fit-content` and `max-width: 100%`; it must not stretch to the width of a Field, Grid or container.
- Each Fluent Tab is 20 CSS pixels high, remains one line and sizes from its label. Options are not forced to equal width.
- The selected Tab uses `colorBrandBackground`, `colorNeutralForegroundOnBrand`, semibold text and `shadow2`.
- Unselected hover uses a subtle neutral surface and brand foreground.
- Fluent pending and selected underline indicators are suppressed so they never overlap the pill selection state.
- Focus and disabled states remain Fluent-owned. No raw brand color or legacy skin may be layered over the component.

## Panel composition

The pill does not own external margin. Place it and its controlled panel in a start-aligned composition with `spacingVerticalXS` between them. Each option supplies unique `tabId` and `panelId` values. Render the active panel with the matching `id`, `aria-labelledby` and `role="tabpanel"`.

When several local editors appear as repeated rows, give their editor column one stable constrained width. Do not let each row derive that column from the intrinsic width of its currently visible Select, Input or other panel: switching modes or changing panel type must not move the pill's inline-start position.

```tsx
<div className="local-editor-mode">
  <InlineModeTabs
    aria-label="Editor mode"
    options={[
      { value: 'reference', label: 'Reference', tabId: 'mode-reference', panelId: 'panel-reference' },
      { value: 'manual', label: 'Manual', tabId: 'mode-manual', panelId: 'panel-manual' },
    ]}
    value={mode}
    onValueChange={(_, nextMode) => setMode(nextMode)}
  />
  <div id={`panel-${mode}`} aria-labelledby={`mode-${mode}`} role="tabpanel">
    {mode === 'reference' ? <ReferenceEditor /> : <ManualEditor />}
  </div>
</div>
```

The local composition should use:

```css
.local-editor-mode {
  display: grid;
  gap: var(--spacingVerticalXS);
  justify-items: start;
  min-width: 0;
}
```

## State and interaction

- The component is controlled; the selected value must match one option.
- There must be at least two options. Values, labels, Tab IDs and panel IDs are non-empty and unique.
- Keyboard interaction follows Fluent `TabList` behavior.
- The tabs do not submit an enclosing Form.
- The consumer retains draft values for every mode while another panel is visible. Switching visibility must not clear inactive-mode input.
- Final validation, persistence, API calls, permissions and business effects remain consumer-owned.

## Version boundary

The implementation is present on shared mainline but is not part of immutable package `0.1.0-rc.2`. It becomes consumable only after a new exact version is qualified and published; consumer application evidence does not retroactively change prior package contents.
