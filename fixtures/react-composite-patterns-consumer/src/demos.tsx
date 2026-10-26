import { Fragment, createContext, useContext, useEffect, useMemo, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { createDOMRenderer, createTableColumn, RendererProvider } from '@fluentui/react-components';
import { DatePicker } from '@phantasywind/nidec-app-ui-design/date-picker';
import {
  AddRegular, ArrowClockwiseRegular, ArrowRedoRegular, ArrowUndoRegular, CheckmarkRegular,
  ChevronDownRegular, ChevronLeftRegular, ChevronRightRegular, DeleteRegular, DismissRegular, EditRegular,
  GridRegular, ListRegular, MoreHorizontalRegular,
} from '@fluentui/react-icons';
import {
  Accordion, AccordionHeader, AccordionItem, AccordionPanel, ActionableCardGalleryItem, Badge, Body1, Breadcrumb, BreadcrumbButton,
  BreadcrumbDivider, BreadcrumbItem, BusinessProcessFlow, Button as SharedButton, Card, CardFooter, CardGallery,
  CardGalleryItem, CardHeader, Caption1, Checkbox, CollectionList, CollectionListItem, Combobox,
  Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider,
  DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Field, InfoLabel, InlineModeTabs, Input,
  EditableGrid, EditableGridRowActionGroup, GroupedTableSectionRow,
  Label, Link, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, MessageBar, MessageBarBody,
  MessageBarTitle, Nav, NavItem, NidecProvider, Option, OverlayDrawer, PageHeader, Persona, Popover,
  PopoverSurface, PopoverTrigger, ProgressBar, Radio, RadioGroup, RecordIdentityCellLayout,
  RecordManagementWorkspace, RecordSelectionDataGrid, RecordSelectionDataGridRow,
  RecordSelectionRegion, RecordTableHeader, SearchBox, SegmentedControl, Dropdown, Skeleton,
  SkeletonItem, Slider, SpinButton, Spinner, StageNavigator, Switch, Tab, Table,
  TableActionIconButton, TableBody, TableCell, TableCellActions, TableHeaderCell, TableRow, TabList,
   Tag, Textarea, Toolbar, ToolbarButton as SharedToolbarButton, Tooltip, ViewModeToggle, WorkspaceSection,
  DataGridBody, DataGridCell, DataGridHeaderCell, DataGridRow, nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import {
  ApplicationFrame, ApplicationNavigation, ApplicationNavigationGroup, ApplicationNavigationItem,
  ApplicationTopBar, AuthenticationLayout, DirectoryWorkspace, VersionedWorkspaceLayout,
} from '@phantasywind/nidec-app-ui-design/layouts';
import '@phantasywind/nidec-app-ui-design/styles.css';

function Button(props: ComponentProps<typeof SharedButton>): ReactElement {
  if (props.children === 'Previous') {
    return <Tooltip content="Previous page" relationship="label"><SharedButton {...props} aria-label="Previous page" icon={<ChevronLeftRegular />} children="" /></Tooltip>;
  }
  if (props.children === 'Next') {
    return <><label className="pagination-sample__size">Rows per page<Dropdown aria-label="Rows per page" defaultValue="25" defaultSelectedOptions={["25"]}><Option value="10">10</Option><Option value="25">25</Option><Option value="50">50</Option></Dropdown></label><Tooltip content="Next page" relationship="label"><SharedButton {...props} aria-label="Next page" icon={<ChevronRightRegular />} children="" /></Tooltip></>;
  }
  return <SharedButton {...props} />;
}

function ToolbarButton(props: ComponentProps<typeof SharedToolbarButton>): ReactElement {
  if (props.children === 'Refresh') {
    return <Tooltip content="Refresh" relationship="label"><SharedToolbarButton {...props} aria-label="Refresh" icon={<ArrowClockwiseRegular />} children={undefined} /></Tooltip>;
  }
  return <SharedToolbarButton {...props} />;
}

const directoryRecords = [
  { id: 'REC-1042', name: 'Example Alpha', category: 'Standard', owner: 'A. Chen', status: 'Ready', tone: 'success' as const, updated: 'Today' },
  { id: 'REC-1038', name: 'Example Beta', category: 'Configured', owner: 'M. Silva', status: 'Review', tone: 'warning' as const, updated: 'Yesterday' },
  { id: 'REC-1021', name: 'Example Gamma', category: 'Special', owner: 'L. Martin', status: 'Blocked', tone: 'danger' as const, updated: '3 days ago' },
  { id: 'REC-1016', name: 'Example Delta', category: 'Standard', owner: 'J. Park', status: 'Draft', tone: 'informative' as const, updated: 'Last week' },
];

const workspaceStages = [
  { id: 'definition', label: 'Definition', description: 'Identity and scope', status: 'completed' as const, statusLabel: 'Prepared' },
  { id: 'parameters', label: 'Parameters', description: 'Governed values', status: 'current' as const, statusLabel: 'In progress' },
  { id: 'rules', label: 'Rules', description: 'Reusable logic', status: 'upcoming' as const, statusLabel: 'Preparation ahead' },
  { id: 'review', label: 'Review', description: 'Readiness evidence', status: 'upcoming' as const, statusLabel: 'Preparation ahead' },
];

const lifecycleStages = [
  { id: 'draft', label: 'Draft', description: 'Completed', status: 'completed' as const, statusLabel: 'Completed' },
  { id: 'review', label: 'In review', description: 'Evidence requested', status: 'current' as const, statusLabel: 'Current stage' },
  { id: 'approved', label: 'Approved', description: 'Not reached', status: 'upcoming' as const, statusLabel: 'Upcoming' },
  { id: 'released', label: 'Released', description: 'Not released', status: 'upcoming' as const, statusLabel: 'Upcoming' },
];

function formatDateOnly(date?: Date): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return formatDateOnly(date) === value.trim() ? date : null;
}

const SpecimenFilter = createContext<string | null>(null);

function Specimen({ title, description, children, wide = false }: { title: string; description: string; children: ReactNode; wide?: boolean }) {
  const filter = useContext(SpecimenFilter);
  if (filter && filter !== title) return null;
  return <section className={`specimen${wide ? ' specimen--wide' : ''}`}>
    <header><div><h2>{title}</h2><p>{description}</p></div><Tag appearance="outline">Governed</Tag></header>
    <div className="specimen__body">{children}</div>
  </section>;
}

function TemplateContract({ purpose, useWhen, task, entry, owns, avoid }: { purpose: string; useWhen: string; task: string; entry: string; owns: string; avoid: string }) {
  return <section className="template-contract" aria-label="Template usage contract">
    <div><strong>Purpose</strong><span>{purpose}</span></div>
    <div><strong>Use when</strong><span>{useWhen}</span></div>
    <div><strong>Primary task</strong><span>{task}</span></div>
    <div><strong>Entry / return</strong><span>{entry}</span></div>
    <div><strong>Consumer owns</strong><span>{owns}</span></div>
    <div><strong>Do not use</strong><span>{avoid}</span></div>
  </section>;
}

function RowMenu({ name }: { name: string }) {
  return <TableCellActions visible><Menu>
    <Tooltip content={`More actions for ${name}`} relationship="description">
      <MenuTrigger disableButtonEnhancement><TableActionIconButton aria-label={`More actions for ${name}`} icon={<MoreHorizontalRegular />} /></MenuTrigger>
    </Tooltip>
    <MenuPopover><MenuList><MenuItem>Review details</MenuItem><MenuItem>Duplicate example</MenuItem></MenuList></MenuPopover>
  </Menu></TableCellActions>;
}

function ElementsPage() {
  const [density, setDensity] = useState('comfortable');
  const [choice, setChoice] = useState('standard');
  const [mode, setMode] = useState('reference');
  const [tab, setTab] = useState<string | number>('overview');
  const [enabled, setEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 8, 23));
  const [boundedDate, setBoundedDate] = useState<Date | null>(new Date(2026, 5, 15));
  const [selected, setSelected] = useState<string[]>(['REC-1042']);
  const [stageId, setStageId] = useState('parameters');
  const [viewedLifecycleStageId, setViewedLifecycleStageId] = useState('review');
  const navigatorStages = workspaceStages;

  return <>
    <div className="specimen-grid">
      <Specimen title="Text input" description="Labels, hints, validation and read-only state.">
        <div className="form-stack bounded-text-fields"><Field label="Record name" hint="Concise supporting guidance"><Input defaultValue="Example Alpha" /></Field><Field label="Description"><Textarea rows={3} defaultValue="Business-neutral multiline content." /></Field><Field label="Reference" validationState="error" validationMessage="Example validation message"><Input defaultValue="Needs review" /></Field></div>
      </Specimen>
      <Specimen title="Date selection" description="Fluent calendar entry for date-only values; business date rules remain consumer-owned." wide>
        <div className="date-preview-grid">
          <Field label="Effective date" hint="Choose from the calendar or type YYYY-MM-DD.">
            <DatePicker aria-label="Effective date" allowTextInput formatDate={formatDateOnly} parseDateFromString={parseDateOnly} placeholder="YYYY-MM-DD" showGoToToday value={selectedDate} onSelectDate={date => setSelectedDate(date ?? null)} />
          </Field>
          <Field label="Date with allowed range" hint="Example boundary only: 2026 calendar year.">
            <DatePicker aria-label="Date with allowed range" allowTextInput value={boundedDate} onSelectDate={date => setBoundedDate(date ?? null)} formatDate={formatDateOnly} parseDateFromString={parseDateOnly} minDate={new Date(2026, 0, 1)} maxDate={new Date(2026, 11, 31)} showGoToToday />
          </Field>
          <Field label="Unavailable date" hint="Disabled state is explicit and non-interactive.">
            <DatePicker aria-label="Unavailable date" disabled value={new Date(2026, 8, 23)} formatDate={formatDateOnly} />
          </Field>
        </div>
      </Specimen>
      <Specimen title="Choice controls" description="Use the control that matches the decision grain.">
        <div className="form-stack"><Field className="compact-choice-field" label="Display density"><Dropdown selectedOptions={[density]} onOptionSelect={(_, data) => setDensity(data.optionValue ?? "comfortable")}><Option value="comfortable">Comfortable</Option><Option value="compact">Compact</Option></Dropdown></Field><Checkbox label="Show supporting details" defaultChecked /><Switch label="Enable governed option" checked={enabled} onChange={(_, data) => setEnabled(data.checked)} /><RadioGroup value={choice} onChange={(_, data) => setChoice(data.value)} layout="horizontal"><Radio value="standard" label="Standard" /><Radio value="extended" label="Extended" /></RadioGroup></div>
      </Specimen>
      <Specimen title="Compact selection" description="Page mode and local editor mode remain distinct.">
         <div className="form-stack"><SegmentedControl aria-label="Workspace mode" options={[{ value: 'standard', label: 'Standard' }, { value: 'extended', label: 'Extended' }]} value={choice} onValueChange={(_, value) => setChoice(value)} /><InlineModeTabs aria-label="Value source" options={[{ value: 'reference', label: 'Reference', tabId: 'material-reference-tab', panelId: 'material-reference-panel' }, { value: 'manual', label: 'Manual', tabId: 'material-manual-tab', panelId: 'material-manual-panel' }]} value={mode} onValueChange={(_, value) => setMode(value)} /><div role="tabpanel" id={`material-${mode}-panel`} aria-labelledby={`material-${mode}-tab`}><Input aria-label="Example mode value" value={mode === 'reference' ? 'Shared parameter' : '42'} readOnly /></div></div>
      </Specimen>

      <Specimen title="Actions and disclosure" description="Primary, attention and secondary actions, then overflow and disclosure.">
        <div className="button-cluster"><Button appearance="primary">Save changes</Button><Button appearance="attention">Return</Button><Button>Cancel</Button><Menu><MenuTrigger disableButtonEnhancement><Button>More actions</Button></MenuTrigger><MenuPopover><MenuList><MenuItem>Edit</MenuItem><MenuItem>Archive</MenuItem></MenuList></MenuPopover></Menu></div><div className="link-row"><Link href="#example">Record identity link</Link><Popover><PopoverTrigger><Button>Show details</Button></PopoverTrigger><PopoverSurface>Contextual information remains consumer-owned.</PopoverSurface></Popover></div>
      </Specimen>
      <Specimen title="Feedback and status" description="Use restrained semantic feedback close to its cause.">
        <div className="status-row"><Badge appearance="tint" color="success">Ready</Badge><Badge appearance="tint" color="warning">Review</Badge><Badge appearance="tint" color="danger">Blocked</Badge><Tag appearance="outline">Metadata</Tag></div><MessageBar intent="info"><MessageBarBody><MessageBarTitle>Information</MessageBarTitle>This example does not introduce a business rule.</MessageBarBody></MessageBar><ProgressBar value={0.65} aria-label="Example progress" /><div className="loading-row"><Spinner size="tiny" label="Loading" /><Skeleton aria-label="Loading placeholder"><SkeletonItem /></Skeleton></div>
      </Specimen>

      <Specimen title="Collection list" description="Compact content hierarchy with isolated selection and actions.">
        <CollectionList aria-label="Example collection" density="compact">{directoryRecords.slice(0, 3).map(record => <CollectionListItem key={record.id} selection={<Checkbox aria-label={`Select ${record.name}`} checked={selected.includes(record.id)} onChange={(_, data) => setSelected(data.checked ? [record.id] : [])} />} primary={record.name} secondary={record.category} metadata={record.updated} actions={<Link href="?view=record">Open </Link>} />)}</CollectionList>
      </Specimen>
      <Specimen title="Data table" description="One linked record identity, distinct fields and compact row actions." wide><RecordTable records={directoryRecords.slice(0, 3)} onOpen={() => { location.href = "?view=record"; }} /></Specimen>
      <Specimen title="Stage Navigator" description="All workspaces may be viewed; the selection ring never changes a stage's own fill." wide><StageNavigator aria-label="Example workspace navigation" stages={navigatorStages} selectedStageId={stageId} onStageSelect={(_, stage) => setStageId(stage.id)} /></Specimen>
      <Specimen title="Business Process Flow" description="Reached stages can be viewed; the actual process remains application-authoritative." wide><BusinessProcessFlow aria-label="Example lifecycle" stages={lifecycleStages} viewedStageId={viewedLifecycleStageId} onStageView={(_, stage) => setViewedLifecycleStageId(stage.id)} /><p className="muted">Viewing: {lifecycleStages.find(stage => stage.id === viewedLifecycleStageId)?.label} · Actual process: In review</p></Specimen>
      <Specimen title="Cards and responsive gallery" description="Display cards group related summaries; actionable cards provide one whole-card entry." wide><CardGallery aria-label="Example gallery" minimumItemWidth="small">{['Foundations', 'Components'].map((name, index) => <CardGalleryItem key={name}><CardHeader header={<strong>{name}</strong>} description={<span>{index + 1} governed area</span>} /><Body1>Display-only content without a nested surface.</Body1></CardGalleryItem>)}{['Patterns', 'Evidence'].map(name => <ActionableCardGalleryItem aria-label={`Open ${name}`} href={`#${name.toLowerCase()}`} key={name}><CardHeader header={<strong>{name}</strong>} description={<span>Whole-card navigation</span>} /><Body1>Click anywhere on the card to open this destination.</Body1></ActionableCardGalleryItem>)}</CardGallery></Specimen>
    </div>
  </>;
}

function RecordTable({ records, onOpen }: { records: typeof directoryRecords; onOpen: (record: typeof directoryRecords[number]) => void }) {
  return <div className="table-scroll" role="region" aria-label="Scrollable records table" tabIndex={0}><Table aria-label="Example data records"><RecordTableHeader><TableRow><TableHeaderCell>Record</TableHeaderCell><TableHeaderCell>Category</TableHeaderCell><TableHeaderCell>Owner</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Updated</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell></TableRow></RecordTableHeader><TableBody>{records.map(record => <TableRow key={record.id}><TableCell><RecordIdentityCellLayout primary={<Link inline href={`#${record.id}`} onClick={event => { event.preventDefault(); onOpen(record); }}>{record.name}</Link>} truncate /></TableCell><TableCell>{record.category}</TableCell><TableCell>{record.owner}</TableCell><TableCell><Badge appearance="tint" color={record.tone}>{record.status}</Badge></TableCell><TableCell>{record.updated}</TableCell><TableCell><RowMenu name={record.name} /></TableCell></TableRow>)}</TableBody></Table></div>;
}

function AuthenticationSamplePage() {
  return <><TemplateContract purpose="Provide a stable application entry surface." useWhen="Authentication precedes the governed workspace." task="Identify and enter the application." entry="Direct entry; successful destination is consumer-owned." owns="Identity provider, SSO, MFA, recovery and errors." avoid="Do not treat this layout as an authentication protocol." /><AuthenticationLayout aria-label="Authentication entry" brand={<div><strong>Application brand</strong><Caption1>Consumer-supplied identity</Caption1></div>} title="Sign in" description="Access the governed application workspace." form={<form className="auth-sample__form" onSubmit={event => event.preventDefault()}><Field label="Email" required><Input type="email" autoComplete="username" /></Field><Field label="Password" required><Input type="password" autoComplete="current-password" /></Field><Button appearance="primary" type="submit">Sign in</Button></form>} footer={<Caption1>Authentication behavior remains application-owned.</Caption1>} /></>;
}

function DirectorySamplePage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [selectedRecord, setSelectedRecord] = useState<typeof directoryRecords[number] | null>(null);
  const filtered = directoryRecords.filter(record => record.name.toLowerCase().includes(query.toLowerCase()) && (status === 'all' || record.status === status));
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const results = !filtered.length ? <p role="status">No matching records. Adjust the search or filters.</p> : viewMode === 'list' ? <RecordTable records={visible} onOpen={setSelectedRecord} /> : <CardGallery aria-label="Record cards" minimumItemWidth="small">{visible.map(record => <ActionableCardGalleryItem aria-label={`Open ${record.name}`} key={record.id} onActivate={() => setSelectedRecord(record)}><CardHeader header={<strong>{record.name}</strong>} description={<span>{record.id}</span>} /><div className="card-facts"><span>{record.category}</span><Badge appearance="tint" color={record.tone}>{record.status}</Badge></div></ActionableCardGalleryItem>)}</CardGallery>;
  return <><Breadcrumb aria-label="Current location"><BreadcrumbItem><BreadcrumbButton href="?view=text">Component catalog</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Record directory</BreadcrumbButton></BreadcrumbItem></Breadcrumb><DirectoryWorkspace aria-label="Record directory" header={<PageHeader title="Record directory" description="Search, filter, switch views and open details." />} toolbar={<div className="button-cluster"><Toolbar aria-label="Directory tools"><SearchBox aria-label="Search records" value={query} onChange={(_, data) => {setQuery(data.value);setPage(0);}} placeholder="Search records" /><Dropdown aria-label="Status filter" selectedOptions={[status]} onOptionSelect={(_, data) => {setStatus(data.optionValue ?? "all");setPage(0);}}><Option value="all">All statuses</Option><Option>Ready</Option><Option>Review</Option><Option>Blocked</Option></Dropdown><Tooltip content="Refresh" relationship="label"><SharedToolbarButton aria-label="Refresh" icon={<ArrowClockwiseRegular />} onClick={() => setPage(0)} /></Tooltip></Toolbar><ViewModeToggle aria-label="Directory view" value={viewMode} onValueChange={(_, value) => setViewMode(value)} listIcon={<ListRegular />} cardIcon={<GridRegular />} /></div>} results={results} resultsLabel="Directory results" pagination={<div className="pagination-sample"><span>{filtered.length} records · Page {page+1}</span><Tooltip content="Previous page" relationship="label"><SharedButton aria-label="Previous page" icon={<ChevronLeftRegular />} disabled={page === 0} onClick={() => setPage(page-1)}>{''}</SharedButton></Tooltip><label>Rows per page<Dropdown aria-label="Rows per page" selectedOptions={[String(pageSize)]} onOptionSelect={(_, data) => {setPageSize(Number(data.optionValue));setPage(0);}}><Option value="2">2</Option><Option value="4">4</Option></Dropdown></label><Tooltip content="Next page" relationship="label"><SharedButton aria-label="Next page" icon={<ChevronRightRegular />} disabled={(page+1)*pageSize >= filtered.length} onClick={() => setPage(page+1)}>{''}</SharedButton></Tooltip></div>} /><OverlayDrawer open={selectedRecord !== null} onOpenChange={(_, data) => {if(!data.open)setSelectedRecord(null);}} position="end" size="medium" aria-label="Record details"><DrawerHeader><DrawerHeaderTitle action={<Button onClick={() => setSelectedRecord(null)}>Close</Button>}>{selectedRecord?.name}</DrawerHeaderTitle></DrawerHeader><DrawerBody><div className="form-stack"><Field label="Name"><Input value={selectedRecord?.name ?? ''} readOnly /></Field><Field label="Category"><Input value={selectedRecord?.category ?? ''} readOnly /></Field><Field label="Owner"><Input value={selectedRecord?.owner ?? ''} readOnly /></Field><MessageBar><MessageBarBody>This directory shows read-only details. See the complete form example for editing and submission.</MessageBarBody></MessageBar></div></DrawerBody></OverlayDrawer></>;
}

type EditableLine = {
  id: string;
  code: string;
  description: string;
  category: string;
  quantity: string;
  unit: string;
  unitPrice: string;
};

const initialEditableLines: EditableLine[] = [
  ['001', 'CMP-001', 'Controller cabinet', 'Electrical', '1', 'ea', '5200.00'],
  ['002', 'DRV-010', 'AC drive 7.5 kW', 'Electrical', '2', 'ea', '1250.00'],
  ['003', 'MTR-200', 'Traction motor', 'Mechanical', '1', 'ea', '3800.00'],
  ['004', 'SFT-100', 'Safety gear', 'Mechanical', '1', 'ea', '950.00'],
  ['005', 'GUI-300', 'Car operating panel', 'Electrical', '1', 'ea', '620.00'],
  ['006', 'CAB-450', 'Travelling cable 18C', 'Electrical', '120', 'm', '12.50'],
  ['007', 'BRK-110', 'Brake assembly', 'Mechanical', '1', 'ea', '680.00'],
  ['008', 'SEN-320', 'Position sensor', 'Electrical', '1', 'ea', '0.00'],
  ['009', 'LIM-210', 'Limit switch set', 'Electrical', '2', 'ea', '85.00'],
  ['010', 'RLR-500', 'Guide rail 5 m', 'Mechanical', '4', 'ea', '215.00'],
  ['011', 'FIX-120', 'Fixing kit', 'Mechanical', '2', 'set', '140.00'],
  ['012', 'BKT-330', 'Bracket set', 'Mechanical', '4', 'set', '90.00'],
  ['013', 'WIR-600', 'Wiring duct', 'Electrical', '10', 'm', '8.50'],
  ['014', 'TRM-410', 'Terminal block', 'Electrical', '5', 'ea', '12.00'],
].map(([id, code, description, category, quantity, unit, unitPrice]) => ({ id, code, description, category, quantity, unit, unitPrice }));

function EditableGridSamplePage() {
  const [lines, setLines] = useState(initialEditableLines);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('006');
  const [draft, setDraft] = useState<EditableLine>(() => ({ ...initialEditableLines[5] }));
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set(['003', '006']));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const filtered = useMemo(() => lines.filter(line => `${line.code} ${line.description} ${line.category}`.toLowerCase().includes(query.toLowerCase())), [lines, query]);
  const validationCount = lines.filter(line => Number(line.unitPrice) <= 0).length;

  const startEditing = (line: EditableLine) => {
    setActiveId(line.id);
    setDraft({ ...line });
  };
  const updateDraft = (field: keyof EditableLine, value: string) => setDraft(current => ({ ...current, [field]: value }));
  const confirmEdit = () => {
    setLines(current => current.map(line => line.id === draft.id ? draft : line));
    setDirtyIds(current => new Set(current).add(draft.id));
    setActiveId('');
  };
  const cancelEdit = () => setActiveId('');
  const addLine = () => {
    const nextId = String(lines.length + 1).padStart(3, '0');
    const line = { id: nextId, code: `NEW-${nextId}`, description: 'New line', category: 'Unassigned', quantity: '1', unit: 'ea', unitPrice: '0.00' };
    setLines(current => [...current, line]);
    startEditing(line);
  };
  const deleteSelected = () => {
    setLines(current => current.filter(line => !selectedIds.has(line.id)));
    setSelectedIds(new Set());
  };

  const status = <div className="editable-grid-preview__status"><span>{dirtyIds.size} unsaved changes</span><span aria-label={`${validationCount} validation issue`} className={validationCount ? 'editable-grid-preview__issue' : undefined}>{validationCount} validation issue</span><Button appearance="primary" onClick={() => setDirtyIds(new Set())}>Save changes</Button></div>;
  const toolbar = <><SearchBox aria-label="Search lines" placeholder="Search by code, description or category" value={query} onChange={(_, data) => setQuery(data.value)} /><Dropdown aria-label="Category filter" defaultValue="All categories" defaultSelectedOptions={["all"]}><Option value="all">All categories</Option><Option>Electrical</Option><Option>Mechanical</Option></Dropdown><Button icon={<AddRegular />} onClick={addLine}>Add line</Button><Button disabled={selectedIds.size === 0} icon={<DeleteRegular />} onClick={deleteSelected}>Delete selected</Button><Tooltip content="Undo" relationship="label"><TableActionIconButton aria-label="Undo" disabled icon={<ArrowUndoRegular />} /></Tooltip><Tooltip content="Redo" relationship="label"><TableActionIconButton aria-label="Redo" disabled icon={<ArrowRedoRegular />} /></Tooltip></>;
  const footer = <><span>{filtered.length} lines</span><label className="editable-grid-preview__page-size">Rows per page<Dropdown aria-label="Rows per page" defaultValue="25" defaultSelectedOptions={["25"]}><Option>25</Option><Option>50</Option><Option>100</Option></Dropdown></label><div className="editable-grid-preview__paging"><Tooltip content="Previous page" relationship="label"><TableActionIconButton aria-label="Previous page" disabled icon={<ChevronLeftRegular />} /></Tooltip><strong>1</strong><Tooltip content="Next page" relationship="label"><TableActionIconButton aria-label="Next page" icon={<ChevronRightRegular />} /></Tooltip></div></>;

  return <><TemplateContract purpose="Edit many line records quickly without opening one form per row." useWhen="The primary task is frequent, repetitive changes across a large line collection." task="Scan, select, edit one active row, validate and save a controlled batch." entry="From a record workspace or line-management page; return preserves the owning record context." owns="Columns, calculations, lookup data, validation, permissions, persistence, concurrency and virtualization." avoid="Do not use for a small form, occasional single-record edits or lifecycle decisions." /><PageHeader eyebrow="Page pattern / editable grid" title="Line editing" description="A dense batch-editing surface for high-volume line collections. The active row expands into editors while the remaining rows stay compact." /><EditableGrid aria-label="Example line editor" title="Line editor" description="Edit multiple lines, resolve validation issues, then save one controlled batch." status={status} toolbar={toolbar} footer={footer}><Table aria-label="Editable line records" className="editable-grid-preview" size="small"><RecordTableHeader><TableRow><TableHeaderCell><Checkbox aria-label="Select all lines" checked={selectedIds.size > 0 && selectedIds.size === filtered.length} /></TableHeaderCell><TableHeaderCell>Line</TableHeaderCell><TableHeaderCell>Item code</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell><TableHeaderCell>Category</TableHeaderCell><TableHeaderCell>Quantity</TableHeaderCell><TableHeaderCell>Unit</TableHeaderCell><TableHeaderCell>Unit price</TableHeaderCell><TableHeaderCell>Line total</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell></TableRow></RecordTableHeader><TableBody>{filtered.map(line => {
    const editing = line.id === activeId;
    const value = editing ? draft : line;
    const invalid = Number(value.unitPrice) <= 0;
    const total = Number(value.quantity || 0) * Number(value.unitPrice || 0);
    const dirty = dirtyIds.has(line.id);
    return <TableRow data-editing={editing || undefined} key={line.id}>
      <TableCell><Checkbox aria-label={`Select line ${line.id}`} checked={selectedIds.has(line.id)} onChange={(_, data) => setSelectedIds(current => { const next = new Set(current); data.checked ? next.add(line.id) : next.delete(line.id); return next; })} /></TableCell>
      <TableCell data-dirty={dirty || undefined} aria-label={`Line ${line.id}${dirty ? ', modified' : ''}`}>{line.id}</TableCell>
      <TableCell>{line.code}</TableCell>
      <TableCell>{editing ? <Input aria-label={`Description for line ${line.id}`} size="small" value={value.description} onChange={(_, data) => updateDraft('description', data.value)} /> : line.description}</TableCell>
      <TableCell>{editing ? <Dropdown aria-label={`Category for line ${line.id}`} size="small" value={value.category} selectedOptions={[value.category]} onOptionSelect={(_, data) => updateDraft('category', data.optionValue ?? '')}><Option>Electrical</Option><Option>Mechanical</Option><Option>Unassigned</Option></Dropdown> : line.category}</TableCell>
      <TableCell>{editing ? <Input aria-label={`Quantity for line ${line.id}`} size="small" inputMode="decimal" value={value.quantity} onChange={(_, data) => updateDraft('quantity', data.value)} /> : line.quantity}</TableCell>
      <TableCell>{editing ? <Dropdown aria-label={`Unit for line ${line.id}`} size="small" value={value.unit} selectedOptions={[value.unit]} onOptionSelect={(_, data) => updateDraft('unit', data.optionValue ?? '')}><Option>ea</Option><Option>m</Option><Option>set</Option></Dropdown> : line.unit}</TableCell>
      <TableCell>{editing ? <Input aria-label={`Unit price for line ${line.id}`} aria-invalid={invalid} size="small" inputMode="decimal" value={value.unitPrice} onChange={(_, data) => updateDraft('unitPrice', data.value)} /> : Number(line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
      <TableCell>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
      <TableCell><Badge appearance="tint" color={invalid ? 'danger' : dirty ? 'warning' : 'success'}>{invalid ? 'Error' : dirty ? 'Modified' : 'Valid'}</Badge></TableCell>
      <TableCell className="nidec-ui-editable-grid__action-column">{editing ? <EditableGridRowActionGroup confirmIcon={<CheckmarkRegular />} confirmLabel={`Confirm edits for line ${line.id}`} cancelIcon={<DismissRegular />} cancelLabel={`Cancel edits for line ${line.id}`} onConfirm={confirmEdit} onCancel={cancelEdit} /> : <Tooltip content={`Edit line ${line.id}`} relationship="label"><TableActionIconButton aria-label={`Edit line ${line.id}`} icon={<EditRegular />} onClick={() => startEditing(line)} /></Tooltip>}</TableCell>
    </TableRow>;
  })}</TableBody></Table></EditableGrid></>;
}

const groupedCategories = ['Electrical', 'Mechanical', 'Unassigned'] as const;
type GroupedLine = EditableLine & { section: 'primary' | 'additional' };
const initialGroupedLines: GroupedLine[] = initialEditableLines.slice(0, 11).map((line, index) => ({
  ...line,
  section: index < 8 ? 'primary' : 'additional',
}));

function GroupedTableSamplePage() {
  const [staticExpanded, setStaticExpanded] = useState<Set<string>>(new Set([
    'primary', 'primary-Electrical', 'primary-Mechanical', 'additional',
  ]));
  const [expanded, setExpanded] = useState<Set<string>>(new Set([
    'primary', 'primary-Electrical', 'primary-Mechanical', 'additional', 'additional-Electrical',
  ]));
  const [lines, setLines] = useState(initialGroupedLines);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('006');
  const [draft, setDraft] = useState<GroupedLine>({ ...initialGroupedLines[5]! });
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set(['003', '006']));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const filtered = lines.filter(line => `${line.code} ${line.description} ${line.category}`.toLowerCase().includes(query.toLowerCase()));
  const sections = [
    { id: 'primary' as const, label: 'Primary collection' },
    { id: 'additional' as const, label: 'Additional collection' },
  ];
  const toggle = (id: string) => setExpanded(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleStatic = (id: string) => setStaticExpanded(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const isStaticExpanded = (id: string) => staticExpanded.has(id);
  const staticIconFor = (id: string) => isStaticExpanded(id) ? <ChevronDownRegular /> : <ChevronRightRegular />;
  const isExpanded = (id: string) => query.trim() !== '' || expanded.has(id);
  const iconFor = (id: string) => isExpanded(id) ? <ChevronDownRegular /> : <ChevronRightRegular />;
  const summaryFor = (groupLines: GroupedLine[]) => {
    const modified = groupLines.filter(line => dirtyIds.has(line.id)).length;
    const issues = groupLines.filter(line => Number((line.id === activeId ? draft : line).unitPrice) <= 0).length;
    const editing = groupLines.some(line => line.id === activeId) ? 1 : 0;
    return [modified && `${modified} modified`, issues && `${issues} issue`, editing && '1 editing'].filter(Boolean).join(' · ');
  };
  const startEditing = (line: GroupedLine) => { setActiveId(line.id); setDraft({ ...line }); };
  const updateDraft = (field: keyof EditableLine, value: string) => setDraft(current => ({ ...current, [field]: value }));
  const confirmEdit = () => {
    if (Number(draft.unitPrice) <= 0) return;
    setLines(current => current.map(line => line.id === draft.id ? draft : line));
    setDirtyIds(current => new Set(current).add(draft.id));
    setActiveId('');
  };
  const addLine = () => {
    const nextId = String(Math.max(...lines.map(line => Number(line.id))) + 1).padStart(3, '0');
    const line: GroupedLine = { id: nextId, code: `NEW-${nextId}`, description: 'New line', category: 'Unassigned', quantity: '1', unit: 'ea', unitPrice: '1.00', section: 'additional' };
    setLines(current => [...current, line]);
    setQuery('');
    setExpanded(current => new Set(current).add('additional').add('additional-Unassigned'));
    startEditing(line);
  };
  const toggleSelected = (id: string, checked: boolean) => setSelectedIds(current => {
    const next = new Set(current);
    checked ? next.add(id) : next.delete(id);
    return next;
  });
  const validationCount = lines.filter(line => Number((line.id === activeId ? draft : line).unitPrice) <= 0).length;

  const staticLines = initialGroupedLines.slice(0, 6);
  const staticTable = <div className="table-scroll"><Table aria-label="Grouped read-only records" className="grouped-table-preview" size="small"><RecordTableHeader><TableRow><TableHeaderCell>Line</TableHeaderCell><TableHeaderCell>Item code</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell><TableHeaderCell>Quantity</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell></TableRow></RecordTableHeader><TableBody>
    <GroupedTableSectionRow label="Primary collection" count={staticLines.length} columnSpan={5} level={0} expanded={isStaticExpanded('primary')} icon={staticIconFor('primary')} onToggle={() => toggleStatic('primary')} />
    {isStaticExpanded('primary') && groupedCategories.filter(category => category !== 'Unassigned').map(category => {
      const members = staticLines.filter(line => line.category === category);
      const id = `primary-${category}`;
      return <Fragment key={id}><GroupedTableSectionRow label={category} count={members.length} columnSpan={5} level={1} expanded={isStaticExpanded(id)} icon={staticIconFor(id)} onToggle={() => toggleStatic(id)} />{isStaticExpanded(id) && members.map(line => <TableRow key={line.id}><TableCell>{line.id}</TableCell><TableCell>{line.code}</TableCell><TableCell>{line.description}</TableCell><TableCell>{line.quantity} {line.unit}</TableCell><TableCell><Badge appearance="tint" color="success">Ready</Badge></TableCell></TableRow>)}</Fragment>;
    })}
    <GroupedTableSectionRow label="Additional collection" count={0} columnSpan={5} level={0} expanded={isStaticExpanded('additional')} icon={staticIconFor('additional')} onToggle={() => toggleStatic('additional')} />
    {isStaticExpanded('additional') && <TableRow><TableCell colSpan={5} className="grouped-table-preview__empty">No current lines</TableCell></TableRow>}
  </TableBody></Table></div>;

  const editableTable = <Table aria-label="Grouped editable lines" className="grouped-editable-grid-preview" size="small"><RecordTableHeader><TableRow><TableHeaderCell><Checkbox aria-label="Select all filtered lines, including collapsed groups" checked={filtered.length > 0 && filtered.every(line => selectedIds.has(line.id))} onChange={(_, data) => setSelectedIds(current => { const next = new Set(current); filtered.forEach(line => data.checked ? next.add(line.id) : next.delete(line.id)); return next; })} /></TableHeaderCell><TableHeaderCell>Line</TableHeaderCell><TableHeaderCell>Item code</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell><TableHeaderCell>Category</TableHeaderCell><TableHeaderCell>Quantity</TableHeaderCell><TableHeaderCell>Unit price</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell></TableRow></RecordTableHeader><TableBody>
    {sections.map(section => {
      const sectionLines = filtered.filter(line => line.section === section.id);
      return <Fragment key={section.id}><GroupedTableSectionRow label={section.label} count={sectionLines.length} columnSpan={9} level={0} expanded={isExpanded(section.id)} icon={iconFor(section.id)} onToggle={() => toggle(section.id)} summary={summaryFor(sectionLines)} />
        {isExpanded(section.id) && groupedCategories.map(category => {
          const members = sectionLines.filter(line => line.category === category);
          if (members.length === 0) return null;
          const groupId = `${section.id}-${category}`;
          return <Fragment key={groupId}><GroupedTableSectionRow label={category} count={members.length} columnSpan={9} level={1} expanded={isExpanded(groupId)} icon={iconFor(groupId)} onToggle={() => toggle(groupId)} summary={summaryFor(members)} />
            {isExpanded(groupId) && members.map(line => {
              const editing = line.id === activeId;
              const value = editing ? draft : line;
              const invalid = Number(value.unitPrice) <= 0;
              const dirty = dirtyIds.has(line.id);
              return <TableRow data-editing={editing || undefined} key={line.id}>
                <TableCell><Checkbox aria-label={`Select line ${line.id}`} checked={selectedIds.has(line.id)} onChange={(_, data) => toggleSelected(line.id, Boolean(data.checked))} /></TableCell>
                <TableCell data-dirty={dirty || undefined} aria-label={`Line ${line.id}${dirty ? ', modified' : ''}`}>{line.id}</TableCell>
                <TableCell>{line.code}</TableCell>
                <TableCell>{editing ? <Input aria-label={`Description for line ${line.id}`} size="small" value={value.description} onChange={(_, data) => updateDraft('description', data.value)} /> : line.description}</TableCell>
                <TableCell>{editing ? <Dropdown aria-label={`Category for line ${line.id}`} size="small" value={value.category} selectedOptions={[value.category]} onOptionSelect={(_, data) => updateDraft('category', data.optionValue ?? '')}><Option>Electrical</Option><Option>Mechanical</Option><Option>Unassigned</Option></Dropdown> : line.category}</TableCell>
                <TableCell>{editing ? <Input aria-label={`Quantity for line ${line.id}`} size="small" inputMode="decimal" value={value.quantity} onChange={(_, data) => updateDraft('quantity', data.value)} /> : `${line.quantity} ${line.unit}`}</TableCell>
                <TableCell>{editing ? <Input aria-label={`Unit price for line ${line.id}`} aria-invalid={invalid} size="small" inputMode="decimal" value={value.unitPrice} onChange={(_, data) => updateDraft('unitPrice', data.value)} /> : Number(line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                <TableCell><Badge appearance="tint" color={invalid ? 'danger' : dirty ? 'warning' : 'success'}>{invalid ? 'Error' : dirty ? 'Modified' : 'Valid'}</Badge></TableCell>
                <TableCell className="nidec-ui-editable-grid__action-column">{editing ? <EditableGridRowActionGroup confirmIcon={<CheckmarkRegular />} confirmLabel={`Confirm edits for line ${line.id}`} confirmDisabled={invalid} cancelIcon={<DismissRegular />} cancelLabel={`Cancel edits for line ${line.id}`} onConfirm={confirmEdit} onCancel={() => setActiveId('')} /> : <Tooltip content={`Edit line ${line.id}`} relationship="label"><TableActionIconButton aria-label={`Edit line ${line.id}`} icon={<EditRegular />} onClick={() => startEditing(line)} /></Tooltip>}</TableCell>
              </TableRow>;
            })}</Fragment>;
        })}
        {isExpanded(section.id) && sectionLines.length === 0 && <TableRow><TableCell colSpan={9} className="grouped-table-preview__empty">No current lines</TableCell></TableRow>}
      </Fragment>;
    })}
  </TableBody></Table>;

  const deleteSelected = () => {
    setLines(current => current.filter(line => !selectedIds.has(line.id)));
    setDirtyIds(current => new Set([...current].filter(id => !selectedIds.has(id))));
    if (selectedIds.has(activeId)) setActiveId('');
    setSelectedIds(new Set());
  };
  return <><TemplateContract purpose="Scan a hierarchical collection and edit many leaf records without losing group context." useWhen="Records are naturally grouped in a table and frequent changes need one batch save." task="Expand a group, select or edit a leaf line, then review unresolved changes across groups." entry="From a record or line workspace; returning preserves the collection context." owns="Group identity and membership, counts, validation, permissions, selection, persistence and conflict handling." avoid="Do not treat a group strip as a record, selection checkbox or editable line." /><PageHeader eyebrow="Page pattern / grouped table" title="Grouped table and grouped editing" description="The same disclosure rows organize a read-only table and an editable line grid. Only leaf rows can be selected or edited." /><WorkspaceSection title="Grouped Table" description="Expand and collapse collections within one table; counts remain visible when rows are hidden.">{staticTable}</WorkspaceSection><EditableGrid aria-label="Grouped line editor" title="Grouped Editable Grid" description="Group disclosure stays independent of selection and the active edit row." status={<div className="editable-grid-preview__status"><span>{dirtyIds.size} unsaved changes</span><span className={validationCount ? 'editable-grid-preview__issue' : undefined}>{validationCount} validation issue</span><Button appearance="primary" disabled={Boolean(activeId) || validationCount > 0 || dirtyIds.size === 0} onClick={() => setDirtyIds(new Set())}>Save changes</Button></div>} toolbar={<><SearchBox aria-label="Search grouped lines" placeholder="Search line code or description" value={query} onChange={(_, data) => setQuery(data.value)} /><Button icon={<AddRegular />} onClick={addLine}>Add line</Button><Button disabled={selectedIds.size === 0} icon={<DeleteRegular />} onClick={deleteSelected}>Delete selected</Button><span>{selectedIds.size} selected</span></>} footer={<><span>{filtered.length} matching lines</span><span>Collapsed groups retain selection, draft and validation state.</span></>}>{editableTable}</EditableGrid></>;
}

type SelectionItem = { id: string; name: string };
const selectionItems: SelectionItem[] = [{ id: 'P-1', name: 'Height' }, { id: 'P-2', name: 'Capacity' }, { id: 'P-3', name: 'Openings' }];
const selectionColumns = [createTableColumn<SelectionItem>({ columnId: 'parameter', renderHeaderCell: () => 'Parameter', renderCell: item => item.name })];

function MasterDataFormListPage() {
  const [items,setItems]=useState(selectionItems);
  const [selectedId,setSelectedId]=useState('P-1');
  const [draft,setDraft]=useState(selectionItems[0].name);
  const [pending,setPending]=useState<string|null>(null);
  const selected=items.find(item=>item.id===selectedId)!;
  const dirty=draft!==selected.name;
  const select=(id:string)=>{setSelectedId(id);setDraft(items.find(item=>item.id===id)!.name);};
  return <><PageHeader title="Definition maintenance" description="Select a row to load the same-page form; handle unsaved changes before switching." /><RecordManagementWorkspace aria-label="Definition management workspace" header={<WorkspaceSection title="Edit definition"><div className="form-grid"><Field label="Reference"><Input value={selectedId} readOnly /></Field><Field label="Name"><Input value={draft} onChange={(_,data)=>setDraft(data.value)} /></Field></div><div className="button-cluster"><Button appearance="primary" disabled={!dirty||!draft.trim()} onClick={()=>setItems(current=>current.map(item=>item.id===selectedId?{...item,name:draft}:item))}>Save local changes</Button><span role="status">{dirty?'Unsaved changes':'Saved in local demo state'}</span></div></WorkspaceSection>} primary={<WorkspaceSection title="Available definitions"><RecordSelectionRegion aria-label="Definition list" toolbar={<span>Select a record to edit</span>}><RecordSelectionDataGrid columns={selectionColumns} items={items} getRowId={item=>item.id} selectedItems={new Set([selectedId])} onSelectionChange={(_,data)=>{const id=String([...data.selectedItems][0]??selectedId);if(id===selectedId)return;if(dirty)setPending(id);else select(id);}} aria-label="Available definitions"><DataGridRow>{({renderHeaderCell})=><DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow><DataGridBody<SelectionItem>>{({rowId})=><RecordSelectionDataGridRow<SelectionItem> key={rowId} recordId={rowId}>{({renderCell})=><DataGridCell>{renderCell(items.find(item=>item.id===rowId)!)}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody></RecordSelectionDataGrid></RecordSelectionRegion></WorkspaceSection>} /><Dialog open={pending!==null} onOpenChange={(_,data)=>{if(!data.open)setPending(null);}}><DialogSurface><DialogBody><DialogTitle>Unsaved changes</DialogTitle><DialogContent>Discard the current changes and switch records?</DialogContent><DialogActions><Button onClick={()=>setPending(null)}>Keep editing</Button><Button onClick={()=>{if(pending)select(pending);setPending(null);}}>Discard and switch</Button></DialogActions></DialogBody></DialogSurface></Dialog></>;
}

function RecordWorkspacePage() {
  const [stageId, setStageId] = useState('parameters');
  const [tab, setTab] = useState<string | number>('details');
  const [mode, setMode] = useState<Record<string, string>>({ Height: 'reference', Capacity: 'manual', Openings: 'reference' });
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set(['P-1']));
  const stages = workspaceStages;
  return <><Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Example Alpha</BreadcrumbButton></BreadcrumbItem></Breadcrumb><RecordManagementWorkspace aria-label="Example record workspace" header={<PageHeader eyebrow="Record / REC-1042" title="Example Alpha" description="A composed workspace keeps record identity, sibling stages, form content and contextual facts in a stable hierarchy." actions={<><Button>Edit identity</Button><Button appearance="primary">Save changes</Button></>} />} contextRailLabel="Record context" contextRail={<div className="context-stack"><Card><CardHeader header={<strong>Readiness</strong>} description={<span>3 of 4 areas complete</span>} /><ProgressBar value={0.75} /></Card><Card><CardHeader header={<strong>Current owner</strong>} /><Persona name="Alex Chen" secondaryText="Engineering" /></Card><Card><CardHeader header={<strong>Evidence</strong>} /><CollectionList aria-label="Evidence summary" density="compact"><CollectionListItem primary="Definition" metadata="Ready" /><CollectionListItem primary="Parameters" metadata="Review" /><CollectionListItem primary="Rules" metadata="Ready" /></CollectionList></Card></div>} primary={<div className="workspace-stack"><StageNavigator aria-label="Record workspaces" stages={stages} selectedStageId={stageId} onStageSelect={(_, stage) => setStageId(stage.id)} /><TabList selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value))}><Tab value="details">Details</Tab><Tab value="parameters">Parameters</Tab><Tab value="evidence">Evidence</Tab></TabList><WorkspaceSection title="Definition" description="Business meaning remains with the adopting application."><div className="form-grid"><Field label="Name"><Input defaultValue="Example Alpha" /></Field><Field label="Category"><Dropdown defaultValue="Standard" defaultSelectedOptions={["standard"]}><Option value="standard">Standard</Option><Option value="special">Special</Option></Dropdown></Field><Field label="Reference code"><Input defaultValue="REC-1042" readOnly /></Field><Field label="Lifecycle"><Input defaultValue="In review" readOnly /></Field><Field className="form-grid__wide" label="Description"><Textarea rows={3} defaultValue="Synthetic record used to demonstrate a governed workspace." /></Field></div></WorkspaceSection><WorkspaceSection title="Parameter sources" description="Small local mode controls stay aligned independently of the active editor."><div className="parameter-list">{selectionItems.map(parameter => { const active = mode[parameter.name]; const base = `sample-${parameter.id.toLowerCase()}`; return <div className="parameter-row" key={parameter.id}><div><strong>{parameter.name}</strong><small>Governed input source</small></div><div className="parameter-editor"><InlineModeTabs aria-label={`${parameter.name} source`} options={[{ value: 'reference', label: 'Reference', tabId: `${base}-reference-tab`, panelId: `${base}-reference-panel` }, { value: 'manual', label: 'Manual', tabId: `${base}-manual-tab`, panelId: `${base}-manual-panel` }]} value={active} onValueChange={(_, value) => setMode(current => ({ ...current, [parameter.name]: value }))} /><div role="tabpanel" id={`${base}-${active}-panel`} aria-labelledby={`${base}-${active}-tab`}><Input aria-label={`${parameter.name} value`} value={active === 'reference' ? 'Shared field' : '42'} readOnly /></div></div></div>; })}</div></WorkspaceSection><WorkspaceSection title="Related definitions" description="Whole-row selection loads the same-surface editor; it does not navigate."><RecordSelectionRegion aria-label="Related definition directory" toolbar={<Toolbar aria-label="Definition tools"><ToolbarButton>Refresh</ToolbarButton></Toolbar>}><RecordSelectionDataGrid columns={selectionColumns} items={selectionItems} getRowId={item => item.id} selectedItems={selectedItems} onSelectionChange={(_, data) => setSelectedItems(new Set(data.selectedItems))} aria-label="Available definitions"><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow><DataGridBody<SelectionItem>>{({ item, rowId }) => <RecordSelectionDataGridRow<SelectionItem> key={rowId} recordId={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody></RecordSelectionDataGrid></RecordSelectionRegion></WorkspaceSection></div>} /></>;
}

function GovernanceSamplePage() {
  const [selectedVersion, setSelectedVersion] = useState('v3');
  const [viewedLifecycleStageId, setViewedLifecycleStageId] = useState('review');
  return <><TemplateContract purpose="Govern one stable object across explicit versions." useWhen="Identity remains stable while draft and released versions coexist." task="Inspect the active version, edit a draft and review evidence." entry="Object identity entry; version selection remains inside the workspace." owns="Version algorithm, lifecycle, permissions, publication and concurrency." avoid="Do not use as a generic record details page or clickable stage navigator." /><PageHeader eyebrow="Page template / versioned governance" title="Rule package governance" description="Stable identity, current-version authority, content and history remain visibly distinct." actions={<Button appearance="primary">New draft version</Button>} /><VersionedWorkspaceLayout aria-label="Versioned governance workspace" identity={<WorkspaceSection title="Example rule package" description="Stable object identity and application-owned authority." actions={<Button>Edit package</Button>}><div className="fact-row"><div><small>Status</small><Badge appearance="tint" color="warning">Draft</Badge></div><div><small>Editing version</small><strong>v3</strong></div><div><small>Effective window</small><strong>Open</strong></div><div><small>Base version</small><strong>v2</strong></div></div></WorkspaceSection>} governance={<WorkspaceSection title="Lifecycle" description="Reached stages can be viewed; lifecycle commands remain separate."><BusinessProcessFlow aria-label="Rule package lifecycle" stages={lifecycleStages} viewedStageId={viewedLifecycleStageId} onStageView={(_, stage) => setViewedLifecycleStageId(stage.id)} /><p className="muted">Viewing: {lifecycleStages.find(stage => stage.id === viewedLifecycleStageId)?.label} · Actual process: In review</p><div className="action-band"><div><strong>Next action</strong><p>Review evidence before requesting approval.</p></div><Button appearance="primary">Request review</Button></div></WorkspaceSection>} content={<div className="workspace-stack"><WorkspaceSection title="Rules" description={`Viewing ${selectedVersion} · definitions stay reusable and business-neutral`} actions={<Button appearance="primary">New rule</Button>}><RecordTable records={directoryRecords.slice(0, 3)} onOpen={() => undefined} /></WorkspaceSection><WorkspaceSection title="Diagnostics" description="Supporting evidence stays subordinate to the main task."><Accordion collapsible><AccordionItem value="coverage"><AccordionHeader>Coverage checks</AccordionHeader><AccordionPanel>All required synthetic parameters are covered.</AccordionPanel></AccordionItem></Accordion></WorkspaceSection></div>} history={<WorkspaceSection title="Versions" description="Choose one version to inspect."><CollectionList aria-label="Package versions" density="compact">{['v3', 'v2', 'v1'].map(version => <CollectionListItem key={version} primary={version} secondary={version === 'v3' ? 'Current draft' : 'Released snapshot'} metadata={version === selectedVersion ? 'Selected' : undefined} actions={<Button size="small" onClick={() => setSelectedVersion(version)}>View</Button>} />)}</CollectionList></WorkspaceSection>} /></>;
}


export function MaterialDemo({ title }: { title: string }) { return <SpecimenFilter.Provider value={title}><ElementsPage /></SpecimenFilter.Provider>; }
export { AuthenticationSamplePage, DirectorySamplePage, EditableGridSamplePage, GroupedTableSamplePage, MasterDataFormListPage, RecordWorkspacePage, GovernanceSamplePage };
