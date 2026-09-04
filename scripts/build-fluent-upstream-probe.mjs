import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {build} from 'vite';
import react from '@vitejs/plugin-react';

const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/fluent-upstream-comparison');
await mkdir(evidence); // Exclusive run: do not replace prior evidence.
const fixture=join(root,'fixtures/fluent-upstream-probe');
const versions={};
for(const [name,expected] of [['@fluentui/react-components','9.74.7'],['react','19.2.7'],['react-dom','19.2.7'],['tabster','8.8.1']]){
  const value=JSON.parse(await readFile(join(root,'node_modules',name,'package.json'),'utf8'));
  assert.equal(value.version,expected);versions[name]=value.version;
}
const modules=[];
await build({configFile:false,root:fixture,plugins:[react(),{
  name:'record-upstream-modules',generateBundle(){modules.push(...this.getModuleIds());}
}],build:{outDir:join(evidence,'dist'),emptyOutDir:false}});
assert(!modules.some(id=>id.includes('@phantasywind') || id.replaceAll('\\','/').includes('/src/index.ts')));
await writeFile(join(evidence,'modules.json'),JSON.stringify(modules,null,2));
for(const name of ['index.html','main.tsx'])await writeFile(join(evidence,name),await readFile(join(fixture,name)));
await writeFile(join(evidence,'build-source.mjs'),await readFile(new URL(import.meta.url)));
await writeFile(join(evidence,'package-lock.json'),await readFile(join(root,'package-lock.json')));
await writeFile(join(evidence,'build.json'),JSON.stringify({versions,node:process.version,
  lockSha256:createHash('sha256').update(await readFile(join(root,'package-lock.json'))).digest('hex'),
  note:'Existing locked root installation; production upstream-only diagnostic build, not a clean consumer acceptance run.'},null,2));
