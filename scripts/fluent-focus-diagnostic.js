// Diagnostic infrastructure only. No mutation of application or Tabster nodes.
(() => {
  const events=[], errors=[];
  const query=new URL(location.href).searchParams;
  let queue=Promise.resolve(), sequence=0;
  function snapshot() {
    return {time:performance.now(),width:innerWidth,documentWidth:document.documentElement.scrollWidth,
      active:document.activeElement?.outerHTML.slice(0,500),hasFocus:document.hasFocus(),
      dialog:Boolean(document.querySelector('[role="dialog"]')),
      guards:[...document.querySelectorAll('[data-tabster-dummy]')].map(el=>({html:el.outerHTML,
        visibility:getComputedStyle(el).visibility,contentVisibility:getComputedStyle(el).contentVisibility})),
      overflowing:[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth || el.scrollWidth>innerWidth)
        .map(el=>({tag:el.tagName,id:el.id,right:el.getBoundingClientRect().right,scrollWidth:el.scrollWidth})).slice(0,30)};
  }
  document.addEventListener('focusin',event=>events.push({time:performance.now(),html:event.target.outerHTML.slice(0,500)}),true);
  window.addEventListener('error',event=>errors.push(String(event.message)));
  window.addEventListener('unhandledrejection',event=>errors.push(String(event.reason)));
  async function scan(reason) {
    const before=snapshot(),samples=[];
    const timer=setInterval(()=>samples.push(snapshot()),50);
    let results;
    try { results=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}); }
    finally {clearInterval(timer);}
    const after=snapshot();
    if(query.has('legacySummary')) {
      let output=document.getElementById('audit-summary');
      if(!output){output=document.createElement('pre');output.id='audit-summary';document.body.append(output);}
      output.textContent=JSON.stringify({run:query.get('run'),width:innerWidth,violations:results.violations.map(x=>x.id),
        incomplete:results.incomplete.map(x=>x.id),passes:results.passes.length,overflow:after.documentWidth>innerWidth});
    }
    const report={sequence:++sequence,reason,run:query.get('run'),userAgent:navigator.userAgent,
      before,after,afterReport:snapshot(),samples,results,events:[...events],errors:[...errors]};
    const response=await fetch('/__probe/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
    if(!response.ok)throw new Error(`Evidence rejected ${response.status}`);
    document.title=`Diagnostic ${sequence} saved`;
  }
  function enqueue(reason){queue=queue.then(()=>scan(reason)).catch(error=>{errors.push(String(error));document.title='Diagnostic failed';});}
  const ready=setInterval(()=>{
    if(!document.querySelector('#action,#negative-control'))return;
    clearInterval(ready);
    const paragraph=document.createElement('p'),button=document.createElement('button');
    button.type='button';button.id='diagnostic-audit';button.textContent='Run diagnostic audit';
    button.addEventListener('click',()=>enqueue('manual'));
    paragraph.append(button);document.body.append(paragraph);
    // Keyboard shortcut keeps focus in the application (including a modal).
    document.addEventListener('keydown',event=>{if(event.ctrlKey && event.altKey && event.key.toLowerCase()==='a')enqueue('keyboard');});
    enqueue('initial');setTimeout(()=>enqueue('settled'),1500);
  },100);
  setTimeout(()=>clearInterval(ready),10000);
})();
