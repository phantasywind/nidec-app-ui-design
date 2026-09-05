// Advance browser checking while the two independent clean restores continue.
// This warm consumer is explicitly not a substitute for their qualification.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, resolve } from 'node:path';
import { inspectArchive, verifyPhysicalReact } from './qualification-contract.mjs';
const root=resolve(import.meta.dirname,'..'),run=join(root,'.qualification/runs/nidec-light-theme-1');
const dir=join(run,'warm-consumer'),consumer=join(root,'.tmp/fluent-form-batch-1/consumer-node22/react-form-batch-consumer');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await mkdir(dir);
async function npm(version,cwd,args,name){
  const node=join(root,`.tmp/node-${version}/node-v${version}-win-x64/node.exe`);
  const r=spawnSync(node,[join(dirname(node),'node_modules/npm/bin/npm-cli.js'),...args],{cwd,encoding:'utf8',maxBuffer:32*1024*1024,
    env:{...process.env,PATH:`${dirname(node)}${delimiter}${process.env.PATH??''}`,npm_config_cache:join(root,'.tmp/fluent-npm-cache')}});
  await writeFile(join(dir,name),(r.stdout??'')+(r.stderr??''),{flag:'wx'});
  assert.equal(r.status,0,name);return r.stdout;
}
const packed=JSON.parse(await npm('24.20.0',root,['pack','--ignore-scripts','--json','--pack-destination',dir],'pack.txt'))[0];
const archive=await readFile(join(dir,packed.filename)),identity=inspectArchive(archive),digest=hash(archive);
const filename=`light-${digest}.tgz`;
await writeFile(join(consumer,filename),archive,{flag:'wx'});
await cp(join(consumer,'src'),join(dir,'source-before'),{recursive:true});
for(const name of ['package.json','package-lock.json'])await cp(join(consumer,name),join(dir,`before-${name}`));
await cp(join(root,'fixtures/react-form-batch-consumer/src'),join(consumer,'src'),{recursive:true});
await npm('22.22.0',consumer,['install','--ignore-scripts','--offline',`./${filename}`],'install.txt');
await npm('22.22.0',consumer,['run','verify'],'verify.txt');
const shared=join(consumer,'node_modules/@phantasywind/nidec-app-ui-design');
for(const [path,digest] of Object.entries(identity.files))assert.equal(hash(await readFile(join(shared,path))),digest);
const react=await verifyPhysicalReact(consumer,shared);
for(const name of ['package.json','package-lock.json'])await cp(join(consumer,name),join(dir,name));
await cp(join(consumer,'dist'),join(dir,'dist'),{recursive:true});
await writeFile(join(dir,'result.json'),JSON.stringify({artifact:digest,bytes:archive.length,react,scope:'Warm exact-version consumer, not a clean restore'},null,2),{flag:'wx'});
await writeFile(join(dir,'executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
console.log(`Warm consumer ready: ${digest}`);
