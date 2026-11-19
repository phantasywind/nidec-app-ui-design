import { useMemo, useState } from 'react';
import {
  EditRegular,
  GridRegular,
  TextBulletListLtrRegular,
} from '@fluentui/react-icons';
import {
  createTableColumn,
  type TableColumnDefinition,
  type TableRowId,
} from '@fluentui/react-components';
import {
  ActionableCardGalleryItem,
  ActiveBadge,
  Badge,
  BusinessNumberInput,
  BusinessProcessFlow,
  BusinessProcessStageDetail,
  Button,
  CardGallery,
  CardHeader,
  ChangeHistoryTable,
  CollectionList,
  CollectionListItem,
  DataGridBody,
  DataGridCell,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  EmptyState,
  FactList,
  Field,
  FormDrawer,
  FormGrid,
  FormGridItem,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  PageHeader,
  Pagination,
  RecordDataGridHeader,
  RecordIdentityCellLayout,
  RecordLink,
  RecordManagementWorkspace,
  RecordSelectionDataGrid,
  RecordSelectionDataGridRow,
  RecordSelectionRegion,
  RecordTableHeader,
  RowEndStatus,
  SearchBox,
  SegmentedControl,
  SingleSelectDropdown,
  StageNavigator,
  StickySaveBar,
  Tab,
  TabList,
  Table,
  TableActionIconButton,
  TableBody,
  TableCell,
  TableCellActions,
  TableHeaderCell,
  TableRow,
  TableScrollRegion,
  Textarea,
  Toolbar,
  ToolbarDivider,
  Tooltip,
  ViewModeToggle,
  WorkspaceSection,
  WorkspaceStack,
  formatCurrency,
  numericColumnClassName,
  type BusinessProcessStageDefinition,
  type ProcessStageDefinition,
  type ViewMode,
} from '@phantasywind/nidec-app-ui-design';
import { BusinessDatePicker } from '@phantasywind/nidec-app-ui-design/date-picker';
import {
  AuthenticationLayout,
  DirectoryWorkspace,
  VersionedWorkspaceLayout,
} from '@phantasywind/nidec-app-ui-design/layouts';

type DirectoryRecord = {
  id: string;
  name: string;
  plant: string;
  amount: number;
  active: boolean;
  updated: string;
};

const INITIAL_DIR_RECORDS: DirectoryRecord[] = [
  { id: 'REC-1041', name: 'Traction Drive Assembly M400', plant: 'Plant 01 — Shanghai', amount: 14820, active: true, updated: '26 Oct 2026' },
  { id: 'REC-1042', name: 'Regenerative Inverter Cabinet R8', plant: 'Plant 03 — Osaka', amount: 9350, active: true, updated: '24 Oct 2026' },
  { id: 'REC-1043', name: 'Compact Brake Unit B12', plant: 'Plant 06 — Munich', amount: 4120, active: false, updated: '20 Oct 2026' },
  { id: 'REC-1044', name: 'Encoder Harness Kit E5', plant: 'Plant 02 — Suzhou', amount: 1680, active: true, updated: '18 Oct 2026' },
  { id: 'REC-1045', name: 'Door Operator Assembly DO-90', plant: 'Plant 01 — Shanghai', amount: 3290, active: true, updated: '15 Oct 2026' },
];

export function DirectoryWorkspaceExample() {
  const [records, setRecords] = useState(INITIAL_DIR_RECORDS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<DirectoryRecord | null>(null);
  const [editName, setEditName] = useState('');
  const pageSize = 3;

  const filtered = useMemo(
    () =>
      records.filter((r) => {
        if (statusFilter === 'active' && !r.active) return false;
        if (statusFilter === 'inactive' && r.active) return false;
        return `${r.id} ${r.name} ${r.plant}`.toLowerCase().includes(query.toLowerCase());
      }),
    [records, query, statusFilter],
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEditor = (rec: DirectoryRecord) => {
    setEditing(rec);
    setEditName(rec.name);
  };

  return (
    <DirectoryWorkspace
      aria-label="Enterprise records directory"
      header={
        <PageHeader
          title="Engineering records"
          description="Search, filter, switch List/Card views, and edit records in a FormDrawer without losing directory state."
          actions={
            <>
              <Button onClick={() => { setQuery(''); setStatusFilter('all'); setPage(1); }}>Reset filters</Button>
              <Button
                appearance="primary"
                onClick={() => openEditor({ id: `REC-${1046 + records.length}`, name: 'New assembly specification', plant: 'Plant 01 — Shanghai', amount: 2500, active: true, updated: 'Today' })}
              >
                New record
              </Button>
            </>
          }
        />
      }
      resultsTitle={`Records (${filtered.length})`}
      resultsLabel="Matching engineering records"
      toolbar={
        <div className="demo-row--spread">
          <Toolbar aria-label="Directory filters">
            <SearchBox
              aria-label="Search records"
              placeholder="Search code, name, or plant..."
              value={query}
              onChange={(_, d) => { setQuery(d.value); setPage(1); }}
            />
            <ToolbarDivider />
            <SegmentedControl
              aria-label="Filter by status"
              value={statusFilter}
              onValueChange={(_, v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Toolbar>
          <ViewModeToggle
            aria-label="Switch list or card view"
            value={viewMode}
            onValueChange={(_, next) => setViewMode(next)}
            listIcon={<TextBulletListLtrRegular />}
            cardIcon={<GridRegular />}
          />
        </div>
      }
      results={
        paged.length === 0 ? (
          <EmptyState
            title="No matching records"
            description="Adjust your search or status filter."
            actions={<Button onClick={() => { setQuery(''); setStatusFilter('all'); }}>Clear filters</Button>}
          />
        ) : viewMode === 'list' ? (
          <TableScrollRegion aria-label="Directory table">
            <Table aria-label="Directory table">
              <RecordTableHeader>
                <TableRow>
                  <TableHeaderCell style={{ minWidth: 120 }}>Record ID</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 220 }}>Name</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 160 }}>Plant</TableHeaderCell>
                  <TableHeaderCell className={numericColumnClassName} style={{ minWidth: 120 }}>Amount</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 160 }}>Updated</TableHeaderCell>
                  <TableHeaderCell style={{ minWidth: 80 }}>Actions</TableHeaderCell>
                </TableRow>
              </RecordTableHeader>
              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <RecordIdentityCellLayout
                        primary={
                          <RecordLink
                            weight="semibold"
                            href={`#/${r.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              openEditor(r);
                            }}
                          >
                            {r.id}
                          </RecordLink>
                        }
                      />
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.plant}</TableCell>
                    <TableCell className={numericColumnClassName}>{formatCurrency(r.amount, 'USD')}</TableCell>
                    <TableCell>
                      <RowEndStatus status={<ActiveBadge active={r.active} />}>
                        <span>{r.updated}</span>
                      </RowEndStatus>
                    </TableCell>
                    <TableCell>
                      <TableCellActions visible>
                        <Tooltip content={`Edit ${r.id}`} relationship="description">
                          <TableActionIconButton
                            aria-label={`Edit ${r.id}`}
                            icon={<EditRegular />}
                            onClick={() => openEditor(r)}
                          />
                        </Tooltip>
                      </TableCellActions>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollRegion>
        ) : (
          <CardGallery aria-label="Directory cards" minimumItemWidth="medium">
            {paged.map((r) => (
              <ActionableCardGalleryItem
                key={r.id}
                aria-label={`Edit ${r.id}`}
                onActivate={() => openEditor(r)}
              >
                <CardHeader header={<strong>{r.id} — {r.name}</strong>} description={r.plant} />
                <div className="demo-row--spread">
                  <span>{formatCurrency(r.amount, 'USD')}</span>
                  <ActiveBadge active={r.active} />
                </div>
              </ActionableCardGalleryItem>
            ))}
          </CardGallery>
        )
      }
      pagination={
        <Pagination
          aria-label="Directory pagination"
          page={page}
          pageSize={pageSize}
          totalCount={filtered.length}
          onPageChange={(_, p) => setPage(p)}
        />
      }
      details={
        <FormDrawer
          open={editing !== null}
          onDismiss={() => setEditing(null)}
          title={editing ? `Edit ${editing.id}` : 'Edit record'}
          actions={
            <>
              <Button onClick={() => setEditing(null)}>Cancel</Button>
              <Button
                appearance="primary"
                onClick={() => {
                  if (!editing) return;
                  setRecords((prev) => {
                    const exists = prev.some((item) => item.id === editing.id);
                    if (exists) {
                      return prev.map((item) => (item.id === editing.id ? { ...item, name: editName } : item));
                    }
                    return [{ ...editing, name: editName }, ...prev];
                  });
                  setEditing(null);
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <FormGrid columns={1}>
            <Field label="Record name">
              <Input value={editName} onChange={(_, d) => setEditName(d.value)} />
            </Field>
            <Field label="Plant">
              <Input value={editing?.plant ?? ''} readOnly />
            </Field>
          </FormGrid>
        </FormDrawer>
      }
    />
  );
}

export function CompleteFormExample() {
  const [name, setName] = useState('Gearless Traction Unit G4');
  const [plant, setPlant] = useState<string | null>('shanghai');
  const [date, setDate] = useState<string | null>('2026-11-15');
  const [weight, setWeight] = useState<number | null>(860);
  const [notes, setNotes] = useState('Synthetic entry example. Validation and persistence remain application-owned.');
  const [submitted, setSubmitted] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const nameError = submitted && !name.trim() ? 'Specification name is required.' : undefined;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!name.trim()) return;
    setDirty(false);
    setSavedNotice(`Saved "${name}" (${weight ?? 0} kg, target ${date ?? 'unset'}) in local preview state.`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <WorkspaceStack>
        <PageHeader
          title="New specification entry"
          description="Dedicated form page with grouped sections, bounded FormGrid columns, inline validation, and StickySaveBar."
        />

        {savedNotice && (
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>Submitted</MessageBarTitle>
              {savedNotice}
            </MessageBarBody>
          </MessageBar>
        )}

        <WorkspaceSection title="General identity">
          <FormGrid columns={2}>
            <Field label="Specification name" required validationState={nameError ? 'error' : undefined} validationMessage={nameError}>
              <Input
                value={name}
                onChange={(_, d) => {
                  setName(d.value);
                  setDirty(true);
                }}
              />
            </Field>
            <Field label="Manufacturing plant">
              <SingleSelectDropdown
                options={[
                  { value: 'shanghai', text: 'Plant 01 — Shanghai' },
                  { value: 'osaka', text: 'Plant 03 — Osaka' },
                  { value: 'munich', text: 'Plant 06 — Munich' },
                ]}
                selectedOption={plant}
                onOptionSelect={(_, d) => {
                  setPlant(d.optionValue);
                  setDirty(true);
                }}
              />
            </Field>
            <Field label="Target release date">
              <BusinessDatePicker
                value={date}
                onValueChange={(next) => {
                  setDate(next);
                  setDirty(true);
                }}
              />
            </Field>
            <Field label="Rated weight">
              <BusinessNumberInput
                value={weight}
                onValueChange={(v) => {
                  setWeight(v);
                  setDirty(true);
                }}
                unit="kg"
                min={0}
              />
            </Field>
            <FormGridItem wide>
              <Field label="Engineering notes">
                <Textarea
                  value={notes}
                  rows={3}
                  onChange={(_, d) => {
                    setNotes(d.value);
                    setDirty(true);
                  }}
                />
              </Field>
            </FormGridItem>
          </FormGrid>
        </WorkspaceSection>

        <div className="demo-row">
          <Button type="submit" appearance="primary">Save specification</Button>
          <Button
            onClick={() => {
              setName('Gearless Traction Unit G4');
              setDirty(false);
              setSavedNotice(null);
            }}
          >
            Reset
          </Button>
        </div>

        {dirty && (
          <StickySaveBar
            message="Unsaved form edits"
            actions={
              <>
                <Button onClick={() => setDirty(false)}>Dismiss</Button>
                <Button type="submit" appearance="primary">Save</Button>
              </>
            }
          />
        )}
      </WorkspaceStack>
    </form>
  );
}

type MasterRow = { id: string; code: string; title: string; unit: string };
const MASTER_ITEMS: MasterRow[] = [
  { id: 'MD-1', code: 'STD-001', title: 'Standard Steel Frame', unit: 'ea' },
  { id: 'MD-2', code: 'STD-002', title: 'Insulated Busbar Set', unit: 'set' },
  { id: 'MD-3', code: 'STD-003', title: 'Optical Shaft Sensor', unit: 'ea' },
];

export function MasterDataExample() {
  const [rows, setRows] = useState(MASTER_ITEMS);
  const [selectedId, setSelectedId] = useState('MD-1');
  const [query, setQuery] = useState('');
  const current = rows.find((r) => r.id === selectedId) ?? rows[0]!;
  const [draftTitle, setDraftTitle] = useState(current.title);
  const [pendingSwitchId, setPendingSwitchId] = useState<string | null>(null);

  const dirty = draftTitle !== current.title;
  const filtered = rows.filter((r) => `${r.code} ${r.title}`.toLowerCase().includes(query.toLowerCase()));

  const columns: TableColumnDefinition<MasterRow>[] = [
    createTableColumn<MasterRow>({ columnId: 'code', renderHeaderCell: () => 'Code', renderCell: (r) => r.code }),
    createTableColumn<MasterRow>({ columnId: 'title', renderHeaderCell: () => 'Definition', renderCell: (r) => r.title }),
    createTableColumn<MasterRow>({ columnId: 'unit', renderHeaderCell: () => 'Unit', renderCell: (r) => r.unit }),
  ];

  const requestSwitch = (nextId: string) => {
    if (nextId === selectedId) return;
    if (dirty) {
      setPendingSwitchId(nextId);
      return;
    }
    const target = rows.find((r) => r.id === nextId);
    if (target) {
      setSelectedId(target.id);
      setDraftTitle(target.title);
    }
  };

  return (
    <>
      <RecordManagementWorkspace
        aria-label="Master data maintenance"
        header={
          <PageHeader
            title="Master definitions (Form + List)"
            description="Whole-row selection loads the editor above; switching with unsaved edits prompts before discarding."
          />
        }
        primary={
          <WorkspaceStack>
            <WorkspaceSection
              title={`Editing ${current.code}`}
              headerContent={dirty ? <Badge appearance="tint" color="warning">Unsaved</Badge> : undefined}
              actions={
                <>
                  <Button disabled={!dirty} onClick={() => setDraftTitle(current.title)}>Revert</Button>
                  <Button
                    appearance="primary"
                    disabled={!dirty}
                    onClick={() => setRows((prev) => prev.map((r) => (r.id === current.id ? { ...r, title: draftTitle } : r)))}
                  >
                    Save
                  </Button>
                </>
              }
            >
              <FormGrid columns={2}>
                <Field label="Code">
                  <Input value={current.code} readOnly />
                </Field>
                <Field label="Definition name">
                  <Input value={draftTitle} onChange={(_, d) => setDraftTitle(d.value)} />
                </Field>
              </FormGrid>
            </WorkspaceSection>

            <WorkspaceSection title="Definitions directory" count={filtered.length}>
              <RecordSelectionRegion
                toolbar={
                  <SearchBox
                    aria-label="Search definitions"
                    placeholder="Filter definitions..."
                    value={query}
                    onChange={(_, d) => setQuery(d.value)}
                  />
                }
              >
                <RecordSelectionDataGrid
                  aria-label="Master definitions table"
                  items={filtered}
                  columns={columns}
                  getRowId={(r: MasterRow) => r.id}
                  selectedItems={new Set<TableRowId>([selectedId])}
                  onSelectionChange={(_, data) => {
                    const id = Array.from(data.selectedItems)[0];
                    if (typeof id === 'string') requestSwitch(id);
                  }}
                >
                  <RecordDataGridHeader>
                    <DataGridRow>
                      {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                    </DataGridRow>
                  </RecordDataGridHeader>
                  <DataGridBody<MasterRow>>
                    {({ item, rowId }) => (
                      <RecordSelectionDataGridRow<MasterRow> key={rowId} recordId={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                      </RecordSelectionDataGridRow>
                    )}
                  </DataGridBody>
                </RecordSelectionDataGrid>
              </RecordSelectionRegion>
            </WorkspaceSection>
          </WorkspaceStack>
        }
      />

      <Dialog open={pendingSwitchId !== null} onOpenChange={(_, d) => { if (!d.open) setPendingSwitchId(null); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Discard unsaved edits?</DialogTitle>
            <DialogContent>You have unsaved edits to {current.code}. Switch records anyway?</DialogContent>
            <DialogActions>
              <Button onClick={() => setPendingSwitchId(null)}>Stay here</Button>
              <Button
                appearance="attention"
                onClick={() => {
                  const target = rows.find((r) => r.id === pendingSwitchId);
                  if (target) {
                    setSelectedId(target.id);
                    setDraftTitle(target.title);
                  }
                  setPendingSwitchId(null);
                }}
              >
                Discard &amp; switch
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}

const RECORD_STAGES: readonly ProcessStageDefinition[] = [
  { id: 'summary', label: '1. Summary', status: 'completed', statusLabel: 'Completed' },
  { id: 'bom', label: '2. Line items', status: 'current', statusLabel: 'In progress' },
  { id: 'review', label: '3. Sign-off', status: 'upcoming', statusLabel: 'Upcoming' },
];

export function RecordWorkspaceExample() {
  const [stageId, setStageId] = useState('bom');
  const [relatedRecord, setRelatedRecord] = useState('REC-1041');

  return (
    <RecordManagementWorkspace
      aria-label="Single record workspace"
      header={
        <PageHeader
          title={relatedRecord}
          titleAdornment={<Badge appearance="tint" color="success">Active</Badge>}
          description="Primary work area with StageNavigator and an optional right context rail that reflows above primary content at <=900px."
          actions={<Button appearance="primary">Edit record</Button>}
        />
      }
      contextRailLabel="Related records"
      contextRail={
        <WorkspaceSection title="Context rail">
          <CollectionList aria-label="Related records" density="compact">
            {['REC-1041', 'REC-1042', 'REC-1043'].map((id) => (
              <CollectionListItem
                key={id}
                primary={
                  <Link
                    inline
                    href={`#/${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setRelatedRecord(id);
                    }}
                  >
                    {id}
                  </Link>
                }
                secondary={id === relatedRecord ? 'Currently open' : 'Switch context'}
              />
            ))}
          </CollectionList>
        </WorkspaceSection>
      }
      primary={
        <WorkspaceStack>
          <StageNavigator
            aria-label="Record workspace stages"
            stages={RECORD_STAGES}
            selectedStageId={stageId}
            onStageSelect={(_, stage) => setStageId(stage.id)}
          />
          <WorkspaceSection title={`Workspace stage: ${stageId}`}>
            <FactList
              facts={[
                { label: 'Record ID', value: relatedRecord },
                { label: 'Active workspace', value: stageId },
                { label: 'Owner', value: 'A. Lin' },
                { label: 'Estimated cost', value: formatCurrency(14820, 'USD') },
              ]}
            />
          </WorkspaceSection>
        </WorkspaceStack>
      }
    />
  );
}

const GOV_STAGES: readonly BusinessProcessStageDefinition[] = [
  { id: 'draft', label: 'Draft', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'Review', status: 'current', statusLabel: 'Current' },
  { id: 'published', label: 'Published', status: 'upcoming', statusLabel: 'Upcoming' },
];

export function GovernanceExample() {
  const [viewedStage, setViewedStage] = useState('review');
  const [tab, setTab] = useState('attributes');
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <VersionedWorkspaceLayout
        aria-label="Versioned specification governance"
        identity={
          <PageHeader
            title="Traction Drive Standard TD-400"
            titleAdornment={<Badge appearance="tint" color="warning">In review</Badge>}
            description="VersionedWorkspaceLayout separates stable object identity, current revision, and governed process stages."
            actions={
              <>
                <Button onClick={() => setHistoryOpen(true)}>Change history</Button>
                <Button appearance="attention">Return</Button>
                <Button appearance="primary">Approve revision</Button>
              </>
            }
          />
        }
        governance={
          <WorkspaceStack>
            <BusinessProcessFlow
              aria-label="Revision lifecycle"
              stages={GOV_STAGES}
              viewedStageId={viewedStage}
              onStageView={(_, s) => setViewedStage(s.id)}
              renderStageDetail={(s) => (
                <BusinessProcessStageDetail
                  title={s.label}
                  status={s.status === 'current' ? 'Awaiting Engineering Lead approval' : 'Completed'}
                  checks={[{ id: '1', label: 'Drawing checksum verified', met: true, stateLabel: 'Done' }]}
                />
              )}
            />
            <FactList
              facts={[
                { label: 'Stable object', value: 'TD-400' },
                { label: 'Current revision', value: 'Rev 3.2 (Candidate)' },
                { label: 'Lifecycle state', value: 'In review' },
              ]}
            />
          </WorkspaceStack>
        }
        navigation={
          <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(String(d.value))}>
            <Tab value="attributes">Governed attributes</Tab>
            <Tab value="evidence">Verification evidence</Tab>
          </TabList>
        }
        content={
          <WorkspaceSection title={tab === 'attributes' ? 'Governed attributes' : 'Verification evidence'}>
            <p className="site-prose">
              {tab === 'attributes'
                ? 'Version numbering, approval authority, and release state transitions remain strictly owned by the adopting application.'
                : 'Attach revision checksums and independent acceptance references here.'}
            </p>
          </WorkspaceSection>
        }
      />

      <FormDrawer
        open={historyOpen}
        size="large"
        onDismiss={() => setHistoryOpen(false)}
        title="Revision change history"
        actions={<Button onClick={() => setHistoryOpen(false)}>Close</Button>}
      >
        <ChangeHistoryTable
          aria-label="Revision history"
          entries={[
            {
              id: '1',
              at: '26 Oct 2026 11:00',
              actor: 'A. Lin',
              action: 'Submitted Rev 3.2',
              changes: [{ field: 'Rated torque', from: '420 Nm', to: '440 Nm' }],
            },
          ]}
        />
      </FormDrawer>
    </>
  );
}

export function AuthenticationExample() {
  const [username, setUsername] = useState('engineer@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError('Enter a synthetic password to test the submitting state. No real credentials are sent.');
      return;
    }
    setError(null);
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setError('Synthetic preview only — authentication services remain application-owned.');
    }, 700);
  };

  return (
    <AuthenticationLayout
      aria-label="Synthetic application sign in"
      brand={<strong>Nidec Engineering Portal</strong>}
      title="Sign in"
      description="Enter your engineering account credentials to continue."
      feedback={
        error ? (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        ) : undefined
      }
      form={
        <form onSubmit={handleSubmit} className="demo-stack">
          <Field label="Work email" required>
            <Input value={username} onChange={(_, d) => setUsername(d.value)} />
          </Field>
          <Field label="Password" required>
            <Input type="password" value={password} onChange={(_, d) => setPassword(d.value)} />
          </Field>
          <Button type="submit" appearance="primary" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      }
      footer={<span className="demo-status-caption">Synthetic demonstration only. SSO, MFA, and sessions stay application-owned.</span>}
    />
  );
}
