import * as designSystem from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/tokens.css';
import '@phantasywind/nidec-app-ui-design/styles.css';
import tokens from '@phantasywind/nidec-app-ui-design/tokens.json';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

if (Object.keys(designSystem).length !== 0) {
  throw new Error('Stage 3E expects the React public API to remain empty.');
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Fixture root is missing.');
}

createRoot(root).render(
  <StrictMode>
    <main data-nidec-ui data-token-count={tokens.tokens.length}>
      CPQ-compatible React consumer fixture
    </main>
  </StrictMode>,
);
