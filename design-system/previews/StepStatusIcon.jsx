// @card group="Feedback" height=110 subtitle="Live component"
function Demo() {
  const row = {display:'flex',gap:8,alignItems:'center'};
  return <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
    <span style={row}><StepStatusIcon status="done" label="Cutting: done on 22 Oct 2026" tooltip="Done on 22 Oct 2026" /> Cutting</span>
    <span style={row}><StepStatusIcon status="pending" label="Painting: not done" /> Painting</span>
    <span style={row}><StepStatusIcon status="notApplicable" label="Plating: not applicable" /> Plating</span>
    <span style={row}><StepStatusIcon status="done" size="small" label="Small: done" /> Small</span>
  </div>;
}
