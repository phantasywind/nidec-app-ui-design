import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('shared hover background', () => {
  it('gives every unselected hover the shared neutral grey, never a brand fill', async () => {
    const files = (await readdir(join(root, 'src'), { recursive: true })).filter(file => file.endsWith('.ts'));
    const source = (await Promise.all(files.map(file => readFile(join(root, 'src', file), 'utf8')))).join('\n');
    const css = await readFile(join(root, 'styles', 'components.css'), 'utf8');
    // Selected, checked or pressed items keep their own selected-state hover
    // fill (for example the ViewModeToggle `selected` slot on a grey surface).
    // A filled button darkens its own fill on hover, as the primary button does.
    const sourceHovers = [...source.matchAll(/'([^'\n]*:hover)': \{\s*backgroundColor: (tokens\.\w+)/g)]
      .filter(match => !/aria-(selected|checked)="true"/.test(match[1]!)
        && !/selected: \{[^}]*$/.test(source.slice(Math.max(0, match.index - 200), match.index))
        && !/useAttentionStyles = makeStyles\(\{[^]*$/.test(source.slice(Math.max(0, match.index - 400), match.index)));
    const cssHovers = [...css.matchAll(/([^{}\n]*:hover[^{}\n]*)\{([^}]*)\}/g)]
      .filter(([, selector, body]) => /background:/.test(body!) && !/aria-(selected|checked)="true"/.test(selector!));
    expect(sourceHovers.length).toBeGreaterThan(0);
    expect(cssHovers.length).toBeGreaterThan(0);
    for (const [, selector, token] of sourceHovers) expect(token, selector).toBe('tokens.colorNeutralBackground1Hover');
    for (const [, selector, body] of cssHovers) expect(body, selector).toMatch(/background:\s*var\(--colorNeutralBackground1Hover\)/);
  });
});
