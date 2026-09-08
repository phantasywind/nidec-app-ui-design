import { createHash } from 'node:crypto';
import { readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { inspectReleaseArchive, RELEASE_FILES, RELEASE_PACKAGE_NAME, RELEASE_PACKAGE_VERSION } from './release-contract.mjs';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packPath = resolve(repositoryRoot, '.pack');
const cachePath = resolve(repositoryRoot, '.tmp', 'fluent-npm-cache');
const npmCliPath = process.env.npm_execpath;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(packPath === `${repositoryRoot}${sep}.pack`, `Unexpected pack path: ${packPath}`);
assert(typeof npmCliPath === 'string' && npmCliPath.length > 0, 'npm_execpath is required for exact npm execution.');
await rm(packPath, { force: true, recursive: true });
await mkdir(packPath, { recursive: true });
await mkdir(cachePath, { recursive: true });

const packResult = spawnSync(
  process.execPath,
  [npmCliPath, 'pack', '--json', '--ignore-scripts', '--pack-destination', packPath],
  {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: cachePath, npm_config_audit: 'false', npm_config_fund: 'false' },
    maxBuffer: 10 * 1024 * 1024,
  },
);

if (packResult.stderr) {
  process.stderr.write(packResult.stderr);
}
assert(!packResult.error, `npm pack process failed: ${packResult.error?.message}`);
assert(packResult.status === 0, `npm pack failed with exit code ${packResult.status}.`);

const parsed = JSON.parse(packResult.stdout);
assert(Array.isArray(parsed) && parsed.length === 1, 'npm pack must produce exactly one artifact record.');
const artifact = parsed[0];
assert(artifact.name === RELEASE_PACKAGE_NAME, 'Unexpected packed package name.');
assert(artifact.version === RELEASE_PACKAGE_VERSION, 'Unexpected packed package version.');

const expectedFiles = RELEASE_FILES;
const actualFiles = artifact.files.map((file) => file.path.replaceAll('\\', '/')).sort();
assert(
  JSON.stringify(actualFiles) === JSON.stringify(expectedFiles),
  `Unexpected packed files:\n${actualFiles.join('\n')}`,
);

const artifactPath = join(packPath, artifact.filename);
const artifactBytes = await readFile(artifactPath);
const archiveEvidence = inspectReleaseArchive(artifactBytes);
const sha256 = createHash('sha256').update(artifactBytes).digest('hex');
const evidence = {
  package: artifact.name,
  version: artifact.version,
  filename: artifact.filename,
  size: artifact.size,
  unpackedSize: artifact.unpackedSize,
  entryCount: artifact.entryCount,
  integrity: artifact.integrity,
  shasum: artifact.shasum,
  sha256,
  files: actualFiles,
  archiveEvidence,
};

await writeFile(join(packPath, 'pack-result.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
await writeFile(join(packPath, 'SHA256SUMS.txt'), `${sha256}  ${artifact.filename}\n`, 'utf8');

console.log(`Packed ${artifact.filename} with ${actualFiles.length} allowed files.`);
console.log(`SHA-256 ${sha256}`);
