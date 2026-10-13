// @card group="Forms" height=300 subtitle="Live component"
function Demo() {
  const options = [{value:'a',text:'Example Alpha'},{value:'b',text:'Example Beta'},{value:'c',text:'Example Gamma'},{value:'d',text:'Example Delta'},{value:'e',text:'Example Epsilon',disabled:true}];
  const many = Array.from({length: 16}, (_, i) => ({value:`m${i}`, text:`Example item ${String(i + 1).padStart(2, '0')}`}));
  const [selected, setSelected] = useState(['a','b','c']);
  const [below, setBelow] = useState(['m0','m2','m4','m5','m9']);
  return <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
    <Field label="Categories" style={{width:'16rem',maxWidth:'100%',minWidth:0}}><MultiSelectDropdown options={options} selectedOptions={selected} onOptionSelect={(_, data) => setSelected(data.selectedOptions)} placeholder="Select categories" /></Field>
    <Field label="Regions" style={{width:'16rem',maxWidth:'100%',minWidth:0}}><MultiSelectDropdown options={options} placeholder="Select regions" /></Field>
    <Field label="Items (tags below, searchable)" style={{width:'20rem',maxWidth:'100%',minWidth:0}}><MultiSelectDropdown tagPlacement="below" searchable options={many} selectedOptions={below} onOptionSelect={(_, data) => setBelow(data.selectedOptions)} placeholder="Search items" /></Field>
  </div>;
}
