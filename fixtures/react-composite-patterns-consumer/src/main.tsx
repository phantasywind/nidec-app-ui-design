import { Fragment, useEffect, useMemo, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
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
  RecordSelectionRegion, RecordTableHeader, SearchBox, SegmentedControl, Select, Skeleton,
  SkeletonItem, Slider, SpinButton, Spinner, SplitButton, StageNavigator, Switch, Tab, Table,
  TableActionIconButton, TableBody, TableCell, TableCellActions, TableHeaderCell, TableRow, TabList,
   Tag, Textarea, ToggleButton, Toolbar, ToolbarButton as SharedToolbarButton, Tooltip, ViewModeToggle, WorkspaceSection,
  DataGridBody, DataGridCell, DataGridHeaderCell, DataGridRow, nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import {
  ApplicationFrame, ApplicationNavigation, ApplicationNavigationGroup, ApplicationNavigationItem,
  ApplicationTopBar, AuthenticationLayout, DirectoryWorkspace, VersionedWorkspaceLayout,
} from '@phantasywind/nidec-app-ui-design/layouts';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './region.css';

type ShowcaseView = 'elements' | 'authentication' | 'directory' | 'editable-grid' | 'grouped-table' | 'record' | 'master-data' | 'governance';

const views: ReadonlyArray<{ value: ShowcaseView; label: string; description: string }> = [
  { value: 'elements', label: 'UI materials', description: 'Shared elements and patterns' },
  { value: 'authentication', label: 'Authentication sample', description: 'Brand, credentials and primary entry' },
  { value: 'directory', label: 'Directory sample', description: 'Search, table, cards and Sheet' },
  { value: 'editable-grid', label: 'Editable grid', description: 'High-volume batch line editing' },
  { value: 'grouped-table', label: 'Grouped table', description: 'Collapsible sections and grouped editing' },
  { value: 'record', label: 'Record workspace', description: 'Stages, tabs and governed form' },
  { value: 'master-data', label: 'Master data / Form + List', description: 'Same-surface editing and row selection' },
  { value: 'governance', label: 'Governance sample', description: 'Versions, process and rules' },
];

function Button(props: ComponentProps<typeof SharedButton>): ReactElement {
  if (props.children === 'Previous') {
    return <Tooltip content="Previous page" relationship="label"><SharedButton {...props} aria-label="Previous page" icon={<ChevronLeftRegular />} children="" /></Tooltip>;
  }
  if (props.children === 'Next') {
    return <><label className="pagination-sample__size">Rows per page<Select aria-label="Rows per page" defaultValue="25"><option value="10">10</option><option value="25">25</option><option value="50">50</option></Select></label><Tooltip content="Next page" relationship="label"><SharedButton {...props} aria-label="Next page" icon={<ChevronRightRegular />} children="" /></Tooltip></>;
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
  { id: 'definition', label: 'Definition', description: 'Identity and scope', status: 'completed' as const, statusLabel: 'Available workspace' },
  { id: 'parameters', label: 'Parameters', description: 'Governed values', status: 'current' as const, statusLabel: 'Current workspace' },
  { id: 'rules', label: 'Rules', description: 'Reusable logic', status: 'upcoming' as const, statusLabel: 'Available workspace' },
  { id: 'review', label: 'Review', description: 'Readiness evidence', status: 'upcoming' as const, statusLabel: 'Available workspace' },
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

function useShowcaseView(): [ShowcaseView, (next: ShowcaseView) => void] {
  const readView = (): ShowcaseView => {
    const candidate = new URLSearchParams(location.search).get('view');
    return views.some(view => view.value === candidate) ? candidate as ShowcaseView : 'elements';
  };
  const [view, setView] = useState<ShowcaseView>(readView);
  useEffect(() => {
    const onPopState = () => setView(readView());
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);
  const navigate = (next: ShowcaseView) => {
    const url = new URL(location.href);
    url.searchParams.set('view', next);
    url.hash = '';
    history.pushState({}, '', url);
    setView(next);
    scrollTo({ top: 0, behavior: 'smooth' });
  };
  return [view, navigate];
}

function Specimen({ title, description, children, wide = false }: { title: string; description: string; children: ReactNode; wide?: boolean }) {
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
  const navigatorStages = workspaceStages.map(stage => ({
    ...stage,
    status: stage.id === stageId ? 'current' as const : stage.status === 'current' ? 'completed' as const : stage.status,
    statusLabel: stage.id === stageId ? 'Current workspace' : 'Available workspace',
  }));

  return <>
    <PageHeader eyebrow="Shared UI / governed inventory" title="UI materials" description="One inspectable page for the reusable controls and compositions available to Nidec applications." actions={<Button appearance="primary">Primary action</Button>} />
    <div className="foundation-strip" aria-label="Foundation roles" role="group">
      <div><span className="swatch swatch--brand" /><strong>Brand</strong><small>Actions and identity</small></div>
      <div><span className="swatch swatch--neutral" /><strong>Neutral</strong><small>Surfaces and hierarchy</small></div>
      <div><span className="swatch swatch--success" /><strong>Success</strong><small>Confirmed status</small></div>
      <div><span className="swatch swatch--warning" /><strong>Warning</strong><small>Needs attention</small></div>
    </div>
    <div className="specimen-grid">
      <Specimen title="Text input" description="Labels, hints, validation and read-only state.">
        <div className="form-stack"><Field label="Record name" hint="Concise supporting guidance"><Input defaultValue="Example Alpha" /></Field><Field label="Description"><Textarea rows={3} defaultValue="Business-neutral multiline content." /></Field><Field label="Reference" validationState="error" validationMessage="Example validation message"><Input defaultValue="Needs review" /></Field></div>
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
        <div className="form-stack"><Field label="Display density"><Select value={density} onChange={(_, data) => setDensity(data.value)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></Select></Field><Checkbox label="Show supporting details" defaultChecked /><Switch label="Enable governed option" checked={enabled} onChange={(_, data) => setEnabled(data.checked)} /><RadioGroup value={choice} onChange={(_, data) => setChoice(data.value)} layout="horizontal"><Radio value="standard" label="Standard" /><Radio value="extended" label="Extended" /></RadioGroup></div>
      </Specimen>
      <Specimen title="Compact selection" description="Page mode and local editor mode remain distinct.">
         <div className="form-stack"><SegmentedControl aria-label="Workspace mode" options={[{ value: 'standard', label: 'Standard' }, { value: 'extended', label: 'Extended' }]} value={choice} onValueChange={(_, value) => setChoice(value)} /><ViewModeToggle aria-label="Content view" value="list" onValueChange={() => undefined} listIcon={<ListRegular />} cardIcon={<GridRegular />} /><InlineModeTabs aria-label="Value source" options={[{ value: 'reference', label: 'Reference', tabId: 'material-reference-tab', panelId: 'material-reference-panel' }, { value: 'manual', label: 'Manual', tabId: 'material-manual-tab', panelId: 'material-manual-panel' }]} value={mode} onValueChange={(_, value) => setMode(value)} /><div role="tabpanel" id={`material-${mode}-panel`} aria-labelledby={`material-${mode}-tab`}><Input aria-label="Example mode value" value={mode === 'reference' ? 'Shared parameter' : '42'} readOnly /></div></div>
      </Specimen>
      <Specimen title="Discovery and values" description="Search, editable selection and numeric values.">
        <div className="form-stack"><SearchBox placeholder="Search records" /><Field label="Category"><Combobox placeholder="Choose category"><Option>Standard</Option><Option>Configured</Option></Combobox></Field><div className="field-pair"><div><InfoLabel info="Consumer owns units and validation.">Quantity</InfoLabel><SpinButton aria-label="Quantity" defaultValue={4} min={0} /></div><div><Label htmlFor="completion-slider">Completion</Label><Slider id="completion-slider" defaultValue={65} /></div></div></div>
      </Specimen>
      <Specimen title="Actions and disclosure" description="Primary, secondary, icon and overflow actions.">
        <div className="button-cluster"><Button appearance="primary">Save changes</Button><Button>Cancel</Button><ToggleButton>Pin</ToggleButton><SplitButton menuButton={{ 'aria-label': 'More save actions' }}>Save</SplitButton><Menu><MenuTrigger disableButtonEnhancement><Button>More actions</Button></MenuTrigger><MenuPopover><MenuList><MenuItem>Edit</MenuItem><MenuItem>Archive</MenuItem></MenuList></MenuPopover></Menu></div><div className="link-row"><Link href="#example">Record identity link</Link><Popover><PopoverTrigger><Button>Show details</Button></PopoverTrigger><PopoverSurface>Contextual information remains consumer-owned.</PopoverSurface></Popover></div>
      </Specimen>
      <Specimen title="Feedback and status" description="Use restrained semantic feedback close to its cause.">
        <div className="status-row"><Badge appearance="tint" color="success">Ready</Badge><Badge appearance="tint" color="warning">Review</Badge><Badge appearance="tint" color="danger">Blocked</Badge><Tag appearance="outline">Metadata</Tag></div><MessageBar intent="info"><MessageBarBody><MessageBarTitle>Information</MessageBarTitle>This example does not introduce a business rule.</MessageBarBody></MessageBar><ProgressBar value={0.65} aria-label="Example progress" /><div className="loading-row"><Spinner size="tiny" label="Loading" /><Skeleton aria-label="Loading placeholder"><SkeletonItem /></Skeleton></div>
      </Specimen>
      <Specimen title="Tabs and overlays" description="Navigation and temporary surfaces retain focus behavior.">
        <TabList selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value))}><Tab value="overview">Overview</Tab><Tab value="evidence">Evidence</Tab><Tab value="history">History</Tab></TabList><p className="muted">Selected tab: {String(tab)}</p><Dialog open={dialogOpen} onOpenChange={(_, data) => setDialogOpen(data.open)}><DialogTrigger disableButtonEnhancement><Button>Open dialog</Button></DialogTrigger><DialogSurface><DialogBody><DialogTitle>Review local values</DialogTitle><DialogContent>No API call or business action will run.</DialogContent><DialogActions><DialogTrigger disableButtonEnhancement><Button>Close</Button></DialogTrigger></DialogActions></DialogBody></DialogSurface></Dialog>
      </Specimen>
      <Specimen title="Collection list" description="Compact content hierarchy with isolated selection and actions.">
        <CollectionList aria-label="Example collection" density="compact">{directoryRecords.slice(0, 3).map(record => <CollectionListItem key={record.id} selection={<Checkbox aria-label={`Select ${record.name}`} checked={selected.includes(record.id)} onChange={(_, data) => setSelected(data.checked ? [record.id] : [])} />} primary={record.name} secondary={record.category} metadata={record.updated} actions={<Button size="small">Open</Button>} />)}</CollectionList>
      </Specimen>
      <Specimen title="Data table" description="One linked record identity, distinct fields and compact row actions." wide><RecordTable records={directoryRecords.slice(0, 3)} onOpen={() => undefined} /></Specimen>
      <Specimen title="Stage Navigator" description="Clickable sibling workspaces; green structural lines do not imply progress." wide><StageNavigator aria-label="Example workspace navigation" stages={navigatorStages} onStageSelect={(_, stage) => setStageId(stage.id)} /></Specimen>
      <Specimen title="Business Process Flow" description="Read-only lifecycle driven by application-authoritative state." wide><BusinessProcessFlow aria-label="Example lifecycle" stages={lifecycleStages} /></Specimen>
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
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [selectedRecord, setSelectedRecord] = useState<typeof directoryRecords[number] | null>(null);
  const filtered = useMemo(() => directoryRecords.filter(record => record.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const header = <PageHeader eyebrow="Page template / directory" title="Records" description="Find, compare and enter one record without mixing identity links and row commands." actions={<Button appearance="primary" onClick={() => setSelectedRecord(directoryRecords[0])}>New record</Button>} />;
  const toolbar = <Toolbar aria-label="Directory tools"><SearchBox value={query} onChange={(_, data) => setQuery(data.value)} placeholder="Search records" /><Select aria-label="Status"><option>All statuses</option><option>Ready</option><option>Review</option></Select><ToolbarButton>Refresh</ToolbarButton><ViewModeToggle aria-label="Directory view" value={viewMode} onValueChange={(_, value) => setViewMode(value)} listIcon={<ListRegular />} cardIcon={<GridRegular />} /></Toolbar>;
  const results = viewMode === 'list'
    ? <RecordTable records={filtered} onOpen={setSelectedRecord} />
    : <CardGallery aria-label="Record cards" minimumItemWidth="small">{filtered.map(record => <ActionableCardGalleryItem aria-label={`Open ${record.name}`} key={record.id} onActivate={() => setSelectedRecord(record)}><CardHeader header={<strong>{record.name}</strong>} description={<span>{record.id}</span>} /><div className="card-facts"><span>{record.category}</span><Badge appearance="tint" color={record.tone}>{record.status}</Badge></div><CardFooter><Caption1>Updated {record.updated.toLowerCase()}</Caption1></CardFooter></ActionableCardGalleryItem>)}</CardGallery>;
  return <><TemplateContract purpose="Find and enter records or work items." useWhen="A peer collection is the primary page subject." task="Search, compare, filter and open one item." entry="Table identity link or whole-card entry; return preserves directory state." owns="Query, filter, sort, paging, selection, data and commands." avoid="Do not use for simultaneous same-page form editing." /><Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Home</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Records</BreadcrumbButton></BreadcrumbItem></Breadcrumb><DirectoryWorkspace aria-label="Record directory" header={header} toolbar={toolbar} results={results} resultsLabel="Directory results" pagination={<div className="pagination-sample"><span>{filtered.length} results</span><Button disabled>Previous</Button><Button>Next</Button></div>} /><OverlayDrawer open={selectedRecord !== null} onOpenChange={(_, data) => { if (!data.open) setSelectedRecord(null); }} position="end" size="medium" modalType="modal" aria-label="Record details"><DrawerHeader><DrawerHeaderTitle action={<Button appearance="subtle" onClick={() => setSelectedRecord(null)}>Close</Button>}>{selectedRecord?.name ?? 'New record'}</DrawerHeaderTitle></DrawerHeader><DrawerBody><div className="form-stack"><MessageBar intent="info"><MessageBarBody><MessageBarTitle>Local preview</MessageBarTitle>Values are not saved.</MessageBarBody></MessageBar><Field label="Record name"><Input value={selectedRecord?.name ?? ''} /></Field><Field label="Category"><Select value={selectedRecord?.category ?? 'Standard'}><option>Standard</option><option>Configured</option><option>Special</option></Select></Field><Field label="Owner"><Input value={selectedRecord?.owner ?? ''} /></Field><Field label="Notes"><Textarea rows={4} /></Field><Switch label="Active" defaultChecked /></div></DrawerBody><DrawerFooter><Button appearance="primary">Save locally</Button><Button onClick={() => setSelectedRecord(null)}>Cancel</Button></DrawerFooter></OverlayDrawer></>;
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
  const toolbar = <><SearchBox aria-label="Search lines" placeholder="Search by code, description or category" value={query} onChange={(_, data) => setQuery(data.value)} /><Select aria-label="Category filter" defaultValue="all"><option value="all">All categories</option><option>Electrical</option><option>Mechanical</option></Select><Button icon={<AddRegular />} onClick={addLine}>Add line</Button><Button disabled={selectedIds.size === 0} icon={<DeleteRegular />} onClick={deleteSelected}>Delete selected</Button><Tooltip content="Undo" relationship="label"><TableActionIconButton aria-label="Undo" disabled icon={<ArrowUndoRegular />} /></Tooltip><Tooltip content="Redo" relationship="label"><TableActionIconButton aria-label="Redo" disabled icon={<ArrowRedoRegular />} /></Tooltip></>;
  const footer = <><span>{filtered.length} lines</span><label className="editable-grid-preview__page-size">Rows per page<Select aria-label="Rows per page" defaultValue="25"><option>25</option><option>50</option><option>100</option></Select></label><div className="editable-grid-preview__paging"><Tooltip content="Previous page" relationship="label"><TableActionIconButton aria-label="Previous page" disabled icon={<ChevronLeftRegular />} /></Tooltip><strong>1</strong><Tooltip content="Next page" relationship="label"><TableActionIconButton aria-label="Next page" icon={<ChevronRightRegular />} /></Tooltip></div></>;

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
      <TableCell>{editing ? <Select aria-label={`Category for line ${line.id}`} size="small" value={value.category} onChange={event => updateDraft('category', event.target.value)}><option>Electrical</option><option>Mechanical</option><option>Unassigned</option></Select> : line.category}</TableCell>
      <TableCell>{editing ? <Input aria-label={`Quantity for line ${line.id}`} size="small" inputMode="decimal" value={value.quantity} onChange={(_, data) => updateDraft('quantity', data.value)} /> : line.quantity}</TableCell>
      <TableCell>{editing ? <Select aria-label={`Unit for line ${line.id}`} size="small" value={value.unit} onChange={event => updateDraft('unit', event.target.value)}><option>ea</option><option>m</option><option>set</option></Select> : line.unit}</TableCell>
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
                <TableCell>{editing ? <Select aria-label={`Category for line ${line.id}`} size="small" value={value.category} onChange={event => updateDraft('category', event.target.value)}><option>Electrical</option><option>Mechanical</option><option>Unassigned</option></Select> : line.category}</TableCell>
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
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set(['P-1']));
  const selectedId = String([...selectedItems][0] ?? 'P-1');
  const selected = selectionItems.find(item => item.id === selectedId) ?? selectionItems[0];
  return <><TemplateContract purpose="Maintain a small governed definition set in context." useWhen="Selection and editing must remain visible together." task="Select one row, inspect or edit it, then save locally." entry="Page entry; row selection replaces the same-surface editor." owns="Validation, persistence, dirty state, permissions and concurrency." avoid="Do not use row selection as hidden navigation to another page." /><PageHeader eyebrow="Page template / master data" title="Definition management" description="The editor and compact selectable list remain on one white workspace surface." actions={<Button appearance="primary">New definition</Button>} /><RecordManagementWorkspace aria-label="Definition management workspace" header={<WorkspaceSection title="Selected definition" description="Selection changes the same-surface editor; it does not navigate."><div className="form-grid"><Field label="Reference"><Input value={selected.id} readOnly /></Field><Field label="Name"><Input value={selected.name} readOnly /></Field><Field className="form-grid__wide" label="Description"><Textarea rows={3} defaultValue="Synthetic business-neutral definition." /></Field></div></WorkspaceSection>} primary={<WorkspaceSection title="Available definitions" description="Rows are the selection target; the primary field is not a link."><RecordSelectionRegion aria-label="Definition list" toolbar={<Toolbar aria-label="Definition tools"><SearchBox placeholder="Search definitions" /><ToolbarButton>Refresh</ToolbarButton></Toolbar>}><RecordSelectionDataGrid columns={selectionColumns} items={selectionItems} getRowId={item => item.id} selectedItems={selectedItems} onSelectionChange={(_, data) => setSelectedItems(new Set(data.selectedItems))} aria-label="Available definitions"><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow><DataGridBody<SelectionItem>>{({ item, rowId }) => <RecordSelectionDataGridRow<SelectionItem> key={rowId} recordId={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody></RecordSelectionDataGrid></RecordSelectionRegion></WorkspaceSection>} /></>;
}

function RecordWorkspacePage() {
  const [stageId, setStageId] = useState('parameters');
  const [tab, setTab] = useState<string | number>('details');
  const [mode, setMode] = useState<Record<string, string>>({ Height: 'reference', Capacity: 'manual', Openings: 'reference' });
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set(['P-1']));
  const stages = workspaceStages.map(stage => ({ ...stage, status: stage.id === stageId ? 'current' as const : 'completed' as const, statusLabel: stage.id === stageId ? 'Current workspace' : 'Available workspace' }));
  return <><Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Example Alpha</BreadcrumbButton></BreadcrumbItem></Breadcrumb><RecordManagementWorkspace aria-label="Example record workspace" header={<PageHeader eyebrow="Record / REC-1042" title="Example Alpha" description="A composed workspace keeps record identity, sibling stages, form content and contextual facts in a stable hierarchy." actions={<><Button>Edit identity</Button><Button appearance="primary">Save changes</Button></>} />} contextRailLabel="Record context" contextRail={<div className="context-stack"><Card><CardHeader header={<strong>Readiness</strong>} description={<span>3 of 4 areas complete</span>} /><ProgressBar value={0.75} /></Card><Card><CardHeader header={<strong>Current owner</strong>} /><Persona name="Alex Chen" secondaryText="Engineering" /></Card><Card><CardHeader header={<strong>Evidence</strong>} /><CollectionList aria-label="Evidence summary" density="compact"><CollectionListItem primary="Definition" metadata="Ready" /><CollectionListItem primary="Parameters" metadata="Review" /><CollectionListItem primary="Rules" metadata="Ready" /></CollectionList></Card></div>} primary={<div className="workspace-stack"><StageNavigator aria-label="Record workspaces" stages={stages} onStageSelect={(_, stage) => setStageId(stage.id)} /><TabList selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value))}><Tab value="details">Details</Tab><Tab value="parameters">Parameters</Tab><Tab value="evidence">Evidence</Tab></TabList><WorkspaceSection title="Definition" description="Business meaning remains with the adopting application."><div className="form-grid"><Field label="Name"><Input defaultValue="Example Alpha" /></Field><Field label="Category"><Select defaultValue="standard"><option value="standard">Standard</option><option value="special">Special</option></Select></Field><Field label="Reference code"><Input defaultValue="REC-1042" readOnly /></Field><Field label="Lifecycle"><Input defaultValue="In review" readOnly /></Field><Field className="form-grid__wide" label="Description"><Textarea rows={3} defaultValue="Synthetic record used to demonstrate a governed workspace." /></Field></div></WorkspaceSection><WorkspaceSection title="Parameter sources" description="Small local mode controls stay aligned independently of the active editor."><div className="parameter-list">{selectionItems.map(parameter => { const active = mode[parameter.name]; const base = `sample-${parameter.id.toLowerCase()}`; return <div className="parameter-row" key={parameter.id}><div><strong>{parameter.name}</strong><small>Governed input source</small></div><div className="parameter-editor"><InlineModeTabs aria-label={`${parameter.name} source`} options={[{ value: 'reference', label: 'Reference', tabId: `${base}-reference-tab`, panelId: `${base}-reference-panel` }, { value: 'manual', label: 'Manual', tabId: `${base}-manual-tab`, panelId: `${base}-manual-panel` }]} value={active} onValueChange={(_, value) => setMode(current => ({ ...current, [parameter.name]: value }))} /><div role="tabpanel" id={`${base}-${active}-panel`} aria-labelledby={`${base}-${active}-tab`}><Input aria-label={`${parameter.name} value`} value={active === 'reference' ? 'Shared field' : '42'} readOnly /></div></div></div>; })}</div></WorkspaceSection><WorkspaceSection title="Related definitions" description="Whole-row selection loads the same-surface editor; it does not navigate."><RecordSelectionRegion aria-label="Related definition directory" toolbar={<Toolbar aria-label="Definition tools"><ToolbarButton>Refresh</ToolbarButton></Toolbar>}><RecordSelectionDataGrid columns={selectionColumns} items={selectionItems} getRowId={item => item.id} selectedItems={selectedItems} onSelectionChange={(_, data) => setSelectedItems(new Set(data.selectedItems))} aria-label="Available definitions"><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow><DataGridBody<SelectionItem>>{({ item, rowId }) => <RecordSelectionDataGridRow<SelectionItem> key={rowId} recordId={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody></RecordSelectionDataGrid></RecordSelectionRegion></WorkspaceSection></div>} /></>;
}

function GovernanceSamplePage() {
  const [selectedVersion, setSelectedVersion] = useState('v3');
  return <><TemplateContract purpose="Govern one stable object across explicit versions." useWhen="Identity remains stable while draft and released versions coexist." task="Inspect the active version, edit a draft and review evidence." entry="Object identity entry; version selection remains inside the workspace." owns="Version algorithm, lifecycle, permissions, publication and concurrency." avoid="Do not use as a generic record details page or clickable stage navigator." /><PageHeader eyebrow="Page template / versioned governance" title="Rule package governance" description="Stable identity, current-version authority, content and history remain visibly distinct." actions={<Button appearance="primary">New draft version</Button>} /><VersionedWorkspaceLayout aria-label="Versioned governance workspace" identity={<WorkspaceSection title="Example rule package" description="Stable object identity and application-owned authority." actions={<Button>Edit package</Button>}><div className="fact-row"><div><small>Status</small><Badge appearance="tint" color="warning">Draft</Badge></div><div><small>Editing version</small><strong>v3</strong></div><div><small>Effective window</small><strong>Open</strong></div><div><small>Base version</small><strong>v2</strong></div></div></WorkspaceSection>} governance={<WorkspaceSection title="Lifecycle" description="The process is read only; commands remain separate."><BusinessProcessFlow aria-label="Rule package lifecycle" stages={lifecycleStages} /><div className="action-band"><div><strong>Next action</strong><p>Review evidence before requesting approval.</p></div><Button appearance="primary">Request review</Button></div></WorkspaceSection>} content={<div className="workspace-stack"><WorkspaceSection title="Rules" description={`Viewing ${selectedVersion} · definitions stay reusable and business-neutral`} actions={<Button appearance="primary">New rule</Button>}><RecordTable records={directoryRecords.slice(0, 3)} onOpen={() => undefined} /></WorkspaceSection><WorkspaceSection title="Diagnostics" description="Supporting evidence stays subordinate to the main task."><Accordion collapsible><AccordionItem value="coverage"><AccordionHeader>Coverage checks</AccordionHeader><AccordionPanel>All required synthetic parameters are covered.</AccordionPanel></AccordionItem></Accordion></WorkspaceSection></div>} history={<WorkspaceSection title="Versions" description="Choose one version to inspect."><CollectionList aria-label="Package versions" density="compact">{['v3', 'v2', 'v1'].map(version => <CollectionListItem key={version} primary={version} secondary={version === 'v3' ? 'Current draft' : 'Released snapshot'} metadata={version === selectedVersion ? 'Selected' : undefined} actions={<Button size="small" onClick={() => setSelectedVersion(version)}>View</Button>} />)}</CollectionList></WorkspaceSection>} /></>;
}

function ShowcaseApp() {
  const [view, navigate] = useShowcaseView();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const active = views.find(item => item.value === view)!;
  const page = view === 'elements' ? <ElementsPage /> : view === 'authentication' ? <AuthenticationSamplePage /> : view === 'directory' ? <DirectorySamplePage /> : view === 'editable-grid' ? <EditableGridSamplePage /> : view === 'grouped-table' ? <GroupedTableSamplePage /> : view === 'record' ? <><TemplateContract purpose="Work deeply on one identified record." useWhen="One record has multiple governed sections and supporting context." task="Review identity, move between sibling work areas and edit details." entry="From a directory identity link; breadcrumb or back returns to the directory." owns="Record data, save semantics, stages, permissions and commands." avoid="Do not use for collection-first work queues or strict lifecycle progress." /><RecordWorkspacePage /></> : view === 'master-data' ? <MasterDataFormListPage /> : <GovernanceSamplePage />;
  const navigation = <ApplicationNavigation aria-label="Showcase pages"><ApplicationNavigationGroup label="UI Materials"><ApplicationNavigationItem current={view === 'elements'} href="?view=elements" icon={<GridRegular />} label="All components" onClick={event => { event.preventDefault(); navigate('elements'); setNavigationOpen(false); }} /></ApplicationNavigationGroup><ApplicationNavigationGroup label="Page Templates">{views.filter(item => item.value !== 'elements').map(item => <ApplicationNavigationItem current={view === item.value} href={`?view=${item.value}`} icon={<GridRegular />} key={item.value} label={item.label} onClick={event => { event.preventDefault(); navigate(item.value); setNavigationOpen(false); }} />)}</ApplicationNavigationGroup></ApplicationNavigation>;
  return <NidecProvider theme={nidecLightTheme}><ApplicationFrame aria-label="Nidec Design System preview" brand={<div className="showcase-brand"><span aria-hidden="true">N</span><div><strong>Nidec UI</strong><small>Design System preview</small></div></div>} compactBrand={<div className="showcase-brand"><span aria-hidden="true">N</span></div>} topBar={<ApplicationTopBar location={<strong>{active.label}</strong>} utilities={<span>Local governed preview</span>} />} navigation={navigation} navigationOpen={navigationOpen} navigationToggleIcon={<ListRegular />} navigationToggleLabel="Open navigation" navigationCloseLabel="Close navigation" onNavigationOpenChange={setNavigationOpen}><div className="showcase-content">{page}</div></ApplicationFrame></NidecProvider>;
}

const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? { styleElementAttributes: { nonce } } : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><ShowcaseApp /></RendererProvider>);
