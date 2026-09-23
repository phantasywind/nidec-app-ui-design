import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const entry = {
  index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  layouts: fileURLToPath(new URL('./src/layouts.ts', import.meta.url)),
  'date-picker': fileURLToPath(new URL('./src/date-picker.ts', import.meta.url)),
};

export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
    },
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      external: (id) => /^(react|react-dom|@fluentui\/react-components|@fluentui\/react-datepicker-compat)(\/|$)/.test(id),
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
