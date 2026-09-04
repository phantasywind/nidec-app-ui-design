import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');

describe('generated CSS isolation', () => {
  it('keeps token variables inside the approved layer and host', async () => {
    const css = await readFile(join(repositoryRoot, 'dist', 'tokens.css'), 'utf8');

    expect(css).toContain('@layer nidec-ui');
    expect(css).toContain('[data-nidec-ui] {');
    expect(css).not.toMatch(/:root|\bhtml\b|\bbody\b/);
    expect(css).not.toContain('#009b4a');
  });

  it('keeps custom component styles empty for the native Button prototype', async () => {
    const css = await readFile(join(repositoryRoot, 'dist', 'styles.css'), 'utf8');

    expect(css).toContain('@layer nidec-ui');
    expect(css).not.toContain('[data-nidec-ui]');
    expect(css).not.toMatch(/\.[a-zA-Z_-][a-zA-Z0-9_-]*\s*\{/);
  });
});
