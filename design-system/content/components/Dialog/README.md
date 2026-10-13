Dialog is a focused confirmation or short task, built from DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent and DialogActions.

Use it only for a short confirmation, entering a reason, or a reminder. Every form or checklist that opens over the page goes in a FormDrawer instead (shared rule). Keep the title, focus trap, Escape and focus return to the trigger. Keep Dialogs inside the NidecProvider tree and use the default portal.

The consumer provides the open, busy and dirty state, and one closing policy for every way to close: while saving, or with unsaved changes, `onOpenChange` should refuse to close and show an application-owned discard prompt.

- The surface is opaque white.
- Check initial focus, Tab containment, Escape, backdrop and returned focus in the real application.
