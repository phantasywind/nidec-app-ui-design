// @card group="Forms" height=250 subtitle="Live component"
function Demo() {
  return <Field label="Search records" style={{width:'16rem'}}><Combobox freeform defaultValue="Ex" placeholder="Search" open>{['Example Alpha','Example Beta','Example Gamma'].map(n => <Option key={n}>{n}</Option>)}</Combobox></Field>;
}
