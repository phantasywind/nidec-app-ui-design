// @card group="Forms" height=130 subtitle="Live component"
function Demo() {
  const [v, setV] = useState(60);
  return <Field label={'Opacity: ' + v + '%'} style={{width:'18rem'}}><Slider min={0} max={100} value={v} onChange={(_, d) => setV(d.value)} /></Field>;
}
