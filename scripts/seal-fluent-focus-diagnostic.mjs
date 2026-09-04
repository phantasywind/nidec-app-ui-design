import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/fluent-focus-diagnostic');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const old=join(root,'.qualification/runs/fluent-adaptation');
const oldSums=await readFile(join(old,'SHA256SUMS.txt'));
assert.equal(digest(oldSums),'4e296623b37aeaf5f4168f53c72f138dbcdf9b658c8033bb7e3a746239c52786');
let preserved=0;
for(const line of oldSums.toString().trim().split(/\r?\n/)){
  const match=/^([a-f0-9]{64})\s+\*?(.+)$/.exec(line);
  assert(match);assert.equal(digest(await readFile(join(old,match[2]))),match[1]);preserved++;
}
const reports=[];
for(const name of (await readdir(evidence)).filter(name=>name.endsWith('-audit.json')).sort()){
  const value=JSON.parse(await readFile(join(evidence,name),'utf8'));
  reports.push({file:name,run:value.run,reason:value.reason,width:value.before.width,
    dialog:value.before.dialog,active:value.before.active,guards:value.before.guards,
    before:value.before.documentWidth,after:value.after.documentWidth,afterReport:value.afterReport.documentWidth,
    maxSampleWidth:Math.max(value.before.documentWidth,...value.samples.map(x=>x.documentWidth)),
    violations:value.results.violations.map(x=>x.id),incomplete:value.results.incomplete.map(x=>x.id),errors:value.errors});
}
for(const width of [720,900,1280,1440])assert(reports.some(x=>x.width===width && x.run===`${width}-no-report` && x.reason==='settled'));
assert(reports.some(x=>x.afterReport>x.width && x.run==='dialog-light720'));
assert(reports.some(x=>x.violations.includes('button-name')));
for(const source of ['node_modules/tabster/dist/esm/Root.js','node_modules/tabster/dist/esm/DummyInput.js','node_modules/tabster/package.json']){
  await writeFile(join(evidence,`tabster-${source.split('/').at(-1)}`),await readFile(join(root,source)),{flag:'wx'});
}
await writeFile(join(evidence,'seal-source.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
const summary={artifact:'f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a',
  priorFilesReverified:preserved,tabster:'8.8.1',axe:'4.13.0',fluent:'9.74.7',reports};
await writeFile(join(evidence,'summary.json'),JSON.stringify(summary,null,2),{flag:'wx'});
const sums=[];
for(const name of (await readdir(evidence)).sort())sums.push(`${digest(await readFile(join(evidence,name)))}  ${name}`);
const manifest=sums.join('\n')+'\n';
await writeFile(join(evidence,'SHA256SUMS.txt'),manifest,{flag:'wx'});
for(const line of sums){const [hash,name]=line.split('  ');assert.equal(digest(await readFile(join(evidence,name))),hash);}
console.log(JSON.stringify({files:sums.length,manifestSha256:digest(manifest),priorFilesReverified:preserved,
  scans:reports.map(({file,run,reason,width,before,after,afterReport,violations,incomplete})=>({file,run,reason,width,before,after,afterReport,violations,incomplete}))},null,2));
