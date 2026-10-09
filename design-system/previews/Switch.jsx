// @card group="Forms" height=110 subtitle="Live component"
function Demo() {
  const [on, setOn] = useState(true);
  return <div style={{display:'flex',flexDirection:'column',gap:4}}><Switch checked={on} onChange={(_, d) => setOn(d.checked)} label="Email notifications" /><Switch label="Off by default" /></div>;
}
