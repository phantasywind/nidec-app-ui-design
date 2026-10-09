StageNavigator is clickable navigation among peer workspaces of one object. It behaves like Tabs, with circular numbered nodes.

Use it when a click only changes where the user is looking, not the business state. If the click changes business state, or you do not yet know, do not integrate it; record `Business Rule Pending`. For real lifecycles use BusinessProcessFlow.

The consumer provides unique stage ids, names, descriptions and each node's own status (the status sets the node colour), a separate `selectedStageId`, and `onStageSelect` that handles the route and content. A click must never rewrite a node's status just to look selected. Mouse, Enter and Space must do the same.

- The selected ring only shows where the user is viewing; it does not show progress. A future workspace can be opened early and keeps its grey fill.
- The connectors are structural, thin, brand-coloured, and gapped from the nodes. They do not change with status. Do not override their colour, weight or ends with page CSS.
