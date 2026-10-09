// @card group="Forms" height=170 subtitle="Live component"
function Demo() {
  return <Field label={{ children: (_, slotProps) => <InfoLabel {...slotProps} info="Letters, digits and hyphens. Shown on hover or focus.">Order code</InfoLabel> }} style={{width:'16rem'}}><Input defaultValue="ORD-20418" /></Field>;
}
