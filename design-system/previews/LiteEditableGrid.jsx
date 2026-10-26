// @card group="Specialized components" height=640 width=1100 subtitle="Live component, row and cell edit modes"
const categories = [
  { value: 'elec', text: 'Electrical' }, { value: 'mech', text: 'Mechanical' }, { value: 'ctrl', text: 'Controls' },
  { value: 'serv', text: 'Service' }, { value: 'pack', text: 'Packaging' },
];
const units = [{ value: 'ea', text: 'ea' }, { value: 'm', text: 'm' }, { value: 'kg', text: 'kg' }, { value: 'set', text: 'set' }];
const suppliers = ['Alder Works', 'Birch Supply', 'Cedar Parts', 'Delta Components', 'Elm Industrial', 'Fir Trading', 'Grove Metals', 'Hazel Electric', 'Iris Plastics', 'Juniper Tools']
  .map((text, index) => ({ value: 'S' + String(index + 1).padStart(2, '0'), text }));
const regions = [{ value: 'apac', text: 'Asia Pacific' }, { value: 'emea', text: 'Europe' }, { value: 'amer', text: 'Americas' }, { value: 'cn', text: 'China' }, { value: 'jp', text: 'Japan' }];
const words = ['Control unit', 'Drive module', 'Mounting frame', 'Cable 18C', 'Sensor bracket', 'Cooling fan', 'Terminal block', 'Gear housing'];
const columns = [
  { key: 'line', header: 'Line', editor: 'none', width: 72, align: 'end' },
  { key: 'code', header: 'Item code', editor: 'text', width: 120 },
  { key: 'description', header: 'Description', editor: 'longText', width: 260 },
  { key: 'category', header: 'Category', editor: 'select', width: 140, options: categories },
  { key: 'supplier', header: 'Supplier', editor: 'combobox', width: 180, options: suppliers },
  { key: 'quantity', header: 'Quantity', editor: 'number', width: 96,
    validate: v => (/^\d+$/.test(v) ? undefined : 'Enter a whole number') },
  { key: 'unit', header: 'Unit', editor: 'select', width: 80, options: units },
  { key: 'regions', header: 'Regions', editor: 'multiselect', width: 230, options: regions },
  { key: 'price', header: 'Unit price', editor: 'text', width: 110, align: 'end',
    validate: v => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Enter an amount with up to two decimals') },
  { key: 'amount', header: 'Amount', editor: 'none', width: 110, align: 'end',
    getValue: r => { const n = Number(r.quantity) * Number(r.price); return Number.isFinite(n) ? n.toFixed(2) : ''; } },
];
function makeRows(count) {
  const rows = new Array(count);
  for (let i = 0; i < count; i += 1) {
    rows[i] = {
      id: String(i + 1), line: String(i + 1), code: 'ITM-' + String(i + 1).padStart(5, '0'),
      description: words[i % words.length] + (i % 7 === 0 ? ', with an extended note that is longer than the column and is edited in the long text editor' : ''),
      category: categories[i % categories.length].value, supplier: suppliers[(i * 3) % suppliers.length].value,
      quantity: String((i % 12) + 1), regions: regions.filter((_, r) => (i + r) % 3 === 0).map(r => r.value), unit: units[i % units.length].value, price: ((i % 97) * 13.5 + 10).toFixed(2),
    };
  }
  return rows;
}
const heights = [{ value: '32', label: '32' }, { value: '40', label: '40' }, { value: '48', label: '48' }, { value: 'auto', label: 'Auto' }];
function Demo() {
  const [mode, setMode] = useState('row');
  const [height, setHeight] = useState('40');
  const [count, setCount] = useState('5000');
  const [rows, setRows] = useState(() => makeRows(200));
  const [changed, setChanged] = useState(0);
  // Every row is rendered in row mode and with auto rows, so those show 200 rows.
  const rowCount = (m, h, c) => (m === 'row' || h === 'auto' ? 200 : Number(c));
  const reset = (m, h, c) => { setRows(makeRows(rowCount(m, h, c))); setChanged(0); };
  const changeMode = (_, value) => {
    const next = value === 'row' ? '40' : '32';
    setMode(value); setHeight(next); reset(value, next, count);
  };
  const changeHeight = (_, value) => {
    if ((value === 'auto') !== (height === 'auto') && mode === 'cell') reset(mode, value, count);
    setHeight(value);
  };
  const changeCount = (_, value) => { setCount(value); reset(mode, height, value); };
  const onCellChange = ({ rowIndex, columnKey, value, values }) => {
    setRows(current => { const next = current.slice(); next[rowIndex] = { ...current[rowIndex], [columnKey]: values ?? value }; return next; });
    setChanged(n => n + 1);
  };
  const onRowChange = ({ rowIndex, changes }) => {
    setRows(current => { const next = current.slice(); const row = { ...current[rowIndex] };
      for (const c of changes) row[c.columnKey] = c.values ?? c.value; next[rowIndex] = row; return next; });
    setChanged(n => n + 1);
  };
  const rowHeight = height === 'auto' ? 'auto' : Number(height);
  const toolbar = <>
    <SegmentedControl aria-label="Edit mode" value={mode} onValueChange={changeMode}
      options={[{ value: 'row', label: 'Row edit' }, { value: 'cell', label: 'Cell edit' }]} />
    <SegmentedControl aria-label="Row height" value={height} onValueChange={changeHeight} options={heights} />
    {mode === 'cell' && height !== 'auto'
      ? <SegmentedControl aria-label="Row count" value={count} onValueChange={changeCount}
        options={[{ value: '1000', label: '1,000 rows' }, { value: '5000', label: '5,000 rows' }, { value: '20000', label: '20,000 rows' }]} />
      : null}
    <span style={{ color: 'var(--colorNeutralForeground2)' }}>{mode === 'row'
      ? 'Edit or double-click a row. Enter confirms the row, Esc cancels.'
      : 'Arrow keys move. Enter, F2, double-click or typing edits. Esc cancels.'}</span>
  </>;
  const grid = mode === 'row'
    ? <LiteEditableGrid key="row" aria-label="Line records" editMode="row" columns={columns} rows={rows} getRowId={row => row.id}
      onRowChange={onRowChange} rowHeight={rowHeight} maxHeight={420} />
    : <LiteEditableGrid key={'cell-' + (height === 'auto')} aria-label="Line records" columns={columns} rows={rows} getRowId={row => row.id}
      onCellChange={onCellChange} rowHeight={rowHeight} height={420} />;
  return <EditableGrid aria-label="Lightweight line editor" density="compact"
    status={<span>{changed} {mode === 'row' ? 'rows confirmed' : 'edits'}</span>} toolbar={toolbar} footer={<span>{rows.length.toLocaleString('en-US')} lines</span>}>
    {grid}
  </EditableGrid>;
}
