import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');

describe('package contract', () => {
  it('keeps the package private and exposes only approved subpaths', async () => {
    const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

    expect(packageJson.private).toBe(true);
    expect(packageJson.exports).toEqual({
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
      './tokens.css': {
        types: './dist/tokens.css.d.ts',
        default: './dist/tokens.css',
      },
      './styles.css': {
        types: './dist/styles.css.d.ts',
        default: './dist/styles.css',
      },
      './tokens.json': './dist/tokens.json',
    });
    expect(packageJson.dependencies).toBeUndefined();
  });
});
