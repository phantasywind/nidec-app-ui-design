import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');

describe('package contract', () => {
  it('pins the release candidate and exposes only approved subpaths', async () => {
    const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

    expect(packageJson.version).toBe('0.1.0-rc.1');
    expect(packageJson.private).toBe(false);
    expect(packageJson.publishConfig).toEqual({ registry: 'https://npm.pkg.github.com', access: 'restricted' });
    expect(packageJson.sideEffects).toEqual(['./dist/styles.css', './dist/tokens.css']);
    expect(packageJson.scripts.prepublishOnly).toBe('npm run publication:check && npm run release:authorize');
    expect(packageJson.dependencies?.['@fluentui/react-icons']).toBeUndefined();
    expect(packageJson.peerDependencies?.['@fluentui/react-icons']).toBeUndefined();
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
