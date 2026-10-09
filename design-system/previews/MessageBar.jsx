// @card group="Forms" height=300 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',flexDirection:'column',gap:8}}>
    <MessageBar intent="info"><MessageBarBody><MessageBarTitle>Information</MessageBarTitle>The list was updated.</MessageBarBody></MessageBar>
    <MessageBar intent="success"><MessageBarBody><MessageBarTitle>Saved</MessageBarTitle>Your changes were saved.</MessageBarBody></MessageBar>
    <MessageBar intent="warning"><MessageBarBody><MessageBarTitle>Warning</MessageBarTitle>Some values are outside the usual range.</MessageBarBody></MessageBar>
    <MessageBar intent="error"><MessageBarBody><MessageBarTitle>Error</MessageBarTitle>The record could not be saved.</MessageBarBody></MessageBar>
  </div>;
}
