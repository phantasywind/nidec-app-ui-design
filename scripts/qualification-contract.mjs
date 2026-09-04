import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

export const PACKAGE_NAME = '@phantasywind/nidec-app-ui-design';
export const PACKAGE_VERSION = '0.0.0-development';
export const FILES = [
  'README.md', 'dist/index.d.ts', 'dist/index.js', 'dist/styles.css',
  'dist/styles.css.d.ts', 'dist/tokens.css', 'dist/tokens.css.d.ts',
  'dist/tokens.json', 'package.json',
];
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const hashPattern = /^[a-f0-9]{64}$/;

// Conservative, bounded tar reader: never extracts. Extensions and links fail closed.
export function inspectArchive(bytes) {
  requireValue(bytes.length <= 16 * 1024 * 1024, 'Archive compressed size exceeds limit');
  const tar = gunzipSync(bytes, { maxOutputLength: 32 * 1024 * 1024 });
  requireValue(tar.length % 512 === 0, 'Unaligned tar');
  const contents = new Map();
  const names = new Set();
  let offset = 0;
  let ended = false;
  const field = (header, start, length) => header.subarray(start, start + length).toString('utf8').replace(/\0.*$/s, '').trim();
  const octal = (header, start, length) => {
    const value = field(header, start, length);
    requireValue(/^[0-7]+$/.test(value), 'Invalid tar octal field');
    return Number.parseInt(value, 8);
  };
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      requireValue(tar.length - offset >= 1024 && tar.subarray(offset).every((byte) => byte === 0), 'Invalid tar end marker');
      ended = true;
      break;
    }
    const checksum = octal(header, 148, 8);
    const computed = header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0);
    requireValue(computed === checksum, 'Invalid tar header checksum');
    requireValue(field(header, 257, 6) === 'ustar', 'Unsupported tar format');
    requireValue(field(header, 345, 155) === '', 'Tar prefixes are not permitted');
    const name = field(header, 0, 100);
    requireValue(/^package\/[A-Za-z0-9._/-]+$/.test(name), 'Unsafe archive path');
    requireValue(!name.split('/').some((part) => part === '..' || part === '.' || part === ''), 'Unsafe archive path segment');
    requireValue(!names.has(name.toLowerCase()), 'Duplicate archive entry');
    names.add(name.toLowerCase());
    const kind = header[156];
    requireValue(kind === 0 || kind === 48, 'Only regular archive files are permitted');
    const size = octal(header, 124, 12);
    const start = offset + 512;
    requireValue(start + size <= tar.length, 'Truncated archive file');
    contents.set(name.slice(8), tar.subarray(start, start + size));
    offset = start + Math.ceil(size / 512) * 512;
  }
  requireValue(ended, 'Missing tar end marker');
  requireValue(JSON.stringify([...contents.keys()].sort()) === JSON.stringify([...FILES].sort()), 'Archive file allowlist mismatch');
  const pkg = JSON.parse(contents.get('package.json').toString('utf8'));
  requireValue(pkg.name === PACKAGE_NAME && pkg.version === PACKAGE_VERSION && pkg.private === true, 'Archive package identity/private mismatch');
  return { sha256: sha256(bytes), size: bytes.length, files: Object.fromEntries([...contents].map(([name, content]) => [name, sha256(content)])) };
}

export function verifyBinding(bytes, artifact) {
  requireValue(artifact && hashPattern.test(artifact.sha256), 'Missing artifact SHA-256');
  requireValue(sha256(bytes) === artifact.sha256, 'Artifact SHA-256 mismatch');
  const actual = inspectArchive(bytes);
  requireValue(actual.size === artifact.size, 'Artifact size mismatch');
  requireValue(JSON.stringify(Object.entries(actual.files).sort()) === JSON.stringify(Object.entries(artifact.files ?? {}).sort()), 'Artifact content manifest mismatch');
  return actual;
}

// This schema deliberately records evidence, not publication permission.
export function validateManifest(manifest) {
  requireValue(manifest?.schemaVersion === 1 && manifest.scope === 'private-scaffold-mechanism', 'Invalid qualification schema/scope');
  requireValue(/^[a-z0-9][a-z0-9-]{0,63}$/.test(manifest.runId), 'Invalid run ID');
  requireValue(/^[a-f0-9]{40}$/.test(manifest.source?.commit) && manifest.source.clean === true, 'Clean committed source required');
  requireValue(hashPattern.test(manifest.source.lockSha256), 'Root lock hash required');
  requireValue(manifest.toolchain?.node === 'v24.20.0' && manifest.toolchain.npm === '11.19.0', 'Exact maintainer toolchain required');
  requireValue(typeof manifest.toolchain.os === 'string' && typeof manifest.toolchain.arch === 'string', 'OS/architecture required');
  requireValue(Number.isFinite(Date.parse(manifest.startedAt)) && Number.isFinite(Date.parse(manifest.finishedAt)) && Date.parse(manifest.finishedAt) >= Date.parse(manifest.startedAt), 'Invalid run timestamps');
  requireValue(['passed', 'failed'].includes(manifest.status), 'Invalid run status');
  requireValue(Array.isArray(manifest.limitations), 'Limitations must be explicit');
  requireValue(manifest.artifact?.filename === 'candidate.tgz' && hashPattern.test(manifest.artifact.sha256), 'Invalid artifact identity');
  requireValue(Array.isArray(manifest.commands) && manifest.commands.length > 0, 'Command evidence required');
  for (const command of manifest.commands) {
    requireValue(typeof command.command === 'string' && Number.isInteger(command.exitCode), 'Invalid command evidence');
  }
  if (manifest.status === 'passed') {
    requireValue(manifest.commands.every((command) => command.exitCode === 0), 'Failed command blocks qualification');
    requireValue(manifest.publicationGuardExitCode === 1 && manifest.cleanupPassed === true && manifest.rollbackPassed === true, 'Guard/cleanup/rollback must pass');
    requireValue(manifest.buildA === manifest.artifact.sha256 && manifest.buildB === manifest.artifact.sha256, 'Independent build hashes must match');
    requireValue(Array.isArray(manifest.consumers) && manifest.consumers.length === 2, 'Two consumer results required');
    requireValue(new Set(manifest.consumers.map((result) => result.name)).size === 2, 'Duplicate consumer evidence');
    for (const consumer of manifest.consumers) {
      requireValue(['token-only-consumer', 'react-vite-cpq-consumer'].includes(consumer.name), 'Unknown consumer');
      requireValue(consumer.artifactSha256 === manifest.artifact.sha256 && consumer.status === 'passed', 'Stale/failed consumer evidence');
      requireValue(hashPattern.test(consumer.lockSha256) && hashPattern.test(consumer.sourceSha256), 'Frozen consumer inputs required');
      requireValue(typeof consumer.node === 'string' && typeof consumer.npm === 'string', 'Actual consumer runtime required');
      requireValue(consumer.smokeStatus === 'passed', 'Runtime smoke must pass');
    }
  }
  return manifest;
}

export function validateFixtureLock(manifest, lock) {
  const spec = 'file:../../artifacts/candidate.tgz';
  requireValue(lock.lockfileVersion === 3, 'Fixture lock version 3 required');
  requireValue(manifest.dependencies?.[PACKAGE_NAME] === spec && lock.packages?.['']?.dependencies?.[PACKAGE_NAME] === spec, 'Portable fixed artifact reference required');
  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (name !== PACKAGE_NAME) requireValue(/^\d+\.\d+\.\d+$/.test(version), 'Fixture direct versions must be exact');
      requireValue(lock.packages[''][section]?.[name] === version, 'Fixture manifest/lock mismatch');
    }
  }
  for (const [name, item] of Object.entries(lock.packages)) {
    if (!name) continue;
    if (name === `node_modules/${PACKAGE_NAME}`) {
      requireValue(item.version === PACKAGE_VERSION && item.resolved === spec && typeof item.integrity === 'string', 'Invalid locked local artifact');
    } else {
      requireValue(typeof item.resolved === 'string' && item.resolved.startsWith('https://registry.npmjs.org/') && typeof item.integrity === 'string', 'Unpinned or non-registry fixture input');
    }
  }
  requireValue(lock.packages[`node_modules/${PACKAGE_NAME}`], 'Locked artifact missing');
  return sha256(Buffer.from(JSON.stringify(lock)));
}

export function redactLog(text) {
  return text
    .replace(/(authorization\s*[:=]\s*)(?:bearer|basic)\s+\S+/gi, '$1[REDACTED]')
    .replace(/((?:_authToken|password|token|secret)\s*[:=]\s*)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/gi, 'https://[REDACTED]@');
}

export async function preserveRun(root, manifest, bytes) {
  validateManifest(manifest);
  verifyBinding(bytes, manifest.artifact);
  await mkdir(root, { recursive: true });
  requireValue(!(await lstat(root)).isSymbolicLink(), 'Retention root cannot be a link');
  const runPath = join(await realpath(root), manifest.runId);
  await mkdir(runPath); // Exclusive reservation: existing or failed runs are never overwritten.
  await writeFile(join(runPath, 'candidate.tgz'), bytes, { flag: 'wx' });
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(join(runPath, 'manifest.json'), manifestBytes, { flag: 'wx' });
  await writeFile(join(runPath, 'SHA256SUMS.txt'), `${sha256(bytes)}  candidate.tgz\n${sha256(manifestBytes)}  manifest.json\n`, { flag: 'wx' });
  return runPath;
}

export async function verifyPhysicalReact(appRoot, packageRoot) {
  const appRequire = createRequire(resolve(appRoot, 'package.json'));
  const packageRequire = createRequire(resolve(packageRoot, 'package.json'));
  const result = {};
  for (const name of ['react', 'react-dom']) {
    const appPath = await realpath(appRequire.resolve(`${name}/package.json`));
    const packagePath = await realpath(packageRequire.resolve(`${name}/package.json`));
    requireValue(appPath === packagePath, `Duplicate physical ${name} resolution`);
    const metadata = JSON.parse(await readFile(appPath, 'utf8'));
    requireValue(metadata.version === '19.2.7', `Unexpected ${name} version`);
    result[name] = { version: metadata.version, resolvedPath: appPath };
  }
  return result;
}
