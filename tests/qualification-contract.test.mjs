import { describe, it, expect } from 'vitest';
import { gzipSync } from 'node:zlib';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FILES, PACKAGE_NAME, PACKAGE_VERSION, inspectArchive, verifyBinding, validateManifest, validateFixtureLock, redactLog, preserveRun, verifyPhysicalReact } from '../scripts/qualification-contract.mjs';

function archive(entries = FILES.map((name) => ({ name: `package/${name}`, content: name === 'package.json' ? JSON.stringify({ name: PACKAGE_NAME, version: PACKAGE_VERSION, private: true }) : 'fixture' }))) {
  const chunks = [];
  for (const entry of entries) {
    const body = Buffer.from(entry.content ?? 'fixture');
    const header = Buffer.alloc(512);
    header.write(entry.name);
    header.write(`${body.length.toString(8).padStart(11, '0')}\0`, 124);
    header.fill(32, 148, 156);
    header[156] = entry.kind ?? 48;
    header.write('ustar\0', 257);
    const sum = header.reduce((a, b) => a + b, 0);
    header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
    chunks.push(header, body, Buffer.alloc((512 - body.length % 512) % 512));
  }
  return gzipSync(Buffer.concat([...chunks, Buffer.alloc(1024)]));
}
const bytes = archive();
const artifact = { filename: 'candidate.tgz', ...inspectArchive(bytes) };
function manifest() {
  return {
    schemaVersion: 1, scope: 'private-scaffold-mechanism', runId: 'unit-test',
    source: { commit: 'a'.repeat(40), clean: true, lockSha256: 'b'.repeat(64) },
    toolchain: { node: 'v24.20.0', npm: '11.19.0', os: 'test', arch: 'test' },
    startedAt: '2026-09-04T00:00:00Z', finishedAt: '2026-09-04T00:01:00Z',
    status: 'passed', limitations: ['Synthetic unit-test evidence only'], artifact,
    commands: [{ command: 'synthetic', exitCode: 0 }], publicationGuardExitCode: 1,
    cleanupPassed: true, rollbackPassed: true, buildA: artifact.sha256, buildB: artifact.sha256,
    consumers: ['token-only-consumer', 'react-vite-cpq-consumer'].map((name) => ({ name, status: 'passed', artifactSha256: artifact.sha256, lockSha256: 'c'.repeat(64), sourceSha256: 'd'.repeat(64), node: 'test', npm: 'test', smokeStatus: 'passed' })),
  };
}
describe('qualification contract (synthetic evidence, not qualification)', () => {
  it('inspects actual bytes and binds their full content manifest', () => {
    expect(verifyBinding(bytes, artifact).files).toHaveProperty('package.json');
    expect(() => verifyBinding(Buffer.concat([bytes, Buffer.from('tampered')]), artifact)).toThrow('SHA-256 mismatch');
    expect(() => verifyBinding(bytes, { ...artifact, size: 0 })).toThrow('size mismatch');
    expect(() => verifyBinding(bytes, { ...artifact, files: {} })).toThrow('content manifest mismatch');
  });
  it.each([
    [{ name: 'package/../escape' }, 'Unsafe archive path segment'],
    [{ name: '/absolute' }, 'Unsafe archive path'],
    [{ name: 'package/link', kind: 50 }, 'Only regular'],
    [{ name: 'package/unexpected' }, 'allowlist'],
  ])('rejects unsafe or unexpected archive entries %j', (entry, error) => {
    expect(() => inspectArchive(archive([entry]))).toThrow(error);
  });
  it('rejects duplicates and invalid gzip', () => {
    expect(() => inspectArchive(archive([{ name: 'package/a' }, { name: 'package/A' }]))).toThrow('Duplicate');
    expect(() => inspectArchive(Buffer.from('not gzip'))).toThrow();
  });
  it('accepts a complete synthetic record', () => expect(validateManifest(manifest()).status).toBe('passed'));
  it.each(['source', 'command', 'cleanup', 'rollback', 'build', 'consumer', 'smoke', 'runId'])('blocks invalid %s evidence', (field) => {
    const record = manifest();
    if (field === 'source') record.source.clean = false;
    if (field === 'command') record.commands[0].exitCode = 1;
    if (field === 'cleanup') record.cleanupPassed = false;
    if (field === 'rollback') record.rollbackPassed = false;
    if (field === 'build') record.buildB = 'e'.repeat(64);
    if (field === 'consumer') record.consumers[0].artifactSha256 = 'e'.repeat(64);
    if (field === 'smoke') record.consumers[0].smokeStatus = 'not-executed';
    if (field === 'runId') record.runId = '../escape';
    expect(() => validateManifest(record)).toThrow();
  });
  it('requires portable exact fixture inputs', () => {
    const spec = 'file:../../artifacts/candidate.tgz';
    const pkg = { dependencies: { [PACKAGE_NAME]: spec }, devDependencies: { vite: '8.2.2' } };
    const lock = { lockfileVersion: 3, packages: { '': structuredClone(pkg), [`node_modules/${PACKAGE_NAME}`]: { version: PACKAGE_VERSION, resolved: spec, integrity: 'sha512-test' }, 'node_modules/vite': { version: '8.2.2', resolved: 'https://registry.npmjs.org/vite/-/vite-8.2.2.tgz', integrity: 'sha512-test' } } };
    expect(validateFixtureLock(pkg, lock)).toHaveLength(64);
    expect(() => validateFixtureLock({ ...pkg, dependencies: { [PACKAGE_NAME]: 'file:D:/transient.tgz' } }, lock)).toThrow('Portable');
    expect(() => validateFixtureLock({ ...pkg, devDependencies: { vite: '^8.2.2' } }, lock)).toThrow('exact');
    lock.packages['node_modules/vite'].resolved = 'https://elsewhere.invalid/vite.tgz';
    expect(() => validateFixtureLock(pkg, lock)).toThrow('non-registry');
  });
  it('retains bytes and refuses overwrite', async () => {
    const root = await mkdtemp(join(tmpdir(), 'nidec-qualification-test-'));
    try {
      const path = await preserveRun(root, manifest(), bytes);
      expect(await readFile(join(path, 'candidate.tgz'))).toEqual(bytes);
      await expect(preserveRun(root, manifest(), bytes)).rejects.toThrow();
      expect(JSON.parse(await readFile(join(path, 'manifest.json'), 'utf8')).runId).toBe('unit-test');
      expect(await readFile(join(path, 'SHA256SUMS.txt'), 'utf8')).toContain(artifact.sha256);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
  it('redacts common credential forms', () => {
    const result = redactLog('Authorization: Bearer fake-value\n_authToken=another-fake\nhttps://user:fake-password@example.test');
    expect(result).not.toContain('fake');
    expect(result).toContain('[REDACTED]');
  });
  it('detects same-version physical duplicates', async () => {
    const root = await mkdtemp(join(tmpdir(), 'nidec-react-test-'));
    const packageRoot = join(root, 'node_modules', '@phantasywind', 'nidec-app-ui-design');
    try {
      await mkdir(packageRoot, { recursive: true });
      for (const name of ['react', 'react-dom']) {
        const target = join(root, 'node_modules', name);
        await mkdir(target, { recursive: true });
        await writeFile(join(target, 'package.json'), JSON.stringify({ name, version: '19.2.7' }));
      }
      expect((await verifyPhysicalReact(root, packageRoot)).react.version).toBe('19.2.7');
      // Use a fresh resolution origin; Node caches resolution within a process.
      const duplicateRoot = join(root, 'node_modules', 'duplicate-consumer');
      const nested = join(duplicateRoot, 'node_modules', 'react');
      await mkdir(nested, { recursive: true });
      await writeFile(join(nested, 'package.json'), JSON.stringify({ name: 'react', version: '19.2.7' }));
      await expect(verifyPhysicalReact(root, duplicateRoot)).rejects.toThrow('Duplicate physical react');
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
