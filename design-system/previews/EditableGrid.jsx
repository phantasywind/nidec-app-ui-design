// @card group="Specialized components" height=380 width=1100 subtitle="Live component"
const initial = [
  { id: '001', code: 'ITM-001', description: 'Control unit', category: 'Electrical', quantity: '1', unit: 'ea', price: '5200.00' },
  { id: '002', code: 'ITM-010', description: 'Drive module', category: 'Electrical', quantity: '2', unit: 'ea', price: '1250.00' },
  { id: '003', code: 'ITM-200', description: 'Mounting frame', category: 'Mechanical', quantity: '1', unit: 'ea', price: '3800.00' },
  { id: '004', code: 'ITM-450', description: 'Cable 18C', category: 'Electrical', quantity: '120', unit: 'm', price: '12.50' },
];
function Demo() {
  const [lines, setLines] = useState(initial);
  const [activeId, setActiveId] = useState('004');
  const [draft, setDraft] = useState({ ...initial[3] });
  const [dirty, setDirty] = useState(new Set(['003', '004']));
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const confirm = () => { setLines(l => l.map(x => x.id === draft.id ? draft : x)); setDirty(s => new Set(s).add(draft.id)); setActiveId(''); };
  const status = <div style={{display:'flex',gap:16,alignItems:'center'}}><span>{dirty.size} unsaved changes</span><span>0 validation issue</span><Button appearance="primary" onClick={() => setDirty(new Set())}>Save changes</Button></div>;
  const toolbar = <><SearchBox aria-label="Search lines" placeholder="Search by code or description" /><Button icon={<Icons.Add />}>Add line</Button><Button disabled icon={<Icons.Delete />}>Delete selected</Button></>;
  return <EditableGrid aria-label="Example line editor" title="Line editor" description="Edit several lines, resolve issues, then save one controlled batch." status={status} toolbar={toolbar} footer={<span>{lines.length} lines</span>}>
    <Table aria-label="Editable line records" size="small">
      <RecordTableHeader><TableRow><TableHeaderCell>Line</TableHeaderCell><TableHeaderCell>Item code</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell><TableHeaderCell>Quantity</TableHeaderCell><TableHeaderCell>Unit price</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell></TableRow></RecordTableHeader>
      <TableBody>{lines.map(line => { const editing = line.id === activeId; const v = editing ? draft : line; const isDirty = dirty.has(line.id);
        return <TableRow key={line.id} data-editing={editing || undefined}>
          <TableCell data-dirty={isDirty || undefined}>{line.id}</TableCell>
          <TableCell>{line.code}</TableCell>
          <TableCell>{editing ? <Input aria-label={'Description for line ' + line.id} size="small" value={v.description} onChange={(_, d) => upd('description', d.value)} /> : line.description}</TableCell>
          <TableCell>{editing ? <Input aria-label={'Quantity for line ' + line.id} size="small" value={v.quantity} onChange={(_, d) => upd('quantity', d.value)} /> : line.quantity + ' ' + line.unit}</TableCell>
          <TableCell>{editing ? <Input aria-label={'Unit price for line ' + line.id} size="small" value={v.price} onChange={(_, d) => upd('price', d.value)} /> : Number(line.price).toFixed(2)}</TableCell>
          <TableCell><Badge appearance="tint" color={isDirty ? 'warning' : 'success'}>{isDirty ? 'Modified' : 'Valid'}</Badge></TableCell>
          <TableCell className="nidec-ui-editable-grid__action-column">{editing ? <EditableGridRowActionGroup confirmIcon={<Icons.Check />} confirmLabel={'Confirm edits for line ' + line.id} cancelIcon={<Icons.Dismiss />} cancelLabel={'Cancel edits for line ' + line.id} onConfirm={confirm} onCancel={() => setActiveId('')} /> : <Tooltip content={'Edit line ' + line.id} relationship="label"><TableActionIconButton aria-label={'Edit line ' + line.id} icon={<Icons.Edit />} onClick={() => { setActiveId(line.id); setDraft({ ...line }); }} /></Tooltip>}</TableCell>
        </TableRow>; })}</TableBody>
    </Table>
  </EditableGrid>;
}
