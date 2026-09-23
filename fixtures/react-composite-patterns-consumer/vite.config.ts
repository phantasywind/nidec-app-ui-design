import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fixtureRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(fixtureRoot, '..', '..');
const useLocalPreview = process.env.NIDEC_UI_LOCAL_PREVIEW === '1';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      ...(useLocalPreview ? [
        { find: '@phantasywind/nidec-app-ui-design/styles.css', replacement: resolve(repositoryRoot, 'dist/styles.css') },
        { find: '@phantasywind/nidec-app-ui-design/date-picker', replacement: resolve(repositoryRoot, 'dist/date-picker.js') },
        { find: '@phantasywind/nidec-app-ui-design/layouts', replacement: resolve(repositoryRoot, 'dist/layouts.js') },
        { find: '@phantasywind/nidec-app-ui-design', replacement: resolve(repositoryRoot, 'dist/index.js') },
      ] : []),
      { find: /^@fluentui\/react-icons\/lib\/(.*)$/, replacement: `${resolve(fixtureRoot, 'node_modules/@fluentui/react-icons/lib')}/$1` },
      { find: /^@fluentui\/react-icons$/, replacement: resolve(fixtureRoot, 'node_modules/@fluentui/react-icons/lib/index.js') },
      { find: 'react', replacement: resolve(fixtureRoot, 'node_modules/react') },
      { find: 'react-dom', replacement: resolve(fixtureRoot, 'node_modules/react-dom') },
    ],
    dedupe: ['react', 'react-dom'],
  },
});
