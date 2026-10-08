import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('keeps preview content and embedded guidance in English', () => {
  for (const file of ['catalog.ts', 'main.tsx', 'component-pages.tsx', 'demos.tsx', 'usage-examples.tsx']) {
    expect(readFileSync(`fixtures/react-composite-patterns-consumer/src/${file}`, 'utf8'), file).not.toMatch(/\p{Script=Han}/u);
  }
  expect(readFileSync('docs/consumer-ui-adoption.md', 'utf8')).not.toMatch(/\p{Script=Han}/u);
});
