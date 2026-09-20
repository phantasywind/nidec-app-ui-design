import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDOMRenderer, createTableColumn, RendererProvider } from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';
import {
  Button, CardGallery, CardGalleryItem, CardHeader, Checkbox, CollectionList, CollectionListItem,
  Badge, BusinessProcessFlow, Link, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, NidecProvider,
  DataGridBody, DataGridCell, DataGridHeaderCell, DataGridRow, StageNavigator, Table, TableBody, TableCell, TableCellActions,
  RecordDataGridHeader, RecordIdentityCellLayout, RecordSelectionDataGrid, RecordSelectionDataGridRow,
  RecordSelectionRegion, RecordTableHeader, TableHeaderCell, TableRow, Tag, Toolbar, ToolbarButton, nidecLightTheme,
  InlineModeTabs, SegmentedControl, TableActionIconButton, Tooltip,
} from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './region.css';

const records = [
  { id: 'alpha', name: 'Example Alpha', detail: 'Primary collection item', meta: 'Updated today' },
  { id: 'beta', name: 'Example Beta', detail: 'Secondary collection item', meta: 'Updated yesterday' },
  { id: 'gamma', name: 'Example Gamma', detail: 'Long content wraps without changing the consumer data contract', meta: 'Archived example' },
];

const gallerySections = [
  { id: 'foundations', title: 'Foundations', description: 'Theme, typography, spacing, color roles, and accessibility targets.' },
  { id: 'components', title: 'Components', description: 'Stable public controls with states, anatomy, and usage boundaries.' },
  { id: 'patterns', title: 'Patterns', description: 'Reusable compositions without application workflow semantics.' },
  { id: 'evidence', title: 'Evidence', description: 'Version, artifact hash, tests, limitations, and adoption maturity.' },
];

const tableRecords = [
  { id: 'REC-1042', name: 'Example Alpha', owner: 'North engineering team', category: 'Standard', status: 'Ready', tone: 'success', updated: 'Today' },
  { id: 'REC-1038', name: 'Example Beta with a longer descriptive name', owner: 'Central engineering team', category: 'Configured', status: 'Review', tone: 'warning', updated: 'Yesterday' },
  { id: 'REC-1021', name: 'Example Gamma', owner: 'South engineering team', category: 'Special', status: 'Blocked', tone: 'danger', updated: '3 days ago' },
] as const;

type SelectionRecord = { id: string; name: string; detail: string };
const selectionRecords: SelectionRecord[] = [
  { id: 'SEL-1001', name: 'Standard definition', detail: 'System-maintained example' },
  { id: 'SEL-1002', name: 'Extended definition', detail: 'Loads into the editor above' },
  { id: 'SEL-1003', name: 'Regional definition', detail: 'No navigation or row command' },
];
const selectionColumns = [
  createTableColumn<SelectionRecord>({
    columnId: 'record',
    renderHeaderCell: () => 'Definition',
    renderCell: item => <RecordIdentityCellLayout primary={item.name} secondary={item.detail} />,
  }),
];

const stages = [
  { id: 'prepare', label: 'Prepare', description: 'Example completed step', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'Review', description: 'Example current step', status: 'current', statusLabel: 'Current stage' },
  { id: 'confirm', label: 'Confirm', description: 'Consumer decides whether this can activate', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'release', label: 'Release', description: 'Example unavailable step', status: 'upcoming', statusLabel: 'Upcoming and unavailable', disabled: true },
] as const;

const businessProcessStages = [
  { id: 'prepare', label: 'Prepare', description: 'Completed', status: 'completed', statusLabel: 'Completed' },
  { id: 'pending', label: 'Pending Approval', description: 'In progress', status: 'current', statusLabel: 'Current stage' },
  { id: 'approved', label: 'Approved', description: 'Not reached', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'issued', label: 'Issued', description: 'Not issued', status: 'upcoming', statusLabel: 'Upcoming' },
] as const;

function App() {
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>(['alpha']);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string | number>>(new Set(['SEL-1001']));
  const [changeMode, setChangeMode] = useState('commercial');
  const [parameterSources, setParameterSources] = useState<Record<string, string>>({ P1: 'fixed', P2: 'field', P3: 'fixed' });
  const [lastAction, setLastAction] = useState('No stage activated');
  return <NidecProvider theme={nidecLightTheme}><div className="composite-fixture">
    <header className="page-header">
      <div><p className="eyebrow">Shared composite patterns</p><h1>Collections, data tables, galleries, and process stages</h1></div>
      <p>Fluent owns control behavior and states; the shared package governs reusable composition.</p>
    </header>
    <main>
      <section aria-labelledby="segmented-control-heading">
        <div className="section-heading"><div><h2 id="segmented-control-heading">Segmented Control</h2><p>Compact, mutually exclusive mode selection with one coherent control boundary.</p></div><Tag appearance="outline">Single choice</Tag></div>
        <SegmentedControl
          aria-label="Change type"
          options={[
            { value: 'commercial', label: 'Commercial change' },
            { value: 'engineering', label: 'Engineering change' },
          ]}
          value={changeMode}
          onValueChange={(_, nextValue) => setChangeMode(nextValue)}
        />
        <div className="inline-mode-example" aria-label="Formula parameter source examples">
          {Object.entries(parameterSources).map(([parameter, source]) => <div className="inline-mode-row" key={parameter}>
            <div><strong>{parameter}</strong><small>Ordered formula parameter</small></div>
            <InlineModeTabs
              aria-label={`${parameter} parameter source`}
              options={[{ value: 'field', label: 'Field' }, { value: 'fixed', label: 'Fixed' }]}
              value={source}
              onValueChange={(_, nextValue) => setParameterSources(current => ({ ...current, [parameter]: nextValue }))}
            />
          </div>)}
        </div>
      </section>

      <section aria-labelledby="list-heading">
        <div className="section-heading"><div><h2 id="list-heading">Collection List</h2><p>Selectable Fluent List behavior with neutral content slots.</p></div><Tag appearance="outline">Compact</Tag></div>
        <CollectionList
          aria-label="Example records"
          density="compact"
        >
          {records.map(record => <CollectionListItem
            key={record.id}
            selection={<Checkbox
              aria-label={`Select ${record.name}`}
              checked={selectedItems.includes(record.id)}
              onChange={(_, data) => setSelectedItems(data.checked ? [record.id] : [])}
            />}
            leading={<span className="record-marker" aria-hidden="true" />}
            primary={record.name}
            secondary={record.detail}
            metadata={record.meta}
            actions={<Button onClick={() => undefined}>Open</Button>}
          />)}
        </CollectionList>
      </section>

      <section aria-labelledby="table-heading">
        <div className="section-heading"><div><h2 id="table-heading">Data Table List</h2><p>Each row declares one record identity; ordinary fields, status, metadata, and row actions retain distinct roles.</p></div><Tag appearance="outline">Scrollable</Tag></div>
        <div className="data-table-scroll" tabIndex={0} role="region" aria-label="Scrollable example records table">
          <Table aria-label="Example data records">
            <RecordTableHeader><TableRow>
              <TableHeaderCell>ID</TableHeaderCell><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Category</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Updated</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell>
            </TableRow></RecordTableHeader>
            <TableBody>{tableRecords.map(record => <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell><RecordIdentityCellLayout
                primary={<Link inline href={`#record-${record.id}`}>{record.name}</Link>}
                secondary={record.owner}
                truncate
              /></TableCell>
              <TableCell>{record.category}</TableCell>
              <TableCell><Badge appearance="tint" color={record.tone}>{record.status}</Badge></TableCell>
              <TableCell>{record.updated}</TableCell>
              <TableCell><TableCellActions visible>
                <Menu>
                  <Tooltip content={`More actions for ${record.name}`} relationship="description">
                    <MenuTrigger disableButtonEnhancement>
                      <TableActionIconButton aria-label={`More actions for ${record.name}`} icon={<MoreHorizontalRegular />} />
                    </MenuTrigger>
                  </Tooltip>
                  <MenuPopover><MenuList>
                    <MenuItem onClick={() => setLastAction(`Reviewed actions for ${record.name}`)}>Review actions</MenuItem>
                  </MenuList></MenuPopover>
                </Menu>
              </TableCellActions></TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </div>
        <p className="table-note">The consumer designates exactly one record identity per row. Column meaning, sorting, selection, pagination, and data loading remain consumer-owned.</p>
      </section>

      <section aria-labelledby="selection-heading">
        <div className="section-heading"><div><h2 id="selection-heading">In-place record selection</h2><p>Selecting a row loads the same-surface editor; it does not navigate or run a row command.</p></div><Tag appearance="outline">Single selection</Tag></div>
        <RecordSelectionRegion
          aria-label="Definition editor directory"
          toolbar={<Toolbar aria-label="Definition tools"><ToolbarButton>Refresh</ToolbarButton></Toolbar>}
        >
          <RecordSelectionDataGrid
            aria-label="Available definitions"
            columns={selectionColumns}
            getRowId={item => item.id}
            items={selectionRecords}
            onSelectionChange={(_, data) => setSelectedRecordIds(new Set(data.selectedItems))}
            selectedItems={selectedRecordIds}
          >
            <RecordDataGridHeader>
              <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
            </RecordDataGridHeader>
            <DataGridBody<SelectionRecord>>{({ item, rowId }) => <RecordSelectionDataGridRow<SelectionRecord> key={rowId} recordId={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </RecordSelectionDataGridRow>}</DataGridBody>
          </RecordSelectionDataGrid>
        </RecordSelectionRegion>
      </section>

      <section aria-labelledby="gallery-heading">
        <div className="section-heading"><div><h2 id="gallery-heading">Design System Gallery structure</h2><p>A governed Gallery separates foundations, components, patterns, and evidence.</p></div><Tag appearance="outline">Responsive</Tag></div>
        <CardGallery aria-label="Design System Gallery sections" minimumItemWidth="small">
          {gallerySections.map(item => <CardGalleryItem key={item.id} cardProps={{ appearance: 'outline' }}>
            <CardHeader header={<h3>{item.title}</h3>} description={<span>{item.id}</span>} />
            <p>{item.description}</p>
            <Button>Open section</Button>
          </CardGalleryItem>)}
        </CardGallery>
      </section>

      <section aria-labelledby="stage-navigator-heading">
        <div className="section-heading"><div><h2 id="stage-navigator-heading">Stage Navigator</h2><p>Users can switch sibling workspaces; it does not imply automatic lifecycle progression.</p></div><Tag appearance="outline">Interactive</Tag></div>
        <StageNavigator
          aria-label="Example workspace navigation"
          stages={stages}
          onStageSelect={(_, stage) => setLastAction(`Activated ${stage.label}`)}
        />
        <p className="stage-result" aria-live="polite">{lastAction}</p>
      </section>

      <section aria-labelledby="business-process-heading">
        <div className="section-heading"><div><h2 id="business-process-heading">Business Process Flow</h2><p>Read-only lifecycle progress; only application business state can move the current stage.</p></div><Tag appearance="outline">Read only</Tag></div>
        <BusinessProcessFlow aria-label="Example business process" stages={businessProcessStages} />
      </section>
    </main>
  </div></NidecProvider>;
}

const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? { styleElementAttributes: { nonce } } : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><App /></RendererProvider>);
