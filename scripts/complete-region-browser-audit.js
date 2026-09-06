// Served observer only; actual keyboard and pointer actions are performed through the browser UI.
(async () => {
  const snapshot = () => ({
    time: new Date().toISOString(), url: location.href,
    viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
    active: document.activeElement?.textContent,
    submissions: document.querySelector('output')?.textContent,
    styles: [...document.querySelectorAll('style')].map(node => ({ nonceMatches: !!node.nonce && node.nonce === document.querySelector('meta[name="csp-nonce"]')?.content, rules: node.sheet?.cssRules.length ?? 0 })),
    controls: [...document.querySelectorAll('input,textarea,select,button')].map(node => ({
      tag: node.tagName, text: node.textContent, type: node.getAttribute('type'),
      disabled: node.disabled, readOnly: node.readOnly,
      backgroundImage: getComputedStyle(node).backgroundImage, padding: getComputedStyle(node).padding,
      font: getComputedStyle(node).font, border: getComputedStyle(node).border,
      describedBy: node.getAttribute('aria-describedby'),
    })),
    dialogs: [...document.querySelectorAll('[role="dialog"]')].map(node => ({
      modal: node.getAttribute('aria-modal'), text: node.textContent,
      width: node.getBoundingClientRect().width, background: getComputedStyle(node).backgroundColor,
      focusInside: node.contains(document.activeElement),
    })),
  });
  const send = async value => {
    const result = await fetch('/__probe/audit', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(value) });
    if (!result.ok) throw new Error('Audit save failed');
  };
  await new Promise(resolve => setTimeout(resolve, 1000));
  const scanAndSend = async kind => {
    const scan = await window.axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
    await send({kind, ...snapshot(), axe:{version:window.axe.version, violations:scan.violations, incomplete:scan.incomplete}});
  };
  await scanAndSend('initial');
  // Explicit test-only rescan after UI transitions have settled.
  window.addEventListener('keydown', event => {
    if(event.key === 'F8') { event.preventDefault(); scanAndSend('settled-rescan').catch(console.error); }
  });
  let pending;
  for (const event of ['click','keyup','change','focusin','resize']) window.addEventListener(event, () => {
    clearTimeout(pending);
    pending = setTimeout(() => send({kind:'interaction', ...snapshot()}).catch(console.error), 350);
  });
})().catch(console.error);
