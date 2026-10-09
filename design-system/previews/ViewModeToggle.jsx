// @card group="Page building blocks" height=100 subtitle="Live component"
function Demo() {
  const [v, setV] = useState('list');
  return <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{color:'var(--text-secondary)'}}>12 records</span><ViewModeToggle aria-label="Directory view" value={v} onValueChange={(_, x) => setV(x)} listIcon={<Icons.List />} cardIcon={<Icons.Grid />} /></div>;
}
