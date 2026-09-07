import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const run = join(root, '.qualification/runs/fluent-platform-surfaces-1');
const source = join(root, '.tmp/fluent-platform-surfaces-1/consumer-node22/react-platform-surfaces-consumer');
const evidence = join(run, 'browser-consumer-retest-1');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const artifact = hash(await readFile(join(run, 'build-a/candidate.tgz')));
assert.equal(artifact, '65b9b2d4f557995e63f122f95b0037f4aa6b30cf401d0c361c99a467933e5998');
const installed = JSON.parse(await readFile(join(source, 'node_modules/@phantasywind/nidec-app-ui-design/package.json'), 'utf8'));
assert.equal(installed.version, '0.0.0-development');
assert.equal(hash(await readFile(join(source, 'candidate.tgz'))), artifact);

const outputs = [];
async function collect(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else {
      const bytes = await readFile(path);
      outputs.push({path: relative(join(source, 'dist'), path), bytes: (await stat(path)).size, sha256: hash(bytes)});
    }
  }
}
await collect(join(source, 'dist'));
await mkdir(evidence);
await cp(join(source, 'dist'), join(evidence, 'dist'), {recursive: true, errorOnExist: true, force: false});
await writeFile(join(evidence, 'results.json'), JSON.stringify({
  purpose: 'Post-qualification fixture correction: explicit nonce-aware Fluent renderer; package bytes unchanged.',
  node: process.version,
  artifact,
  fluent: JSON.parse(await readFile(join(source, 'node_modules/@fluentui/react-components/package.json'), 'utf8')).version,
  react: JSON.parse(await readFile(join(source, 'node_modules/react/package.json'), 'utf8')).version,
  outputs,
}, null, 2), {flag: 'wx'});
await writeFile(join(evidence, 'source-main.tsx'), await readFile(join(source, 'src/main.tsx')), {flag: 'wx'});
await writeFile(join(evidence, 'recorder-source.mjs'), await readFile(new URL(import.meta.url)), {flag: 'wx'});
console.log(JSON.stringify({evidence, artifact, outputs}, null, 2));
