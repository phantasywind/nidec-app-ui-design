import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDOMRenderer, RendererProvider } from '@fluentui/react-components';
import {
  Avatar, AvatarGroup, AvatarGroupItem, Divider, InfoLabel, Label,
  Button, NidecProvider, Persona, Popover, PopoverSurface, PopoverTrigger,
  SearchBox, Slider, SpinButton, Tag, TagGroup,
  nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './region.css';

function App() {
  const [query, setQuery] = useState('');
  return <NidecProvider theme={nidecLightTheme} className="common-fixture">
    <header>
      <div><h1>Common content and controls</h1><p>Neutral Fluent foundations; application meaning remains outside the package.</p></div>
      <Persona name="Example User" secondaryText="Example role" avatar={{ color: 'colorful' }} />
    </header>
    <Divider />
    <main>
      <section aria-labelledby="discovery-heading">
        <h2 id="discovery-heading">Discovery and values</h2>
        <Label htmlFor="record-search">Search</Label>
        <SearchBox id="record-search" value={query} onChange={(_, data) => setQuery(data.value)} placeholder="Find records" />
        <div className="field-row">
          <div><InfoLabel info="Consumer defines units and validation.">Quantity</InfoLabel><SpinButton defaultValue={1} min={0} aria-label="Quantity" /></div>
          <div><Label htmlFor="completion">Completion</Label><Slider id="completion" defaultValue={50} /></div>
        </div>
      </section>
      <section aria-labelledby="identity-heading">
        <h2 id="identity-heading">Identity and classification</h2>
        <AvatarGroup layout="spread"><AvatarGroupItem name="Example A" /><AvatarGroupItem name="Example B" /><AvatarGroupItem name="Example C" /></AvatarGroup>
        <div className="tag-row"><TagGroup aria-label="Example tags"><Tag value="priority">Priority</Tag><Tag value="internal">Internal</Tag></TagGroup><Avatar name="Example User" /></div>
      </section>
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading">Actions and disclosure</h2>
        <div className="action-row">
          <Button appearance="primary">Submit</Button>
          <Button appearance="attention">Return</Button>
          <Button>Export</Button>
          <Popover positioning="below-start">
            <PopoverTrigger><button type="button">Details</button></PopoverTrigger>
            <PopoverSurface>Consumer-owned contextual content.</PopoverSurface>
          </Popover>
        </div>
      </section>
    </main>
  </NidecProvider>;
}

const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? {styleElementAttributes: {nonce}} : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><App /></RendererProvider>);
