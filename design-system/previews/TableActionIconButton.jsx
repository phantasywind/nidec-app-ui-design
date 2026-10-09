// @card group="Forms" height=110 subtitle="Live component"
function Demo() {
  return <div style={{display:'flex',gap:4}}>
    <Tooltip content="Edit" relationship="label"><TableActionIconButton aria-label="Edit" icon={<Icons.Edit />} /></Tooltip>
    <Tooltip content="Delete" relationship="label"><TableActionIconButton aria-label="Delete" icon={<Icons.Delete />} /></Tooltip>
    <Tooltip content="More actions" relationship="label"><TableActionIconButton aria-label="More actions" icon={<Icons.More />} /></Tooltip>
  </div>;
}
