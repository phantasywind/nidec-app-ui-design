// @card group="Forms" height=150 subtitle="Live component"
function Demo() {
  const [mode, setMode] = useState('reference');
  return <div style={{display:'grid',gap:4,justifyItems:'start',minWidth:0}}>
    <InlineModeTabs aria-label="Value source" options={[{value:'reference',label:'Reference',tabId:'t-ref',panelId:'p-ref'},{value:'manual',label:'Manual',tabId:'t-man',panelId:'p-man'}]} value={mode} onValueChange={(_, v) => setMode(v)} />
    <div role="tabpanel" id={'p-'+mode.slice(0,3)} aria-labelledby={'t-'+mode.slice(0,3)}><Input aria-label="Example value" readOnly value={mode === 'reference' ? 'Shared parameter' : '42'} /></div>
  </div>;
}
