// @card group="Forms" height=320 subtitle="Live component"
function Demo() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
    <DialogTrigger disableButtonEnhancement><Button>Open dialog</Button></DialogTrigger>
    <DialogSurface><DialogBody><DialogTitle>Edit details</DialogTitle><DialogContent>Application-owned fields and state.</DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Close</Button><Button appearance="primary" onClick={() => setOpen(false)}>Save</Button></DialogActions></DialogBody></DialogSurface>
  </Dialog>;
}
