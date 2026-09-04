import '@phantasywind/nidec-app-ui-design/tokens.css';
import '@phantasywind/nidec-app-ui-design/styles.css';
import tokens from '@phantasywind/nidec-app-ui-design/tokens.json';

const host = document.querySelector('[data-nidec-ui]');

if (!(host instanceof HTMLElement)) {
  throw new Error('Fixture host is missing.');
}

host.dataset.tokenCount = String(tokens.tokens.length);
