import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@phantasywind/nidec-app-ui-design/tokens.css';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './site.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
