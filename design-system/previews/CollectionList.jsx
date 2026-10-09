// @card group="Page building blocks" height=260 subtitle="Live component"
function Demo() {
  const [sel, setSel] = useState('a');
  return <div style={{maxWidth:'30rem'}}><CollectionList aria-label="Example collection" density="comfortable">{[['a','Example Alpha','Standard','Today'],['b','Example Beta','Configured','Yesterday'],['c','Example Gamma','Special','3 days ago']].map(([id,n,c,u]) => <CollectionListItem key={id} selection={<Checkbox aria-label={'Select '+n} checked={sel===id} onChange={() => setSel(id)} />} primary={n} secondary={c} metadata={u} actions={<Link href="#open" onClick={e => e.preventDefault()}>Open</Link>} />)}</CollectionList></div>;
}
