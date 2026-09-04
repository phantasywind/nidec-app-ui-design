// Instrumentation only: served separately from the original packed consumer.
(() => {
  const observation = {events:[], errors:[], resources:[]};
  window.addEventListener('error', event => observation.errors.push(String(event.message)));
  window.addEventListener('unhandledrejection', event => observation.errors.push(String(event.reason)));
  for (const name of ['click','keydown','focusin','input','submit']) document.addEventListener(name,event => {
    if (observation.events.length >= 400) return;
    const target=event.target;
    observation.events.push({name,key:event.key ?? null,tag:target?.tagName,id:target?.id,
      text:target?.textContent?.slice(0,100),value:target?.value ?? null, trusted:event.isTrusted});
  }, true);
  async function audit() {
    const results=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
    const styles = Array.from(document.querySelectorAll('button,input,[role="dialog"],[data-nidec-ui]')).map(element => {
      const css=getComputedStyle(element),rect=element.getBoundingClientRect();
      return {tag:element.tagName,id:element.id,text:element.textContent?.slice(0,80),
        background:css.backgroundColor,color:css.color,fontSize:css.fontSize,padding:css.padding,
        outline:css.outline,border:css.border,width:rect.width,height:rect.height,
        describedby:element.getAttribute('aria-describedby'),labelledby:element.getAttribute('aria-labelledby')};
    });
    const report = {...observation,run:new URL(location.href).searchParams.get('run'),
      width:innerWidth,height:innerHeight,userAgent:navigator.userAgent,
      serviceWorkerControlled:Boolean(navigator.serviceWorker?.controller),
      overflow:document.documentElement.scrollWidth>innerWidth,styles,results,
      active:{tag:document.activeElement?.tagName,id:document.activeElement?.id,text:document.activeElement?.textContent},
      resources:performance.getEntriesByType('resource').map(item=>({name:item.name,type:item.initiatorType}))};
    const response=await fetch('/__probe/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
    if(!response.ok) throw new Error(`Evidence rejected: ${response.status}`);
    let output=document.getElementById('audit-summary');
    if(!output){output=document.createElement('pre');output.id='audit-summary';document.body.append(output);}
    output.textContent=JSON.stringify({run:report.run,width:report.width,violations:results.violations.map(item=>item.id),
      incomplete:results.incomplete.map(item=>item.id),passes:results.passes.length,overflow:report.overflow});
  }
  const ready=setInterval(() => {
    if(!document.querySelector('#action') && !document.querySelector('#negative-control')) return;
    clearInterval(ready);
    const button=document.createElement('button');button.type='button';button.id='run-audit';button.textContent='Run accessibility audit';
    button.addEventListener('click',()=>audit().catch(error=>{button.textContent=String(error);}));
    document.body.append(button);
    audit().catch(error=>{button.textContent=String(error);});
    let dialogVisible=false;
    new MutationObserver(() => {
      const visible=Boolean(document.querySelector('[role="dialog"]'));
      if(visible===dialogVisible)return;
      dialogVisible=visible;
      setTimeout(()=>audit().catch(error=>{button.textContent=String(error);}),250);
    }).observe(document.body,{childList:true,subtree:true});
  },100);
  setTimeout(()=>clearInterval(ready),10000);
})();
