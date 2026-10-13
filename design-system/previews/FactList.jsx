// @card group="Page building blocks" height=230 subtitle="Live component"
function Demo() {
  return <WorkspaceSection title="Summary">
    <FactList title="Site" facts={[{label:'Owner',value:'Alex Chen'},{label:'Region',value:'Example North'},{label:'Due date',value:'22 Oct 2026'},{label:'Reference'},{label:'Units',value:'4'},{label:'Contact',value:'example@example.com'}]} />
  </WorkspaceSection>;
}
