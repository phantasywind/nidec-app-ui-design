import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const run=join(root,'.qualification/runs/fluent-directory-actions-1');
const name=process.argv[2]??'browser-1';
assert(/^browser-[1-9][0-9]*$/.test(name));
const evidence=join(run,name);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const consumerRun=process.argv[3]??'consumer-retest-1';
assert(/^consumer-retest-[1-9][0-9]*$/.test(consumerRun));
const results=JSON.parse(await readFile(join(run,consumerRun,'results.json'),'utf8'));
const consumer=results.find(item=>item.name==='react-directory-actions-consumer');
assert(consumer);
assert.equal(consumer.artifact,hash(await readFile(join(run,'build-a/candidate.tgz'))));
const content=new Map();
for(const item of consumer.outputs){
  const bytes=await readFile(join(root,'.tmp/fluent-directory-actions-1/consumer-node22/react-directory-actions-consumer/dist',item.path));
  assert.equal(hash(bytes),item.sha256);
  content.set(item.path==='index.html'?'/':'/'+item.path.replaceAll('\\','/'),bytes);
}
const axe=await readFile(join(root,'.qualification/runs/button-validation-ceb04a1/audit-tools/axe-axe.min.js'));
assert.equal(hash(axe),'c24f097bd2f451d4f933e8bc7d8d539f8672a2ebcb5cc9f9f3eec8ca9470a0c1');
content.set('/__probe/axe.js',axe);
content.set('/__probe/audit.js',await readFile(join(root,'scripts/directory-actions-browser-audit.js')));
content.set('/__probe/control.js',Buffer.from("fetch('https://nidec-probe.invalid/blocked').catch(()=>{});"));
await mkdir(evidence);
for(const css of ['tokens','layout','components','pages','design-system']){
  const path=css==='design-system'?'D:/Documents/Nidec Elevator CPQ/client/src/design-system/styles.css':`D:/Documents/Nidec Elevator CPQ/client/src/styles/${css}.css`;
  const bytes=await readFile(path);
  content.set(`/__probe/cpq-${css}.css`,bytes);
  await writeFile(join(evidence,`cpq-${css}.css`),bytes,{flag:'wx'});
}
await writeFile(join(evidence,'binding.json'),JSON.stringify({consumer,files:Object.fromEntries([...content].map(([path,bytes])=>[path,hash(bytes)]))},null,2),{flag:'wx'});
await writeFile(join(evidence,'server-source.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
await writeFile(join(evidence,'audit.js'),content.get('/__probe/audit.js'),{flag:'wx'});
let origin,count=0;
const server=createServer(async(req,res)=>{
  try{
    if(req.headers.host!==origin.slice(7)){res.writeHead(403).end();return;}
    const url=new URL(req.url,origin),nonce=randomBytes(18).toString('base64');
    const policy=`default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self'${url.searchParams.has('strict')?'':` 'nonce-${nonce}'`}; img-src 'self'; font-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; report-uri /__probe/csp`;
    const respond=(status,body='',type='text/plain')=>{
      appendFileSync(join(evidence,'requests.ndjson'),JSON.stringify({path:url.pathname,query:url.search,method:req.method,status,bytes:Buffer.byteLength(body),sha256:hash(body),policy})+'\n');
      res.writeHead(status,{'content-type':type,'content-security-policy':policy,'cache-control':'no-store','x-content-type-options':'nosniff'}).end(body);
    };
    if(req.method==='POST' && ['/__probe/audit','/__probe/csp'].includes(url.pathname)){
      if(req.headers.origin && req.headers.origin!==origin)return respond(403);
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>2*1024*1024)return respond(413);chunks.push(chunk);}
      const data=JSON.parse(Buffer.concat(chunks).toString());
      await writeFile(join(evidence,`${String(++count).padStart(4,'0')}-${url.pathname.endsWith('audit')?'audit':'csp'}.json`),JSON.stringify(data,null,2),{flag:'wx'});
      return respond(200,'ok');
    }
    if(url.pathname==='/__probe/blank')return respond(200,'<!doctype html><html lang="en"><title>Blank control</title><main><h1>Blank control</h1></main></html>','text/html');
    if(url.pathname==='/__probe/control')return respond(200,'<!doctype html><html lang="en"><title>Negative control</title><main><h1>Negative control</h1><button></button></main><script src="/__probe/control.js"></script><script src="/__probe/axe.js"></script><script src="/__probe/audit.js"></script></html>','text/html');
    if(url.pathname==='/'){
      let html=content.get('/').toString().replace('<head>',`<head><meta name="csp-nonce" content="${nonce}">`);
      if(url.searchParams.has('cpqhost'))html=html.replace('</head>',['tokens','layout','components','pages','design-system'].map(css=>`<link rel="stylesheet" href="/__probe/cpq-${css}.css">`).join('')+'</head>');
      html=html.replace('</body>','<script src="/__probe/axe.js"></script><script src="/__probe/audit.js"></script></body>');
      return respond(200,html,'text/html');
    }
    const bytes=content.get(url.pathname);
    return bytes?respond(200,bytes,url.pathname.endsWith('.css')?'text/css':'text/javascript'):respond(404);
  }catch(error){res.writeHead(500).end(String(error));}
});
server.listen(0,'127.0.0.1',async()=>{
  origin=`http://127.0.0.1:${server.address().port}`;
  await writeFile(join(evidence,'server.json'),JSON.stringify({origin,artifact:consumer.artifact}),{flag:'wx'});
  console.log(origin);
});
process.once('SIGINT',()=>server.close());
process.once('SIGTERM',()=>server.close());
