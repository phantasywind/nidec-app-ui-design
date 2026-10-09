// @card group="Forms" height=240 subtitle="Live component"
function Demo() {
  return <div style={{maxWidth:'28rem',display:'flex',flexDirection:'column',gap:16}}>
    <Field label="Notes" hint="Multi-line text. The height follows content."><Textarea rows={4} defaultValue={'First line\nSecond line'} /></Field>
    <Field label="Read-only notes"><Textarea readOnly rows={2} defaultValue="Copyable but not editable." /></Field>
  </div>;
}
