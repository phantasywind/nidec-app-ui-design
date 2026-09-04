import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const POLICY = "default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-uri /__probe/report";
const CONTROL = Buffer.from('<!doctype html><title>Network probe control</title><p id="result">Pending</p><script src="/__probe/control.js"></script>');
const CONTROL_SCRIPT = Buffer.from("fetch('https://nidec-probe.invalid/blocked', {mode:'no-cors'}).then(() => {document.getElementById('result').textContent='Unexpected success';}).catch(() => {document.getElementById('result').textContent='Request rejected; require CSP report confirmation';});");

// Only load the historically anchored output set; never serve the repository.
export async function loadRetainedOutputs(retained, runtime, name) {
  assert(['node22', 'node24'].includes(runtime));
  assert(['token-only-consumer', 'react-vite-cpq-consumer'].includes(name));
  const sums = await readFile(join(retained, 'SHA256SUMS.txt'));
  assert.equal(digest(sums), '7de1867fa53ecca61ea475ab7d6d7bf8b7028114398b8b1983ca46ef36ba452c', 'Stage 4C checksum anchor mismatch');
  const entries = new Map(sums.toString().trimEnd().split('\n').map(line => [line.slice(66), line.slice(0, 64)]));
  const checks = await readFile(join(retained, 'consumer-checks.json'));
  assert.equal(digest(checks), entries.get('consumer-checks.json'), 'Consumer evidence hash mismatch');
  const selected = JSON.parse(checks).find(r => r.runtime === runtime && r.name === name);
  assert(selected, 'Missing consumer output record');
  const files = new Map();
  for (const [path, hash] of Object.entries(selected.outputs)) {
    assert(/^(index\.html|assets\/[A-Za-z0-9._-]+\.(js|css))$/.test(path), 'Unexpected output path');
    const bytes = await readFile(join(retained, 'outputs', runtime, name, 'dist', path));
    assert.equal(digest(bytes), hash, `Output hash mismatch: ${path}`);
    files.set(path === 'index.html' ? '/' : `/${path}`, bytes);
  }
  assert(files.has('/'), 'Missing HTML');
  return { files, selected };
}

export async function startNetworkProbe(files) {
  // Freeze byte copies before listening to avoid filesystem changes during a run.
  const content = new Map([...files].map(([key, bytes]) => [key, Buffer.from(bytes)]));
  const evidence = { status: 'observation-only', policy: POLICY, requests: [], reports: [], overflow: false };
  let origin;
  const server = createServer(async (req, res) => {
    const path = req.url;
    const respond = (status, body = '', type = 'text/plain') => {
      if (evidence.requests.length < 4096) evidence.requests.push({ path: /^\/[A-Za-z0-9/_.-]*$/.test(path) ? path : '[invalid-path]', method: req.method, status });
      else evidence.overflow = true;
      res.writeHead(status, { 'Content-Type': type, 'Content-Security-Policy': POLICY, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(body);
    };
    if (req.headers.host !== origin.slice(7)) return respond(403);
    if (req.method === 'POST' && path === '/__probe/report') {
      if (req.headers.origin && req.headers.origin !== origin) return respond(403);
      if (!/^application\/(csp-report|json)(;|$)/.test(req.headers['content-type'] ?? '')) return respond(415);
      try {
        let size = 0; const chunks = [];
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 8192) return respond(413);
          chunks.push(chunk);
        }
        const report = JSON.parse(Buffer.concat(chunks).toString())['csp-report'];
        if (!report || typeof report['document-uri'] !== 'string' || typeof report['blocked-uri'] !== 'string') return respond(400);
        const document = new URL(report['document-uri']);
        if (document.origin !== origin || !['/', '/__probe/control.html'].includes(document.pathname)) return respond(400);
        const blocked = report['blocked-uri'];
        // Store origins only; do not retain headers, cookies, query strings or bodies.
        let blockedOrigin;
        try { blockedOrigin = new URL(blocked).origin; } catch { blockedOrigin = ['inline', 'eval'].includes(blocked) ? blocked : '[other]'; }
        const directive = report['effective-directive'];
        if (typeof directive !== 'string' || !/^[a-z-]{1,40}$/.test(directive)) return respond(400);
        if (evidence.reports.length >= 256) { evidence.overflow = true; return respond(429); }
        evidence.reports.push({ document: document.pathname, blockedOrigin, directive, disposition: report.disposition === 'enforce' ? 'enforce' : 'unknown' });
        return respond(204);
      } catch { return respond(400); }
    }
    if (req.method !== 'GET') return respond(405);
    if (path === '/__probe/control.html') return respond(200, CONTROL, 'text/html; charset=utf-8');
    if (path === '/__probe/control.js') return respond(200, CONTROL_SCRIPT, 'text/javascript; charset=utf-8');
    if (path === '/favicon.ico') return respond(204);
    const bytes = content.get(path);
    if (!bytes) return respond(404);
    return respond(200, bytes, path === '/' ? 'text/html; charset=utf-8' : path.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8');
  });
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, evidence, close: () => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve()); server.closeAllConnections();
  }) };
}

// A report is an untrusted observation. This predicate is necessary, not sufficient
// for browser acceptance; actual DOM and report provenance must be reviewed too.
export function assessProbeEvidence(evidence) {
  return {
    controlObserved: evidence.reports.some(r => r.document === '/__probe/control.html' && r.blockedOrigin === 'https://nidec-probe.invalid' && r.directive === 'connect-src' && r.disposition === 'enforce'),
    fixtureViolationCount: evidence.reports.filter(r => r.document === '/').length,
    overflow: evidence.overflow,
    status: 'browser-review-required',
  };
}
