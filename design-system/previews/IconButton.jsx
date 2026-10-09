// @card group="Forms" height=110 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',gap:8}}>
    <Tooltip content="Refresh" relationship="label"><IconButton aria-label="Refresh" icon={<Icons.Refresh />} /></Tooltip>
    <Tooltip content="Search" relationship="label"><IconButton aria-label="Search" appearance="primary" icon={<Icons.Search />} /></Tooltip>
    <Tooltip content="Add" relationship="label"><IconButton aria-label="Add" appearance="subtle" icon={<Icons.Add />} /></Tooltip>
  </div>;
}
