# Stage 4E — Bounded network evidence plan and probe preparation

- Date: 2026-09-04
- Entry commit: `a3cf773ff4bd8ebbad0ade88b74dd78fd001a2aa`, clean worktree.
- Authorization: Locke Yuan's continuation after the Stage 4D commit.
- Status: 4E1 probe implemented and locally tested; 4E2 browser execution pending commit and confirmation.
- Scope: Historical private-scaffold consumer outputs only. Not an application security policy or support standard.

## Purpose and chosen method

Demonstrate whether the already-built fixtures can complete their initial render with off-origin resource access prohibited by an enforced browser Content Security Policy (CSP). This supplements the previous static scan and DOM smoke; it is not a complete OS/browser packet capture or proof covering every possible future application behavior.

The [W3C CSP specification](https://www.w3.org/TR/CSP3/) describes response-header enforcement, source restrictions, and violation reporting. The retrieved CSP3 document is a Working Draft, not a newly adopted Nidec compliance requirement. This probe uses established source-list directives and `report-uri`; actual browser support/report delivery must be demonstrated by the control case, not presumed.

A loopback-only server serves the retained HTML/JS/CSS bytes unchanged. It applies `default-src 'self'` and explicit local-only script/style/image/font/connect policies; workers, frames, objects, base changes, form actions and embedding are prohibited. Its report endpoint is local. It does not change Windows firewall, DNS, proxies, browser security settings or production headers.

An independent control page attempts `fetch('https://nidec-probe.invalid/blocked')`. The reserved `.invalid` hostname contains no user data. A rejected fetch alone is insufficient: DNS failure could also reject it. Acceptance requires a corresponding `connect-src` report with enforcement disposition from the control document, plus visible execution of the control script. It never intentionally contacts GitHub or sends credentials.

## Implementation

`scripts/network-probe.mjs` exports:

- `loadRetainedOutputs(retained, runtime, name)`: anchors the Stage 4C checksum list and consumer record; checks output hashes; accepts only the known consumer/runtime names and HTML/JS/CSS file shapes.
- `startNetworkProbe(files)`: copies verified bytes into memory, binds an OS-assigned port on `127.0.0.1`, serves only explicit routes, and returns its origin, bounded in-memory observations and an explicit close operation.
- `assessProbeEvidence(evidence)`: reports control observation and fixture violation count, but always returns `browser-review-required`, never an automatic qualification pass.

The server sends `Cache-Control: no-store`. It rejects unexpected Host and foreign Origin headers, limits report bodies to 8 KiB, and caps reports/request records. Overflow invalidates acceptance. It stores document paths, blocked origins and directives only, not arbitrary report bodies, request headers, credentials or URL query strings. CSP reports remain untrusted and potentially spoofable by a local caller; browser-originated provenance must be reviewed during the controlled run.

The module is a test utility, not an end-to-end qualified runner or automatically retained evidence service. Formal execution must explicitly save observations before closing and report cleanup failure. Abrupt interruption without saved observations is an incomplete run.

## Local checks completed (4E1)

- Script lint passed.
- Five test files / 27 tests passed (24 existing and 3 new).
- New tests check original bytes, enforced—not report-only—policy, no-cache responses, restricted routes, query omission, report validation, body limit, foreign-origin rejection, control/fixture separation and refusal to infer acceptance from missing reports.
- Test reports are synthetic HTTP inputs; they do not prove browser CSP enforcement.
- Read-only loading verified three retained output files in each of all four historical runtime/consumer sets.
- Same-tree rollback/restore was rerun without changing the real worktree; temporary proof data was removed.

No new dependencies were installed. No real browser qualification, external request, package rebuild, application edit or publication occurred in this step. The localhost unit-test servers were closed.

## Formal execution gate (4E2)

After this implementation is committed and Locke confirms continuation:

1. Record the exact implementation commit, clean-tree observation, probe-source hash, observed Node/browser/OS versions and the Stage 4C output hashes. Reserve a new evidence directory; never rewrite Stage 4C/4D evidence.
2. Start a separate loopback probe for each of the two Node 22 fixture outputs. Open new controlled browser tabs; do not reuse a previously loaded fixture tab or rely on cached output. Confirm no unexpected service-worker control. If this cannot be established, record it and do not overstate isolation.
3. Open the control page, observe its script result and the matching enforced CSP report. A DNS error, rejected fetch or absent report without the matching enforcement evidence is a failed/inconclusive control, not a pass. Do not weaken the policy to make the fixture pass.
4. Open the unchanged main fixture. Observe expected text, `data-token-count="4"`, computed spacing `7px`, and expected local JS/CSS responses. Review browser errors. Collect reports for a declared bounded observation window (at least 10 seconds after the initial render). Separate control errors/reports from fixture errors/reports.
5. Require a successful control, no fixture CSP violations, no unexpected fixture resource failures, no report/log overflow, and expected DOM/CSS observations. Preserve the policy, request/status records, sanitized reports, browser observations, exact served-file hashes, timestamps and limitations. If the browser/report interface fails, preserve that result and leave the gap open.
6. Close only the created tabs/servers; verify closure. Seal the new evidence and checksum list and independently read back the saved files. Bring the bounded result back for Stage 4 exit review; do not automatically enter Stage 5.

A successful result supports **these fixture initial renders under this enforced policy in this observed browser**, not arbitrary later workflows, all browser traffic, WebRTC/DNS/extension activity, production UX/security compatibility, or a general browser support matrix. No full-network-trace claim is permitted. Node 24 output browser validation, automation and backup remain separately stated scope decisions; the earlier Node 24 build evidence is unchanged.

## Rollback and stop

Withdraw this slice by reverting only the new probe/test files and its documentation/status changes. Existing immutable evidence remains untouched. Stop at review/commit of 4E1 and confirmation for 4E2. No system-wide block, proxy, firewall change, upload, publication, CPQ/EPM integration, or new brand/business rule is authorized.
