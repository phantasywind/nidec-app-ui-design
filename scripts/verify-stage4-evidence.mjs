import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { readFile, readdir, mkdir, mkdtemp, writeFile, rm, access } from 'node:fs/promises';
import { join, resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { inspectArchive, verifyBinding, validateManifest, validateFixtureLock, preserveRun } from './qualification-contract.mjs';

// Independent read-back against anchors committed in the Stage 4C record.
// This audits that historical run; it is not a general release approval tool.
const root = resolve(import.meta.dirname, '..');
const retained = join(root, '.qualification/runs/stage4c-20260904-5f41634');
const evidence = join(root, '.qualification/runs/stage4d-20260904-cc036f9');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const cloneRecord = value => JSON.parse(JSON.stringify(value));
const anchors = {
  'SHA256SUMS.txt': '7de1867fa53ecca61ea475ab7d6d7bf8b7028114398b8b1983ca46ef36ba452c',
  'manifest.json': '2e2729ceac9147a9a8035449bc1c2535a31855d71530fbf8dfdfe3d771c11251',
  'inputs/source.zip': '49b9d499183cfe60bbf66338d326c2e6f0d30394f8026bf59c2bbfa5b0f09009',
};
const results = [];
function sourceReference(manifest) {
  assert.equal(manifest.source.commit, '5f41634573131751129599aa1039a79535675e40', 'Source commit anchor mismatch');
  assert.equal(manifest.source.lockSha256, '0e6bb559c365fc05cd77daacbbac4fa19b1b98f554c2d8131e9bb89b90e549ff', 'Source lock anchor mismatch');
}
async function inventory(dir) {
  const paths = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...await inventory(path));
    else { assert(entry.isFile(), 'Links/special files rejected'); paths.push(path); }
  }
  return paths;
}
async function checkRetention() {
  for (const [file, expected] of Object.entries(anchors)) assert.equal(hash(await readFile(join(retained, file))), expected, `Committed anchor: ${file}`);
  const lines = (await readFile(join(retained, 'SHA256SUMS.txt'), 'utf8')).trimEnd().split('\n');
  const seen = new Set();
  for (const line of lines) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9._/-]+)$/.exec(line);
    assert(match, 'Invalid checksum line');
    const [, expected, file] = match;
    assert(!file.startsWith('/') && !file.split('/').some(p => p === '.' || p === '..' || p === ''), 'Unsafe checksum path');
    assert(!seen.has(file.toLowerCase()), 'Duplicate checksum path'); seen.add(file.toLowerCase());
    assert.equal(hash(await readFile(join(retained, file))), expected, `Retained bytes: ${file}`);
  }
  const actual = (await inventory(retained)).map(p => relative(retained, p).replaceAll('\\', '/').toLowerCase()).filter(p => p !== 'sha256sums.txt');
  assert.deepEqual(actual.sort(), [...seen].sort(), 'Exact checksum coverage required');
  assert.equal(lines.length, 76);
  return lines.length;
}
async function negative(name, action, expected) {
  let error;
  try { await action(); } catch (caught) { error = caught; }
  assert(error && expected.test(error.message), `Negative case did not reject correctly: ${name}: ${error?.message}`);
  results.push({ name, status: 'passed', rejection: error.message });
}
// Modify actual regular-file entries in memory; never extract or change originals.
function tarEntries(bytes) {
  const tar = gunzipSync(bytes); const entries = [];
  for (let offset = 0; !tar.subarray(offset, offset + 512).every(b => b === 0);) {
    const header = Buffer.from(tar.subarray(offset, offset + 512));
    const size = Number.parseInt(header.subarray(124, 136).toString().replace(/\0.*$/s, '').trim(), 8);
    entries.push({ header, body: Buffer.from(tar.subarray(offset + 512, offset + 512 + size)) });
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}
function pack(entries) {
  return gzipSync(Buffer.concat([...entries.flatMap(({ header: input, body }) => {
    const header = Buffer.from(input);
    header.fill(0, 124, 136); header.write(`${body.length.toString(8).padStart(11, '0')}\0`, 124);
    header.fill(32, 148, 156);
    header.write(`${header.reduce((a, b) => a + b, 0).toString(8).padStart(6, '0')}\0 `, 148);
    return [header, body, Buffer.alloc((512 - body.length % 512) % 512)];
  }), Buffer.alloc(1024)]));
}
function rename(entry, name) { entry.header.fill(0, 0, 100); entry.header.write(name); }

await mkdir(evidence); // No reuse, including failed attempts.
let scratch;
const report = { scope: 'historical-stage4c-evidence-audit', startedAt: new Date().toISOString(), status: 'failed', results, limitations: ['Same agent/maintainer technical re-verification, not independent personnel or application acceptance.', 'Browser network evidence gap from Stage 4C remains open.', 'This new audit procedure is not a newly qualified package implementation.'] };
try {
  report.retainedFileCount = await checkRetention();
  const manifest = JSON.parse(await readFile(join(retained, 'manifest.json')));
  validateManifest(manifest);
  sourceReference(manifest);
  const exported = spawnSync('git', ['archive', '--format=zip', manifest.source.commit], { cwd: root, maxBuffer: 20 * 1024 * 1024 });
  assert.equal(exported.status, 0); assert.equal(hash(exported.stdout), anchors['inputs/source.zip']);
  const bytes = await readFile(join(retained, 'candidate.tgz'));
  for (const file of ['candidate.tgz', 'artifacts/build-a.tgz', 'artifacts/build-b.tgz', 'inputs/artifacts/candidate.tgz']) verifyBinding(await readFile(join(retained, file)), manifest.artifact);
  const gitLock = spawnSync('git', ['show', `${manifest.source.commit}:package-lock.json`], { cwd: root });
  assert.equal(gitLock.status, 0); assert.equal(hash(gitLock.stdout), manifest.source.lockSha256);
  assert.equal(hash(await readFile(join(retained, 'inputs/root-package-lock.json'))), manifest.source.lockSha256);
  const frozen = JSON.parse(await readFile(join(retained, 'inputs/frozen-inputs.json')));
  const consumers = JSON.parse(await readFile(join(retained, 'consumer-checks.json')));
  assert.equal(consumers.length, 4);
  assert.equal(new Set(consumers.map(c => `${c.runtime}/${c.name}`)).size, 4);
  for (const fixture of frozen.fixtures) {
    const base = join(retained, 'inputs/fixtures', fixture.name);
    const lockBytes = await readFile(join(base, 'package-lock.json'));
    assert.equal(hash(lockBytes), fixture.lockSha256);
    assert.equal(validateFixtureLock(JSON.parse(await readFile(join(base, 'package.json'))), JSON.parse(lockBytes)), fixture.lockNormalizedSha256);
    assert.equal(hash(JSON.stringify(fixture.files)), fixture.sourceSha256);
    for (const [file, digest] of Object.entries(fixture.files)) assert.equal(hash(await readFile(join(base, file))), digest);
    for (const consumer of consumers.filter(c => c.name === fixture.name)) {
      assert.equal(consumer.artifactSha256, manifest.artifact.sha256);
      assert.equal(consumer.lockSha256, fixture.lockSha256); assert.equal(consumer.sourceSha256, fixture.sourceSha256);
      for (const [file, digest] of Object.entries(consumer.outputs)) assert.equal(hash(await readFile(join(retained, 'outputs', consumer.runtime, consumer.name, 'dist', file))), digest);
    }
  }
  results.push({ name: 'anchored files, archive bindings, source lock, frozen fixtures and four output sets', status: 'passed' });
  await mkdir(join(root, '.tmp'), { recursive: true });
  scratch = await mkdtemp(join(root, '.tmp/stage4d-proof-'));
  const corrupted = Buffer.from(bytes); corrupted[Math.floor(corrupted.length / 2)] ^= 1;
  await negative('one-byte corruption', () => verifyBinding(corrupted, manifest.artifact), /SHA-256 mismatch/);
  for (const [name, mutate, rejection] of [
    ['stale consumer', m => { m.consumers[0].artifactSha256 = 'a'.repeat(64); }, /Stale\/failed/],
    ['missing lock hash', m => { delete m.consumers[0].lockSha256; }, /Frozen consumer/],
    ['nonzero command', m => { m.commands[0].exitCode = 1; }, /Failed command/],
    ['failed cleanup', m => { m.cleanupPassed = false; }, /Guard\/cleanup\/rollback/],
    ['failed rollback', m => { m.rollbackPassed = false; }, /Guard\/cleanup\/rollback/],
    ['publication guard unexpectedly passes', m => { m.publicationGuardExitCode = 0; }, /Guard\/cleanup\/rollback/],
    ['different build hash', m => { m.buildB = 'a'.repeat(64); }, /Independent build/],
  ]) { const copy = cloneRecord(manifest); mutate(copy); await negative(name, () => validateManifest(copy), rejection); }
  for (const key of ['name', 'version']) {
    const entries = tarEntries(bytes);
    const entry = entries.find(e => e.header.subarray(0, 100).toString().startsWith('package/package.json\0'));
    const pkg = JSON.parse(entry.body); pkg[key] = 'wrong'; entry.body = Buffer.from(JSON.stringify(pkg));
    await negative(`wrong package ${key}`, () => inspectArchive(pack(entries)), /identity\/private mismatch/);
  }
  for (const [name, mutate, rejection] of [
    ['missing entry', entries => entries.pop(), /allowlist/],
    ['extra entry', entries => { const extra = tarEntries(bytes)[0]; rename(extra, 'package/unexpected.txt'); entries.push(extra); }, /allowlist/],
    ['path traversal', entries => rename(entries[0], 'package/../escape'), /Unsafe archive path/],
    ['symbolic link', entries => { entries[0].header[156] = 50; }, /Only regular/],
    ['duplicate entry', entries => entries.push(tarEntries(bytes)[0]), /Duplicate/],
  ]) { const entries = tarEntries(bytes); mutate(entries); await negative(name, () => inspectArchive(pack(entries)), rejection); }
  const copy = cloneRecord(manifest); copy.runId = 'overwrite-proof';
  const saved = await preserveRun(scratch, copy, bytes);
  const before = hash(await readFile(join(saved, 'manifest.json')));
  await negative('existing run overwrite', () => preserveRun(scratch, copy, bytes), /EEXIST/);
  assert.equal(hash(await readFile(join(saved, 'manifest.json'))), before);
  assert.equal(hash(await readFile(join(saved, 'candidate.tgz'))), manifest.artifact.sha256);
  const wrongSource = cloneRecord(manifest); wrongSource.source.commit = 'a'.repeat(40);
  await negative('wrong committed source reference', () => sourceReference(wrongSource), /Source commit anchor/);
  const wrongLock = cloneRecord(manifest); wrongLock.source.lockSha256 = 'a'.repeat(64);
  await negative('wrong committed lock reference', () => sourceReference(wrongLock), /Source lock anchor/);
  report.status = 'passed';
} finally {
  if (scratch) {
    assert(scratch.startsWith(`${join(root, '.tmp')}${sep}stage4d-proof-`), 'Unsafe cleanup target');
    await rm(scratch, { recursive: true, force: true });
    await assert.rejects(access(scratch), { code: 'ENOENT' });
  }
  report.cleanupPassed = true;
  report.originalEvidenceUnchanged = (await checkRetention()) === 76;
  report.finishedAt = new Date().toISOString();
  report.procedureSha256 = hash(await readFile(new URL(import.meta.url)));
  await writeFile(join(evidence, 'procedure.mjs'), await readFile(new URL(import.meta.url)), { flag: 'wx' });
  const record = Buffer.from(`${JSON.stringify(report, null, 2)}\n`);
  await writeFile(join(evidence, 'result.json'), record, { flag: 'wx' });
  await writeFile(join(evidence, 'SHA256SUMS.txt'), `${hash(record)}  result.json\n${report.procedureSha256}  procedure.mjs\n`, { flag: 'wx' });
  console.log(JSON.stringify({ ...report, results: results.map(r => ({ name: r.name, status: r.status })), resultSha256: hash(record) }, null, 2));
}
