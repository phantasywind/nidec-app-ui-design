// @card group="Page building blocks" height=300 subtitle="Live component"
function Demo() {
  return <WorkspaceStack>
    <PageHeader eyebrow="Records" title="Record directory" description="Find, compare and open records." actions={<><Button>Export</Button><Button appearance="primary">New record</Button></>} />
    <PageHeader title="R-2026-0142" titleAdornment={<Badge appearance="tint" color="success">Open</Badge>} description="Example Alpha · Example North" />
  </WorkspaceStack>;
}
