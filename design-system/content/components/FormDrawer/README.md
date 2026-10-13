FormDrawer is the right-hand sheet for viewing or editing one record without leaving the page: a title with a close icon button, a scrolling body and right-aligned footer commands.

Use it for detailed editing from a list. Use a Dialog for a short confirmation or one decision, and a page of its own for a flow with its own route (see the page selection guide). Import `FormDrawer` from the package entry.

| Prop | Values | Default |
| --- | --- | --- |
| `open` | boolean | required |
| `onDismiss` | called by the close button, Escape and a backdrop click | required |
| `title` | the sheet's heading | required |
| `actions` | footer Buttons: the primary command first, then Cancel | none |
| `size` | `medium` (592 px) or `large` (940 px) | `medium` |
| `closeLabel` | accessible name and tooltip of the close button | `Close` |

- `onDismiss` is the guard for unsaved work: close the sheet there, or ask first and keep it open.
- Focus moves into the sheet when it opens, stays there, and returns to the trigger when it closes.
- Package components inside the sheet keep their styles, because NidecProvider mounts portals inside its own scope.
- Fields, validation, saving and busy states belong to the application. A busy save disables the commands and keeps their labels.
