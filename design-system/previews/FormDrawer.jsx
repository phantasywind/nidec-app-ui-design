// @card group="Forms" height=520 subtitle="Live component"
function Demo() {
  const [open, setOpen] = useState(true);
  return <div><Button onClick={() => setOpen(true)}>Edit record</Button>
    <FormDrawer open={open} onDismiss={() => setOpen(false)} title="Edit record" actions={<><Button appearance="primary" onClick={() => setOpen(false)}>Save</Button><Button onClick={() => setOpen(false)}>Cancel</Button></>}>
      <div style={{display:'grid',gap:12}}>
        <Field label="Name"><Input defaultValue="Example Alpha" /></Field>
        <Field label="View"><SegmentedControl aria-label="View" value="list" onValueChange={() => undefined} options={[{value:'list',label:'List'},{value:'cards',label:'Cards'}]} /></Field>
        <Field label="Notes"><Textarea defaultValue="Portal content keeps the package styles." /></Field>
      </div>
    </FormDrawer></div>;
}
