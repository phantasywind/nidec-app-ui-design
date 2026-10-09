// @card group="Forms" height=250 subtitle="Live component"
function Demo() {
  return <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,16rem))',gap:'16px 24px',alignItems:'start'}}>
    <Field label="Normal"><Input defaultValue="Value" /></Field>
    <Field label="Read-only"><Input readOnly defaultValue="Read-only value" /></Field>
    <Field label="Disabled"><Input disabled defaultValue="Disabled" /></Field>
    <Field label="Invalid" validationState="error" validationMessage="Example validation message"><Input defaultValue="Invalid" /></Field>
    <Field label="Small" size="small"><Input size="small" defaultValue="Small control" /></Field>
    <Field label="Small, disabled" size="small"><Input size="small" disabled defaultValue="Disabled" /></Field>
  </div>;
}
