// @card group="Forms" height=120 subtitle="Live component"
function Demo() {
  const [v, setV] = useState('engineering');
  return <div style={{display:'flex',flexDirection:'column',gap:12}}>
    <SegmentedControl aria-label="Change type" options={[{value:'commercial',label:'Commercial change'},{value:'engineering',label:'Engineering change'}]} value={v} onValueChange={(_, x) => setV(x)} />
    <SegmentedControl aria-label="Change type, medium" size="medium" options={[{value:'commercial',label:'Commercial change'},{value:'engineering',label:'Engineering change'}]} value={v} onValueChange={(_, x) => setV(x)} />
  </div>;
}
