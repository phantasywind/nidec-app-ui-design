import * as designSystem from '@phantasywind/nidec-app-ui-design';
import { Button } from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/tokens.css';
import '@phantasywind/nidec-app-ui-design/styles.css';
import tokens from '@phantasywind/nidec-app-ui-design/tokens.json';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

if (Object.keys(designSystem).join(',') !== 'Button') {
  throw new Error('Only the approved Button runtime export is permitted.');
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Fixture root is missing.');
}

function ButtonDemo() {
  const [clicks, setClicks] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [disabledClicks, setDisabledClicks] = useState(0);
  return <main data-nidec-ui data-token-count={tokens.tokens.length}>
    <h1>Button functional fixture — not approved brand design</h1>
    <form onSubmit={event => { event.preventDefault(); setSubmits(count => count + 1); }}>
      <Button onClick={() => setClicks(count => count + 1)}>Test action</Button>
      <Button disabled onClick={() => setDisabledClicks(count => count + 1)}>Disabled action</Button>
      <Button type="submit">Explicit submit</Button>
    </form>
    <p role="status">Clicks: {clicks}; Submits: {submits}; Disabled clicks: {disabledClicks}</p>
  </main>;
}

createRoot(root).render(
  <StrictMode>
    <ButtonDemo />
  </StrictMode>,
);
