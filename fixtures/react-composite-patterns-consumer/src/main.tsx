import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDOMRenderer, RendererProvider } from '@fluentui/react-components';
import {
  Button, CardGallery, CardGalleryItem, CardHeader, Checkbox, CollectionList, CollectionListItem,
  NidecProvider, ProcessStageIndicator, Tag, nidecLightTheme,
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

const stages = [
  { id: 'prepare', label: 'Prepare', description: 'Example completed step', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'Review', description: 'Example current step', status: 'current', statusLabel: 'Current stage' },
  { id: 'confirm', label: 'Confirm', description: 'Consumer decides whether this can activate', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'release', label: 'Release', description: 'Example unavailable step', status: 'upcoming', statusLabel: 'Upcoming and unavailable', disabled: true },
] as const;

function App() {
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>(['alpha']);
  const [lastAction, setLastAction] = useState('No stage activated');
  return <NidecProvider theme={nidecLightTheme} className="composite-fixture">
    <header className="page-header">
      <div><p className="eyebrow">Shared composite patterns</p><h1>Collections, galleries, and process stages</h1></div>
      <p>Fluent owns control behavior and states; the shared package governs reusable composition.</p>
    </header>
    <main>
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

      <section aria-labelledby="process-heading">
        <div className="section-heading"><div><h2 id="process-heading">Process Stage Indicator</h2><p>Presentation only; transition rules and permissions stay in the consumer.</p></div><Tag appearance="outline">Responsive</Tag></div>
        <ProcessStageIndicator
          aria-label="Example process"
          stages={stages}
          onStageSelect={(_, stage) => setLastAction(`Activated ${stage.label}`)}
        />
        <p className="stage-result" aria-live="polite">{lastAction}</p>
      </section>
    </main>
  </NidecProvider>;
}

const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? { styleElementAttributes: { nonce } } : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><App /></RendererProvider>);
