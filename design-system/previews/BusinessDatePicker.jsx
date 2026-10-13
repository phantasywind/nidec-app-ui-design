// @card group="Forms" height=470 subtitle="Live component"
function Demo() {
  const [value, setValue] = useState('2026-10-22');
  return <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
    <Field label="Due date" hint={`Value: ${value ?? 'none'}`} style={{width:'16rem'}}><BusinessDatePicker value={value} onValueChange={setValue} /></Field>
    <Field label="Small, in a dense row" style={{width:'12rem'}}><BusinessDatePicker size="small" value={null} onValueChange={() => undefined} /></Field>
  </div>;
}
