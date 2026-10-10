// @card group="Forms" height=280 subtitle="Live component"
function Demo() {
  const options = [{value:'a',text:'Example Alpha'},{value:'b',text:'Example Beta'},{value:'c',text:'Example Gamma'},{value:'d',text:'Example Delta'},{value:'e',text:'Example Epsilon',disabled:true}];
  const [selected, setSelected] = useState(['a','b','c']);
  return <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
    <Field label="Categories" style={{width:'16rem',maxWidth:'100%',minWidth:0}}><MultiSelectDropdown options={options} selectedOptions={selected} onOptionSelect={(_, data) => setSelected(data.selectedOptions)} placeholder="Select categories" open /></Field>
    <Field label="Regions" style={{width:'16rem',maxWidth:'100%',minWidth:0}}><MultiSelectDropdown options={options} placeholder="Select regions" /></Field>
  </div>;
}
