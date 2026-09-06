// Read CPQ inputs only; npm audit runs against local copies, never npm audit fix.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname, delimiter } from 'node:path';
import { sha256, redactLog } from './qualification-contract.mjs';
const root=join(import.meta.dirname,'..');
const cpq='D:/Documents/Nidec Elevator CPQ';
const runId=process.argv[2]??'cpq-dependency-audit-1';
assert(/^cpq-dependency-audit-[1-9][0-9]*$/.test(runId));
const out=join(root,'.qualification/runs',runId);
const work=join(root,'.tmp',runId);
const node=join(root,'.tmp/node-22.22.0/node-v22.22.0-win-x64/node.exe');
await mkdir(out); await mkdir(work);
const currentLock=await readFile(join(cpq,'client/package-lock.json'));
const records=[];
for(const baseline of ['current','head']){
  const cwd=join(work,baseline); await mkdir(cwd);
  for(const name of ['package.json','package-lock.json']){
    const bytes=baseline==='current'?await readFile(join(cpq,'client',name)):execFileSync('git',['-c',`safe.directory=${cpq}`,'-C',cpq,'show',`HEAD:client/${name}`]);
    await writeFile(join(cwd,name),bytes,{flag:'wx'});
    await writeFile(join(out,`${baseline}-${name}`),bytes,{flag:'wx'});
  }
  const result=spawnSync(node,[join(dirname(node),'node_modules/npm/bin/npm-cli.js'),'audit','--package-lock-only','--ignore-scripts','--json','--registry=https://registry.npmjs.org'],{cwd,encoding:'utf8',timeout:90000,maxBuffer:8*1024*1024,env:{...process.env,PATH:`${dirname(node)}${delimiter}${process.env.PATH??''}`,npm_config_cache:join(root,'.tmp/fluent-npm-cache')}});
  await writeFile(join(out,`${baseline}-audit.json`),redactLog(result.stdout??''),{flag:'wx'});
  await writeFile(join(out,`${baseline}-stderr.txt`),redactLog(result.stderr??''),{flag:'wx'});
  let audit; try {audit=JSON.parse(result.stdout);} catch { audit={error:'non-JSON audit response'}; }
  records.push({baseline,exitCode:result.status,error:result.error?.message,metadata:audit.metadata,errorResponse:audit.error});
  console.log(JSON.stringify(records.at(-1)));
}
assert.equal(sha256(await readFile(join(cpq,'client/package-lock.json'))),sha256(currentLock),'CPQ lock changed concurrently; do not attribute audit to new state');
await writeFile(join(out,'execution.json'),JSON.stringify({records,currentLockSha256:sha256(currentLock),scope:'Read-only registry audit on lock snapshots; no install/fix or CPQ edits'},null,2),{flag:'wx'});
