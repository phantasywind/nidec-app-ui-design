import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RendererProvider, createDOMRenderer } from '@fluentui/react-components';
import { Button, NidecProvider, Input, Field, Textarea, Select, Checkbox, RadioGroup, Radio, Switch,
  Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@phantasywind/nidec-app-ui-design';
import { demoLightTheme, demoDarkTheme } from './themes';
import './palette.css';
import './demo.css';

function FormBatch() {
  const [notes, setNotes] = useState('');
  const [density, setDensity] = useState('comfortable');
  const [checked, setChecked] = useState<boolean | 'mixed'>('mixed');
  const [layout, setLayout] = useState('stacked');
  const [enabled, setEnabled] = useState(false);
  const [submits, setSubmits] = useState(0);
  const [disabledEvents, setDisabledEvents] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const values = {notes, density, checked, layout, enabled, submits, disabledEvents};
  return <main className="batch-demo">
    <header><p className="batch-eyebrow">SHARED UI / FORM COMPONENTS / BATCH 01</p>
      <h1>Everyday form controls</h1>
      <p>Official Fluent themes · not an approved Nidec brand design. Local demo only; no business API or saving.</p>
    </header>
    <div className="batch-columns">
      <NidecProvider theme={demoLightTheme} id="batch-light" className="batch-panel">
        <h2>Interactive composition</h2><p>Five control families, one shared contract.</p>
        <form className="batch-form" onSubmit={event => {event.preventDefault(); setSubmits(value => value + 1);}}>
          <Field label="Short label" hint="Existing Input retained for comparison"><Input name="shortLabel" placeholder="Example label" /></Field>
          <Field label="Notes" hint="Multiline text; no business-required rule"><Textarea ref={node=>{textareaRef.current=node;}} name="notes" rows={3} resize="vertical" value={notes} onChange={(_event,data)=>setNotes(data.value)} /></Field>
          <Field label="Display density"><Select name="density" value={density} onChange={(_event,data)=>setDensity(data.value)}>
            <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
          </Select></Field>
          <Checkbox name="helperText" label="Show helper text" checked={checked} onChange={(_event,data)=>setChecked(data.checked)} />
          <Field label="Layout"><RadioGroup name="layout" value={layout} onChange={(_event,data)=>setLayout(data.value)} layout="horizontal">
            <Radio value="stacked" label="Stacked" /><Radio value="columns" label="Columns" />
          </RadioGroup></Field>
          <Switch name="highlights" label="Preview highlights" checked={enabled} onChange={(_event,data)=>setEnabled(data.checked)} />
          <div className="batch-actions"><Button onClick={()=>textareaRef.current?.focus()}>Focus notes via ref</Button>
            <Button type="submit">Submit demo</Button>
            <Dialog><DialogTrigger disableButtonEnhancement><Button>Review values</Button></DialogTrigger>
              <DialogSurface><DialogBody><DialogTitle>Current demo values</DialogTitle><DialogContent>
                <p>This dialog uses the same theme through its portal.</p><pre>{JSON.stringify(values,null,2)}</pre>
                <Field label="Dialog notes"><Textarea defaultValue="Independent dialog text" /></Field>
                <Checkbox label="Dialog checkbox" />
              </DialogContent><DialogActions><DialogTrigger disableButtonEnhancement><Button>Close review</Button></DialogTrigger></DialogActions></DialogBody></DialogSurface>
            </Dialog></div>
        </form>
        <h3>Live state</h3><output id="batch-state" aria-label="Demo state">{JSON.stringify(values)}</output>
      </NidecProvider>
      <div className="batch-side">
        <NidecProvider theme={demoLightTheme} id="batch-states" className="batch-panel">
          <h2>State examples</h2><div className="batch-form">
            <Field label="Read-only notes"><Textarea readOnly value="This text remains selectable." /></Field>
            <Field label="Disabled notes"><Textarea disabled value="Disabled example" onChange={()=>setDisabledEvents(value=>value+1)} /></Field>
            <Field label="Disabled density"><Select disabled defaultValue="compact" onChange={()=>setDisabledEvents(value=>value+1)}><option value="compact">Compact</option></Select></Field>
            <Checkbox disabled label="Disabled checkbox" onChange={()=>setDisabledEvents(value=>value+1)} />
            <RadioGroup disabled name="disabled-layout" aria-label="Disabled layout"><Radio value="fixed" label="Disabled radio" onChange={()=>setDisabledEvents(value=>value+1)} /></RadioGroup>
            <Switch disabled label="Disabled switch" onChange={()=>setDisabledEvents(value=>value+1)} />
            <Field label="Error example" validationState="error" validationMessage="Demonstration message only, not a business rule"><Textarea /></Field>
          </div>
        </NidecProvider>
        <NidecProvider theme={demoDarkTheme} id="batch-dark" className="batch-panel">
          <h2>Independent dark theme</h2><div className="batch-form">
            <Field label="Dark notes"><Textarea placeholder="Theme contrast example" /></Field>
            <Field label="Dark density"><Select><option>Comfortable</option><option>Compact</option></Select></Field>
            <Checkbox label="Dark checkbox" defaultChecked /><Switch label="Dark switch" defaultChecked />
          </div>
        </NidecProvider>
      </div>
    </div>
    <footer><button id="batch-outside" type="button">Outside Provider control</button><span>Consumers retain business rules, theme approval and acceptance.</span></footer>
  </main>;
}

const root=document.getElementById('root');
if (!root) throw new Error('Missing fixture root');
const nonce=document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer=createDOMRenderer(document,nonce?{styleElementAttributes:{nonce}}:{});
createRoot(root).render(<StrictMode><RendererProvider renderer={renderer}><FormBatch /></RendererProvider></StrictMode>);
