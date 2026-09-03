import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const entry = fileURLToPath(new URL('./src/index.ts', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es'],
      fileName: () => 'index.js',
    },
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
});
