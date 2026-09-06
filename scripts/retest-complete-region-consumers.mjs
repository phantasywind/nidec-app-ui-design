// Bounded append-only retest; preserves the original failed qualification stage.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile, realpath } from 'node:fs/promises';
import { join, dirname, delimiter, relative } from 'node:path';
import { createRequire } from 'node:module';
import { inspectArchive, sha256, verifyPhysicalReact, redactLog } from './qualification-contract.mjs';

const root = join(import.meta.dirname, '..');
const directoryActions = process.argv[3] === 'directory-actions';
const run = directoryActions ? 'fluent-directory-actions-1' : 'fluent-complete-region-1';
const evidence = join(root, '.qualification/runs', run);
const retestId = process.argv[2] ?? 'consumer-retest-1';
assert(/^consumer-retest-[1-9][0-9]*$/.test(retestId));
const out = join(evidence, retestId);
const node = join(root, '.tmp/node-22.22.0/node-v22.22.0-win-x64/node.exe');
const expectedHash = directoryActions ? '304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0' : '5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6';
const archive = await readFile(join(evidence, 'build-a/candidate.tgz'));
assert.equal(sha256(archive), expectedHash);
const expected = inspectArchive(archive).files;
await mkdir(out); // Never overwrite an existing retest, even if it failed.
async function save(name, bytes) {
  await writeFile(join(out, name), typeof bytes === 'string' || Buffer.isBuffer(bytes) ? bytes : JSON.stringify(bytes, null, 2) + '\n', { flag: 'wx' });
}
async function files(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    assert(!item.isSymbolicLink());
    const path = join(dir, item.name);
    if (item.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result.sort();
}
await save('executor.mjs', await readFile(new URL(import.meta.url)));
await save('scope.json', { artifact: expectedHash, originalStage: 'consumer-node22', originalFailurePreserved: true,
  description: 'Rerun original verify on previously clean-installed consumers; not a new clean install, browser qualification or release approval.',
  fixturePatch: directoryActions ? 'Narrow Tab event to declared demo IDs; optional host-exclusion markers through supported Tab className and Combobox input slot. See captured source for this retest; candidate unchanged.' : 'See captured consumer source hashes and patch: vite/client declaration; current main.tsx includes Fluent useRestoreFocusTarget for the drawer trigger; candidate bytes unchanged', startedAt: new Date().toISOString() });
const results = [];
for (const name of ['token-only-consumer', 'react-vite-cpq-consumer', directoryActions ? 'react-directory-actions-consumer' : 'react-complete-region-consumer']) {
  const cwd = join(root, '.tmp', run, 'consumer-node22', name);
  assert.equal(sha256(await readFile(join(cwd, 'candidate.tgz'))), expectedHash);
  const sourceFiles = [];
  for (const path of await files(join(cwd, 'src'))) sourceFiles.push({ path: relative(cwd, path), sha256: sha256(await readFile(path)) });
  await save(`${name}-source.json`, sourceFiles);
  if (name === 'react-directory-actions-consumer') {
    const bytes = await readFile(join(cwd, 'src/main.tsx'));
    assert.deepEqual(bytes, await readFile(join(root, 'fixtures', name, 'src/main.tsx')));
    await save('directory-actions-main.tsx', bytes);
  }
  if (name === 'react-complete-region-consumer') {
    const patch = await readFile(join(cwd, 'src/vite-env.d.ts'));
    assert.deepEqual(patch, await readFile(join(root, 'fixtures', name, 'src/vite-env.d.ts')));
    await save('vite-env.d.ts', patch);
    await save('complete-region-main.tsx', await readFile(join(cwd, 'src/main.tsx')));
  }
  const processResult = spawnSync(node, [join(dirname(node), 'node_modules/npm/bin/npm-cli.js'), 'run', 'verify'], {
    cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PATH: `${dirname(node)}${delimiter}${process.env.PATH ?? ''}` },
  });
  await save(`${name}-verify.txt`, redactLog((processResult.stdout ?? '') + (processResult.stderr ?? '')));
  assert.equal(processResult.status, 0, `${name} verify failed`);
  const shared = join(cwd, 'node_modules/@phantasywind/nidec-app-ui-design');
  assert.equal((await files(shared)).length, Object.keys(expected).length);
  for (const [path, digest] of Object.entries(expected)) assert.equal(sha256(await readFile(join(shared, path))), digest);
  const lockBytes = await readFile(join(cwd, 'package-lock.json'));
  const lock = JSON.parse(lockBytes);
  let react = 'not-installed';
  if (name === 'token-only-consumer') {
    for (const path of Object.keys(lock.packages)) assert(!/(^|\/)node_modules\/(react|react-dom|@fluentui\/[^/]+)$/.test(path));
  } else {
    react = await verifyPhysicalReact(cwd, shared);
    assert.equal(lock.packages['node_modules/@fluentui/react-components'].version, '9.74.7');
    assert.equal(await realpath(createRequire(join(cwd, 'package.json')).resolve('@fluentui/react-components')),
      await realpath(createRequire(join(shared, 'package.json')).resolve('@fluentui/react-components')));
  }
  await save(`${name}-package.json`, await readFile(join(cwd, 'package.json')));
  await save(`${name}-lock.json`, lockBytes);
  const outputs = [];
  for (const path of await files(join(cwd, 'dist'))) {
    const bytes = await readFile(path);
    outputs.push({ path: relative(join(cwd, 'dist'), path), bytes: bytes.length, sha256: sha256(bytes) });
  }
  results.push({ name, artifact: expectedHash, node: spawnSync(node, ['--version'], {encoding:'utf8'}).stdout.trim(),
    verifyExitCode: processResult.status, lockSha256: sha256(lockBytes), installedBytesMatch: true, react, outputs });
  console.log(`${name}: verify and installed artifact checks passed`);
}
await save('results.json', results);
const checksums = [];
for (const path of await files(out)) checksums.push(`${sha256(await readFile(path))}  ${relative(out, path).replaceAll('\\', '/')}`);
await save('SHA256SUMS.txt', checksums.join('\n') + '\n');
console.log('Retest recorded; browser/CSP qualification remains separate.');
