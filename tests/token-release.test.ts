import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');

describe('governed release token metadata', () => {
  it('binds all light-theme roles to ADR-0006 without scaffold markers', async () => {
    const metadata = JSON.parse(await readFile(join(repositoryRoot, 'dist', 'tokens.json'), 'utf8'));
    const extension = metadata.$extensions['com.nidec.ui'];

    expect(extension).toMatchObject({
      status: 'release-candidate',
      publication: 'qualified-input',
      authority: 'ADR-0006',
      darkMode: 'out-of-scope',
      source: 'tokens/nidec-light.tokens.json',
    });
    expect(metadata.tokens).toHaveLength(16);
    expect(metadata.tokens.every((token: { path: string }) => token.path.startsWith('color.'))).toBe(true);
    expect(metadata.tokens.every((token: { cssVariable: string }) => token.cssVariable.startsWith('--nidec-ui-color-'))).toBe(true);
    expect(JSON.stringify(metadata)).not.toContain('SCAFFOLD FIXTURE ONLY');
  });

  it('matches the reviewable generated metadata', async () => {
    const reviewable = await readFile(join(repositoryRoot, 'styles', 'tokens.json'), 'utf8');
    const distributable = await readFile(join(repositoryRoot, 'dist', 'tokens.json'), 'utf8');
    expect(distributable).toBe(reviewable);
  });
});
