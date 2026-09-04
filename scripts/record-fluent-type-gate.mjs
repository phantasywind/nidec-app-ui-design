import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, delimiter } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, '.qualification', 'runs', 'fluent-transition', 'type-gate');
await mkdir(output, { recursive: false });
const npm = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
const env = { ...process.env, PATH: `${dirname(process.execPath)}${delimiter}${process.env.PATH ?? ''}` };
const metadata = spawnSync(process.execPath, [npm, 'view', '@fluentui/react-components@9.74.7',
  'version', 'dist', 'peerDependencies', 'dependencies', '--json', '--offline', '--cache=.tmp/fluent-npm-cache'],
{ cwd: root, env, encoding:'utf8' });
await writeFile(join(output, 'registry-metadata.json'), metadata.stdout);
await writeFile(join(output, 'registry-stderr.txt'), metadata.stderr);
const check = spawnSync(process.execPath, [npm, 'run', 'typecheck'], { cwd:root, env, encoding:'utf8' });
await writeFile(join(output, 'typecheck.txt'), check.stdout + check.stderr);
await writeFile(join(output, 'candidate.patch'), execFileSync('git', ['diff', '--binary', 'HEAD'], {cwd:root}));
const files = ['package.json', 'package-lock.json', 'src/index.ts', 'vite.config.ts',
  'tests/button.test.ts', 'tests/fluent-contract.test.ts',
  'fixtures/react-vite-cpq-consumer/package.json', 'fixtures/react-vite-cpq-consumer/src/main.tsx'];
const hashes = [];
for (const path of files) {
  const bytes = await readFile(join(root,path));
  const snapshot = join(output,'candidate',path);
  await mkdir(dirname(snapshot), {recursive:true});
  await writeFile(snapshot,bytes);
  hashes.push({ path, sha256:createHash('sha256').update(bytes).digest('hex') });
}
const summary = { node:process.version, metadataExitCode:metadata.status,
  typecheckExitCode:check.status, status:check.status === 0 ? 'typecheck-only-pass' : 'failed',
  files:hashes, packageQualification:'not-run', browserQualification:'not-run' };
await writeFile(join(output, 'summary.json'), JSON.stringify(summary,null,2) + '\n');
console.log(JSON.stringify(summary,null,2));
process.stdout.write(check.stdout + check.stderr);
process.exitCode = check.status ?? 1;
