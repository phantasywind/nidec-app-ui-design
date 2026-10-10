import { copyFile, rm } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { rollup } from 'rollup';
import { dts } from 'rollup-plugin-dts';

// tsc emits one declaration per source module. The root entry is implemented
// across src/internal/components, so its declarations are bundled into one
// self-contained file and internal module paths never enter the package.
const repositoryRoot = resolve(import.meta.dirname, '..');
const declarationsPath = resolve(repositoryRoot, '.tmp', 'declarations');
const distPath = join(repositoryRoot, 'dist');

if (declarationsPath !== `${repositoryRoot}${sep}.tmp${sep}declarations`) {
  throw new Error(`Refusing to use unexpected path: ${declarationsPath}`);
}

const bundle = await rollup({
  input: join(declarationsPath, 'index.d.ts'),
  external: (id) => /^(react|react-dom|@fluentui\/react-components)(\/|$)/.test(id),
  plugins: [dts()],
});
await bundle.write({ file: join(distPath, 'index.d.ts'), format: 'es' });
await bundle.close();

// These entries are single self-contained modules; their tsc output is final.
for (const entry of ['layouts', 'date-picker']) {
  await copyFile(join(declarationsPath, `${entry}.d.ts`), join(distPath, `${entry}.d.ts`));
}

await rm(declarationsPath, { force: true, recursive: true });
