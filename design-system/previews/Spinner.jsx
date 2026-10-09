// @card group="Forms" height=140 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',flexDirection:'column',gap:16}}><Spinner size="tiny" label="Loading records" labelPosition="after" /><ProgressBar value={0.65} aria-label="Example progress" /></div>;
}
