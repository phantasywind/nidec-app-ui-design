BusinessProcessFlow shows a real business process with arrow-shaped stages. The current stage comes from authoritative application state, and users can only look back at stages already reached.

Pass each stage as `completed`, `current`, `upcoming` or `error` from the server or state machine, with a localised `statusLabel`. Control the viewed stage separately with `viewedStageId` and `onStageView`, which may only change the view or route. Never set the process state there. Upcoming stages render no button and cannot be clicked.

- The arrow fill shows process state only. The viewed stage gets a thin brand outline offset around its arrow, with no glow or hover border.
- Advance, return or stop the process with clearly labelled Buttons or Menu items outside the flow; the arrow never runs those commands.
- The flow keeps its order on narrow screens and scrolls horizontally inside its own bounds.

The consumer owns the stage definitions, transitions, permissions, validation, persistence and error handling. Do not use `ProcessStageIndicator`; it is deprecated.
