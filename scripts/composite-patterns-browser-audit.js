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
    const stageGeometry = [...document.querySelectorAll('.nidec-ui-process-stage__item')].map((item, index, items) => {
      const itemRect = item.getBoundingClientRect();
      const marker = item.querySelector('.nidec-ui-process-stage__marker');
      const button = item.querySelector('.nidec-ui-process-stage__button');
      const nextMarker = items[index + 1]?.querySelector('.nidec-ui-process-stage__marker');
      const markerRect = marker?.getBoundingClientRect();
      const nextMarkerRect = nextMarker?.getBoundingClientRect();
      const connector = getComputedStyle(item, '::after');
      const number = value => Number.isFinite(Number.parseFloat(value)) ? Number.parseFloat(value) : null;
      const left = number(connector.left);
      const right = number(connector.right);
      const top = number(connector.top);
      return {
        itemWidth: Number(itemRect.width.toFixed(2)),
        buttonWidth: button ? Number(button.getBoundingClientRect().width.toFixed(2)) : null,
        markerLeft: markerRect ? Number(markerRect.left.toFixed(2)) : null,
        markerRight: markerRect ? Number(markerRect.right.toFixed(2)) : null,
        markerBottom: markerRect ? Number(markerRect.bottom.toFixed(2)) : null,
        markerCenterX: markerRect ? Number(((markerRect.left + markerRect.right) / 2).toFixed(2)) : null,
        nextMarkerLeft: nextMarkerRect ? Number(nextMarkerRect.left.toFixed(2)) : null,
        connectorStartX: left === null ? null : Number((itemRect.left + left).toFixed(2)),
        connectorEndX: right === null ? null : Number((itemRect.right - right).toFixed(2)),
        connectorX: left === null ? null : Number((itemRect.left + left).toFixed(2)),
        connectorStartY: top === null ? null : Number((itemRect.top + top).toFixed(2)),
      };
    });
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
      stageGeometry,
      dataTableRows: document.querySelectorAll('table[aria-label="Example data records"] tbody tr').length,
      dataTableHeaders: document.querySelectorAll('table[aria-label="Example data records"] th').length,
      dataTableRegionScrollable: (() => {
        const region = document.querySelector('.data-table-scroll');
        return region ? getComputedStyle(region).overflowX === 'auto' && region.scrollWidth >= region.clientWidth : false;
      })(),
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
