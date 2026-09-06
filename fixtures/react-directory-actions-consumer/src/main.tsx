import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RendererProvider, createDOMRenderer } from '@fluentui/react-components';
import { NidecProvider, nidecLightTheme, Button, IconButton, Tooltip, Link, TabList, Tab,
  Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuDivider,
  Combobox, Option, Field, Subtitle2, Body1 } from '@phantasywind/nidec-app-ui-design';
import './layout.css';
// Host-only test markers exclude old control rules; they add no replacement skin.
const isolateHost=new URLSearchParams(location.search).has('isolation');
function Demo() {
  const [count,setCount]=useState(0);
  const [tab,setTab]=useState<string | number>('first');
  const [value,setValue]=useState('');
  const [selected,setSelected]=useState<string[]>([]);
  return <NidecProvider theme={nidecLightTheme}><main className="directory-demo">
    <Subtitle2 as="h1">Directory actions</Subtitle2>
    <Body1>Local simulation only. No business API, authentication or persistence.</Body1>
    <div className="directory-demo-actions">
      <Tooltip content="Run a local example action" relationship="description">
        <IconButton aria-label="Edit example" icon={<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M4 14 13 5l2 2-9 9H4v-2Z" fill="currentColor" /></svg>} onClick={()=>setCount(n=>n+1)} />
      </Tooltip>
      <Menu><MenuTrigger disableButtonEnhancement><Button>More actions</Button></MenuTrigger>
        <MenuPopover><MenuList><MenuItem onClick={()=>setCount(n=>n+1)}>Run example</MenuItem><MenuDivider /><MenuItem disabled>Unavailable example</MenuItem></MenuList></MenuPopover>
      </Menu>
      <Link href="#results">View local result</Link>
    </div>
    <TabList aria-label="Example views" selectedValue={tab} onTabSelect={(_,data)=>{if(data.value==='first'||data.value==='second')setTab(data.value);}}>
      <Tab className={isolateHost?'nidec-ui-button':undefined} id="first-tab" aria-controls="first-panel" value="first">First view</Tab><Tab className={isolateHost?'nidec-ui-button':undefined} id="second-tab" aria-controls="second-panel" value="second">Second view</Tab>
    </TabList>
    <section role="tabpanel" id={tab==='first'?'first-panel':'second-panel'} aria-labelledby={tab==='first'?'first-tab':'second-tab'}>{tab==='first'?'First example content':'Second example content'}</section>
    <Field label="Choose an example" hint="Selection and editable text retain the upstream events.">
      <Combobox {...(isolateHost?{input:{className:'cpq-nidec-native-control'}}:{})} value={value} selectedOptions={selected} onChange={event=>setValue(event.target.value)} onOptionSelect={(_,data)=>{setSelected(data.selectedOptions);setValue(data.optionText??'');}}>
        <Option value="alpha" text="Alpha">Alpha</Option><Option value="beta" text="Beta">Beta</Option>
      </Combobox>
    </Field>
    <output id="results" aria-label="Local actions">Local actions: {count}</output>
  </main></NidecProvider>;
}
const nonce=document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer=createDOMRenderer(document,nonce?{styleElementAttributes:{nonce}}:{});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><Demo /></RendererProvider>);
