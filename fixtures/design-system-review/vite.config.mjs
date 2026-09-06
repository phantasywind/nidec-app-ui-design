import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname);
const cpq = 'D:/Documents/Nidec Elevator CPQ/client';
const qualified = resolve(root, '../../.tmp/fluent-directory-actions-1/consumer-node22/react-directory-actions-consumer/node_modules');
const hashes = new Map();
const snapshots = {name:'review-screenshots',generateBundle(){for(const name of ['forms-viewport.png','actions-viewport.png','gallery-viewport.png']){const path=resolve(root,'../../.tmp/design-system-review-evidence',name);if(existsSync(path))this.emitFile({type:'asset',fileName:'evidence/'+name,source:readFileSync(path)});}}};
export default defineConfig({
 root, plugins: [react(), snapshots, {name:'review-provenance',transform(code,id){if(id.startsWith(cpq)&&!id.includes('node_modules')&&!id.includes('?'))hashes.set(id,createHash('sha256').update(readFileSync(id)).digest('hex'));},generateBundle(){this.emitFile({type:'asset',fileName:'source-manifest.json',source:JSON.stringify({capturedAt:new Date().toISOString(),candidateSha256:'304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0',note:'Read-only imports from current CPQ working tree; not a historical pristine baseline. Synthetic data only.',sources:Object.fromEntries(hashes)},null,2)});}}],
 resolve:{alias:[{find:'@cpq',replacement:cpq+'/src'},{find:/^@phantasywind\/nidec-app-ui-design$/,replacement:qualified+'/@phantasywind/nidec-app-ui-design/dist/index.js'},{find:/^react-dom(\/.*)?$/,replacement:qualified+'/react-dom$1'},{find:/^react(\/.*)?$/,replacement:qualified+'/react$1'},{find:/^@fluentui\/react-components$/,replacement:qualified+'/@fluentui/react-components/lib/index.js'},{find:'lucide-react',replacement:cpq+'/node_modules/lucide-react'},{find:'react-router-dom',replacement:cpq+'/node_modules/react-router-dom'},{find:'recharts',replacement:cpq+'/node_modules/recharts'}],dedupe:['react','react-dom']},
 build:{outDir:resolve(root,'../../.tmp/design-system-review-dist'),emptyOutDir:true},
 server:{host:'127.0.0.1',port:5191,strictPort:true,fs:{allow:[resolve(root,'../..'),cpq]}},preview:{host:'127.0.0.1',port:5191,strictPort:true}
});
