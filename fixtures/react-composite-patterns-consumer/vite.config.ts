import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fixtureRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: resolve(fixtureRoot, 'node_modules/react'),
      'react-dom': resolve(fixtureRoot, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
});
