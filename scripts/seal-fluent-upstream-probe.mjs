import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';

const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/fluent-upstream-comparison');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const write=(name,bytes)=>writeFile(join(evidence,name),bytes,{flag:'wx'});
const compiler=join(root,'node_modules/typescript/bin/tsc');
const checks=[];
for(const [name,args] of [['inherited-typecheck',['-p','fixtures/fluent-upstream-probe/tsconfig.json']],
  ['dependency-declaration-diagnostic',['-p','fixtures/fluent-upstream-probe/tsconfig.json','--skipLibCheck','false']]]){
  const result=spawnSync(process.execPath,[compiler,...args],{cwd:root,encoding:'utf8'});
  await write(`${name}.txt`,result.stdout+result.stderr);
  checks.push({name,args,exitCode:result.status});
}
assert.equal(checks[0].exitCode,0);
await write('tsconfig.json',await readFile(join(root,'fixtures/fluent-upstream-probe/tsconfig.json')));
await write('inherited-tsconfig.json',await readFile(join(root,'tsconfig.json')));
await write('seal-source.mjs',await readFile(new URL(import.meta.url)));
const local=JSON.parse(await readFile(join(root,'package-lock.json'))).packages;
const consumer=JSON.parse(await readFile(join(root,'.qualification/runs/fluent-adaptation/consumer-node22/react-vite-cpq-consumer-lock.json'))).packages;
const keys=Object.keys(consumer).filter(k=>/node_modules\/(?:@fluentui\/|@griffel\/|tabster$|keyborg$|react$|react-dom$)/.test(k));
for(const key of keys){assert.equal(local[key]?.version,consumer[key].version);assert.equal(local[key]?.integrity,consumer[key].integrity);}
const prior=[];
for(const [run,expected] of [['fluent-adaptation','4e296623b37aeaf5f4168f53c72f138dbcdf9b658c8033bb7e3a746239c52786'],
  ['fluent-focus-diagnostic','d4d7f7f28162d724569b46f213d49ecd52962c2bf0ea6b15b5a694bd20680c2f']]){
  const dir=join(root,'.qualification/runs',run),bytes=await readFile(join(dir,'SHA256SUMS.txt'));
  assert.equal(hash(bytes),expected);let count=0;
  for(const line of bytes.toString().trim().split(/\r?\n/)){
    const match=/^([a-f0-9]{64})\s+\*?(.+)$/.exec(line);assert(match);
    assert.equal(hash(await readFile(join(dir,match[2]))),match[1]);count++;
  }
  prior.push({run,count});
}
const scans=[];
for(const name of (await readdir(join(evidence,'browser'))).filter(x=>x.endsWith('-audit.json')).sort()){
  const v=JSON.parse(await readFile(join(evidence,'browser',name)));
  scans.push({file:name,run:v.run,reason:v.reason,width:v.before.width,dialog:v.before.dialog,
    violations:v.results.violations.map(x=>x.id),incomplete:v.results.incomplete.map(x=>x.id),
    active:v.before.active,guards:v.before.guards,events:v.events,errors:v.errors,
    maxWidth:Math.max(v.before.documentWidth,v.after.documentWidth,...v.samples.map(x=>x.documentWidth))});
}
assert(scans.some(x=>x.run==='upstream-720' && x.reason==='settled' && x.violations.includes('aria-hidden-focus')));
assert(scans.some(x=>x.run==='negative-control' && x.violations.includes('button-name')));
await write('summary.json',JSON.stringify({checks,matchedDependencyEntries:keys.length,prior,scans},null,2));
async function files(dir,prefix=''){
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const name=prefix+entry.name;
    if(entry.isDirectory())result.push(...await files(join(dir,entry.name),name+'/'));else result.push(name);
  }
  return result.sort();
}
const sums=[];
for(const name of await files(evidence))sums.push(`${hash(await readFile(join(evidence,name)))}  ${name}`);
const manifest=sums.join('\n')+'\n';await write('SHA256SUMS.txt',manifest);
for(const line of sums){const [expected,name]=line.split('  ');assert.equal(hash(await readFile(join(evidence,name))),expected);}
console.log(JSON.stringify({files:sums.length,manifestSha256:hash(manifest),checks,matchedDependencyEntries:keys.length,prior,
  scans:scans.map(({file,run,reason,violations,incomplete})=>({file,run,reason,violations,incomplete}))},null,2));
