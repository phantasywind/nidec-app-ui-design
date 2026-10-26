// @card group="Specialized components" height=640 width=1100 subtitle="Live component, row edit with fixed rows for long master data"
const families = [{ value: 'mot', text: 'Motor' }, { value: 'drv', text: 'Drive' }, { value: 'sen', text: 'Sensor' }, { value: 'cab', text: 'Cable' }, { value: 'mec', text: 'Mechanical' }];
const units = [{ value: 'ea', text: 'ea' }, { value: 'm', text: 'm' }, { value: 'kg', text: 'kg' }, { value: 'set', text: 'set' }];
const currencies = [{ value: 'CNY', text: 'CNY' }, { value: 'USD', text: 'USD' }, { value: 'EUR', text: 'EUR' }, { value: 'JPY', text: 'JPY' }];
const statuses = [{ value: 'active', text: 'Active' }, { value: 'hold', text: 'On hold' }, { value: 'eol', text: 'End of life' }];
const names = ['Traction motor', 'Door drive', 'Position sensor', 'Travelling cable', 'Guide shoe', 'Brake coil', 'Encoder', 'Rope clamp'];
const columns = [
  { key: 'code', header: 'Component', editor: 'none', width: 130 },
  { key: 'name', header: 'Name', editor: 'text', width: 200 },
  { key: 'family', header: 'Family', editor: 'select', width: 130, options: families },
  { key: 'unit', header: 'Unit', editor: 'select', width: 80, options: units },
  { key: 'cost', header: 'Standard cost', editor: 'number', width: 140, format: (v, r) => formatCurrency(v, r.currency),
    validate: v => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Enter an amount with up to two decimals') },
  { key: 'currency', header: 'Currency', editor: 'select', width: 100, options: currencies },
  { key: 'leadTime', header: 'Lead time (days)', editor: 'number', width: 140,
    validate: v => (/^\d+$/.test(v) ? undefined : 'Enter a whole number') },
  { key: 'status', header: 'Status', editor: 'select', width: 120, options: statuses },
  { key: 'updated', header: 'Updated', editor: 'none', width: 120 },
];
function makeRows(count) {
  const rows = new Array(count);
  for (let i = 0; i < count; i += 1) {
    rows[i] = {
      id: String(i + 1), code: 'CMP-' + String(i + 1).padStart(6, '0'), name: names[i % names.length] + ' ' + (100 + (i % 900)),
      family: families[i % families.length].value, unit: units[i % units.length].value, cost: ((i % 211) * 7.25 + 15).toFixed(2),
      currency: currencies[i % 7 === 0 ? 1 : i % 11 === 2 ? 3 : 0].value, leadTime: String(5 + (i % 40)), status: statuses[i % 13 === 0 ? 1 : 0].value,
      updated: '2026-10-' + String(1 + (i % 25)).padStart(2, '0'),
    };
  }
  return rows;
}
const heights = [{ value: '32', label: '32' }, { value: '40', label: '40' }, { value: '48', label: '48' }];
function Demo() {
  const [height, setHeight] = useState('40');
  const [count, setCount] = useState('5000');
  const [rows, setRows] = useState(() => makeRows(5000));
  const [saved, setSaved] = useState(0);
  const changeCount = (_, value) => { setCount(value); setRows(makeRows(Number(value))); setSaved(0); };
  const onRowChange = ({ rowIndex, changes }) => {
    setRows(current => { const next = current.slice(); const row = { ...current[rowIndex] };
      for (const c of changes) row[c.columnKey] = c.values ?? c.value; next[rowIndex] = row; return next; });
    setSaved(n => n + 1);
  };
  const toolbar = <>
    <SegmentedControl aria-label="Row height" value={height} onValueChange={(_, value) => setHeight(value)} options={heights} />
    <SegmentedControl aria-label="Row count" value={count} onValueChange={changeCount}
      options={[{ value: '1000', label: '1,000 rows' }, { value: '5000', label: '5,000 rows' }, { value: '20000', label: '20,000 rows' }]} />
    <span style={{ color: 'var(--colorNeutralForeground2)' }}>Arrow keys move. Enter, F2 or double-click edits the row. Leaving the row or Enter saves it; Esc cancels.</span>
  </>;
  return <EditableGrid aria-label="Component master" density="compact"
    status={<span>{saved} rows saved</span>} toolbar={toolbar} footer={<span>{rows.length.toLocaleString('en-US')} components</span>}>
    <LiteRowEditGrid aria-label="Components" columns={columns} rows={rows} getRowId={row => row.id}
      onRowChange={onRowChange} rowHeight={Number(height)} height={420} />
  </EditableGrid>;
}
