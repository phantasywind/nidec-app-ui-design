// Research prototype only. Compares the current "Fluent control inside a Table cell" edit row
// with a lightweight model where the cell itself draws the editor, at several row heights.
import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckmarkRegular, DismissRegular, EditRegular, LockClosedRegular } from '@fluentui/react-icons';
import {
  Badge, Dropdown, EditableGrid, EditableGridRowActionGroup, Input, NidecProvider, Option, SegmentedControl,
  Table, TableActionIconButton, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Tooltip, nidecLightTheme,
} from '../../src/index';
import '../../styles/styles.css';
import './research.css';

type Kind = 'readonly' | 'text' | 'longText' | 'number' | 'select' | 'multiselect';
type Height = '32' | '40' | '48' | 'auto';
type Frame = 'text' | 'text-white' | 'grey' | 'filled' | 'ghost' | 'inset' | 'cell' | 'underline';
type Scenario = 'current' | 'lite-row' | 'lite-cell';
type Line = { id: string; code: string; description: string; category: string; qty: string; price: string; regions: string[] };
type Column = { key: keyof Line | 'amount'; header: string; width: number; kind: Kind; align?: 'end'; options?: readonly { value: string; text: string }[] };

const categories = [
  { value: 'elec', text: 'Electrical' }, { value: 'mech', text: 'Mechanical' }, { value: 'ctrl', text: 'Controls' }, { value: 'serv', text: 'Service' },
];
const regions = [{ value: 'apac', text: 'Asia Pacific' }, { value: 'emea', text: 'Europe' }, { value: 'amer', text: 'Americas' }, { value: 'cn', text: 'China' }];
const textOf = (options: Column['options'], value: string) => options?.find(o => o.value === value)?.text ?? value;

const columns: Column[] = [
  { key: 'id', header: 'Line', width: 64, kind: 'readonly', align: 'end' },
  { key: 'code', header: 'Item code', width: 116, kind: 'text' },
  { key: 'description', header: 'Description', width: 240, kind: 'longText' },
  { key: 'category', header: 'Category', width: 132, kind: 'select', options: categories },
  { key: 'qty', header: 'Quantity', width: 92, kind: 'number', align: 'end' },
  { key: 'price', header: 'Unit price', width: 104, kind: 'number', align: 'end' },
  { key: 'regions', header: 'Regions', width: 200, kind: 'multiselect', options: regions },
  { key: 'amount', header: 'Amount', width: 104, kind: 'readonly', align: 'end' },
];

const initialLines: Line[] = [
  { id: '1', code: 'ITM-00001', description: 'Control unit', category: 'elec', qty: '1', price: '5200.00', regions: ['apac'] },
  { id: '2', code: 'ITM-00002', description: 'Drive module with an extended note that is longer than the column and wraps onto more lines', category: 'elec', qty: '2', price: '1250.00', regions: ['apac', 'cn'] },
  { id: '3', code: 'ITM-00003', description: 'Mounting frame', category: 'mech', qty: '1', price: '3800.00', regions: ['emea'] },
  { id: '4', code: 'ITM-00004', description: 'Cable 18C', category: 'elec', qty: '120', price: '12.50', regions: ['apac', 'emea', 'amer'] },
  { id: '5', code: 'ITM-00005', description: 'Sensor bracket', category: 'mech', qty: '4', price: '86.00', regions: [] },
  { id: '6', code: 'ITM-00006', description: 'Commissioning and site acceptance support, two engineers for three days', category: 'serv', qty: '1', price: '2400.00', regions: ['cn'] },
];

const amountOf = (line: Line) => { const n = Number(line.qty) * Number(line.price); return Number.isFinite(n) ? n.toFixed(2) : ''; };
const qtyError = (value: string) => (/^\d+$/.test(value) ? undefined : 'Enter a whole number');
const valueOf = (line: Line, column: Column) => {
  if (column.key === 'amount') return amountOf(line);
  if (column.key === 'regions') return line.regions.map(v => textOf(regions, v)).join(', ');
  if (column.kind === 'select') return textOf(column.options, line[column.key] as string);
  return line[column.key] as string;
};
const template = (actions: boolean) => columns.map(c => (c.key === 'description' ? `minmax(${c.width}px, 1fr)` : `${c.width}px`)).join(' ') + (actions ? ' 80px' : '');

// ---------------------------------------------------------------------------
// Current approach: Fluent Table, the active row swaps text for size="small" Fluent controls.
// Controls are stretched to the cell width, as adopting applications do.
const fill: CSSProperties = { width: '100%', minWidth: 0, boxSizing: 'border-box' };
function CurrentGrid({ height, editingId: initialEditing }: { height: Height; editingId: string }) {
  const [lines, setLines] = useState(initialLines);
  const [editingId, setEditingId] = useState(initialEditing);
  const [draft, setDraft] = useState<Line | undefined>(() => initialLines.find(l => l.id === initialEditing));
  const start = (line: Line) => { setEditingId(line.id); setDraft({ ...line }); };
  const set = (key: keyof Line, value: string | string[]) => setDraft(d => (d ? { ...d, [key]: value } : d));
  const confirm = () => { if (draft) setLines(ls => ls.map(l => (l.id === draft.id ? draft : l))); setEditingId(''); };
  const control = (column: Column, line: Line) => {
    const label = `${column.header} for line ${line.id}`;
    if (column.kind === 'select') {
      return <Dropdown aria-label={label} size="small" style={fill} value={textOf(column.options, line[column.key as keyof Line] as string)}
        selectedOptions={[line[column.key as keyof Line] as string]} onOptionSelect={(_, d) => set(column.key as keyof Line, d.optionValue ?? '')}>
        {column.options!.map(o => <Option key={o.value} value={o.value}>{o.text}</Option>)}
      </Dropdown>;
    }
    if (column.kind === 'multiselect') {
      return <Dropdown aria-label={label} size="small" style={fill} multiselect value={valueOf(line, column)} selectedOptions={line.regions}
        onOptionSelect={(_, d) => set('regions', d.selectedOptions)}>
        {regions.map(o => <Option key={o.value} value={o.value}>{o.text}</Option>)}
      </Dropdown>;
    }
    return <Input aria-label={label} size="small" style={fill} value={line[column.key as keyof Line] as string}
      onChange={(_, d) => set(column.key as keyof Line, d.value)} input={{ style: column.align ? { textAlign: 'end' } : undefined }} />;
  };
  return <div className="rs-current" data-height={height}>
    <Table aria-label="Current edit row" size={height === '32' || height === 'auto' ? 'extra-small' : height === '40' ? 'small' : 'medium'} style={{ tableLayout: 'fixed', minWidth: 1132 }}>
      <TableHeader><TableRow>
        {columns.map(c => <TableHeaderCell key={c.key} style={{ width: c.key === 'description' ? undefined : c.width }}>{c.header}</TableHeaderCell>)}
        <TableHeaderCell style={{ width: 80 }}>Actions</TableHeaderCell>
      </TableRow></TableHeader>
      <TableBody>{lines.map(line => {
        const editing = line.id === editingId && draft;
        const v = editing ? draft : line;
        return <TableRow key={line.id} data-row-id={line.id} data-editing={editing ? true : undefined}>
          {columns.map(c => <TableCell key={c.key} data-col={c.key} style={c.align ? { textAlign: 'end' } : undefined}>
            {editing && c.kind !== 'readonly' ? control(c, v) : <span className="rs-text">{valueOf(v, c)}</span>}
          </TableCell>)}
          <TableCell className="nidec-ui-editable-grid__action-column">{editing
            ? <EditableGridRowActionGroup confirmIcon={<CheckmarkRegular />} confirmLabel={`Confirm line ${line.id}`} cancelIcon={<DismissRegular />}
              cancelLabel={`Cancel line ${line.id}`} onConfirm={confirm} onCancel={() => setEditingId('')} />
            : <Tooltip content={`Edit line ${line.id}`} relationship="label"><TableActionIconButton aria-label={`Edit line ${line.id}`} icon={<EditRegular />} onClick={() => start(line)} /></Tooltip>}
          </TableCell>
        </TableRow>;
      })}</TableBody>
    </Table>
  </div>;
}

// ---------------------------------------------------------------------------
// Lightweight approach: one CSS grid; a cell in edit state draws its own field inside its own box,
// so the field always matches the row height and the text never moves.
function Chevron() { return <span aria-hidden className="rs-chevron" />; }
function Lock() { return <span aria-hidden className="rs-lock"><LockClosedRegular fontSize={14} /></span>; }
function Tags({ values }: { values: readonly string[] }) {
  return <>{values.map(v => <span key={v} className="rs-tag">{textOf(regions, v)}</span>)}</>;
}

type ListState = { rowId: string; col: string } | undefined;

function LiteGrid({ height, frame, scenario, editingId: initialEditing, focusCol, openList, showError }: {
  height: Height; frame: Frame; scenario: 'lite-row' | 'lite-cell'; editingId: string; focusCol?: string; openList?: string; showError?: boolean;
}) {
  const rowMode = scenario === 'lite-row';
  const [lines, setLines] = useState(initialLines);
  const [editingId, setEditingId] = useState(initialEditing);
  const [draft, setDraft] = useState<Line | undefined>(() => {
    const line = initialLines.find(l => l.id === initialEditing);
    return line && showError ? { ...line, qty: '2.5' } : line && { ...line };
  });
  const [active, setActive] = useState<{ rowId: string; col: string } | undefined>(
    initialEditing ? { rowId: initialEditing, col: focusCol ?? 'description' } : undefined);
  const [list, setList] = useState<ListState>(openList ? { rowId: initialEditing, col: openList } : undefined);
  const dirty = useRef(new Set<string>(['4']));

  const start = (line: Line, col?: string) => { setEditingId(line.id); setDraft({ ...line }); setActive({ rowId: line.id, col: col ?? 'code' }); setList(undefined); };
  const set = (key: keyof Line, value: string | string[]) => setDraft(d => (d ? { ...d, [key]: value } : d));
  const confirm = () => {
    if (!draft || qtyError(draft.qty)) return;
    setLines(ls => ls.map(l => (l.id === draft.id ? draft : l))); dirty.current.add(draft.id); setEditingId(''); setList(undefined);
  };
  const cancel = () => { setEditingId(''); setList(undefined); };
  const keys = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); cancel(); }
    if (event.key === 'Enter' && !(event.target instanceof HTMLTextAreaElement && !event.ctrlKey)) { event.preventDefault(); confirm(); }
  };

  const field = (line: Line, column: Column) => {
    const key = column.key as keyof Line;
    const label = `${column.header} for line ${line.id}`;
    const error = column.key === 'qty' ? qtyError(line.qty) : undefined;
    const focused = active?.rowId === line.id && active.col === column.key;
    const common = { 'data-frame': frame, 'data-focused': focused || undefined, 'aria-invalid': error ? true : undefined, title: error } as const;
    const onFocus = () => setActive({ rowId: line.id, col: column.key });
    if (column.kind === 'select' || column.kind === 'multiselect') {
      const open = list?.rowId === line.id && list.col === column.key;
      return <div {...common} className="rs-field rs-field--list" role="combobox" aria-label={label} aria-expanded={open} tabIndex={0}
        onFocus={onFocus} onClick={() => setList(open ? undefined : { rowId: line.id, col: column.key })}>
        <span className="rs-field-value">{column.kind === 'multiselect' ? <Tags values={line.regions} /> : valueOf(line, column)}</span><Chevron />
        {open ? <div className="rs-listbox" role="listbox" aria-multiselectable={column.kind === 'multiselect'} onClick={e => e.stopPropagation()}>
          {column.options!.map(o => {
            const selected = column.kind === 'multiselect' ? line.regions.includes(o.value) : line[key] === o.value;
            return <div key={o.value} role="option" aria-selected={selected} className="rs-option" data-check={column.kind === 'multiselect' || undefined}
              onClick={() => {
                if (column.kind === 'multiselect') set('regions', selected ? line.regions.filter(v => v !== o.value) : regions.map(r => r.value).filter(v => v === o.value || line.regions.includes(v)));
                else { set(key, o.value); setList(undefined); }
              }}>{o.text}</div>;
          })}
        </div> : null}
      </div>;
    }
    const value = line[key] as string;
    if (column.kind === 'longText' && height === 'auto') {
      return <div {...common} className="rs-field"><textarea aria-label={label} className="rs-input rs-input--area" value={value} rows={1}
        autoFocus={focused} onFocus={onFocus} onChange={e => set(key, e.target.value)} /></div>;
    }
    return <div {...common} className="rs-field"><input aria-label={label} className="rs-input" value={value} autoFocus={focused}
      style={column.align ? { textAlign: 'end' } : undefined} onFocus={onFocus} onChange={e => set(key, e.target.value)} /></div>;
  };

  const cell = (line: Line, column: Column, editing: boolean) => {
    const readOnly = column.kind === 'readonly';
    const cellEditing = editing && !readOnly && (rowMode || active?.col === column.key);
    const display = column.kind === 'multiselect' ? <Tags values={line.regions} /> : valueOf(line, column);
    const selected = !rowMode && !editing && active?.rowId === line.id && active.col === column.key;
    return <div key={column.key} role="gridcell" className="rs-cell" data-col={column.key} data-kind={column.kind} data-align={column.align}
      aria-readonly={readOnly || undefined} data-lock={readOnly && (!rowMode || editing) ? true : undefined} aria-selected={selected || undefined}
      data-dirty={column.key === 'id' && dirty.current.has(line.id) ? true : undefined}
      onClick={() => { if (!rowMode && !readOnly) start(line, column.key); }}>
      {/* In flow: keeps the row height from the (draft) content; the field is drawn over it. */}
      <span className="rs-text" style={cellEditing ? { visibility: 'hidden' } : undefined}>{display}</span>
      {cellEditing ? field(line, column) : null}
      {readOnly && (!rowMode || editing) ? <Lock /> : null}
    </div>;
  };

  const minWidth = columns.reduce((sum, c) => sum + c.width, rowMode ? 80 : 0);
  const style = { '--rs-columns': template(rowMode), '--rs-min-width': `${minWidth}px`, '--rs-row-height': height === 'auto' ? '40px' : `${height}px` } as CSSProperties;
  return <div className="rs-lite" role="grid" aria-label="Lightweight edit grid" data-height={height} data-mode={scenario} data-frame={frame} style={style} onKeyDown={keys}>
    <div className="rs-row rs-row--header" role="row">
      {columns.map(c => <div key={c.key} role="columnheader" className="rs-cell rs-header" data-align={c.align}>{c.header}</div>)}
      {rowMode ? <div role="columnheader" className="rs-cell rs-header rs-actions">Actions</div> : null}
    </div>
    {lines.map(line => {
      const editing = line.id === editingId && !!draft;
      const v = editing ? draft! : line;
      return <div key={line.id} role="row" className="rs-row" data-row-id={line.id} data-editing={editing || undefined}
        onDoubleClick={() => { if (rowMode && !editing) start(line); }}>
        {columns.map(c => cell(v, c, editing))}
        {rowMode ? <div role="gridcell" className="rs-cell rs-actions">{editing
          ? <EditableGridRowActionGroup confirmIcon={<CheckmarkRegular />} confirmLabel={`Confirm line ${line.id}`} cancelIcon={<DismissRegular />}
            cancelLabel={`Cancel line ${line.id}`} onConfirm={confirm} onCancel={cancel} confirmDisabled={!!qtyError(v.qty)} />
          : <Tooltip content={`Edit line ${line.id}`} relationship="label"><TableActionIconButton aria-label={`Edit line ${line.id}`} icon={<EditRegular />} onClick={() => start(line)} /></Tooltip>}
        </div> : null}
      </div>;
    })}
  </div>;
}

// ---------------------------------------------------------------------------
const params = new URLSearchParams(location.search);
const heights: Height[] = ['32', '40', '48', 'auto'];
const heightLabel = (h: Height) => (h === 'auto' ? '自动行高（长文本换行）' : `${h}px 固定行高`);
const scenarioLabel: Record<Scenario, string> = { current: '现状：单元格里放 Fluent 小号控件', 'lite-row': '轻量：整行编辑（单元格即控件）', 'lite-cell': '轻量：单格编辑（现有 LiteEditableGrid 方式）' };
const frameLabel: Record<Frame, string> = { text: '绿字加粗（绿行）', 'text-white': '绿字加粗（白行）', grey: '白行灰格', filled: '白底无框', ghost: '无框（仅聚焦）', inset: '内缩输入框', cell: '整格边框', underline: '仅下划线' };

function Grid({ scenario, height, frame, editingId = '2', ...rest }: { scenario: Scenario; height: Height; frame: Frame; editingId?: string; focusCol?: string; openList?: string; showError?: boolean }) {
  const body = scenario === 'current'
    ? <CurrentGrid height={height} editingId={editingId} />
    : <LiteGrid height={height} frame={frame} scenario={scenario} editingId={editingId} {...rest} />;
  return <EditableGrid aria-label={scenarioLabel[scenario]} title={scenarioLabel[scenario]}
    description={`${heightLabel(height)}${scenario === 'current' ? '' : ` · ${frameLabel[frame]}`}`}
    status={<Badge appearance="tint" color="warning">1 unsaved line</Badge>} footer={<span>{initialLines.length} lines</span>}>
    {body}
  </EditableGrid>;
}

function Playground() {
  const [scenario, setScenario] = useState<Scenario>((params.get('scenario') as Scenario) ?? 'lite-row');
  const [height, setHeight] = useState<Height>((params.get('h') as Height) ?? '40');
  const [frame, setFrame] = useState<Frame>((params.get('frame') as Frame) ?? 'text');
  const [compare, setCompare] = useState(params.get('compare') !== '0');
  const key = `${scenario}-${height}-${frame}`;
  return <div className="rs-page">
    <header className="rs-controls">
      <h1>可编辑表轻量化：对比原型</h1>
      <p>第 2 行默认处于编辑态。点铅笔或双击一行进入编辑，Enter 保存、Esc 取消。切换行高看控件尺寸是否跟着走。</p>
      <div className="rs-control-row">
        <label>方案</label>
        <SegmentedControl aria-label="方案" value={scenario} onValueChange={(_, v) => setScenario(v as Scenario)}
          options={[{ value: 'current', label: '现状' }, { value: 'lite-row', label: '轻量 · 整行' }, { value: 'lite-cell', label: '轻量 · 单格' }]} />
        <label>行高</label>
        <SegmentedControl aria-label="行高" value={height} onValueChange={(_, v) => setHeight(v as Height)}
          options={heights.map(h => ({ value: h, label: h === 'auto' ? '自动' : h }))} />
        <label>编辑框样式</label>
        <SegmentedControl aria-label="编辑框样式" value={frame} disabled={scenario === 'current'} onValueChange={(_, v) => setFrame(v as Frame)}
          options={(Object.keys(frameLabel) as Frame[]).map(f => ({ value: f, label: frameLabel[f] }))} />
        <label><input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)} /> 同时显示现状</label>
      </div>
    </header>
    {compare && scenario !== 'current' ? <Grid key={`c-${height}`} scenario="current" height={height} frame={frame} /> : null}
    <Grid key={key} scenario={scenario} height={height} frame={frame} />
  </div>;
}

function Single() {
  const scenario = (params.get('scenario') as Scenario) ?? 'lite-row';
  const opts = {
    scenario, height: (params.get('h') as Height) ?? '40', frame: (params.get('frame') as Frame) ?? 'inset',
    editingId: params.get('edit') ?? '2',
  } as const;
  const focusCol = params.get('focus') ?? undefined;
  const openList = params.get('open') ?? undefined;
  return <div className="rs-page rs-page--shot">
    <Grid {...opts} {...(focusCol ? { focusCol } : {})} {...(openList ? { openList } : {})} showError={params.get('error') === '1'} />
  </div>;
}

function App(): ReactNode {
  return params.get('view') === 'single' ? <Single /> : <Playground />;
}

function Root() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { document.body.dataset.ready = 'true'; }, []);
  return <div ref={ref}><NidecProvider theme={nidecLightTheme}><App /></NidecProvider></div>;
}

createRoot(document.getElementById('root')!).render(<Root />);
