// Test observer; interaction is performed through browser UI, never evaluation.
(async()=>{
  const snapshot=()=>({time:new Date().toISOString(),url:location.href,
    viewport:{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth},
    active:{role:document.activeElement?.getAttribute('role'),name:document.activeElement?.getAttribute('aria-label'),text:document.activeElement?.textContent},
    result:document.querySelector('output')?.textContent,
    controls:[...document.querySelectorAll('button,input,[role="tab"],[role="menu"],[role="menuitem"],[role="listbox"],[role="option"],[role="tooltip"]')].map(node=>({
      tag:node.tagName,role:node.getAttribute('role'),text:node.textContent,name:node.getAttribute('aria-label'),value:node.value,
      selected:node.getAttribute('aria-selected'),expanded:node.getAttribute('aria-expanded'),disabled:node.getAttribute('aria-disabled'),
      height:node.getBoundingClientRect().height,backgroundImage:getComputedStyle(node).backgroundImage,
      background:getComputedStyle(node).backgroundColor,font:getComputedStyle(node).font,padding:getComputedStyle(node).padding,
      border:getComputedStyle(node).border,brand:getComputedStyle(node).getPropertyValue('--colorBrandBackground'),
      before:getComputedStyle(node,'::before').content,after:getComputedStyle(node,'::after').content,
    })),
    styles:[...document.querySelectorAll('style')].map(node=>({nonceMatches:!!node.nonce&&node.nonce===document.querySelector('meta[name="csp-nonce"]')?.content,rules:node.sheet?.cssRules.length??0})),
  });
  const send=async data=>{const response=await fetch('/__probe/audit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});if(!response.ok)throw Error('Audit save failed');};
  const scan=async kind=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});await send({kind,...snapshot(),axe:{version:window.axe.version,violations:result.violations,incomplete:result.incomplete}});};
  await new Promise(resolve=>setTimeout(resolve,1000));
  await scan('initial');
  window.addEventListener('keydown',event=>{if(event.key==='F8'){event.preventDefault();scan('settled-rescan').catch(console.error);}});
  let pending;
  for(const event of ['click','keyup','change','focusin','resize'])window.addEventListener(event,()=>{clearTimeout(pending);pending=setTimeout(()=>send({kind:'interaction',...snapshot()}).catch(console.error),350);});
})().catch(console.error);
