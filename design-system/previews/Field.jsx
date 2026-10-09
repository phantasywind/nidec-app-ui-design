// @card group="Forms" height=300 subtitle="Live component"
function Demo() {
  return <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,16rem))',gap:'16px 24px',alignItems:'start'}}>
    <Field label="Order code" hint="Letters, digits and hyphens."><Input defaultValue="ORD-20418" /></Field>
    <Field label="Quantity" required validationState="error" validationMessage="Enter a quantity of 1 or more."><Input defaultValue="-3" /></Field>
    <Field label="Notes" style={{gridColumn:'1 / -1',maxWidth:'28rem'}}><Textarea rows={3} defaultValue="Multi-line text." /></Field>
  </div>;
}
