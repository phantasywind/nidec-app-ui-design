import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const runId = process.argv[2] ?? 'fluent-common-content-controls-3';
if (!/^fluent-common-content-controls-[1-9][0-9]*$/.test(runId)) throw new Error('Invalid run ID');
const run = join(root, '.qualification/runs', runId);
const paths = process.argv.slice(3);
if (paths.length === 0 || paths.some(path => !/^browser-[1-9][0-9]*$/.test(path))) throw new Error('At least one valid browser evidence path is required');
const viewportMatrix = new Set();
let hydratedScan = false;
const knownLimitations = new Set();
for (const path of paths) {
  const directory = join(run, path);
  const names = await readdir(directory);
  const audits = names.filter(name => name.endsWith('-audit.json'));
  assert(audits.length > 0, `${path} has no browser audits`);
  const observations = [];
  for (const name of audits) {
    const audit = JSON.parse(await readFile(join(directory, name), 'utf8'));
    observations.push(audit);
    if (!audit.axe) continue;
    assert.equal(audit.axe.incomplete.length, 0, `${path}/${name} has incomplete axe results`);
    for (const violation of audit.axe.violations) {
      assert.equal(violation.id, 'aria-hidden-focus', `${path}/${name} has an unapproved axe violation`);
      assert(violation.nodes.length > 0 && violation.nodes.every(node => node.html.includes('data-tabster-dummy')), `${path}/${name} aria-hidden-focus is not limited to Tabster sentinels`);
      knownLimitations.add('aria-hidden-focus:data-tabster-dummy');
    }
    assert(!audit.axe.violations.some(violation => violation.id === 'color-contrast'), `${path}/${name} retains a color contrast failure`);
    if (audit.kind === 'viewport') viewportMatrix.add(`${audit.viewport.width}x${audit.viewport.height}`);
    if (audit.fluentRules > 500) hydratedScan = true;
  }
  assert(observations.some(item => item.search === 'motor'), `${path} did not record search input`);
  assert(observations.some(item => item.kind === 'interaction:click' && item.search === ''), `${path} did not record search clear`);
  assert(observations.some(item => item.spin === '2'), `${path} did not record spinbutton keyboard change`);
  assert(observations.some(item => item.slider === '51'), `${path} did not record slider keyboard change`);
  assert(observations.some(item => item.togglePressed === 'true'), `${path} did not record toggle state change`);
  assert(observations.some(item => item.popoverText === 'Consumer-owned contextual content.'), `${path} did not record the open popover`);
  assert(observations.some(item => item.kind === 'interaction:keydown' && item.popoverText === null && item.activeElement === 'Details'), `${path} did not record Escape close with trigger focus`);
  for (const name of names.filter(name => name.endsWith('-csp.json'))) {
    const report = JSON.parse(await readFile(join(directory, name), 'utf8'))['csp-report'];
    assert.equal(report['effective-directive'], 'style-src-elem', `${path}/${name} has an unexpected CSP directive`);
    assert.equal(report['blocked-uri'], 'inline', `${path}/${name} has an unexpected CSP target`);
    assert.equal(report['line-number'], 135, `${path}/${name} does not match the retained line-135 CSP signature`);
    knownLimitations.add('style-src-elem:inline:line-135');
  }
  const requests = (await readFile(join(directory, 'requests.ndjson'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  assert(requests.every(request => request.policy.includes("object-src 'none'") && !request.policy.includes("'unsafe-inline'")), `${path} weakened the strict CSP`);
  assert(requests.every(request => request.path === '/' || request.path === '/favicon.ico' || request.path.startsWith('/assets/') || request.path.startsWith('/__probe/')), `${path} made an unexpected request`);
}
for (const expected of ['1440x900', '1280x900', '900x900', '720x900']) assert(viewportMatrix.has(expected), `Missing viewport ${expected}`);
assert(hydratedScan, 'No hydrated axe scan was recorded');
await writeFile(join(run, 'browser-summary.json'), `${JSON.stringify({runId, paths, viewportMatrix: [...viewportMatrix].sort(), knownLimitations: [...knownLimitations].sort()}, null, 2)}\n`, {flag: 'wx'});
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else files.push(path);
  }
}
for (const path of paths) await collect(join(run, path));
files.push(join(run, 'browser-summary.json'));
files.sort((a, b) => a.localeCompare(b, 'en'));
const lines = [];
for (const path of files) {
  const digest = createHash('sha256').update(await readFile(path)).digest('hex');
  lines.push(`${digest}  ${relative(run, path).replaceAll('\\', '/')}`);
}
const manifest = `${lines.join('\n')}\n`;
await writeFile(join(run, 'BROWSER-SHA256SUMS.txt'), manifest, {flag: 'wx'});
if (await readFile(join(run, 'BROWSER-SHA256SUMS.txt'), 'utf8') !== manifest) throw new Error('Browser evidence manifest readback mismatch');
console.log(JSON.stringify({files: files.length, manifestSha256: createHash('sha256').update(manifest).digest('hex')}, null, 2));
