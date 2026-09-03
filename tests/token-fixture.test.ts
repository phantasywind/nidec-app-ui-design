import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');
const fixtureMarker = 'SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.';

describe('scaffold token metadata', () => {
  it('is explicitly non-brand and publication-blocked', async () => {
    const metadata = JSON.parse(await readFile(join(repositoryRoot, 'dist', 'tokens.json'), 'utf8'));
    const extension = metadata.$extensions['com.nidec.ui.scaffold'];

    expect(metadata.$description).toBe(fixtureMarker);
    expect(extension).toMatchObject({
      status: 'scaffold-only',
      publication: 'blocked',
      brandAuthority: 'absent',
    });
    expect(metadata.tokens).toHaveLength(4);
    expect(metadata.tokens.every((token: { path: string }) => token.path.startsWith('fixture.'))).toBe(true);
    expect(metadata.tokens.every((token: { cssVariable: string }) => token.cssVariable.startsWith('--nidec-ui-fixture-'))).toBe(true);
  });

  it('matches the reviewable generated metadata', async () => {
    const reviewable = await readFile(join(repositoryRoot, 'styles', 'tokens.json'), 'utf8');
    const distributable = await readFile(join(repositoryRoot, 'dist', 'tokens.json'), 'utf8');

    expect(distributable).toBe(reviewable);
  });
});
