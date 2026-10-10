import { useState } from 'react';
import { createTableColumn } from '@fluentui/react-components';
import { DataGridBody, DataGridCell, DataGridHeaderCell, DataGridRow, RecordSelectionDataGrid, RecordSelectionDataGridRow, ViewModeToggle, CardGallery, ActionableCardGalleryItem } from '@phantasywind/nidec-app-ui-design';
import { GridRegular, ListRegular, SearchRegular } from '@fluentui/react-icons';
import { MaterialDemo } from './demos';
import { DatePicker } from '@phantasywind/nidec-app-ui-design/date-picker';
import { Button, Field, Input, Textarea, Dropdown, MultiSelectDropdown, Combobox, Option, SpinButton, Slider, Checkbox, RadioGroup, Radio, Switch, InfoLabel, Tooltip, Popover, PopoverTrigger, PopoverSurface, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, OverlayDrawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, DrawerFooter, Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, PageHeader, WorkspaceSection, TabList, Tab, MessageBar, MessageBarBody, Spinner, Link } from '@phantasywind/nidec-app-ui-design';
import { AuthenticationLayout } from '@phantasywind/nidec-app-ui-design/layouts';

export function SelectionDemo() {
  const [query,setQuery] = useState('');
  const [open,setOpen] = useState(false);
  const [selected,setSelected] = useState<string[]>([]);
  const options = ['Standard option','Extended option'];
  const matches = options.filter(option=>option.toLowerCase().includes(query.toLowerCase()));
  return <div className="form-grid"><Field label="Fixed options"><Dropdown defaultSelectedOptions={['Standard']} defaultValue="Standard"><Option>Standard</Option><Option>Extended</Option></Dropdown></Field><Field label="Search options"><div className="searchable-choice"><SearchRegular aria-hidden="true" className="searchable-choice__icon" /><Combobox placeholder="Select or search" open={open} onOpenChange={(_,data)=>setOpen(data.open)} value={query} selectedOptions={selected} onChange={event=>{setQuery(event.target.value);setSelected([]);setOpen(true);}} onOptionSelect={(_,data)=>{if(data.optionValue===undefined)return;setQuery(data.optionText??'');setSelected(data.selectedOptions);setOpen(false);}}>{matches.map(option=><Option key={option}>{option}</Option>)}{matches.length===0&&<Option disabled>No matching options</Option>}</Combobox></div></Field><Field label="Several options"><MultiSelectDropdown placeholder="Select options" defaultSelectedOptions={['standard','extended']} options={[{value:'standard',text:'Standard'},{value:'extended',text:'Extended'},{value:'special',text:'Special'}]} /></Field><Field label="Unavailable"><Dropdown disabled defaultSelectedOptions={['Disabled example']} defaultValue="Disabled example"><Option>Disabled example</Option></Dropdown></Field></div>;
}
type GridRecord = { id: string; name: string };
const gridRecords: GridRecord[] = [{id:'1',name:'Standard definition'},{id:'2',name:'Extended definition'}];
const gridColumns = [createTableColumn<GridRecord>({columnId:'name',renderHeaderCell:()=> 'Definition name',renderCell:item=>item.name})];
export function TableAndGridDemo() {
  const [selected,setSelected]=useState(new Set<string|number>(['1']));
  return <><MaterialDemo title="Data table" /><WorkspaceSection title="DataGrid: same-page record selection" description="The list and details share one surface, so rows select rather than navigate."><p role="status">Current details: {gridRecords.find(item=>selected.has(item.id))?.name}</p><RecordSelectionDataGrid aria-label="Select a definition" columns={gridColumns} items={gridRecords} getRowId={item=>item.id} selectedItems={selected} onSelectionChange={(_,data)=>setSelected(new Set(data.selectedItems))}><DataGridRow>{({renderHeaderCell})=><DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow><DataGridBody<GridRecord>>{({item,rowId})=><RecordSelectionDataGridRow<GridRecord> key={rowId} recordId={rowId}>{({renderCell})=><DataGridCell>{renderCell(item)}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody></RecordSelectionDataGrid></WorkspaceSection></>;
}
export function CardsDemo() {
  const [mode,setMode]=useState<'list'|'card'>('card');
  return <><ViewModeToggle aria-label="Collection view" value={mode} onValueChange={(_,value)=>setMode(value)} listIcon={<ListRegular />} cardIcon={<GridRegular />} />{mode==='card'?<CardGallery aria-label="Record cards">{gridRecords.map(item=><ActionableCardGalleryItem key={item.id} aria-label={`Open ${item.name}`} href="?view=record"><span>{item.name}</span><p>The whole card is the single primary entry.</p></ActionableCardGalleryItem>)}</CardGallery>:<ul>{gridRecords.map(item=><li key={item.id}><Link href="?view=record">{item.name}</Link></li>)}</ul>}</>;
}
export function NumberDemo() {
  const [value, setValue] = useState(30);
  return <div className="form-grid"><Field className="number-field" label="Quantity"><SpinButton defaultValue={4} min={0} /></Field><Field label={`Estimated completion: ${value}%`}><Slider value={value} onChange={(_, data) => setValue(data.value)} /></Field></div>;
}
export function HintDemo() {
  return <div className="button-cluster"><InfoLabel info="Explain the field without replacing visible error messages.">Record reference</InfoLabel><Tooltip content="This is a supporting action" relationship="description"><Button>Hover or focus</Button></Tooltip><Popover><PopoverTrigger disableButtonEnhancement><Button>View explanation</Button></PopoverTrigger><PopoverSurface>Additional information related directly to the current context.</PopoverSurface></Popover></div>;
}
export function OverlayDemo() {
  const [open, setOpen] = useState(false);
  return <div className="button-cluster"><Dialog><DialogTrigger disableButtonEnhancement><Button>Open confirmation Dialog</Button></DialogTrigger><DialogSurface><DialogBody><DialogTitle>Confirm local action</DialogTitle><DialogContent>This example does not write business data.</DialogContent><DialogActions><DialogTrigger disableButtonEnhancement><Button>Cancel</Button></DialogTrigger><DialogTrigger disableButtonEnhancement><Button appearance="primary">Confirm</Button></DialogTrigger></DialogActions></DialogBody></DialogSurface></Dialog><Button onClick={() => setOpen(true)}>Open Sheet</Button><OverlayDrawer open={open} onOpenChange={(_, data) => setOpen(data.open)} position="end" aria-label="Details Sheet"><DrawerHeader><DrawerHeaderTitle>Record details</DrawerHeaderTitle></DrawerHeader><DrawerBody><Field label="Name"><Input defaultValue="Example record" /></Field></DrawerBody><DrawerFooter><Button onClick={() => setOpen(false)}>Close</Button></DrawerFooter></OverlayDrawer></div>;
}
export function BreadcrumbDemo() {
  return <Breadcrumb aria-label="Current location"><BreadcrumbItem><BreadcrumbButton href="?view=directory">Record directory</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Current record</BreadcrumbButton></BreadcrumbItem></Breadcrumb>;
}
export function HeaderDemo() {
  return <PageHeader title="Example record" description="Stable identity, a short description and page-level actions." actions={<Button appearance="primary">Create record</Button>} />;
}
export function TabsDemo() {
  const [tab, setTab] = useState('details');
  return <><TabList selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value))}><Tab id="details-tab" aria-controls="details-panel" value="details">Details</Tab><Tab id="history-tab" aria-controls="history-panel" value="history">History</Tab></TabList><div role="tabpanel" id={`${tab}-panel`} aria-labelledby={`${tab}-tab`}>{tab === 'details' ? 'Primary fields of the current record.' : 'Historical changes to this record.'}</div></>;
}
export function ShellDemo() {
  return <div className="form-stack"><p>This preview uses ApplicationFrame: white grouped navigation, a stable top bar and a content workspace. Resize to explore mobile navigation.</p><p>The application supplies account, environment and tools to ApplicationTopBar and synchronizes the current navigation item with its route.</p><Link href="?view=directory">Open the complete directory example</Link></div>;
}
export function LayoutDemo() {
  return <div className="catalog-layout-demo"><WorkspaceSection title="Primary content"><p>Forms, lists and the primary task belong here.</p></WorkspaceSection><WorkspaceSection title="Supporting information"><p>Object-related summaries follow the primary content on narrow screens.</p></WorkspaceSection></div>;
}
export function LoginDemo() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return <AuthenticationLayout aria-label="Sign-in demo" title="Sign in" description="Synthetic preview. Do not enter a real password." brand={<span>Nidec UI example</span>} form={<form className="form-stack" onSubmit={async event => { event.preventDefault(); setBusy(true); setMessage(''); await new Promise(resolve => setTimeout(resolve, 600)); setBusy(false); setMessage('Demo sign-in completed. Authentication and redirects belong to the application.'); }}><Field label="Email" required><Input type="email" required autoComplete="off" /></Field><Field label="Demo password" required><Input type="password" required autoComplete="off" /></Field><div className="button-cluster"><Button type="submit" appearance="primary" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</Button></div>{message && <MessageBar intent="success"><MessageBarBody>{message}</MessageBarBody></MessageBar>}</form>} />;
}
export function CompleteFormPage() {
  const [name, setName] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  return <form className="workspace-stack" noValidate onSubmit={async event => { event.preventDefault(); setAttempted(true); setSaved(false); if (!name.trim()) return; setBusy(true); await new Promise(resolve => setTimeout(resolve, 700)); setBusy(false); setSaved(true); }}>
    <PageHeader title="Create record" description="Complete form example: fields, sections, validation and local submission feedback." />
    <fieldset disabled={busy} className="catalog-fieldset"><WorkspaceSection title="Basic information"><div className="form-grid"><Field label="Name" required validationState={attempted && !name.trim() ? 'error' : 'none'} validationMessage={attempted && !name.trim() ? 'Enter a name' : undefined}><Input value={name} onChange={(_, data) => { setName(data.value); setSaved(false); }} /></Field><Field label="Reference (read-only)"><Input value="EXAMPLE-001" readOnly /></Field><Field label="Category"><Dropdown><Option>Standard</Option><Option>Extended</Option></Dropdown></Field><Field label="Planned date"><DatePicker aria-label="Planned date" /></Field></div></WorkspaceSection>
    <WorkspaceSection title="Configuration and options"><div className="form-grid"><Field className="number-field" label="Quantity"><SpinButton defaultValue={1} min={1} /></Field><Field label="Priority"><RadioGroup defaultValue="normal" layout="horizontal"><Radio value="normal" label="Normal" /><Radio value="high" label="High" /></RadioGroup></Field><Checkbox label="Additional information required" /><Switch label="Enable this record" defaultChecked /></div></WorkspaceSection>
    <WorkspaceSection title="Additional notes"><Field label="Description"><Textarea rows={4} /></Field></WorkspaceSection></fieldset>
    {saved && <MessageBar intent="success"><MessageBarBody>Local demo submitted: {name}. Refreshing resets the data.</MessageBarBody></MessageBar>}
    <div className="button-cluster"><Button type="submit" appearance="primary" disabled={busy}>{busy ? 'Submitting' : 'Submit record'}</Button><Button disabled={busy} onClick={() => { setName(''); setAttempted(false); setSaved(false); }}>Reset</Button>{busy && <Spinner size="tiny" label="Submitting" />}</div>
  </form>;
}
