// @card group="Page building blocks" height=210 subtitle="Live component"
function Demo() {
  return <WorkspaceSection title="Definition" description="Short explanation of this region." actions={<Button>Edit</Button>}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,16rem))',gap:16}}><Field label="Name"><Input defaultValue="Example Alpha" /></Field><Field label="Reference"><Input readOnly defaultValue="REC-1042" /></Field></div>
  </WorkspaceSection>;
}
