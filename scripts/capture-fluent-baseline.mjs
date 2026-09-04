import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const destination = join(root, '.qualification', 'runs', 'fluent-transition', 'baseline');
await mkdir(destination, { recursive: false });
const git = (...args) => execFileSync('git', args, { cwd: root });
const paths = ['package.json', 'package-lock.json', 'src/index.ts', 'vite.config.ts',
  'docs/roadmap.md', 'docs/implementation/button-prototype-record.md',
  'docs/implementation/button-validation-record.md'];
const records = [];
for (const path of paths) {
  const target = join(destination, 'files', path);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, path), target);
  records.push({ path, sha256: createHash('sha256').update(await readFile(target)).digest('hex') });
}
await writeFile(join(destination, 'working-tree.patch'), git('diff', '--binary', 'HEAD'));
await writeFile(join(destination, 'baseline.json'), JSON.stringify({
  head: git('rev-parse', 'HEAD').toString().trim(),
  status: git('status', '--short').toString(), files: records,
}, null, 2) + '\n');
console.log(JSON.stringify({ destination, files: records }, null, 2));
