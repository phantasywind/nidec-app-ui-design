ViewModeToggle switches the same collection between List/Table and Card/Gallery presentations. It is a presentation control, not navigation, a filter, a workflow state or a data change.

Render two separate 32 by 32 icon buttons, List first and Card second, with `space-xs` (4px) between them. Keep the group `space-m` (12px) from the count, sort or filter control before it. Each button has a white surface, a light neutral boundary and a small radius. The selected button uses a subtle neutral fill and a brand-coloured icon, not a filled primary button. Do not join them into a track and do not add visible labels.

The consumer provides the approved List and Card icons, localised labels, the controlled `value` and `onValueChange`. Data loading, route or query persistence, virtualisation and whether a Card view exists belong to the application.

- The container is one labelled group. Each button has an accessible label, a Tooltip and `aria-pressed`.
- Pointer, Enter and Space call the same handler. Clicking the already selected view emits no change.
- Switching must not reset search text, filters, sort, selection, pagination or loaded data.
