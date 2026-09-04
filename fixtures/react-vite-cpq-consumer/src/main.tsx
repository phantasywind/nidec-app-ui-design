import { Button, NidecProvider, Input, Field, Dialog, DialogTrigger, DialogSurface,
  DialogBody, DialogTitle, DialogContent, DialogActions } from '@phantasywind/nidec-app-ui-design';
import { webLightTheme, webDarkTheme, createDOMRenderer, RendererProvider } from '@fluentui/react-components';
import '@phantasywind/nidec-app-ui-design/tokens.css';
import '@phantasywind/nidec-app-ui-design/styles.css';
import tokens from '@phantasywind/nidec-app-ui-design/tokens.json';
import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Fixture root is missing.');
}

function ButtonDemo() {
  const [clicks, setClicks] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [disabledClicks, setDisabledClicks] = useState(0);
  const [text, setText] = useState('');
  const ref = useRef<HTMLButtonElement>(null);
  return <main data-token-count={tokens.tokens.length}>
    <h1>Fluent functional fixture — not approved Nidec brand design</h1>
    <p><button id="outside-control" type="button">Outside theme control</button></p>
    <NidecProvider theme={webLightTheme} id="light-provider">
    <form onSubmit={event => { event.preventDefault(); setSubmits(count => count + 1); }}>
      <Button ref={ref} id="action" onClick={() => setClicks(count => count + 1)}>Test action</Button>
      <Button disabled onClick={() => setDisabledClicks(count => count + 1)}>Disabled action</Button>
      <Button type="submit">Explicit submit</Button>
    </form>
    <p role="status">Clicks: {clicks}; Submits: {submits}; Disabled clicks: {disabledClicks}</p>
    <button type="button" onClick={() => ref.current?.focus()}>Focus action via ref</button>
    <Field label="Example value" validationState="error" validationMessage="Example error, not a business rule">
      <Input value={text} onChange={(_event, data) => setText(data.value)} />
    </Field>
    <output aria-label="Current value">{text}</output>
    <Field label="Disabled value"><Input disabled value="Disabled" /></Field>
    <Field label="Read-only value"><Input readOnly value="Read only" /></Field>
    <Dialog>
      <DialogTrigger disableButtonEnhancement><Button>Open light dialog</Button></DialogTrigger>
      <DialogSurface><DialogBody>
        <DialogTitle>Light dialog</DialogTitle>
        <DialogContent><Field label="Dialog value"><Input /></Field></DialogContent>
        <DialogActions><DialogTrigger disableButtonEnhancement><Button>Close light dialog</Button></DialogTrigger></DialogActions>
      </DialogBody></DialogSurface>
    </Dialog>
    </NidecProvider>
    <NidecProvider theme={webDarkTheme} id="dark-provider">
      <Button>Dark action</Button>
      <Dialog>
        <DialogTrigger disableButtonEnhancement><Button>Open dark dialog</Button></DialogTrigger>
        <DialogSurface><DialogBody>
          <DialogTitle>Dark dialog</DialogTitle>
          <DialogContent>Theme must survive portal placement.</DialogContent>
          <DialogActions><DialogTrigger disableButtonEnhancement><Button>Close dark dialog</Button></DialogTrigger></DialogActions>
        </DialogBody></DialogSurface>
      </Dialog>
    </NidecProvider>
  </main>;
}

// Test-server nonce is response-specific. No unsafe-inline fallback or app CSP change.
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? { styleElementAttributes:{ nonce } } : {});
createRoot(root).render(
  <StrictMode>
    <RendererProvider renderer={renderer}>
    <ButtonDemo />
    </RendererProvider>
  </StrictMode>,
);
