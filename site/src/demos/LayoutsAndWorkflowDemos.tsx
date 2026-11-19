import { useState } from 'react';
import {
  DocumentRegular,
  GridRegular,
  HomeRegular,
  NavigationRegular,
  SettingsRegular,
  TextBulletListLtrRegular,
} from '@fluentui/react-icons';
import {
  ActionableCardGalleryItem,
  Badge,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  BusinessProcessFlow,
  BusinessProcessStageDetail,
  Button,
  CardGallery,
  CardGalleryItem,
  CardHeader,
  CollectionList,
  CollectionListItem,
  CountBadge,
  FactList,
  Link,
  PageHeader,
  Pagination,
  SearchBox,
  SectionNavigation,
  StageNavigator,
  StepStatusIcon,
  Tab,
  TabList,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ViewModeToggle,
  WorkspaceSection,
  WorkspaceStack,
  type BusinessProcessStageDefinition,
  type ProcessStageDefinition,
  type ViewMode,
} from '@phantasywind/nidec-app-ui-design';
import {
  ApplicationFrame,
  ApplicationNavigation,
  ApplicationNavigationGroup,
  ApplicationNavigationItem,
  ApplicationTopBar,
} from '@phantasywind/nidec-app-ui-design/layouts';

export function AppShellDemo() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('records');

  const nav = (
    <ApplicationNavigation
      aria-label="Sample application navigation"
      footer={
        <ApplicationNavigationGroup label="System">
          <ApplicationNavigationItem
            href="#settings"
            label="Settings"
            icon={<SettingsRegular />}
            current={activeRoute === 'settings'}
            onClick={(e) => {
              e.preventDefault();
              setActiveRoute('settings');
              setNavOpen(false);
            }}
          />
        </ApplicationNavigationGroup>
      }
    >
      <ApplicationNavigationGroup label="Workspace">
        <ApplicationNavigationItem
          href="#home"
          label="Overview"
          icon={<HomeRegular />}
          current={activeRoute === 'home'}
          onClick={(e) => {
            e.preventDefault();
            setActiveRoute('home');
            setNavOpen(false);
          }}
        />
        <ApplicationNavigationItem
          href="#records"
          label="Records"
          icon={<DocumentRegular />}
          badge={<CountBadge count={6} size="small" />}
          current={activeRoute === 'records'}
          onClick={(e) => {
            e.preventDefault();
            setActiveRoute('records');
            setNavOpen(false);
          }}
        />
      </ApplicationNavigationGroup>
    </ApplicationNavigation>
  );

  return (
    <div className="demo-shell-frame">
      <ApplicationFrame
        aria-label="Sample Nidec application shell"
        brand={<strong>Nidec Sample App</strong>}
        compactBrand={<strong>N</strong>}
        navigationOpen={navOpen}
        navigationToggleIcon={<NavigationRegular />}
        navigationToggleLabel="Open navigation"
        navigationCloseLabel="Close navigation"
        onNavigationOpenChange={setNavOpen}
        navigation={nav}
        topBar={
          <ApplicationTopBar
            location={<span>Engineering Portal · Test Environment</span>}
            utilities={<Badge appearance="tint" color="informative">A. Lin</Badge>}
            breadcrumb={
              <Breadcrumb aria-label="Page location">
                <BreadcrumbItem>
                  <BreadcrumbButton onClick={() => setActiveRoute('home')}>Home</BreadcrumbButton>
                </BreadcrumbItem>
                <BreadcrumbDivider />
                <BreadcrumbItem>
                  <BreadcrumbButton current>{activeRoute === 'records' ? 'Records' : activeRoute}</BreadcrumbButton>
                </BreadcrumbItem>
              </Breadcrumb>
            }
          />
        }
      >
        <div style={{ padding: 16 }}>
          <PageHeader
            title={activeRoute === 'records' ? 'Records directory' : activeRoute === 'settings' ? 'System settings' : 'Overview'}
            description="White flat navigation, single-border module hierarchy, and optional topbar breadcrumb row."
          />
        </div>
      </ApplicationFrame>
    </div>
  );
}

export function WorkspaceStructureDemo() {
  const [sectionId, setSectionId] = useState('general');
  const [tab, setTab] = useState('specs');

  return (
    <WorkspaceStack>
      <PageHeader
        title="Drive Assembly D-240"
        titleAdornment={<Badge appearance="tint" color="success">Released</Badge>}
        description="PageHeader, SectionNavigation with completion counts, WorkspaceSection, FactList, and Tabs."
        actions={
          <>
            <Button>Export</Button>
            <Button appearance="primary">Edit properties</Button>
          </>
        }
      />

      <SectionNavigation
        aria-label="Record sections"
        currentId={sectionId}
        onSectionSelect={(e, id) => {
          e.preventDefault();
          setSectionId(id);
        }}
        items={[
          { id: 'general', label: 'General', count: 4, total: 4, countLabel: '4 of 4 filled', status: <StepStatusIcon status="done" label="General complete" size="small" /> },
          { id: 'technical', label: 'Technical', count: 3, total: 5, countLabel: '3 of 5 filled', status: <StepStatusIcon status="pending" label="Technical in progress" size="small" /> },
          { id: 'docs', label: 'Documents', count: 2 },
        ]}
      />

      <WorkspaceSection
        title="Key attributes"
        count={4}
        headerContent={<Badge appearance="tint" color="informative">Active section: {sectionId}</Badge>}
        actions={<Button size="small">Refresh</Button>}
      >
        <FactList
          facts={[
            { label: 'Identifier', value: 'D-240-REV3' },
            { label: 'Plant', value: 'Plant 01 — Shanghai' },
            { label: 'Owner', value: 'A. Lin' },
            { label: 'Supersedes', value: '' },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Peer content views (Tabs)">
        <div className="demo-stack--tight">
          <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(String(d.value))}>
            <Tab value="specs">Specifications</Tab>
            <Tab value="attachments">Attachments</Tab>
          </TabList>
          <p className="site-prose">
            {tab === 'specs'
              ? 'Tabs switch peer content views of the same record. They do not represent sequential workflow steps.'
              : '2 governed engineering drawings attached (synthetic sample).'}
          </p>
        </div>
      </WorkspaceSection>
    </WorkspaceStack>
  );
}

const SAMPLE_COLLECTION = [
  { id: 'REC-301', title: 'Traction Drive M400', meta: 'Plant 01 · Active', summary: 'Primary gearless drive specification.' },
  { id: 'REC-302', title: 'Brake Module B12', meta: 'Plant 03 · Review', summary: 'Dual-coil electromagnetic brake.' },
  { id: 'REC-303', title: 'Controller Cabinet C8', meta: 'Plant 06 · Active', summary: 'Compact inverter and safety relay enclosure.' },
  { id: 'REC-304', title: 'Door Operator DO-90', meta: 'Plant 02 · Draft', summary: 'Linear belt-driven door mechanism.' },
  { id: 'REC-305', title: 'Load Sensor Kit LS-4', meta: 'Plant 01 · Active', summary: 'Four-point weighing cell kit.' },
  { id: 'REC-306', title: 'Governor Assembly G2', meta: 'Plant 03 · Active', summary: 'Bi-directional overspeed governor.' },
];

export function CollectionsCardsDemo() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [clicked, setClicked] = useState('Switch between List and Card — query and page are preserved.');

  const filtered = SAMPLE_COLLECTION.filter((item) =>
    `${item.id} ${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="demo-stack">
      <div className="demo-row--spread">
        <Toolbar aria-label="Collection controls">
          <SearchBox
            aria-label="Filter items"
            placeholder="Search items..."
            value={query}
            onChange={(_, d) => {
              setQuery(d.value);
              setPage(1);
            }}
          />
          <ToolbarDivider />
          <ToolbarButton onClick={() => setQuery('')}>Reset</ToolbarButton>
        </Toolbar>
        <div className="demo-row">
          <span className="demo-status-caption">{filtered.length} items</span>
          <ViewModeToggle
            aria-label="View mode"
            value={viewMode}
            onValueChange={(_, next) => setViewMode(next)}
            listIcon={<TextBulletListLtrRegular />}
            cardIcon={<GridRegular />}
          />
        </div>
      </div>

      {viewMode === 'card' ? (
        <CardGallery aria-label="Record cards" minimumItemWidth="medium">
          {paged.map((item) => (
            <ActionableCardGalleryItem
              key={item.id}
              aria-label={`Open ${item.title}`}
              onActivate={() => setClicked(`Activated whole-card entry: ${item.id} (${item.title})`)}
            >
              <CardHeader header={<strong>{item.title}</strong>} description={item.meta} />
              <p className="site-prose">{item.summary}</p>
            </ActionableCardGalleryItem>
          ))}
        </CardGallery>
      ) : (
        <CollectionList aria-label="Record list">
          {paged.map((item) => (
            <CollectionListItem
              key={item.id}
              primary={
                <Link
                  inline
                  href={`#/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setClicked(`Opened CollectionList item: ${item.id}`);
                  }}
                >
                  {item.title}
                </Link>
              }
              secondary={item.summary}
              metadata={<Badge appearance="tint" color="informative">{item.meta}</Badge>}
            />
          ))}
        </CollectionList>
      )}

      <div className="demo-stack--tight">
        <span className="demo-status-caption">Display-only CardGalleryItem (no action):</span>
        <CardGallery aria-label="Display cards" minimumItemWidth="small">
          <CardGalleryItem>
            <CardHeader header={<strong>Static summary card</strong>} description="No hover pointer or nested border" />
          </CardGalleryItem>
        </CardGallery>
      </div>

      <Pagination
        aria-label="Collection pagination"
        page={page}
        pageSize={pageSize}
        totalCount={filtered.length}
        onPageChange={(_, next) => setPage(next)}
        pageSizeOptions={[3, 6]}
        onPageSizeChange={(_, nextSize) => {
          setPageSize(nextSize);
          setPage(1);
        }}
      />

      <span className="demo-status-caption">{clicked}</span>
    </div>
  );
}

const WORKSPACE_STAGES: readonly ProcessStageDefinition[] = [
  { id: 'overview', label: '1. Parameters', status: 'completed', statusLabel: 'Completed', description: 'Core inputs verified' },
  { id: 'components', label: '2. Components', status: 'current', statusLabel: 'In progress', description: 'Editing line list' },
  { id: 'pricing', label: '3. Cost summary', status: 'upcoming', statusLabel: 'Not started', description: 'Can preview ahead' },
  { id: 'checks', label: '4. Checks', status: 'error', statusLabel: 'Needs attention', description: '1 missing input' },
];

export function StageNavigatorDemo() {
  const [selectedStageId, setSelectedStageId] = useState('components');
  const active = WORKSPACE_STAGES.find((s) => s.id === selectedStageId)!;

  return (
    <div className="demo-stack">
      <StageNavigator
        aria-label="Preparation workspaces"
        stages={WORKSPACE_STAGES}
        selectedStageId={selectedStageId}
        onStageSelect={(_, stage) => setSelectedStageId(stage.id)}
      />
      <WorkspaceSection
        title={`Viewing workspace: ${active.label}`}
        headerContent={<Badge appearance="tint" color="informative">Own status: {active.statusLabel}</Badge>}
      >
        <p className="site-prose">
          Notice that selecting an upcoming stage (such as <strong>3. Cost summary</strong>) moves only the outer focus ring — each marker keeps its own status fill.
        </p>
      </WorkspaceSection>
    </div>
  );
}

const PROCESS_STAGES: readonly BusinessProcessStageDefinition[] = [
  { id: 'draft', label: 'Draft', status: 'completed', statusLabel: 'Completed' },
  { id: 'engineering', label: 'Engineering review', status: 'current', statusLabel: 'Current stage' },
  { id: 'commercial', label: 'Commercial sign-off', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'released', label: 'Released', status: 'upcoming', statusLabel: 'Upcoming' },
];

export function BusinessProcessFlowDemo() {
  const [viewedStageId, setViewedStageId] = useState<string>('engineering');
  const [actionNote, setActionNote] = useState('Click Draft or Engineering review to open the stage detail popover. Upcoming stages are non-interactive.');

  return (
    <div className="demo-stack">
      <BusinessProcessFlow
        aria-label="Governed release lifecycle"
        stages={PROCESS_STAGES}
        viewedStageId={viewedStageId}
        onStageView={(_, stage) => {
          setViewedStageId(stage.id);
          setActionNote(`Inspecting reached stage "${stage.label}". Actual process progress remains at Engineering review.`);
        }}
        renderStageDetail={(stage) => (
          <BusinessProcessStageDetail
            title={stage.label}
            status={stage.status === 'completed' ? 'Completed on 22 Oct 2026' : 'Waiting for Engineering reviewer'}
            checksTitle="Entry conditions"
            checks={[
              { id: 'c1', label: 'Technical parameters complete', met: true, stateLabel: 'Done' },
              {
                id: 'c2',
                label: 'Tolerance verification signed',
                met: stage.status === 'completed',
                stateLabel: stage.status === 'completed' ? 'Done' : 'Missing',
                detail: stage.status === 'completed' ? undefined : 'Confirm thermal margin before advancing.',
              },
            ]}
            actionsTitle="Available commands"
            actions={
              stage.status === 'current' ? (
                <>
                  <Button
                    appearance="attention"
                    size="small"
                    onClick={() => setActionNote('Application command: Returned to Draft.')}
                  >
                    Return
                  </Button>
                  <Button
                    appearance="primary"
                    size="small"
                    onClick={() => setActionNote('Application command: Submitted to Commercial sign-off.')}
                  >
                    Advance stage
                  </Button>
                </>
              ) : undefined
            }
            next={stage.status === 'current' ? 'Next stage: Commercial sign-off' : undefined}
          />
        )}
      />
      <span className="demo-status-caption">{actionNote}</span>
    </div>
  );
}
