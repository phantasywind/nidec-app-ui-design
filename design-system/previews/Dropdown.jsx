// @card group="Forms" height=260 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
    <Field label="Change type" style={{width:'16rem'}}><Dropdown defaultValue="Engineering change" defaultSelectedOptions={['eng']} open><Option value="com">Commercial change</Option><Option value="eng">Engineering change</Option><Option value="adm">Administrative change</Option></Dropdown></Field>
  </div>;
}
