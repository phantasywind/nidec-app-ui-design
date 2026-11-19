import { useMemo, useState } from 'react';
import {
  ChevronDownRegular,
  ChevronRightRegular,
  EditRegular,
} from '@fluentui/react-icons';
import {
  createTableColumn,
  type TableColumnDefinition,
  type TableRowId,
} from '@fluentui/react-components';
import {
  ActiveBadge,
  Badge,
  Button,
  ChangeHistoryTable,
  Checkbox,
  DataGridBody,
  DataGridCell,
  DataGridHeaderCell,
  DataGridRow,
  EditableGrid,
  Field,
  GroupedTableSectionRow,
  Input,
  LiteEditableGrid,
  LiteRowEditGrid,
  MatrixCellButton,
  RecordDataGridHeader,
  RecordIdentityCellLayout,
  RecordLink,
  RecordSelectionDataGrid,
  RecordSelectionDataGridRow,
  RecordSelectionRegion,
  RecordTableHeader,
  RowEndStatus,
  SearchBox,
  SegmentedControl,
  Table,
  TableActionIconButton,
  TableBody,
  TableCell,
  TableCellActions,
  TableHeaderCell,
  TableRow,
  TableScrollRegion,
  Tooltip,
  TruncatedText,
  formatCurrency,
  numericColumnClassName,
  type ChangeHistoryEntry,
  type LiteEditableGridColumn,
  type LiteEditableGridRowHeight,
} from '@phantasywind/nidec-app-ui-design';

type LineRow = {
  id: string;
  section: string;
  line: string;
  code: string;
  description: string;
  category: string;
  supplier: string;
  quantity: string;
  regions: string[];
  price: string;
};

const CATEGORIES = [
  { value: 'elec', text: 'Electrical' },
  { value: 'mech', text: 'Mechanical' },
  { value: 'ctrl', text: 'Controls' },
  { value: 'pack', text: 'Packaging' },
];

const SUPPLIERS = [
  { value: 'S01', text: 'Alder Works' },
  { value: 'S02', text: 'Birch Supply' },
  { value: 'S03', text: 'Cedar Parts' },
  { value: 'S04', text: 'Delta Components' },
  { value: 'S05', text: 'Elm Industrial' },
];

const REGIONS = [
  { value: 'apac', text: 'APAC' },
  { value: 'emea', text: 'EMEA' },
  { value: 'amer', text: 'Americas' },
  { value: 'cn', text: 'China' },
];

const SECTIONS = ['Drive assembly', 'Control cabinet', 'Safety hardware'];
const ITEMS = [
  'Traction motor module',
  'Frequency inverter unit',
  'Encoder mounting bracket with extended isolation pad',
  'Terminal distribution block',
  'Cooling fan assembly',
  'Brake coil harness',
];

function buildLineRows(count: number): LineRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    section: SECTIONS[i % SECTIONS.length]!,
    line: String(i + 1),
    code: `ITM-${String(i + 1).padStart(4, '0')}`,
    description: ITEMS[i % ITEMS.length]!,
    category: CATEGORIES[i % CATEGORIES.length]!.value,
    supplier: SUPPLIERS[(i * 2) % SUPPLIERS.length]!.value,
    quantity: String((i % 8) + 1),
    regions: REGIONS.filter((_, idx) => (i + idx) % 2 === 0).map((r) => r.value),
    price: ((i % 25) * 18.5 + 45).toFixed(2),
  }));
}

const LITE_COLUMNS: readonly LiteEditableGridColumn<LineRow>[] = [
  { key: 'line', header: 'Line', editor: 'none', width: 84, align: 'end' },
  { key: 'code', header: 'Item code', editor: 'text', width: 112 },
  { key: 'description', header: 'Description', editor: 'longText', width: 240 },
  { key: 'category', header: 'Category', editor: 'select', width: 132, options: CATEGORIES },
  { key: 'supplier', header: 'Supplier', editor: 'combobox', width: 164, options: SUPPLIERS },
  {
    key: 'quantity',
    header: 'Qty',
    editor: 'number',
    width: 84,
    validate: (v) => (/^\d+$/.test(v) ? undefined : 'Whole number required'),
  },
  { key: 'regions', header: 'Regions', editor: 'multiselect', width: 180, options: REGIONS },
  {
    key: 'price',
    header: 'Unit price',
    editor: 'number',
    width: 118,
    format: (v) => formatCurrency(v, 'USD'),
    validate: (v) => (/^\d+(\.\d{1,2})?$/.test(v) ? undefined : 'Max 2 decimals'),
  },
  {
    key: 'amount',
    header: 'Amount',
    editor: 'none',
    width: 124,
    align: 'end',
    getValue: (r) => {
      const total = Number(r.quantity) * Number(r.price);
      return Number.isFinite(total) ? total.toFixed(2) : '';
    },
    format: (v) => formatCurrency(v, 'USD'),
  },
];

export function LiteEditableGridDemo() {
  const [rowHeight, setRowHeight] = useState<'auto' | '32' | '40' | '48'>('auto');
  const [grouped, setGrouped] = useState(true);
  const [rows, setRows] = useState<LineRow[]>(() => buildLineRows(24));
  const [edits, setEdits] = useState(0);

  const handleHeightChange = (next: 'auto' | '32' | '40' | '48') => {
    setRowHeight(next);
    setRows(buildLineRows(next === 'auto' ? 24 : 1000));
    setEdits(0);
  };

  return (
    <EditableGrid
      aria-label="Lightweight cell-editable grid"
      density="compact"
      status={<Badge appearance="tint" color={edits > 0 ? 'brand' : 'informative'}>{edits} saved cell edits</Badge>}
      toolbar={
        <div className="demo-row">
          <SegmentedControl
            aria-label="Row height mode"
            size="small"
            value={rowHeight}
            onValueChange={(_, v) => handleHeightChange(v as 'auto' | '32' | '40' | '48')}
            options={[
              { value: 'auto', label: 'Auto (24 rows)' },
              { value: '32', label: '32px (1,000 rows)' },
              { value: '40', label: '40px' },
              { value: '48', label: '48px' },
            ]}
          />
          {rowHeight === 'auto' && (
            <Checkbox
              label="Group by section"
              checked={grouped}
              onChange={(_, d) => setGrouped(Boolean(d.checked))}
            />
          )}
          <span className="demo-status-caption">
            Click, double-click, press Enter/F2, or start typing in a cell. Leaving saves; Esc cancels.
          </span>
        </div>
      }
      footer={<span>{rows.length.toLocaleString('en-US')} lines</span>}
    >
      <LiteEditableGrid
        key={`${rowHeight}-${grouped}`}
        aria-label="Editable line items"
        columns={LITE_COLUMNS}
        rows={rows}
        getRowId={(r) => r.id}
        rowHeight={rowHeight === 'auto' ? 'auto' : (Number(rowHeight) as LiteEditableGridRowHeight)}
        height={360}
        getRowGroup={rowHeight === 'auto' && grouped ? (r) => [r.section] : undefined}
        onCellChange={({ rowIndex, columnKey, value, values }) => {
          setRows((current) => {
            const next = current.slice();
            next[rowIndex] = { ...current[rowIndex]!, [columnKey]: values ?? value };
            return next;
          });
          setEdits((n) => n + 1);
        }}
      />
    </EditableGrid>
  );
}

export function LiteRowEditGridDemo() {
  const [rowHeight, setRowHeight] = useState<32 | 40 | 48>(40);
  const [count, setCount] = useState<'1000' | '5000'>('1000');
  const [rows, setRows] = useState<LineRow[]>(() => buildLineRows(1000));
  const [savedRows, setSavedRows] = useState(0);

  const changeCount = (next: '1000' | '5000') => {
    setCount(next);
    setRows(buildLineRows(Number(next)));
    setSavedRows(0);
  };

  return (
    <EditableGrid
      aria-label="Lightweight row-editable grid"
      density="compact"
      status={<Badge appearance="tint" color={savedRows > 0 ? 'brand' : 'informative'}>{savedRows} row saves</Badge>}
      toolbar={
        <div className="demo-row">
          <SegmentedControl
            aria-label="Row height"
            size="small"
            value={String(rowHeight)}
            onValueChange={(_, v) => setRowHeight(Number(v) as 32 | 40 | 48)}
            options={[
              { value: '32', label: '32px' },
              { value: '40', label: '40px' },
              { value: '48', label: '48px' },
            ]}
          />
          <SegmentedControl
            aria-label="Virtualized row count"
            size="small"
            value={count}
            onValueChange={(_, v) => changeCount(v as '1000' | '5000')}
            options={[
              { value: '1000', label: '1,000 rows' },
              { value: '5000', label: '5,000 rows' },
            ]}
          />
          <span className="demo-status-caption">
            Double-click or press Enter/F2 to edit the whole row. Leaving the row saves once; Esc cancels.
          </span>
        </div>
      }
      footer={<span>{rows.length.toLocaleString('en-US')} virtualized rows</span>}
    >
      <LiteRowEditGrid
        aria-label="Row edit master data"
        columns={LITE_COLUMNS}
        rows={rows}
        getRowId={(r) => r.id}
        rowHeight={rowHeight}
        height={360}
        onRowChange={({ rowIndex, changes }) => {
          setRows((current) => {
            const next = current.slice();
            const updated = { ...current[rowIndex]! } as Record<string, unknown>;
            for (const c of changes) {
              updated[c.columnKey] = c.values ?? c.value;
            }
            next[rowIndex] = updated as LineRow;
            return next;
          });
          setSavedRows((n) => n + 1);
        }}
      />
    </EditableGrid>
  );
}

export function EditableGridGroupedDemo() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ drive: true, safety: true });
  const groups = [
    {
      id: 'drive',
      label: 'Drive assembly',
      summary: '2 items · $ 1,920.00',
      rows: [
        { id: 'G-01', code: 'DRV-100', name: 'Traction motor', qty: 1, amount: 1480 },
        { id: 'G-02', code: 'DRV-105', name: 'Mounting bracket', qty: 2, amount: 440 },
      ],
    },
    {
      id: 'safety',
      label: 'Safety & braking',
      summary: '2 items · $ 890.00',
      rows: [
        { id: 'G-03', code: 'SAF-201', name: 'Overspeed governor', qty: 1, amount: 520 },
        { id: 'G-04', code: 'SAF-208', name: 'Brake switch assembly', qty: 2, amount: 370 },
      ],
    },
  ];

  return (
    <EditableGrid
      aria-label="Grouped table with disclosure sections"
      title="Grouped sub-assemblies"
      description="Section rows disclose leaf rows and keep summaries visible while collapsed."
      density="compact"
    >
      <TableScrollRegion aria-label="Grouped sub-assemblies table">
        <Table aria-label="Grouped sub-assemblies table">
          <RecordTableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: 130 }}>Item code</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 200 }}>Description</TableHeaderCell>
              <TableHeaderCell className={numericColumnClassName} style={{ minWidth: 80 }}>Qty</TableHeaderCell>
              <TableHeaderCell className={numericColumnClassName} style={{ minWidth: 120 }}>Amount</TableHeaderCell>
            </TableRow>
          </RecordTableHeader>
          <TableBody>
            {groups.map((group) => {
              const isOpen = Boolean(expanded[group.id]);
              return [
                <GroupedTableSectionRow
                  key={group.id}
                  label={group.label}
                  count={group.rows.length}
                  summary={group.summary}
                  columnSpan={4}
                  level={0}
                  expanded={isOpen}
                  icon={isOpen ? <ChevronDownRegular /> : <ChevronRightRegular />}
                  onToggle={() => setExpanded((prev) => ({ ...prev, [group.id]: !isOpen }))}
                />,
                ...(isOpen
                  ? group.rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.code}</TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell className={numericColumnClassName}>{r.qty}</TableCell>
                        <TableCell className={numericColumnClassName}>{formatCurrency(r.amount, 'USD')}</TableCell>
                      </TableRow>
                    ))
                  : []),
              ];
            })}
          </TableBody>
        </Table>
      </TableScrollRegion>
    </EditableGrid>
  );
}

export function DataTableDemo() {
  const [selectedCell, setSelectedCell] = useState<string>('REC-201:b');
  const [eventLog, setEventLog] = useState('Scroll horizontally to verify frozen first column and pinned scrollbar.');
  const records = [
    {
      id: 'REC-201',
      name: 'High-efficiency permanent magnet traction assembly with integrated encoder',
      plant: 'Plant 01 — Shanghai',
      owner: 'A. Lin',
      amount: 14820.5,
      active: true,
    },
    {
      id: 'REC-202',
      name: 'Compact regenerative drive cabinet',
      plant: 'Plant 03 — Osaka',
      owner: 'K. Sato',
      amount: 9350,
      active: true,
    },
    {
      id: 'REC-203',
      name: 'Auxiliary brake control unit (legacy frame)',
      plant: 'Plant 06 — Munich',
      owner: 'M. Weber',
      amount: 4120,
      active: false,
    },
  ];

  return (
    <div className="demo-stack">
      <TableScrollRegion aria-label="Wide record table" pinnedScrollbar maxHeight={260} frozenColumns={1}>
        <Table aria-label="Wide record table" style={{ minWidth: 920 }}>
          <RecordTableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: 140 }}>Record ID</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 220 }}>Description (TruncatedText)</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 170 }}>Plant</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 110 }}>Owner</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 110 }}>Matrix cell</TableHeaderCell>
              <TableHeaderCell className={numericColumnClassName} style={{ minWidth: 120 }}>Amount</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 150 }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 90 }}>Actions</TableHeaderCell>
            </TableRow>
          </RecordTableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <RecordIdentityCellLayout
                    primary={
                      <RecordLink
                        weight="semibold"
                        href={`#/${r.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setEventLog(`Navigated via RecordLink: ${r.id}`);
                        }}
                      >
                        {r.id}
                      </RecordLink>
                    }
                  />
                </TableCell>
                <TableCell style={{ maxWidth: 220 }}>
                  <TruncatedText>{r.name}</TruncatedText>
                </TableCell>
                <TableCell>{r.plant}</TableCell>
                <TableCell>{r.owner}</TableCell>
                <TableCell>
                  <MatrixCellButton
                    matched={r.active}
                    selected={selectedCell === `${r.id}:b`}
                    onClick={() => {
                      setSelectedCell(`${r.id}:b`);
                      setEventLog(`Selected MatrixCellButton for ${r.id}`);
                    }}
                  >
                    {r.active ? 'Rule A' : '—'}
                  </MatrixCellButton>
                </TableCell>
                <TableCell className={numericColumnClassName}>{formatCurrency(r.amount, 'USD')}</TableCell>
                <TableCell>
                  <RowEndStatus status={<ActiveBadge active={r.active} />}>
                    <span>v2</span>
                  </RowEndStatus>
                </TableCell>
                <TableCell>
                  <TableCellActions visible>
                    <Tooltip content={`Edit ${r.id}`} relationship="description">
                      <TableActionIconButton
                        aria-label={`Edit ${r.id}`}
                        icon={<EditRegular />}
                        onClick={() => setEventLog(`Row edit action clicked for ${r.id}`)}
                      />
                    </Tooltip>
                  </TableCellActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollRegion>
      <span className="demo-status-caption">{eventLog}</span>
    </div>
  );
}

type MasterItem = { id: string; code: string; name: string; unit: string };
const INITIAL_MASTER: MasterItem[] = [
  { id: 'M1', code: 'CMP-010', name: 'Main traction sheave', unit: 'ea' },
  { id: 'M2', code: 'CMP-020', name: 'Guide rail bracket', unit: 'set' },
  { id: 'M3', code: 'CMP-030', name: 'Encoder cable 15m', unit: 'm' },
];

export function RecordSelectionDemo() {
  const [items, setItems] = useState(INITIAL_MASTER);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('M1');
  const selected = items.find((i) => i.id === selectedId) ?? items[0]!;
  const [draftName, setDraftName] = useState(selected.name);

  const filtered = useMemo(
    () => items.filter((i) => `${i.code} ${i.name}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  const columns: TableColumnDefinition<MasterItem>[] = [
    createTableColumn<MasterItem>({
      columnId: 'code',
      renderHeaderCell: () => 'Code',
      renderCell: (item) => item.code,
    }),
    createTableColumn<MasterItem>({
      columnId: 'name',
      renderHeaderCell: () => 'Definition name',
      renderCell: (item) => item.name,
    }),
    createTableColumn<MasterItem>({
      columnId: 'unit',
      renderHeaderCell: () => 'Unit',
      renderCell: (item) => item.unit,
    }),
  ];

  const selectRecord = (nextId: string) => {
    const found = items.find((i) => i.id === nextId);
    if (!found) return;
    setSelectedId(found.id);
    setDraftName(found.name);
  };

  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ alignItems: 'flex-end' }}>
        <div className="demo-field-medium">
          <Field label={`Selected definition (${selected.code})`}>
            <Input value={draftName} onChange={(_, d) => setDraftName(d.value)} />
          </Field>
        </div>
        <Button
          appearance="primary"
          onClick={() =>
            setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, name: draftName } : i)))
          }
        >
          Update name
        </Button>
      </div>

      <RecordSelectionRegion
        toolbar={
          <SearchBox
            aria-label="Filter definitions"
            placeholder="Filter definitions..."
            value={query}
            onChange={(_, d) => setQuery(d.value)}
          />
        }
      >
        <RecordSelectionDataGrid
          aria-label="Definitions list"
          items={filtered}
          columns={columns}
          getRowId={(item: MasterItem) => item.id}
          selectedItems={new Set<TableRowId>([selectedId])}
          onSelectionChange={(_, data) => {
            const first = Array.from(data.selectedItems)[0];
            if (typeof first === 'string') selectRecord(first);
          }}
        >
          <RecordDataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
            </DataGridRow>
          </RecordDataGridHeader>
          <DataGridBody<MasterItem>>
            {({ item, rowId }) => (
              <RecordSelectionDataGridRow<MasterItem> key={rowId} recordId={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </RecordSelectionDataGridRow>
            )}
          </DataGridBody>
        </RecordSelectionDataGrid>
      </RecordSelectionRegion>
    </div>
  );
}

const SAMPLE_HISTORY: readonly ChangeHistoryEntry[] = [
  {
    id: 'H-3',
    at: '26 Oct 2026 14:15',
    actor: 'A. Lin',
    action: 'Updated pricing',
    changes: [
      { field: 'Unit price', from: '$ 1,240.00', to: '$ 1,310.00' },
      { field: 'Lead time', from: '14 days', to: '12 days' },
    ],
    reason: 'Annual supplier cost revision',
  },
  {
    id: 'H-2',
    at: '22 Oct 2026 09:40',
    actor: 'K. Sato',
    action: 'Submitted for review',
    changes: [{ field: 'Status', from: 'Draft', to: 'In review' }],
  },
  {
    id: 'H-1',
    at: '19 Oct 2026 16:05',
    actor: 'A. Lin',
    action: 'Created record',
  },
];

export function ChangeHistoryDemo() {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="demo-stack">
      <div className="site-playground__controls">
        <Checkbox
          label="Preview empty history state"
          checked={showEmpty}
          onChange={(_, d) => setShowEmpty(Boolean(d.checked))}
        />
      </div>
      <ChangeHistoryTable
        aria-label="Record change history"
        entries={showEmpty ? [] : SAMPLE_HISTORY}
      />
    </div>
  );
}
