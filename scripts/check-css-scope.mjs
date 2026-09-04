import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const fixtureMarker = 'SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.';
const repositoryRoot = resolve(import.meta.dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const root of ['styles', 'dist']) {
  const tokenCss = await readFile(join(repositoryRoot, root, 'tokens.css'), 'utf8');
  const componentCss = await readFile(join(repositoryRoot, root, 'styles.css'), 'utf8');

  for (const [fileName, css] of [
    ['tokens.css', tokenCss],
    ['styles.css', componentCss],
  ]) {
    const cssWithoutComments = css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
    assert(css.includes(fixtureMarker), `${root}/${fileName} is missing the scaffold marker.`);
    assert(css.includes('@layer nidec-ui'), `${root}/${fileName} is outside the approved cascade layer.`);
    assert(
      !/(^|[\s,{])(:root|html|body|\*|#[a-z_-])/im.test(cssWithoutComments),
      `${root}/${fileName} contains a forbidden global selector.`,
    );
  }

  assert(tokenCss.includes('[data-nidec-ui] {'), `${root}/tokens.css is missing the approved host scope.`);
  const declaredVariables = [...tokenCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]);
  assert(declaredVariables.length > 0, `${root}/tokens.css contains no fixture variables.`);
  assert(
    declaredVariables.every((variable) => variable.startsWith('--nidec-ui-fixture-')),
    `${root}/tokens.css contains an unapproved variable namespace.`,
  );
  assert(!componentCss.includes('[data-nidec-ui]'), `${root}/styles.css must remain empty for the native Button prototype.`);
}

console.log('Scoped fixture CSS contract verified.');
