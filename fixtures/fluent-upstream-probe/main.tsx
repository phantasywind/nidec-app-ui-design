import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, FluentProvider, webLightTheme, RendererProvider, createDOMRenderer,
  Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components';

// Upstream-only diagnostic: no shared-package imports, styles or aliases.
const root = document.getElementById('root');
if (!root) throw new Error('Missing root');
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? {styleElementAttributes:{nonce}} : {});
createRoot(root).render(<StrictMode><RendererProvider renderer={renderer}>
  <main><h1>Upstream Fluent focus reproduction — not a brand design</h1>
    <FluentProvider theme={webLightTheme}>
      <p><Button id="action" type="button">Test action</Button></p>
      <Dialog>
        <DialogTrigger disableButtonEnhancement><Button type="button">Open dialog</Button></DialogTrigger>
        <DialogSurface><DialogBody>
          <DialogTitle>Upstream dialog</DialogTitle>
          <DialogContent>Focus must remain inside this modal.</DialogContent>
          <DialogActions><DialogTrigger disableButtonEnhancement><Button type="button">Close dialog</Button></DialogTrigger></DialogActions>
        </DialogBody></DialogSurface>
      </Dialog>
    </FluentProvider>
  </main>
</RendererProvider></StrictMode>);
