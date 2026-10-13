// @card group="Specialized components" height=640 width=1100 subtitle="Live component, 5,000 rows in two group levels"
const categories = [
  { value: 'elec', text: 'Electrical' }, { value: 'mech', text: 'Mechanical' }, { value: 'ctrl', text: 'Controls' },
  { value: 'serv', text: 'Service' }, { value: 'pack', text: 'Packaging' },
];
const suppliers = ['Alder Works', 'Birch Supply', 'Cedar Parts', 'Delta Components', 'Elm Industrial', 'Fir Trading']
  .map((text, index) => ({ value: 'S' + String(index + 1).padStart(2, '0'), text }));
const regions = [{ value: 'apac', text: 'Asia Pacific' }, { value: 'emea', text: 'Europe' }, { value: 'amer', text: 'Americas' }, { value: 'cn', text: 'China' }, { value: 'jp', text: 'Japan' }];
const words = ['Control unit', 'Drive module', 'Mounting frame', 'Cable 18C', 'Sensor bracket', 'Cooling fan', 'Terminal block', 'Gear housing'];
const categoryText = new Map(categories.map(c => [c.value, c.text]));
const supplierText = new Map(suppliers.map(s => [s.value, s.text]));
const columns = [
  { key: 'code', header: 'Item code', editor: 'none', width: 150 },
  { key: 'description', header: 'Description', editor: 'longText', width: 240 },
  { key: 'category', header: 'Category', editor: 'select', width: 140, options: categories },
  { key: 'supplier', header: 'Supplier', editor: 'combobox', width: 170, options: suppliers, freeform: false },
  { key: 'quantity', header: 'Quantity', editor: 'text', width: 96, align: 'end',
    validate: v => (/^\d+$/.test(v) ? undefined : 'Enter a whole number') },
  { key: 'regions', header: 'Regions', editor: 'multiselect', width: 220, options: regions },
  { key: 'price', header: 'Unit price', editor: 'text', width: 110, align: 'end',
    validate: v => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Enter an amount with up to two decimals') },
  { key: 'amount', header: 'Amount', editor: 'none', width: 110, align: 'end',
    getValue: r => { const n = Number(r.quantity) * Number(r.price); return Number.isFinite(n) ? n.toFixed(2) : ''; } },
];
const groupOf = row => [categoryText.get(row.category) ?? row.category, supplierText.get(row.supplier) ?? row.supplier];
function makeRows(count) {
  const rows = new Array(count);
  for (let i = 0; i < count; i += 1) {
    rows[i] = {
      id: String(i + 1), code: 'ITM-' + String(i + 1).padStart(5, '0'),
      description: words[i % words.length], category: categories[i % categories.length].value,
      supplier: suppliers[Math.floor(i / 5) % suppliers.length].value, quantity: String((i % 12) + 1),
      regions: regions.filter((_, r) => (i + r) % 3 === 0).map(r => r.value), price: ((i % 97) * 13.5 + 10).toFixed(2),
    };
  }
  return rows;
}
function Demo() {
  const [rows, setRows] = useState(() => makeRows(5000));
  const [modified, setModified] = useState(() => new Set());
  const [collapsed, setCollapsed] = useState(() => new Set(['Mechanical', 'Controls', 'Service', 'Packaging']));
  const onCellChange = ({ rowIndex, rowId, columnKey, value, values }) => {
    setRows(current => { const next = current.slice(); next[rowIndex] = { ...current[rowIndex], [columnKey]: values ?? value }; return next; });
    setModified(current => new Set(current).add(rowId));
  };
  const allKeys = () => { const keys = new Set(); rows.forEach(r => { const [a, b] = groupOf(r); keys.add(a); keys.add(a + ' / ' + b); }); return keys; };
  const summary = group => { const n = group.rowIndexes.reduce((sum, i) => sum + (modified.has(rows[i].id) ? 1 : 0), 0); return n ? n + ' modified' : undefined; };
  const toolbar = <>
    <Button onClick={() => setCollapsed(new Set())}>Expand all</Button>
    <Button onClick={() => setCollapsed(allKeys())}>Collapse all</Button>
    <span style={{ color: 'var(--colorNeutralForeground2)' }}>Click a group, or press Enter on it, to collapse or expand. Left collapses, Right expands.</span>
  </>;
  return <EditableGrid aria-label="Grouped lightweight line editor" title="Grouped line editor"
    description="Groups by category and supplier. Collapsing keeps every edit; counts include hidden rows."
    status={<span>{modified.size} modified lines</span>} toolbar={toolbar} footer={<span>{rows.length.toLocaleString('en-US')} lines</span>}>
    <LiteEditableGrid aria-label="Grouped line records" columns={columns} rows={rows} getRowId={row => row.id} onCellChange={onCellChange}
      getRowGroup={groupOf} collapsedGroups={collapsed} onCollapsedGroupsChange={setCollapsed} getGroupSummary={summary} height={420} />
  </EditableGrid>;
}
