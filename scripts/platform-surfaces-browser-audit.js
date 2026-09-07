(() => {
  const snapshot = () => ({
    time: new Date().toISOString(),
    viewport: {
      width: innerWidth,
      height: innerHeight,
      document: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    },
    selectedNav: document.querySelector('[aria-current="page"], [aria-selected="true"]')?.textContent?.trim() ?? null,
    expanded: [...document.querySelectorAll('[aria-expanded="true"]')].map(node => node.textContent?.trim()),
    activeElement: document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName,
  });
  const send = data => fetch('/__probe/audit', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  });
  const scan = async kind => {
    const result = await window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}});
    await send({kind, ...snapshot(), axe: {version: window.axe.version, violations: result.violations, incomplete: result.incomplete, passes: result.passes.length}});
  };
  window.__nidecPlatformAudit = {snapshot, scan, send};
  addEventListener('resize', () => send({kind: 'viewport', ...snapshot()}).catch(console.error));
  scan('initial').catch(console.error);
})();
