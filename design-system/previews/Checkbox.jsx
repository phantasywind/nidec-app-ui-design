// @card group="Forms" height=140 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',flexDirection:'column',gap:4}}><Checkbox defaultChecked label="Show supporting details" /><Checkbox checked="mixed" label="Mixed (partial selection)" /><Checkbox label="Unchecked" /><Checkbox disabled label="Disabled" /></div>;
}
