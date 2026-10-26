// @card group="Specialized components" height=640 width=1100 subtitle="Live component, cell edit with auto or fixed row height"
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
  { key: 'price', header: 'Unit price', editor: 'number', width: 110,
    validate: v => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Enter an amount with up to two decimals') },
  { key: 'amount', header: 'Amount', editor: 'none', width: 110, align: 'end',
    getValue: r => { const n = Number(r.quantity) * Number(r.price); return Number.isFinite(n) ? n.toFixed(2) : ''; } },
];
function makeRows(count) {
  const rows = new Array(count);
  for (let i = 0; i < count; i += 1) {
    rows[i] = {
      id: String(i + 1), line: String(i + 1), code: 'ITM-' + String(i + 1).padStart(5, '0'),
      description: words[i % words.length] + (i % 7 === 0 ? ', with an extended note that is longer than the column and wraps onto more lines' : ''),
      category: categories[i % categories.length].value, supplier: suppliers[(i * 3) % suppliers.length].value,
      quantity: String((i % 12) + 1), regions: regions.filter((_, r) => (i + r) % 3 === 0).map(r => r.value), unit: units[i % units.length].value, price: ((i % 97) * 13.5 + 10).toFixed(2),
    };
  }
  return rows;
}
const heights = [{ value: 'auto', label: 'Auto' }, { value: '32', label: '32' }, { value: '40', label: '40' }, { value: '48', label: '48' }];
function Demo() {
  const [height, setHeight] = useState('auto');
  const [count, setCount] = useState('5000');
  const [rows, setRows] = useState(() => makeRows(300));
  const [changed, setChanged] = useState(0);
  // Auto rows are all rendered, so they show 300 lines; fixed rows are virtualised.
  const reset = (h, c) => { setRows(makeRows(h === 'auto' ? 300 : Number(c))); setChanged(0); };
  const changeHeight = (_, value) => { if ((value === 'auto') !== (height === 'auto')) reset(value, count); setHeight(value); };
  const changeCount = (_, value) => { setCount(value); reset(height, value); };
  const onCellChange = ({ rowIndex, columnKey, value, values }) => {
    setRows(current => { const next = current.slice(); next[rowIndex] = { ...current[rowIndex], [columnKey]: values ?? value }; return next; });
    setChanged(n => n + 1);
  };
  const toolbar = <>
    <SegmentedControl aria-label="Row height" value={height} onValueChange={changeHeight} options={heights} />
    {height !== 'auto'
      ? <SegmentedControl aria-label="Row count" value={count} onValueChange={changeCount}
        options={[{ value: '1000', label: '1,000 rows' }, { value: '5000', label: '5,000 rows' }, { value: '20000', label: '20,000 rows' }]} />
      : null}
    <span style={{ color: 'var(--colorNeutralForeground2)' }}>Arrow keys move. Enter, F2, double-click or typing edits. Each cell saves when you leave it; Esc cancels.</span>
  </>;
  return <EditableGrid aria-label="Lightweight line editor" density="compact"
    status={<span>{changed} edits</span>} toolbar={toolbar} footer={<span>{rows.length.toLocaleString('en-US')} lines</span>}>
    <LiteEditableGrid key={'cell-' + (height === 'auto')} aria-label="Line records" columns={columns} rows={rows} getRowId={row => row.id}
      onCellChange={onCellChange} rowHeight={height === 'auto' ? 'auto' : Number(height)} height={420} />
  </EditableGrid>;
}
