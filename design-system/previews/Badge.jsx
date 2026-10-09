// @card group="Forms" height=110 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
    <Badge appearance="tint" color="success">Ready</Badge>
    <Badge appearance="tint" color="warning">Review</Badge>
    <Badge appearance="tint" color="danger">Blocked</Badge>
    <Badge appearance="tint" color="informative">Draft</Badge>
    <Badge appearance="filled" color="brand">New</Badge>
    <Badge appearance="outline">Outline</Badge>
    <CounterBadge count={5} color="brand" />
  </div>;
}
