import { rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const distPath = resolve(repositoryRoot, 'dist');

if (distPath !== `${repositoryRoot}${sep}dist`) {
  throw new Error(`Refusing to remove unexpected path: ${distPath}`);
}

await rm(distPath, { force: true, recursive: true });
