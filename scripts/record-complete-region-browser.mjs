// Immutable evidence snapshot, not release qualification or application acceptance.
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { sha256 } from './qualification-contract.mjs';
const root = join(import.meta.dirname, '..');
const run = join(root, '.qualification/runs/fluent-complete-region-1');
const out = join(run, 'browser-closeout-1');
const artifact = await readFile(join(run, 'build-a/candidate.tgz'));
assert.equal(sha256(artifact), '5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6');
assert.deepEqual(artifact, await readFile(join(run, 'build-b/candidate.tgz')));
const results = JSON.parse(await readFile(join(run, 'consumer-retest-4/results.json'), 'utf8'));
assert.equal(results.length, 3);
assert(results.every(r => r.verifyExitCode === 0 && r.installedBytesMatch && r.artifact === sha256(artifact)));
await mkdir(out);
const sums = [];
async function save(name, bytes) {
  const path = join(out, name);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes, { flag: 'wx' });
  assert.equal(sha256(await readFile(path)), sha256(bytes));
  sums.push(`${sha256(bytes)}  ${relative(out, path).replaceAll('\\', '/')}`);
}
for (const dir of ['browser-4','browser-5','browser-6','browser-7','consumer-retest-4']) {
  for (const item of await readdir(join(run, dir), { withFileTypes: true })) {
    assert(item.isFile(), 'Unexpected nested evidence');
    await save(`${dir}/${item.name}`, await readFile(join(run, dir, item.name)));
  }
}
await save('followup.md', await readFile(join(root, 'docs/implementation/fluent-complete-region-browser-followup.md')));
await save('executor.mjs', await readFile(new URL(import.meta.url)));
await save('scope.json', JSON.stringify({artifact:sha256(artifact),createdAt:new Date().toISOString(),
  status:'LOCAL_BROWSER_EVIDENCE_SNAPSHOT',published:false,cpqModified:false,
  limitations:['Host isolation was tested in a CSS copy, not implemented in CPQ','Real application regression and independent acceptance pending','Production CSP unknown','No blanket WCAG claim','Original failed runs preserved outside and inside this snapshot']},null,2)+'\n');
await writeFile(join(out,'SHA256SUMS.txt'),sums.join('\n')+'\n',{flag:'wx'});
console.log(`Read back ${sums.length} immutable evidence files; not application approval.`);
