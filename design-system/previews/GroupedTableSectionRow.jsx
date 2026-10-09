// @card group="Specialized components" height=420 width=900 subtitle="Live component"
const lines = [
  { id: '001', code: 'ITM-001', description: 'Control unit', group: 'Electrical' },
  { id: '002', code: 'ITM-010', description: 'Drive module', group: 'Electrical' },
  { id: '003', code: 'ITM-200', description: 'Mounting frame', group: 'Mechanical' },
];
function Demo() {
  const [open, setOpen] = useState(new Set(['primary', 'Electrical']));
  const toggle = id => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const icon = id => open.has(id) ? <Icons.ChevronDown /> : <Icons.ChevronRight />;
  return <Table aria-label="Grouped records" size="small">
    <RecordTableHeader><TableRow><TableHeaderCell>Line</TableHeaderCell><TableHeaderCell>Item code</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell></TableRow></RecordTableHeader>
    <TableBody>
      <GroupedTableSectionRow label="Primary collection" count={3} columnSpan={4} level={0} expanded={open.has('primary')} icon={icon('primary')} onToggle={() => toggle('primary')} />
      {open.has('primary') && ['Electrical', 'Mechanical'].map(g => {
        const m = lines.filter(l => l.group === g);
        return <Frag key={g}>
          <GroupedTableSectionRow label={g} count={m.length} columnSpan={4} level={1} expanded={open.has(g)} icon={icon(g)} onToggle={() => toggle(g)} summary={g === 'Mechanical' ? '1 modified' : undefined} />
          {open.has(g) && m.map(l => <TableRow key={l.id}><TableCell style={{paddingInlineStart:72}}>{l.id}</TableCell><TableCell>{l.code}</TableCell><TableCell>{l.description}</TableCell><TableCell><Badge appearance="tint" color="success">Ready</Badge></TableCell></TableRow>)}
        </Frag>;
      })}
      <GroupedTableSectionRow label="Additional collection" count={0} columnSpan={4} level={0} expanded={open.has('add')} icon={icon('add')} onToggle={() => toggle('add')} />
    </TableBody>
  </Table>;
}
