OverlayDrawer, called a Sheet in the guidance, edits a record or shows detail without leaving the current page. It is built from DrawerHeader, DrawerHeaderTitle, DrawerBody and DrawerFooter.

Use it for detailed editing that would be too much for a Dialog, and for a directory's contextual detail. Keep the header, a scrollable body and a footer with the actions.

The consumer provides the open, busy and dirty state. Apply one closing policy to every entry point, prevent accidental closing while saving, and check focus, Escape and focus return.

- Keep it in the Provider tree with the default portal; the surface stays opaque.
