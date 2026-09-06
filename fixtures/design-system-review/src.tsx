import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import * as Old from '@cpq/design-system/controls';
import { FormField, Sheet } from '@cpq/design-system/forms';
import { DirectoryScopeTabs, Combobox } from '@cpq/design-system/directory';
import { LoadingState, InlineDiagnostics } from '@cpq/design-system/feedback';
import { DesignSystemGallery } from '@cpq/design-system/DesignSystemGallery';
import * as New from '@cpq/integrations/nidec-ui/NidecFormControls';
import { NidecFormSurface } from '@cpq/integrations/nidec-ui/NidecFormSurface';
import { NidecDirectoryTabs, NidecCustomerCombobox, NidecIconButton as NidecDirectoryIconButton } from '@cpq/integrations/nidec-ui/NidecDirectoryControls';
import { NidecDrawer } from '@cpq/integrations/nidec-ui/NidecDrawer';
import catalog from '@cpq/design-system/component-catalog.json';
import '@cpq/styles/tokens.css';
import '@cpq/styles/layout.css';
import '@cpq/styles/components.css';
import '@cpq/styles/pages.css';
import '@cpq/design-system/styles.css';
import './review.css';

const params = new URLSearchParams(location.search);
const side = params.get('side');
const groups = [ ['forms','01 · 表单与输入'], ['actions','02 · 按钮与反馈'], ['directory','03 · 目录选择与检索'], ['overlay','04 · Sheet / Drawer'] ];
const options = [{value:'all',label:'All enquiries'},{value:'mine',label:'My enquiries'},{value:'closed',label:'Closed history'}];
const customers = [{value:'nidec',label:'Nidec demo',description:'Synthetic customer A'},{value:'sample',label:'Sample customer',description:'Synthetic customer B'}];

function Specimens({modern,section}:{modern:boolean;section:string}) {
 const [value,setValue]=useState('Nidec demonstration'); const [choice,setChoice]=useState('all'); const [note,setNote]=useState('Review only. No business data.'); const [checked,setChecked]=useState(true); const [customer,setCustomer]=useState(''); const [open,setOpen]=useState(false); const [count,setCount]=useState(0);
 const Btn=modern?New.NidecButton:Old.Button; const Field=modern?New.NidecField:FormField;
 const input=(props:any={})=>modern?<New.NidecInput value={value} onValueChange={setValue} {...props}/>:<Old.Input value={value} onChange={e=>setValue(e.target.value)} {...props}/>;
 let content;
 if(section==='forms') content=<>
  <Field label="Name" hint="Editable · 输入内容可修改">{input()}</Field>
  <Field label="Search">{input({type:'search',placeholder:'Search enquiries'})}</Field>
  <Field label="Scope">{modern?<New.NidecSelect value={choice} onValueChange={setChoice}>{options.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</New.NidecSelect>:<Old.Select value={choice} onChange={e=>setChoice(e.target.value)}>{options.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</Old.Select>}</Field>
  <Field label="Notes">{modern?<New.NidecTextarea value={note} onValueChange={setNote}/>:<Old.Textarea value={note} onChange={e=>setNote(e.target.value)}/>}</Field>
  <Field label="Error example" error="Demonstration error — not a business rule">{input({'aria-label':'Error example'})}</Field>
  <Field label="Read only">{input({readOnly:true})}</Field>
  <Field label="Disabled">{input({disabled:true})}</Field>
  {modern?<New.NidecCheckbox label="Include inactive" checked={checked} onCheckedChange={setChecked}/>:<Old.Checkbox label="Include inactive" checked={checked} onChange={e=>setChecked(e.target.checked)}/>}
 </>;
 else if(section==='actions') content=<>
  <div className="review-row"><Btn variant="primary" type="button" onClick={()=>setCount(count+1)}>Save demo</Btn><Btn type="button" onClick={()=>setCount(count+1)}>Cancel demo</Btn><Btn variant="ghost" type="button">More</Btn><Btn variant="danger" type="button">Delete demo</Btn></div>
  <div className="review-row"><Btn disabled type="button">Disabled</Btn><Btn loading type="button">Working</Btn>{modern?<NidecDirectoryIconButton aria-label="Edit demo" icon={<Pencil size={16}/>} onClick={()=>setCount(count+1)}/>:<Old.IconButton label="Edit demo" onClick={()=>setCount(count+1)}><Pencil size={16}/></Old.IconButton>}</div>
  <p role="status">Local action count: {count} · no save / POST</p>
  {modern?<New.NidecMessage tone="warning" title="Review notice">Synthetic content. No business action.</New.NidecMessage>:<InlineDiagnostics tone="warning" title="Review notice">Synthetic content. No business action.</InlineDiagnostics>}
  {modern?<New.NidecLoading label="Loading demo"/>:<LoadingState label="Loading demo"/>}
  <p className="review-note">LoadingState 的骨架行与 Spinner 是两种不同的加载表达；右侧不是旧骨架的等价替换声明。</p>
 </>;
 else if(section==='directory') content=<>
  {modern?<NidecDirectoryTabs items={options} value={choice} onChange={setChoice} label="Scope" controls="results"/>:<DirectoryScopeTabs items={options} value={choice} onChange={setChoice} label="Scope"/>}
  <div id="results">Selected: {choice}</div>
  <Field label="Customer">{modern?<NidecCustomerCombobox label="Customer" value={customer} options={customers} onChange={setCustomer} placeholder="Find customer"/>:<Combobox label="Customer" value={customer} options={customers} onChange={setCustomer} placeholder="Find customer"/>}</Field>
  <p role="status">Selected ID: {customer||'(empty)'}</p>
  <p className="review-note">可试：键入 sample、选择、重新打开、清空、方向键、Escape。事件协议与选中后候选列表差异需要应用合同审查。</p>
 </>;
 else {const Overlay=modern?NidecDrawer:Sheet;content=<><Btn type="button" onClick={()=>setOpen(true)}>Open edit panel</Btn><p>打开后可编辑、关闭、按 Escape；只在本对比栏中弹出。</p><Overlay open={open} title="Edit demo" description="Synthetic content — no business write" onClose={()=>setOpen(false)} footer={<Btn type="button" onClick={()=>setOpen(false)}>Close demo</Btn>}><Field label="Name">{input()}</Field></Overlay></>}
 return <div className="review-specimen">{modern?<NidecFormSurface><div className="review-stack">{content}</div></NidecFormSurface>:<div className="review-stack">{content}</div>}</div>;
}

function Report(){const [section,setSection]=useState('forms');return <main className="review-report">
 <header><p className="review-kicker">NIDEC · DESIGN SYSTEM REVIEW · 2026-09-06</p><h1>旧 Design System → Fluent UI</h1><p>真实控件视觉对比与综合评审 · 当前工作树快照 · 非独立应用验收</p></header>
 <section className="review-summary"><h2>评审结论</h2><p>基础控件已具备 Fluent 替换能力；这不等于 Gallery 全目录或 CPQ 全页面已经迁移。应保持“Fluent 管外观与状态、CPQ 管业务组合”，不能把两套皮肤叠加。</p><p>本页直接导入当前 CPQ 旧控件及当前 Fluent 适配器，使用相同演示数据。左右文档隔离，均加载当前宿主 CSS；未复制控件实现，也未改动 CPQ。当前旧代码不是迁移前的历史快照。</p></section>
 <nav className="review-nav" aria-label="Comparison sections">{groups.map(([id,label])=><button key={id} aria-pressed={section===id} onClick={()=>setSection(id)}>{label}</button>)}</nav>
 <div className="review-comparison">{[['old','旧实现 · Gallery 当前引用'],['new','Fluent · 当前 CPQ 适配器']].map(([id,label])=><section key={id}><h2>{label}</h2><iframe key={id+section} title={label} src={`?side=${id}&section=${section}`}/></section>)}</div>
 <section><h2>评审判定与风险</h2><table><thead><tr><th>范围</th><th>实际变化 / 判定</th><th>退出条件</th></tr></thead><tbody>
 <tr><td>字体、字重、尺寸</td><td>Fluent 主题与 size 机制治理；不要求完全复刻旧像素。</td><td>真实页面检查密度、截断、对齐与焦点。</td></tr>
 <tr><td>Input / Select / Textarea</td><td>原生旧控件改为 Fluent 结构；CPQ slot 标记排除旧装饰。</td><td>不能仅凭绿色或类名宣布替换；检查内外层、箭头及状态。</td></tr>
 <tr><td>Tabs / Combobox</td><td>真实适配器已存在；角色、键盘与事件模型发生改变。</td><td>保留空值、筛选与业务请求合同，不能只审外观。</td></tr>
 <tr><td>Sheet → Drawer</td><td>侧边编辑意图保留，弹层机制改为 Fluent。</td><td>在真实宿主复验焦点返回、背景隔离、CSP。</td></tr>
 <tr><td>加载、业务状态</td><td>Spinner 不等于骨架屏；业务状态映射不属于共享库。</td><td>逐场景选择，不按名称机械替换。</td></tr>
 <tr><td>Gallery 与退役</td><td>当前 Gallery 仍引用旧 controls；目录 native 标签不是“Fluent 已迁移”。</td><td>活动引用清零、业务组合保留、迁移证据闭合后才能退役。</td></tr>
 </tbody></table></section>
 <section><h2>本轮实际观察 · 不是全量 PASS</h2><ol><li>表单：已渲染并检查普通、错误、只读、禁用状态；右侧输入能更新本地值。可见 Fluent 边框底线、标签字重、下拉箭头与旧版不同。截图右侧处于已输入状态，左右内容因此不同。</li><li>按钮与反馈：左右 Save demo 均能增加各自本地计数。危险按钮左侧为红色，右侧呈中性描边；列为需要确认的语义强调缺口，不在本报告中擅自整改。窄栏出现换行，不能据此认定 CPQ 真实工具栏失败。</li><li>目录：已观察旧分段按钮与 Fluent 下划线 Tabs、组合框检索呈现；完整选择、重开、空值与键盘合同尚未在本报告完成复测。</li><li>弹层：已观察 Fluent Drawer 打开、输入获取焦点及 Escape 后关闭。旧 Sheet 和真实应用焦点循环仍需专项验收。</li><li>完整 Gallery：当前页面可渲染，登记 156 项；文档预览、工程与商业业务组合仍是独立责任范围。</li></ol><details><summary>查看本轮保存并复核的视觉证据</summary><p>截图是本轮状态记录；交互对比请使用上方真实控件。</p>{['forms-viewport','actions-viewport','gallery-viewport'].map(name=><figure key={name}><img style={{maxWidth:'100%',height:'auto'}} src={`evidence/${name}.png`} alt={name}/><figcaption>{name}</figcaption></figure>)}</details><p>生产构建成功，但包含完整 Gallery 的报告 JS 约 1.11 MB，触发大 chunk 警告；此体积不是共享包增量。没有执行本报告的完整 TypeScript 检查、自动无障碍扫描或真实应用独立验收。</p></section>
 <section><h2>Gallery 完整目录覆盖视图</h2><p>以下直接读取 component-catalog.json：{catalog.groups.reduce((n,g)=>n+g.components.length,0)} 个登记项。登记数不等于活动引用数，也不是迁移完成率。</p>{catalog.groups.map(g=><details key={g.id}><summary>{g.label} · {g.components.length} 项 · 原目录分类：{g.status}</summary><p>{g.description}</p><p>{g.components.join(' · ')}</p><p>{g.status==='business'||g.status==='template'?'业务组合 / 页面模板：保留在 CPQ；内部视觉原语逐步替换，不搬入共享包。':'需按活动引用与实际实现逐项判定；本页只为上方演示的控件提供可操作对比。'}</p></details>)}<p><a href="?side=gallery" target="_blank" rel="noreferrer">打开当前真实 Design System Gallery（完整目录与演示）</a></p></section>
 <section><h2>来源与证据边界</h2><ul><li>真实已安装候选：@phantasywind/nidec-app-ui-design 0.0.0-development；Fluent 9.74.7；React 19.2.7。</li><li>候选 SHA-256：<code>304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0</code></li><li>报告没有使用共享库源码别名替代制品；CPQ 源码仅作为只读评审参照。</li><li>本页不连接后端，不登录、不保存业务数据；左右状态各自独立，切换分类会重置演示。</li><li>嵌入栏宽度不是 CPQ 实际页面视口。本评审不替代多视口、完整键盘、辅助技术、安全或独立验收。</li><li>未开展 Dark Mode。未发布包或应用变更。</li></ul><a href="source-manifest.json">查看本次构建实际读取的源文件 SHA-256</a></section>
 </main>}
createRoot(document.getElementById('root')!).render(<MemoryRouter>{side==='gallery'?<DesignSystemGallery/>:side?<Specimens modern={side==='new'} section={params.get('section')||'forms'}/>:<Report/>}</MemoryRouter>);
