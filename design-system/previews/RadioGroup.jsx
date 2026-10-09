// @card group="Forms" height=170 subtitle="Live component"
function Demo() {
  const [v, setV] = useState('standard');
  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <Field label="Delivery"><RadioGroup value={v} onChange={(_, d) => setV(d.value)}><Radio value="standard" label="Standard" /><Radio value="extended" label="Extended" /><Radio value="custom" label="Custom" /></RadioGroup></Field>
  </div>;
}
