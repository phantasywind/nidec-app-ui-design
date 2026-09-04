import { it, expect } from 'vitest';
import { startNetworkProbe, POLICY, assessProbeEvidence } from '../scripts/network-probe.mjs';

it('serves unchanged bytes with enforced policy, no cache and a local control', async () => {
  const bytes = Buffer.from('<main>unchanged fixture</main>');
  const probe = await startNetworkProbe(new Map([['/', bytes]]));
  try {
    const response = await fetch(probe.origin);
    expect(Buffer.from(await response.arrayBuffer())).toEqual(bytes);
    expect(response.headers.get('content-security-policy')).toBe(POLICY);
    expect(response.headers.get('content-security-policy-report-only')).toBeNull();
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect((await fetch(probe.origin + '/__probe/control.js')).status).toBe(200);
    expect((await fetch(probe.origin + '/package.json')).status).toBe(404);
    expect((await fetch(probe.origin + '/?secret=value')).status).toBe(404);
    expect(JSON.stringify(probe.evidence)).not.toContain('secret=value');
  } finally { await probe.close(); }
});

it('bounds and sanitizes reports but never treats synthetic input as browser acceptance', async () => {
  const probe = await startNetworkProbe(new Map([['/', Buffer.from('fixture')]]));
  const post = (body, headers = {}) => fetch(probe.origin + '/__probe/report', {method:'POST', headers:{'content-type':'application/csp-report',...headers},body});
  const report = {'csp-report':{'document-uri':probe.origin+'/__probe/control.html?private=value','blocked-uri':'https://nidec-probe.invalid/path?private=value','effective-directive':'connect-src',disposition:'enforce'}};
  try {
    expect((await post(JSON.stringify(report))).status).toBe(204);
    expect(assessProbeEvidence(probe.evidence)).toEqual({controlObserved:true,fixtureViolationCount:0,overflow:false,status:'browser-review-required'});
    expect(JSON.stringify(probe.evidence)).not.toContain('private=value');
    expect((await post('{}')).status).toBe(400);
    expect((await post('x'.repeat(8193))).status).toBe(413);
    expect((await post('{}', {origin:'https://foreign.invalid'})).status).toBe(403);
    expect((await post('{}', {'content-type':'text/plain'})).status).toBe(415);
    report['csp-report']['document-uri'] = probe.origin + '/';
    expect((await post(JSON.stringify(report))).status).toBe(204);
    expect(assessProbeEvidence(probe.evidence).fixtureViolationCount).toBe(1);
  } finally { await probe.close(); }
});

it('does not infer a pass from absent reports', () => {
  expect(assessProbeEvidence({reports:[],overflow:false})).toEqual({controlObserved:false,fixtureViolationCount:0,overflow:false,status:'browser-review-required'});
});
