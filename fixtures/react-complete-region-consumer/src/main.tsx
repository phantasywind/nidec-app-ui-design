import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useRestoreFocusTarget, RendererProvider, createDOMRenderer } from '@fluentui/react-components';
import { Button, NidecProvider, nidecLightTheme, Input, Field, Textarea, Select, Checkbox,
  OverlayDrawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, DrawerFooter,
  MessageBar, MessageBarBody, MessageBarTitle, Body1, Caption1, Subtitle2,
  Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@phantasywind/nidec-app-ui-design';
import './region.css';

function Demo() {
  // Consumer-test boundary only; this marker is not part of the shared API.
  const nativeSlot = new URLSearchParams(location.search).has('isolation') ? { className: 'cpq-nidec-native-control' } : {};
  const restoreFocusTarget = useRestoreFocusTarget();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Example');
  const [notes, setNotes] = useState('');
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(0);
  return <NidecProvider theme={nidecLightTheme} className="region-host">
    <main className="region-main">
      <Subtitle2 as="h1">Complete form region</Subtitle2>
      <Body1>No business API, authentication, persistence or production data.</Body1>
      <Caption1>Shared candidate · ordinary text, labels, feedback, actions and right-side drawer use Fluent.</Caption1>
      <div className="region-actions"><Button {...restoreFocusTarget} appearance="primary" onClick={() => setOpen(true)}>Open editor</Button></div>
      <output aria-label="Local submissions">Local submissions: {submitted}</output>
      <Dialog><DialogTrigger disableButtonEnhancement><Button>Open confirmation</Button></DialogTrigger>
        <DialogSurface><DialogBody><DialogTitle>Confirm local action</DialogTitle><DialogContent>No business action will run.</DialogContent>
          <DialogActions><DialogTrigger disableButtonEnhancement><Button>Cancel</Button></DialogTrigger></DialogActions>
        </DialogBody></DialogSurface>
      </Dialog>
    </main>
    <OverlayDrawer open={open} onOpenChange={(_, data) => setOpen(data.open)} position="end" size="medium" modalType="modal" aria-labelledby="editor-title">
      <DrawerHeader><DrawerHeaderTitle id="editor-title" action={<Button onClick={() => setOpen(false)}>Close</Button>}>Edit example</DrawerHeaderTitle></DrawerHeader>
      <DrawerBody>
        <form id="region-form" className="region-form" onSubmit={event => { event.preventDefault(); setSubmitted(value => value + 1); }}>
          <MessageBar intent="info"><MessageBarBody><MessageBarTitle>Local demonstration</MessageBarTitle>Input values remain in this page only.</MessageBarBody></MessageBar>
          <Field label="Name" hint="Ordinary single-line Fluent Input"><Input input={nativeSlot} size="medium" value={name} onChange={(_, data) => setName(data.value)} /></Field>
          <Field label="Notes" hint="Multiline Fluent Textarea"><Textarea textarea={nativeSlot} size="medium" rows={3} value={notes} onChange={(_, data) => setNotes(data.value)} /></Field>
          <Field label="Category"><Select select={nativeSlot} size="medium"><option>Example A</option><option>Example B</option></Select></Field>
          <Field label="Read-only value"><Input input={nativeSlot} value="Reference" readOnly /></Field>
          <Field label="Disabled value"><Input input={nativeSlot} value="Unavailable" disabled /></Field>
          <Field label="Validation example" validationState="error" validationMessage="Example message, not a business rule"><Input input={nativeSlot} defaultValue="Review this value" /></Field>
          <Checkbox input={nativeSlot} label="Local option" checked={checked} onChange={(_, data) => setChecked(data.checked === true)} />
          <Caption1>Default typography and medium controls are demonstration choices, not a frozen application-wide density policy.</Caption1>
        </form>
      </DrawerBody>
      <DrawerFooter><Button appearance="primary" type="submit" form="region-form">Save locally</Button><Button onClick={() => setOpen(false)}>Cancel</Button></DrawerFooter>
    </OverlayDrawer>
  </NidecProvider>;
}
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer = createDOMRenderer(document, nonce ? { styleElementAttributes: { nonce } } : {});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><Demo /></RendererProvider>);
