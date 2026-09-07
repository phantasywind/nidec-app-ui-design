import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDOMRenderer, RendererProvider } from '@fluentui/react-components';
import {
  Accordion, AccordionHeader, AccordionItem, AccordionPanel,
  Badge, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem,
  Card, CardFooter, CardHeader, Nav, NavItem, NidecProvider, ProgressBar,
  Skeleton, SkeletonItem, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Toolbar, ToolbarButton, Tree, TreeItem,
  TreeItemLayout, nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './region.css';

function App() {
  const [section, setSection] = useState('records');
  const [expanded, setExpanded] = useState<string[]>(['details']);
  return <NidecProvider theme={nidecLightTheme} className="surface-fixture">
    <header><Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#home">Home</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Records</BreadcrumbButton></BreadcrumbItem></Breadcrumb><h1>Platform surfaces</h1></header>
    <div className="surface-fixture-layout">
      <Nav aria-label="Primary" selectedValue={section} onNavItemSelect={(_, data) => setSection(String(data.value))}>
        <NavItem as="button" value="records">Records</NavItem><NavItem as="button" value="status">Status</NavItem>
      </Nav>
      <main>
        <Toolbar aria-label="Record actions"><ToolbarButton>Add</ToolbarButton><ToolbarButton>Edit</ToolbarButton></Toolbar>
        <Card><CardHeader header={<strong>Current records</strong>} description={<span>Consumer-owned columns and meanings</span>} />
          <Table aria-label="Example records"><TableHeader><TableRow><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell></TableRow></TableHeader><TableBody><TableRow><TableCell>Example A</TableCell><TableCell><Badge appearance="tint" color="success">Ready</Badge></TableCell></TableRow><TableRow><TableCell>Example B</TableCell><TableCell><Badge appearance="tint" color="warning">Review</Badge></TableCell></TableRow></TableBody></Table>
          <CardFooter><ProgressBar value={0.5} aria-label="Example progress" /></CardFooter>
        </Card>
        <Accordion collapsible multiple openItems={expanded} onToggle={(_, data) => setExpanded(data.openItems.map(String))}><AccordionItem value="details"><AccordionHeader>Details</AccordionHeader><AccordionPanel><Tree aria-label="Example hierarchy"><TreeItem itemType="branch"><TreeItemLayout>Group</TreeItemLayout><Tree><TreeItem itemType="leaf"><TreeItemLayout>Item</TreeItemLayout></TreeItem></Tree></TreeItem></Tree></AccordionPanel></AccordionItem></Accordion>
        <Skeleton aria-label="Loading example"><SkeletonItem /><SkeletonItem /></Skeleton>
      </main>
    </div>
  </NidecProvider>;
}
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? {styleElementAttributes: {nonce}} : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><App /></RendererProvider>);
