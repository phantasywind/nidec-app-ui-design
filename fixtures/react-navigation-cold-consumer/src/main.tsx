import { createRoot } from 'react-dom/client';
import {
  AppItemStatic, Hamburger, Nav, NavDrawer, NavDrawerBody, NavDrawerHeader,
  NavItem, NidecProvider, nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import '@phantasywind/nidec-app-ui-design/styles.css';

function App() {
  return <NidecProvider theme={nidecLightTheme}>
    <NavDrawer open type="inline" aria-label="Cold navigation contract">
      <NavDrawerHeader><AppItemStatic icon={<Hamburger aria-label="Menu" />}>Example application</AppItemStatic></NavDrawerHeader>
      <NavDrawerBody>
        <Nav aria-label="Primary navigation" selectedValue="home">
          <NavItem value="home">Home</NavItem>
          <NavItem value="records">Records</NavItem>
        </Nav>
      </NavDrawerBody>
    </NavDrawer>
  </NidecProvider>;
}

createRoot(document.getElementById('root')!).render(<App />);
