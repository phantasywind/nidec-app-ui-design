// @card group="Specialized components" height=420 width=1100 subtitle="Live component, frame with a cell-edit grid"
const initial = [
  { id: '001', code: 'ITM-001', description: 'Control unit', category: 'elec', quantity: '1', unit: 'ea', price: '5200.00' },
  { id: '002', code: 'ITM-010', description: 'Drive module', category: 'elec', quantity: '2', unit: 'ea', price: '1250.00' },
  { id: '003', code: 'ITM-200', description: 'Mounting frame', category: 'mech', quantity: '1', unit: 'ea', price: '3800.00' },
  { id: '004', code: 'ITM-450', description: 'Cable 18C', category: 'elec', quantity: '120', unit: 'm', price: '12.50' },
  { id: '005', code: 'ITM-512', description: 'Sensor bracket', category: 'mech', quantity: '4', unit: 'ea', price: '86.00' },
];
const categories = [{ value: 'elec', text: 'Electrical' }, { value: 'mech', text: 'Mechanical' }, { value: 'serv', text: 'Service' }];
const columns = [
  { key: 'id', header: 'Line', editor: 'none', width: 72 },
  { key: 'code', header: 'Item code', editor: 'none', width: 120 },
  { key: 'description', header: 'Description', editor: 'text', width: 220 },
  { key: 'category', header: 'Category', editor: 'select', width: 140, options: categories },
  { key: 'quantity', header: 'Quantity', editor: 'number', width: 100,
    validate: v => (/^\d+$/.test(v) ? undefined : 'Enter a whole number') },
  { key: 'price', header: 'Unit price', editor: 'number', width: 120, format: v => formatCurrency(v, 'USD'),
    validate: v => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Enter an amount with up to two decimals') },
  { key: 'amount', header: 'Amount', editor: 'none', width: 130, align: 'end',
    getValue: r => { const n = Number(r.quantity) * Number(r.price); return Number.isFinite(n) ? n.toFixed(2) : ''; },
    format: v => formatCurrency(v, 'USD') },
];
function Demo() {
  const [lines, setLines] = useState(initial);
  const [dirty, setDirty] = useState(new Set(['003']));
  const onCellChange = ({ rowIndex, rowId, columnKey, value }) => {
    setLines(current => { const next = current.slice(); next[rowIndex] = { ...current[rowIndex], [columnKey]: value }; return next; });
    setDirty(s => new Set(s).add(rowId));
  };
  const status = <div style={{display:'flex',gap:16,alignItems:'center'}}><span>{dirty.size} unsaved changes</span><Button appearance="primary" onClick={() => setDirty(new Set())}>Save changes</Button></div>;
  const toolbar = <><SearchBox aria-label="Search lines" placeholder="Search by code or description" /><Button icon={<Icons.Add />}>Add line</Button></>;
  return <EditableGrid aria-label="Example line editor" title="Line editor" description="Each cell saves into the draft when you leave it; save the draft as one controlled batch." status={status} toolbar={toolbar} footer={<span>{lines.length} lines</span>}>
    <LiteEditableGrid aria-label="Editable line records" columns={columns} rows={lines} getRowId={row => row.id} onCellChange={onCellChange} height="auto" />
  </EditableGrid>;
}
