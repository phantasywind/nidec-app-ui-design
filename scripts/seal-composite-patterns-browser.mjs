import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const runId = process.argv[2] ?? 'fluent-composite-patterns-2';
assert(/^fluent-composite-patterns-[1-9][0-9]*$/.test(runId) || runId === 'release-0-1-0-rc-1');
const requiresDataTable = runId === 'fluent-composite-patterns-3' || runId === 'release-0-1-0-rc-1';
const paths = process.argv.slice(3);
assert(paths.length > 0 && paths.every(path => /^browser-[1-9][0-9]*$/.test(path)), 'Browser evidence paths are required');
const run = join(root, '.qualification/runs', runId);
const viewports = new Map();
const limitations = new Set();
const interactions = {selected: false, cleared: false, confirm: false, review: false, keyboard: false};

for (const path of paths) {
  const directory = join(run, path);
  const names = await readdir(directory);
  for (const name of names.filter(name => name.endsWith('-audit.json'))) {
    const audit = JSON.parse(await readFile(join(directory, name), 'utf8'));
    if (audit.kind?.startsWith('interaction:')) {
      interactions.selected ||= audit.selectedItems.some(item => item.includes('Example Beta'));
      interactions.cleared ||= audit.selectedItems.length === 0;
      interactions.confirm ||= audit.lastAction === 'Activated Confirm';
      interactions.review ||= audit.lastAction === 'Activated Review';
      interactions.keyboard ||= audit.kind === 'interaction:keydown';
    }
    if (!audit.axe || audit.collectionItems !== 3) continue;
    assert.equal(audit.galleryItems, 4, `${path}/${name} gallery item count`);
    assert.equal(audit.stageItems, 4, `${path}/${name} stage item count`);
    if (requiresDataTable) {
      assert.equal(audit.dataTableRows, 3, `${path}/${name} data table row count`);
      assert.equal(audit.dataTableHeaders, 6, `${path}/${name} data table header count`);
      assert(audit.dataTableRegionScrollable, `${path}/${name} data table lacks bounded horizontal overflow`);
    }
    assert.equal(audit.currentStages, 1, `${path}/${name} current stage count`);
    assert.equal(audit.disabledStages, 1, `${path}/${name} disabled stage count`);
    if (audit.processDisplay === 'flex') {
      for (const [index, geometry] of audit.stageGeometry.entries()) {
        assert(geometry.buttonWidth < geometry.itemWidth, `${path}/${name} stage ${index} still uses the full column hit area`);
        if (geometry.nextMarkerLeft !== null) {
          assert(Math.abs(geometry.connectorStartX - geometry.markerRight) <= 1, `${path}/${name} stage ${index} connector overlaps its marker`);
          assert(Math.abs(geometry.connectorEndX - geometry.nextMarkerLeft) <= 1, `${path}/${name} stage ${index} connector misses the next marker edge`);
        }
      }
    } else {
      for (const [index, geometry] of audit.stageGeometry.entries()) if (geometry.nextMarkerLeft !== null) {
        assert(Math.abs(geometry.connectorX - geometry.markerCenterX) <= 1, `${path}/${name} vertical stage ${index} connector is not centered`);
        assert(Math.abs(geometry.connectorStartY - geometry.markerBottom) <= 1, `${path}/${name} vertical stage ${index} connector overlaps its marker`);
      }
    }
    assert(audit.viewport.scrollWidth <= audit.viewport.width, `${path}/${name} has horizontal overflow`);
    assert.equal(audit.axe.violations.length, 0, `${path}/${name} has axe violations`);
    for (const item of audit.axe.incomplete) {
      assert.equal(item.id, 'color-contrast', `${path}/${name} has unexpected incomplete result`);
      assert(item.nodes.every(node => node.html.includes('nidec-ui-process-stage__marker') || node.html.includes('nidec-ui-process-stage__description')), `${path}/${name} has unexpected contrast target`);
      limitations.add('axe-color-contrast-incomplete:process-stage-overlap');
    }
    assert(audit.contrastPairs.length >= 7 && audit.contrastPairs.every(pair => pair.ratio >= 4.5), `${path}/${name} manual contrast check failed`);
    assert(audit.injectedStyles.length > 0 && audit.injectedStyles.every(style => style.nonceMatches && style.rules > 0), `${path}/${name} has invalid dynamic style nonce`);
    viewports.set(`${audit.viewport.width}x${audit.viewport.height}`, {columns: audit.galleryColumns, processDisplay: audit.processDisplay});
  }
  for (const name of names.filter(name => name.endsWith('-csp.json'))) {
    const report = JSON.parse(await readFile(join(directory, name), 'utf8'))['csp-report'];
    assert.equal(report['effective-directive'], 'style-src-elem');
    assert.equal(report['blocked-uri'], 'inline');
    assert.equal(report['line-number'], 135);
    limitations.add('style-src-elem:inline:line-135');
  }
  const requests = (await readFile(join(directory, 'requests.ndjson'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  assert(requests.every(request => request.policy.includes("object-src 'none'") && !request.policy.includes("'unsafe-inline'")), `${path} weakened CSP`);
  assert(requests.every(request => request.path === '/' || request.path === '/favicon.ico' || request.path.startsWith('/assets/') || request.path.startsWith('/__probe/')), `${path} made an unexpected request`);
}

for (const key of ['1440x900', '1280x900', '900x900', '720x900']) assert(viewports.has(key), `Missing viewport ${key}`);
assert.equal(viewports.get('1440x900').columns, 4);
assert.equal(viewports.get('1280x900').columns, 4);
assert.equal(viewports.get('900x900').columns, 3);
assert.equal(viewports.get('720x900').columns, 3);
assert.equal(viewports.get('1440x900').processDisplay, 'flex');
assert.equal(viewports.get('720x900').processDisplay, 'grid');
assert(Object.values(interactions).every(Boolean), `Missing interaction evidence: ${JSON.stringify(interactions)}`);

const summary = {runId, paths, viewports: Object.fromEntries([...viewports].sort()), interactions, knownLimitations: [...limitations].sort()};
await writeFile(join(run, 'browser-summary.json'), `${JSON.stringify(summary, null, 2)}\n`, {flag: 'wx'});
const files = [];
for (const path of paths) for (const name of await readdir(join(run, path))) files.push(join(run, path, name));
files.push(join(run, 'browser-summary.json'));
files.sort((a, b) => a.localeCompare(b, 'en'));
const lines = [];
for (const path of files) lines.push(`${createHash('sha256').update(await readFile(path)).digest('hex')}  ${relative(run, path).replaceAll('\\', '/')}`);
const manifest = `${lines.join('\n')}\n`;
await writeFile(join(run, 'BROWSER-SHA256SUMS.txt'), manifest, {flag: 'wx'});
assert.equal(await readFile(join(run, 'BROWSER-SHA256SUMS.txt'), 'utf8'), manifest);
console.log(JSON.stringify(summary, null, 2));
