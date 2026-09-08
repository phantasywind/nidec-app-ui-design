(() => {
  const rgb = value => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const luminance = color => {
    const values = color.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
  };
  const opaqueBackground = node => {
    let current = node;
    while (current) {
      const value = getComputedStyle(current).backgroundColor;
      const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
      if (parts.length >= 3 && (parts.length < 4 || parts[3] > 0.99)) return value;
      current = current.parentElement;
    }
    return 'rgb(255, 255, 255)';
  };
  const contrast = node => {
    const foreground = getComputedStyle(node).color;
    const background = opaqueBackground(node);
    const light = Math.max(luminance(rgb(foreground)), luminance(rgb(background)));
    const dark = Math.min(luminance(rgb(foreground)), luminance(rgb(background)));
    return {text: node.textContent?.trim(), foreground, background, ratio: Number(((light + 0.05) / (dark + 0.05)).toFixed(2))};
  };
  const snapshot = kind => {
    const gallery = document.querySelector('.nidec-ui-card-gallery');
    const stages = document.querySelector('.nidec-ui-process-stage');
    return {
      kind,
      time: new Date().toISOString(),
      viewport: {
        width: innerWidth,
        height: innerHeight,
        document: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
      },
      collectionItems: document.querySelectorAll('.nidec-ui-collection-list__item').length,
      selectedItems: [...document.querySelectorAll('.nidec-ui-collection-list__item')].filter(node => node.querySelector('input[type="checkbox"]:checked')).map(node => node.textContent?.trim()),
      galleryItems: document.querySelectorAll('.nidec-ui-card-gallery__item').length,
      galleryColumns: gallery ? getComputedStyle(gallery).gridTemplateColumns.split(' ').filter(value => Number.parseFloat(value) > 0).length : 0,
      stageItems: document.querySelectorAll('.nidec-ui-process-stage__item').length,
      currentStages: document.querySelectorAll('[aria-current="step"]').length,
      disabledStages: document.querySelectorAll('.nidec-ui-process-stage__button:disabled').length,
      processDisplay: stages ? getComputedStyle(stages).display : null,
      lastAction: document.querySelector('.stage-result')?.textContent?.trim() ?? null,
      activeElement: document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName,
      contrastPairs: [...document.querySelectorAll('.nidec-ui-process-stage__marker, .nidec-ui-process-stage__description')].map(contrast),
      injectedStyles: [...document.querySelectorAll('style')].map(node => ({
        nonceMatches: !!node.nonce && node.nonce === document.querySelector('meta[name="csp-nonce"]')?.content,
        rules: node.sheet?.cssRules.length ?? 0,
      })),
    };
  };
  const send = data => fetch('/__probe/audit', {
    method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(data),
  });
  const scan = async kind => {
    const result = await window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}});
    await send({...snapshot(kind), axe: {version: window.axe.version, violations: result.violations, incomplete: result.incomplete, passes: result.passes.length}});
  };
  let timer;
  const schedule = event => {
    clearTimeout(timer);
    timer = setTimeout(() => send(snapshot(`interaction:${event.type}`)).catch(console.error), 100);
  };
  addEventListener('resize', () => scan('viewport').catch(console.error));
  document.addEventListener('click', schedule, true);
  document.addEventListener('keydown', schedule, true);
  window.__nidecCompositeAudit = {snapshot, scan, send};
  scan('initial').catch(console.error);
})();
