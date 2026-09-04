// Staged qualification of one immutable working-source snapshot. Never commits,
// publishes, changes consumer applications, or overwrites a prior stage record.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { dirname, delimiter, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { inspectArchive, redactLog, verifyPhysicalReact } from './qualification-contract.mjs';

const root = resolve(import.meta.dirname, '..');
const work = join(root, '.tmp', 'fluent-adaptation');
const evidence = join(root, '.qualification', 'runs', 'fluent-adaptation');
const cache = join(root, '.tmp', 'fluent-npm-cache');
const source = join(work, 'source');
const node24 = join(root, '.tmp/node-24.20.0/node-v24.20.0-win-x64/node.exe');
const node22 = join(root, '.tmp/node-22.22.0/node-v22.22.0-win-x64/node.exe');
const stage = process.argv[2];
assert(['prepare', 'build-a', 'build-b', 'consumer-node22', 'seal'].includes(stage), 'Unknown stage');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else { assert(entry.isFile(), 'Links are not allowed in evidence'); result.push(path); }
  }
  return result.sort();
}
async function save(path, value) {
  await mkdir(dirname(path), {recursive:true});
  await writeFile(path, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value,null,2)+'\n', {flag:'wx'});
}
function npm(node, args, cwd, log) {
  const result = spawnSync(node, [join(dirname(node),'node_modules/npm/bin/npm-cli.js'), ...args], {
    cwd, encoding:'utf8', maxBuffer:32*1024*1024,
    env:{...process.env, PATH:`${dirname(node)}${delimiter}${process.env.PATH ?? ''}`,
      npm_config_cache:cache, npm_config_registry:'https://registry.npmjs.org',
      npm_config_audit:'false', npm_config_fund:'false'},
  });
  const output = redactLog((result.stdout ?? '') + (result.stderr ?? ''));
  console.log(output);
  return {log, output, exitCode:result.status, error:result.error?.message};
}
async function run(node, args, cwd, log) {
  const result = npm(node,args,cwd,log);
  await save(join(evidence, stage, log), result.output);
  assert.equal(result.exitCode,0, `${log} failed: ${result.error ?? result.exitCode}`);
  return result;
}

if (stage === 'prepare') {
  await mkdir(evidence); await mkdir(work); await mkdir(source);
  const names = execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root})
    .toString().split('\0').filter(Boolean);
  const records = [];
  for (const name of [...new Set(names)].sort()) {
    assert(!name.startsWith('../') && !name.startsWith('/'));
    const bytes = await readFile(join(root,name));
    await mkdir(dirname(join(source,name)),{recursive:true});
    await writeFile(join(source,name),bytes,{flag:'wx'});
    records.push({path:name,sha256:hash(bytes)});
  }
  await save(join(evidence,'source.json'), {head:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),
    clean:false, description:'Immutable working-source snapshot; not a committed release qualification',files:records});
  const metadata = JSON.parse(await readFile(join(root,'.qualification/runs/fluent-transition/type-gate/registry-metadata.json'),'utf8'));
  const requireNpm = createRequire(join(dirname(node24),'node_modules/npm/package.json'));
  const cacache = requireNpm('cacache');
  const upstream = await cacache.get.byDigest(join(cache,'_cacache'),metadata.dist.integrity);
  assert.equal('sha512-'+createHash('sha512').update(upstream).digest('base64'),metadata.dist.integrity);
  await save(join(evidence,'upstream-9.74.7.tgz'),upstream);
  await save(join(evidence,'upstream-metadata.json'),metadata);
  console.log(`Prepared ${records.length} source files.`);
} else if (stage.startsWith('build-')) {
  await mkdir(join(evidence,stage));
  const destination = join(work,stage);
  await mkdir(destination); await cp(source,destination,{recursive:true});
  await run(node24,['ci','--ignore-scripts','--offline'],destination,'ci.txt');
  await run(node24,['run','verify'],destination,'verify.txt');
  await run(node24,['run','pack:verify'],destination,'pack.txt');
  const record = JSON.parse(await readFile(join(destination,'.pack/pack-result.json'),'utf8'));
  const artifact = await readFile(join(destination,'.pack',record.filename));
  const archive = inspectArchive(artifact);
  assert.equal(hash(artifact),record.sha256);
  await save(join(evidence,stage,'candidate.tgz'),artifact);
  await save(join(evidence,stage,'artifact.json'),{...record,archive});
  if (stage === 'build-b') assert.deepEqual(artifact,await readFile(join(evidence,'build-a/candidate.tgz')));
  console.log(`Qualified ${stage}: ${hash(artifact)}`);
} else if (stage === 'consumer-node22') {
  await mkdir(join(evidence,stage));
  const results = [];
  for (const name of ['token-only-consumer','react-vite-cpq-consumer']) {
    const destination = join(work,stage,name);
    await mkdir(destination,{recursive:true});
    await cp(join(source,'fixtures',name),destination,{recursive:true});
    const archive = await readFile(join(evidence,'build-a/candidate.tgz'));
    await writeFile(join(destination,'candidate.tgz'),archive,{flag:'wx'});
    const manifestPath = join(destination,'package.json');
    const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
    manifest.dependencies = {...manifest.dependencies, '@phantasywind/nidec-app-ui-design':'file:candidate.tgz'};
    await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
    // Only prepares resolution here. The actual qualification uses npm ci below.
    await run(node22,['install','--package-lock-only','--ignore-scripts'],destination,`${name}-lock.txt`);
    await run(node22,['ci','--ignore-scripts'],destination,`${name}-ci.txt`);
    await run(node22,['run','verify'],destination,`${name}-verify.txt`);
    const sharedRoot = join(destination,'node_modules/@phantasywind/nidec-app-ui-design');
    const installed = await files(sharedRoot);
    const expected = await files(join(work,'build-a','dist'));
    assert.equal(installed.length,expected.length+2);
    for (const path of expected) assert.deepEqual(await readFile(join(sharedRoot,'dist',relative(join(work,'build-a','dist'),path))),await readFile(path));
    const lock = JSON.parse(await readFile(join(destination,'package-lock.json'),'utf8'));
    let react;
    if (name === 'token-only-consumer') {
      for (const key of Object.keys(lock.packages)) assert(!/(^|\/)node_modules\/(react|react-dom|@fluentui\/[^/]+)$/.test(key), `Unexpected React/Fluent dependency: ${key}`);
    } else {
      react = await verifyPhysicalReact(destination, sharedRoot);
      const requireApp = createRequire(manifestPath);
      const requirePackage = createRequire(join(sharedRoot,'package.json'));
      assert.equal(await realpath(requireApp.resolve('@fluentui/react-components')),await realpath(requirePackage.resolve('@fluentui/react-components')));
      assert.equal(lock.packages['node_modules/@fluentui/react-components'].version,'9.74.7');
    }
    await save(join(evidence,stage,`${name}-package.json`),await readFile(manifestPath));
    await save(join(evidence,stage,`${name}-lock.json`),await readFile(join(destination,'package-lock.json')));
    await cp(join(destination,'dist'),join(evidence,stage,name,'dist'),{recursive:true});
    const outputs = [];
    for (const path of await files(join(destination,'dist'))) {
      const bytes = await readFile(path);
      outputs.push({path:relative(join(destination,'dist'),path),bytes:bytes.length,sha256:hash(bytes)});
    }
    results.push({name,node:'22.22.0',artifact:hash(archive),react:react ?? 'not-installed',outputs});
  }
  await save(join(evidence,stage,'results.json'),results);
} else {
  await cp(source,join(evidence,'source'),{recursive:true,errorOnExist:true,force:false});
  await save(join(evidence,'qualifier-executor.mjs'),await readFile(new URL(import.meta.url)));
  const all = (await files(evidence)).filter(path=>!path.endsWith('SHA256SUMS.txt'));
  const lines = [];
  for (const path of all) lines.push(`${hash(await readFile(path))}  ${relative(evidence,path).replaceAll('\\','/')}`);
  await save(join(evidence,'SHA256SUMS.txt'),lines.join('\n')+'\n');
  for (const line of lines) assert.equal(hash(await readFile(join(evidence,line.slice(66)))),line.slice(0,64));
  console.log(`Read back ${lines.length} evidence files.`);
}
