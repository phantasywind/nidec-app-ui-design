# List and Card view toggle

## Purpose

Use `ViewModeToggle` only when the same record collection can be presented as a List/Table view or a Card/Gallery view without changing its query, selection authority or business meaning. It is a compact presentation control, not a navigation tab, filter, workflow state or data mutation.

## Governed presentation

- Render two separate rounded icon buttons: List first, Card second.
- Each target is 32 by 32 CSS pixels and contains a consumer-supplied Fluent icon sized by Fluent's medium icon-button treatment.
- Keep exactly one XS horizontal spacing token between the buttons; with the current Fluent baseline this is 4 CSS pixels.
- Keep the view group one medium horizontal spacing token away from the preceding count, sort or filter control; with the current baseline this is 12 CSS pixels.
- Use a white button surface, light neutral boundary and small shared radius. The selected button uses a subtle neutral surface and brand foreground rather than a filled primary-action treatment.
- Do not join the two buttons into a segmented track and do not add visible text labels beside the icons in a compact directory toolbar.

## Interaction and accessibility contract

- The component is controlled through `value` and `onValueChange`; the consumer owns the current view and rendering.
- The container is one labelled group. Each icon button has a non-empty accessible label, Tooltip and `aria-pressed` state.
- List and Card buttons remain in stable DOM order. Pointer, Enter and Space use the same callback.
- Clicking the already selected view does not emit a redundant value change.
- Changing view must not silently alter filters, search text, sort order, selected record, pagination authority or fetched data.

Consumers supply the approved List and Card icons and localised labels. Data loading, route/query persistence, virtualization and whether a Card view is available remain consumer-owned.
