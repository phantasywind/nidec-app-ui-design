import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const siteRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(siteRoot, '..');

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? './',
  plugins: [react()],
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  resolve: {
    alias: [
      { find: '@phantasywind/nidec-app-ui-design/styles.css', replacement: resolve(repoRoot, 'dist/styles.css') },
      { find: '@phantasywind/nidec-app-ui-design/tokens.css', replacement: resolve(repoRoot, 'dist/tokens.css') },
      { find: '@phantasywind/nidec-app-ui-design/tokens.json', replacement: resolve(repoRoot, 'dist/tokens.json') },
      { find: '@phantasywind/nidec-app-ui-design/date-picker', replacement: resolve(repoRoot, 'dist/date-picker.js') },
      { find: '@phantasywind/nidec-app-ui-design/layouts', replacement: resolve(repoRoot, 'dist/layouts.js') },
      { find: '@phantasywind/nidec-app-ui-design', replacement: resolve(repoRoot, 'dist/index.js') },
      { find: /^@fluentui\/react-icons\/lib\/(.*)$/, replacement: `${resolve(siteRoot, 'node_modules/@fluentui/react-icons/lib')}/$1` },
      { find: /^@fluentui\/react-icons$/, replacement: resolve(siteRoot, 'node_modules/@fluentui/react-icons/lib/index.js') },
      { find: 'react', replacement: resolve(siteRoot, 'node_modules/react') },
      { find: 'react-dom', replacement: resolve(siteRoot, 'node_modules/react-dom') },
      { find: '@fluentui/react-components', replacement: resolve(siteRoot, 'node_modules/@fluentui/react-components') },
      { find: '@fluentui/react-datepicker-compat', replacement: resolve(siteRoot, 'node_modules/@fluentui/react-datepicker-compat') },
    ],
    dedupe: ['react', 'react-dom', '@fluentui/react-components', '@fluentui/react-shared-contexts'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
