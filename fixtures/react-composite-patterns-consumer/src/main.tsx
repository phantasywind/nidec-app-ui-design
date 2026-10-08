import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDOMRenderer, RendererProvider } from '@fluentui/react-components';
import { GridRegular, ListRegular } from '@fluentui/react-icons';
import { NidecProvider, nidecLightTheme, PageHeader, Link, SearchBox } from '@phantasywind/nidec-app-ui-design';
import { ApplicationFrame, ApplicationTopBar, ApplicationNavigation, ApplicationNavigationGroup, ApplicationNavigationItem } from '@phantasywind/nidec-app-ui-design/layouts';
import { catalog, groups, resolveView, type CatalogEntry } from './catalog';
import { MaterialDemo, DirectorySamplePage, EditableGridSamplePage, GroupedTableSamplePage, MasterDataFormListPage, RecordWorkspacePage, GovernanceSamplePage } from './demos';
import { SelectionDemo, NumberDemo, HintDemo, OverlayDemo, BreadcrumbDemo, HeaderDemo, TabsDemo, ShellDemo, LayoutDemo, LoginDemo, CompleteFormPage } from './component-pages';
import { TableAndGridDemo, CardsDemo } from './component-pages';
import demoSource from './demos.tsx?raw';
import componentSource from './component-pages.tsx?raw';
import adoptionGuide from '../../../docs/consumer-ui-adoption.md?raw';
import usageSource from './usage-examples.tsx?raw';
import layoutSource from './region.css?raw';
import '@phantasywind/nidec-app-ui-design/styles.css';
import './region.css';
const custom = { select: SelectionDemo, number: NumberDemo, hints: HintDemo, overlays: OverlayDemo, breadcrumb: BreadcrumbDemo, header: HeaderDemo, tabs: TabsDemo, shell: ShellDemo, layout: LayoutDemo, login: LoginDemo, form: CompleteFormPage, directory: DirectorySamplePage, toolbar: DirectorySamplePage, 'editable-grid': EditableGridSamplePage, 'grouped-table': GroupedTableSamplePage, 'master-data': MasterDataFormListPage, record: RecordWorkspacePage, governance: GovernanceSamplePage };
const names: Record<string,string> = {select:'SelectionDemo',number:'NumberDemo',hints:'HintDemo',overlays:'OverlayDemo',breadcrumb:'BreadcrumbDemo',header:'HeaderDemo',tabs:'TabsDemo',shell:'ShellDemo',layout:'LayoutDemo',login:'LoginDemo',form:'CompleteFormPage',directory:'DirectorySamplePage',toolbar:'DirectorySamplePage','editable-grid':'EditableGridSamplePage','grouped-table':'GroupedTableSamplePage','master-data':'MasterDataFormListPage',record:'RecordWorkspacePage',governance:'GovernanceSamplePage'};
function sourceFor(entry: CatalogEntry) {
  const name = entry.id==='table' ? 'TableAndGridDemo' : entry.id==='cards' ? 'CardsDemo' : names[entry.demo];
  if (name) { const source = componentSource.includes('function '+name+'(') ? componentSource : demoSource; const start = source.indexOf('function '+name+'('); return source.slice(start, source.indexOf('\n}\n',start)+2); }
  const start = demoSource.indexOf('<Specimen title="'+entry.demo+'"');
  return demoSource.slice(start, demoSource.indexOf('</Specimen>',start)+11);
}
function DocumentationPage({entry}: {entry: CatalogEntry}) {
  const Component = entry.id==='table' ? TableAndGridDemo : entry.id==='cards' ? CardsDemo : custom[entry.demo as keyof typeof custom];
  const usageNames: Record<string,string> = {text:'Text',date:'Date',choice:'Choice',select:'Select',number:'Number',actions:'Action',modes:'Mode',feedback:'Feedback',hints:'Hint',overlays:'Overlay',shell:'Shell',breadcrumb:'Breadcrumb',header:'Header',layout:'Layout',tabs:'Tabs',toolbar:'Toolbar',collection:'Collection',table:'Table',cards:'Cards',stage:'Stage',bpf:'Bpf','editable-grid':'Editable','grouped-table':'Grouped'};
  const usage = usageSource.split('\n').find(line=>line.startsWith('export function '+usageNames[entry.id]+'Usage('));
  const ownsHeading = ['login', 'header', 'form', 'directory', 'toolbar', 'editable-grid', 'grouped-table', 'master-data', 'record', 'governance'].includes(entry.demo);
  return <>{ownsHeading ? <header className="catalog-guide catalog-guide--single"><h2>{entry.group} / {entry.title}</h2><p>{entry.components}</p></header> : <PageHeader eyebrow={entry.group+' / Local candidate preview'} title={entry.title} description={entry.components} />}
  <section className="catalog-guide" aria-label="Usage guide"><div><h2>Recommended use</h2><p>{entry.use}</p></div><div><h2>Selection and boundaries</h2><p>{entry.guidance}</p></div><div><h2>Application responsibilities</h2><p>Data, permissions, business validation, routing and persistence. Examples use synthetic in-memory data only.</p></div></section>
  <section className="catalog-live" aria-label="Interactive preview">{Component ? <Component /> : <MaterialDemo title={entry.demo} />}</section>
  {entry.group === 'Forms' && <section className="catalog-guide catalog-guide--single"><h2>Width and layout</h2><p>Component size controls height and typography, not page width. Keep short choices and dates bounded; use a narrower field for quantities. Names and long selections can fill a bounded form column. Multiline notes may fill the form region. Ordinary actions remain content-sized.</p><p>These are preview-owned container styles, not shared package defaults. Copy the required layout with the JSX; check parent Grid/Flex stretching and legacy width rules.</p><pre><code>{layoutSource.split('\n').filter(line => /^(\.compact-choice-field|\.bounded-text-fields|\.catalog-live \.form-grid|\.catalog-live \.number-field|\.form-grid \{|\.button-cluster \{)/.test(line)).join('\n') + '\n@media (max-width: 720px) { .form-grid { grid-template-columns: minmax(0, 1fr); } }'}</code></pre></section>}
  {usage && <section className="catalog-guide catalog-guide--single"><h2>Minimal usage</h2><p>Import components from the shared package and useState from React; use /date-picker for dates and /layouts for layouts. Examples are typechecked. Wrap the application in NidecProvider and import styles.css.</p><pre><code>{usage}</code></pre></section>}
  <section className="catalog-guide catalog-guide--single"><details><summary>Application adoption and legacy UI replacement</summary><pre>{adoptionGuide}</pre></details><h2>Usage notes</h2><p>Use supported sizes and disabled, read-only, error and loading states. Keep ordinary buttons content-sized. Remove legacy skins, global typography overrides and unintended container stretching.</p><p>This local candidate includes unpublished typography, compact sizing and Dropdown changes. The published version is rc.4; the npm package does not include the full docs.</p><Link href={'?view='+entry.related}>Related example: {catalog.find(item=>item.id===entry.related)?.title}</Link><details><summary>View running demo source</summary><p>Import components from the root, layouts from /layouts and dates from /date-picker. These excerpts come directly from the running demo; see the same file for state and data.</p><pre><code>{sourceFor(entry)}</code></pre></details><p><Link href="https://github.com/phantasywind/nidec-app-ui-design/tree/v0.1.0-rc.4/docs">Published rc.4 documentation</Link> · Local: docs/component-catalog.md、docs/consumer-ui-adoption.md</p></section></>;
}
function ShowcaseApp() {
  const [view,setView]=useState(()=>resolveView(new URLSearchParams(location.search).get('view')));
  const [navigationOpen,setNavigationOpen]=useState(false);
  const [filter,setFilter]=useState('');
  useEffect(()=>{const update=()=>setView(resolveView(new URLSearchParams(location.search).get('view')));addEventListener('popstate',update);return()=>removeEventListener('popstate',update);},[]);
  const navigate=(id:string)=>{history.pushState({},'','?view='+id);setView(id);setNavigationOpen(false);window.scrollTo(0,0);};
  const active=catalog.find(item=>item.id===view)!;
  const navigation=<ApplicationNavigation aria-label="Components and examples"><div className="catalog-search"><SearchBox aria-label="Find components" value={filter} onChange={(_,data)=>setFilter(data.value)} placeholder="Find components" /></div>{groups.map(group=><details className="catalog-nav-group" key={group} open={group===active.group||Boolean(filter)}><summary>{group}</summary><ApplicationNavigationGroup label={group}>{catalog.filter(item=>item.group===group&&(item.title+item.components).toLowerCase().includes(filter.toLowerCase())).map(item=><ApplicationNavigationItem key={item.id} current={view===item.id} href={'?view='+item.id} label={item.title} icon={<GridRegular />} onClick={event=>{event.preventDefault();navigate(item.id);}} />)}</ApplicationNavigationGroup></details>)}</ApplicationNavigation>;
  return <NidecProvider theme={nidecLightTheme}><ApplicationFrame aria-label="Nidec UI Components and examples" brand={<div className="showcase-brand"><span aria-hidden="true">N</span><div><strong>Nidec UI</strong><small>Components and page usage guide</small></div></div>} compactBrand={<span>N</span>} topBar={<ApplicationTopBar location={<span>{active.group} / {active.title}</span>} utilities={<span>Local candidate · Unpublished</span>} />} navigation={navigation} navigationOpen={navigationOpen} navigationToggleIcon={<ListRegular />} navigationToggleLabel="Open navigation" navigationCloseLabel="Close navigation" onNavigationOpenChange={setNavigationOpen}><div className="showcase-content"><DocumentationPage key={active.id} entry={active} /></div></ApplicationFrame></NidecProvider>;
}
const nonce=document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
const renderer=createDOMRenderer(document,nonce?{styleElementAttributes:{nonce}}:{});
createRoot(document.getElementById('root')!).render(<RendererProvider renderer={renderer}><ShowcaseApp /></RendererProvider>);
