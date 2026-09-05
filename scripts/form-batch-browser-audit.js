/* Local fixture observer: no application interaction is simulated here. */
(async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
  await wait(900);
  const snapshot = () => {
    const control = document.querySelector('#batch-outside');
    const roots = ['batch-light','batch-states','batch-dark'].map(id => {
      const node=document.getElementById(id);
      return node ? {id,background:getComputedStyle(node).backgroundColor,width:node.getBoundingClientRect().width} : {id,missing:true};
    });
    return {time:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight,document:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth},
      state:document.querySelector('#batch-state')?.textContent,active:document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.getAttribute('name') ?? document.activeElement?.textContent,
      roots,outside:control?{font:getComputedStyle(control).fontSize,padding:getComputedStyle(control).padding}:null,
      dialogs:[...document.querySelectorAll('[role="dialog"]')].map(node=>({text:node.textContent,background:getComputedStyle(node).backgroundColor}))};
  };
  const send = async value => {
    const response=await fetch('/__probe/audit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(value)});
    if (!response.ok) throw new Error('Audit persistence failed');
  };
  const scan = await window.axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
  await send({kind:'initial',...snapshot(),axe:{version:window.axe.version,violations:scan.violations,incomplete:scan.incomplete,passes:scan.passes.length}});
  let pending;
  for (const event of ['change','keyup','click','focusin']) document.addEventListener(event,() => {
    clearTimeout(pending);
    pending=setTimeout(()=>send({kind:'interaction',...snapshot()}).catch(error=>console.error(error)),250);
  });
  window.addEventListener('resize',() => {clearTimeout(pending);pending=setTimeout(()=>send({kind:'viewport',...snapshot()}).catch(error=>console.error(error)),400);});
})().catch(error=>console.error('Batch audit failed',error));
