import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

export const RELEASE_PACKAGE_NAME = '@phantasywind/nidec-app-ui-design';
export const RELEASE_PACKAGE_VERSION = '0.2.0';
export const RELEASE_FILES = [
  'README.md', 'dist/date-picker.d.ts', 'dist/date-picker.js', 'dist/index.d.ts', 'dist/index.js', 'dist/layouts.d.ts', 'dist/layouts.js', 'dist/styles.css',
  'dist/styles.css.d.ts', 'dist/tokens.css', 'dist/tokens.css.d.ts',
  'dist/tokens.json', 'package.json',
];

export const releaseSha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };

export function inspectReleaseArchive(bytes) {
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
  requireValue(JSON.stringify([...contents.keys()].sort()) === JSON.stringify([...RELEASE_FILES].sort()), 'Archive file allowlist mismatch');
  const pkg = JSON.parse(contents.get('package.json').toString('utf8'));
  requireValue(pkg.name === RELEASE_PACKAGE_NAME && pkg.version === RELEASE_PACKAGE_VERSION && pkg.private === false, 'Release package identity mismatch');
  requireValue(pkg.publishConfig?.registry === 'https://npm.pkg.github.com' && pkg.publishConfig?.access === 'restricted', 'Release registry contract mismatch');
  return { sha256: releaseSha256(bytes), size: bytes.length, files: Object.fromEntries([...contents].map(([name, content]) => [name, releaseSha256(content)])) };
}

export function verifyReleaseBinding(bytes, artifact) {
  requireValue(artifact && /^[a-f0-9]{64}$/.test(artifact.sha256), 'Missing artifact SHA-256');
  requireValue(releaseSha256(bytes) === artifact.sha256, 'Artifact SHA-256 mismatch');
  const actual = inspectReleaseArchive(bytes);
  requireValue(actual.size === artifact.size, 'Artifact size mismatch');
  requireValue(JSON.stringify(Object.entries(actual.files).sort()) === JSON.stringify(Object.entries(artifact.files ?? {}).sort()), 'Artifact content manifest mismatch');
  return actual;
}
