import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const run = join(root, '.qualification/runs/fluent-platform-surfaces-1');
const paths = ['browser-consumer-retest-1', 'browser-1', 'browser-2'];
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else files.push(path);
  }
}
for (const path of paths) await collect(join(run, path));
files.sort((a, b) => a.localeCompare(b, 'en'));
const lines = [];
for (const path of files) {
  const digest = createHash('sha256').update(await readFile(path)).digest('hex');
  lines.push(`${digest}  ${relative(run, path).replaceAll('\\', '/')}`);
}
await writeFile(join(run, 'BROWSER-SHA256SUMS.txt'), `${lines.join('\n')}\n`, {flag: 'wx'});
const saved = await readFile(join(run, 'BROWSER-SHA256SUMS.txt'), 'utf8');
if (saved !== `${lines.join('\n')}\n`) throw new Error('Browser evidence manifest readback mismatch');
console.log(JSON.stringify({files: files.length, manifestSha256: createHash('sha256').update(saved).digest('hex')}, null, 2));
