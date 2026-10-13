// @card group="Forms" height=360 subtitle="Live component"
function Demo() {
  const few = ['Alpha','Beta','Gamma','Delta'].map((t, i) => ({value:`f${i}`, text:`Example ${t}`}));
  const many = Array.from({length: 20}, (_, i) => ({value:`m${i}`, text:`Example item ${String(i + 1).padStart(2, '0')}`}));
  const [a, setA] = useState('f1');
  const [b, setB] = useState(null);
  return <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
    <Field label="Short list (Dropdown)" style={{width:'16rem'}}><SingleSelectDropdown options={few} selectedOption={a} onOptionSelect={(_, d) => setA(d.optionValue)} /></Field>
    <Field label="20 items (type to filter)" style={{width:'16rem'}}><SingleSelectDropdown options={many} selectedOption={b} onOptionSelect={(_, d) => setB(d.optionValue)} placeholder="Type to search" /></Field>
  </div>;
}
