// @card group="Forms" height=130 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',gap:24,flexWrap:'wrap'}}><Field label="Quantity" style={{width:'12rem'}}><SpinButton defaultValue={12} min={0} max={100} /></Field><Field label="Small" style={{width:'12rem'}}><SpinButton size="small" defaultValue={3} /></Field></div>;
}
