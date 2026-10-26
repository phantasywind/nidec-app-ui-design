(() => {
  const text = selector => document.querySelector(selector)?.textContent?.trim() ?? null;
  const value = selector => document.querySelector(selector)?.value ?? null;
  const snapshot = kind => ({
    kind,
    time: new Date().toISOString(),
    viewport: {
      width: innerWidth,
      height: innerHeight,
      document: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    },
    search: value('input[type="search"]'),
    spin: value('[role="spinbutton"]'),
    slider: value('input[type="range"]'),
    popoverText: text('.fui-PopoverSurface'),
    activeElement: document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim() || document.activeElement?.tagName,
    fluentRules: [...document.styleSheets].reduce((total, sheet) => {
      try { return total + sheet.cssRules.length; } catch { return total; }
    }, 0),
  });
  const send = data => fetch('/__probe/audit', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  });
  const scan = async kind => {
    const result = await window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}});
    await send({...snapshot(kind), axe: {version: window.axe.version, violations: result.violations, incomplete: result.incomplete, passes: result.passes.length}});
  };
  let timer;
  const schedule = event => {
    clearTimeout(timer);
    timer = setTimeout(() => send(snapshot(`interaction:${event.type}`)).catch(console.error), 80);
  };
  addEventListener('resize', () => scan('viewport').catch(console.error));
  document.addEventListener('click', schedule, true);
  document.addEventListener('input', schedule, true);
  document.addEventListener('keydown', schedule, true);
  window.__nidecCommonControlsAudit = {snapshot, scan, send};
  scan('initial').catch(console.error);
})();
