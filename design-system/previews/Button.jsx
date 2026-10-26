// @card group="Actions" height=190 subtitle="Live component"
function Demo() {
  const row = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <div style={row}><Button appearance="primary">Submit</Button><Button appearance="attention">Return</Button><Button>Export</Button></div>
    <div style={row}><Button size="small" appearance="primary">Submit (small)</Button><Button size="small" appearance="attention">Start change (small)</Button><Button size="small">Cancel (small)</Button></div>
    <div style={row}><Button appearance="primary" disabled>Disabled primary</Button><Button appearance="attention" disabled>Disabled attention</Button><Button disabled>Disabled</Button></div>
  </div>;
}
