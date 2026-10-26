// @card group="Forms" height=320 subtitle="Live component"
function Demo() {
  const [open, setOpen] = useState(false);
  return <div><Button onClick={() => setOpen(true)}>Open sheet</Button>
    <OverlayDrawer open={open} onOpenChange={(_, d) => setOpen(d.open)} position="end" size="medium" aria-label="Record details">
      <DrawerHeader><DrawerHeaderTitle action={<Tooltip content="Close" relationship="label"><IconButton aria-label="Close" icon={<Icons.Dismiss />} onClick={() => setOpen(false)} /></Tooltip>}>Record details</DrawerHeaderTitle></DrawerHeader>
      <DrawerBody><Field label="Name"><Input defaultValue="Example Alpha" /></Field></DrawerBody>
      <DrawerFooter><Button appearance="primary" onClick={() => setOpen(false)}>Save</Button><Button onClick={() => setOpen(false)}>Cancel</Button></DrawerFooter>
    </OverlayDrawer></div>;
}
