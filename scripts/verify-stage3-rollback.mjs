import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const stage3BaseCommit = '184d73b85245774b625a8f702e98e611ede17f43';
const repositoryRoot = resolve(import.meta.dirname, '..');
const proofRoot = resolve(repositoryRoot, '.tmp', 'stage3-rollback-proof');
const currentRoot = join(proofRoot, 'current');
const rollbackRoot = join(proofRoot, 'rollback');
const excludedTopLevelPaths = new Set(['.git', '.pack', '.tmp', '.qualification', 'dist', 'node_modules']);
const stage3IntroducedPaths = [
  '.gitignore',
  '.node-version',
  '.npmrc',
  '.nvmrc',
  'docs/implementation',
  'eslint.config.js',
  'fixtures',
  'package-lock.json',
  'package.json',
  'scripts',
  'src',
  'styles',
  'tests',
  'tokens',
  'tsconfig.build.json',
  'tsconfig.json',
  'vite.config.ts',
  'vitest.config.ts',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runGit(arguments_, encoding = 'utf8') {
  const result = spawnSync('git', arguments_, {
    cwd: repositoryRoot,
    encoding,
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  assert(!result.error, `Git process failed: ${result.error?.message}`);
  assert(result.status === 0, `git ${arguments_.join(' ')} failed.`);
  return result.stdout;
}

async function inventory(root) {
  const files = [];

  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const entryPath = join(path, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile()) {
        files.push(relative(root, entryPath).replaceAll('\\', '/'));
      } else {
        throw new Error(`Unsupported filesystem entry: ${entryPath}`);
      }
    }
  }

  await walk(root);
  return files.sort();
}

function normalizedHash(buffer) {
  if (buffer.includes(0)) {
    return createHash('sha256').update(buffer).digest('hex');
  }
  const normalized = Buffer.from(buffer.toString('utf8').replaceAll('\r\n', '\n'));
  return createHash('sha256').update(normalized).digest('hex');
}

async function compareTrees(leftRoot, rightRoot) {
  const leftInventory = await inventory(leftRoot);
  const rightInventory = await inventory(rightRoot);
  assert(JSON.stringify(leftInventory) === JSON.stringify(rightInventory), 'Restored Stage 3 inventory does not match the original snapshot.');

  for (const path of leftInventory) {
    const left = await readFile(join(leftRoot, path));
    const right = await readFile(join(rightRoot, path));
    assert(normalizedHash(left) === normalizedHash(right), `Restored file hash differs: ${path}`);
  }

  return leftInventory.length;
}

assert(proofRoot === `${repositoryRoot}${sep}.tmp${sep}stage3-rollback-proof`, `Unexpected proof path: ${proofRoot}`);
await rm(proofRoot, { force: true, recursive: true });
await mkdir(proofRoot, { recursive: true });

try {
  await mkdir(currentRoot, { recursive: true });
  for (const entry of await readdir(repositoryRoot, { withFileTypes: true })) {
    if (excludedTopLevelPaths.has(entry.name)) {
      continue;
    }
    await cp(join(repositoryRoot, entry.name), join(currentRoot, entry.name), { recursive: true });
  }
  await cp(currentRoot, rollbackRoot, { recursive: true });

  for (const path of stage3IntroducedPaths) {
    const target = resolve(rollbackRoot, path);
    assert(target.startsWith(`${rollbackRoot}${sep}`), `Refusing to remove out-of-proof path: ${target}`);
    await rm(target, { force: true, recursive: true });
  }

  const baselineRoadmap = runGit(['show', `${stage3BaseCommit}:docs/roadmap.md`], null);
  await writeFile(join(rollbackRoot, 'docs', 'roadmap.md'), baselineRoadmap);

  const baselineInventory = runGit(['ls-tree', '-r', '--name-only', stage3BaseCommit])
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
  const rollbackInventory = await inventory(rollbackRoot);
  assert(
    JSON.stringify(rollbackInventory) === JSON.stringify(baselineInventory),
    `Rollback inventory differs from Stage 3 baseline.\nExpected:\n${baselineInventory.join('\n')}\nActual:\n${rollbackInventory.join('\n')}`,
  );

  for (const path of baselineInventory) {
    const baseline = runGit(['show', `${stage3BaseCommit}:${path}`], null);
    const rolledBack = await readFile(join(rollbackRoot, path));
    assert(normalizedHash(baseline) === normalizedHash(rolledBack), `Rollback content differs from baseline: ${path}`);
  }

  // Restore into the actual rolled-back tree, not a fresh comparison copy.
  await cp(currentRoot, rollbackRoot, { recursive: true });
  const restoredFileCount = await compareTrees(currentRoot, rollbackRoot);
  console.log(`Stage 3 rollback matched baseline ${stage3BaseCommit.slice(0, 7)} across ${baselineInventory.length} files.`);
  console.log(`Stage 3 restoration matched ${restoredFileCount} current source files.`);
} finally {
  await rm(proofRoot, { force: true, recursive: true });
}

console.log('Isolated rollback proof removed; the real worktree was not mutated.');
