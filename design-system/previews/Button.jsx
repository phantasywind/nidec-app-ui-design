// @card group="Actions" height=190 subtitle="Live component"
function Demo() {
  const row = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <div style={row}><Button appearance="primary">Save</Button><Button>Cancel</Button><Button appearance="subtle">Subtle</Button><Button disabled>Disabled</Button><Button appearance="primary" disabled>Disabled primary</Button></div>
    <div style={row}><Button size="small" appearance="primary">Save (small)</Button><Button size="small">Cancel (small)</Button><Button size="small" appearance="subtle">Subtle (small)</Button><Button size="small" disabled>Disabled (small)</Button></div>
    <div style={row}><ToggleButton>Pin</ToggleButton><SplitButton menuButton={{'aria-label':'More save actions'}}>Save</SplitButton></div>
  </div>;
}
