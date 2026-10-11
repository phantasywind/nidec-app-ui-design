BusinessProcessFlow shows a real business process with arrow-shaped stages, and opens a stage detail card below a reached stage when it is clicked. The current stage comes from authoritative application state, and users can only look back at stages already reached.

Pass each stage as `completed`, `current`, `upcoming` or `error` from the server or state machine, with a localised `statusLabel`. Control the viewed stage separately with `viewedStageId` and `onStageView`, which may only change the view or route. Never set the process state there. Upcoming stages render no button and cannot be clicked.

- The arrows are flat, with no outline. Reached stages are deep green and the viewed stage is the saturated brand green; without `viewedStageId` that is the current stage. Upcoming stages stay neutral grey and an error stage is red. A focus ring appears around an arrow only under keyboard focus.
- Advance, return or stop the process with clearly labelled Buttons, either in the stage detail card or outside the flow; the arrow itself never runs those commands.
- The flow keeps its order on narrow screens and scrolls horizontally inside its own bounds.

## Stage detail card

Pass `renderStageDetail` to give a reached stage a popover that opens below its arrow. Return a `BusinessProcessStageDetail`, or `undefined` for a stage without detail.

`BusinessProcessStageDetail` has, in order:

- `title` and `status`: the stage name and who or what it waits on, for example "Waiting for you (Engineer)".
- `checksTitle` and `checks`: the conditions for the next stage. Each check has a `label`, `met` (true shows a green tick, false a red cross), a localised `stateLabel` that screen readers announce for the icon, an optional `detail` line under the label and an optional trailing `action`, usually a Link to the field to fix.
- `actionsTitle` and `actions`: the commands the viewer can run, usually one primary and one secondary Button.
- `next`: what happens after this stage, under a divider.

Every part except `title` is optional. Interactive items in the card use the shared grey hover.

The consumer owns the stage definitions, transitions, permissions, validation, persistence, error handling and every check and action in the detail card; the package only displays the `met` value it is given. Do not use `ProcessStageIndicator`; it is deprecated.
