# Stage 4E2 — Enforced-policy browser observation

- Date: 2026-09-04
- Authorization: Locke confirmed the probe was committed and asked to continue.
- Implementation commit: `0051a951b587ce00636a8b954fd8d63ffcb43151`; entry worktree clean.
- Result: **Bounded initial-render pass; Stage 4 exit approval pending.**

## Execution and observations

The committed probe ran on portable Node `24.20.0`. It loaded the unchanged, hash-anchored Stage 4C **Node 22 built** outputs and bound two OS-assigned loopback ports. No package rebuild, dependency installation, original-evidence change or system-network change occurred.

Microsoft Edge `152.0.4191.53` on Windows `10.0.26200.0` opened four new tabs: a control and original fixture for each origin. The controls attempted only the configured synthetic `.invalid` URL. No synthetic report was posted by the executor during this run.

| Observation | Token-only fixture | CPQ-compatible React fixture |
| --- | --- | --- |
| Control script visible result | Request rejected | Request rejected |
| Server received matching CSP report | `connect-src`, `enforce`, `https://nidec-probe.invalid` | Same |
| Original document / JS / CSS | All HTTP 200 | All HTTP 200 |
| Script-produced token count | 4 | 4 |
| Computed fixture spacing | 7px | 7px |
| Captured fixture warnings/errors | None returned | None returned |
| Fixture CSP reports | 0 | 0 |
| Log/report overflow | No | No |

The response policy is preserved verbatim in `server-observations.json`; it was enforced, not report-only. Control reports are separated from fixture reports. Each server recorded one control report and eight successful requests (including report/favicons). The probe's `browser-review-required` output was reviewed together with actual browser DOM observations, not treated as an automatic pass.

Server observation ran from `2026-09-04T04:08:34.709Z` to `04:10:27.743Z`. Both DOM results were observed before the independently read clock at `04:10:07.969Z`. Thus the final collection window includes over 19 seconds after that observation, exceeding the planned minimum 10 seconds. Individual request/report timestamps were not captured by this version of the probe; the browser sequence and overall window are the retained timing evidence.

## Isolation and claim limits

The supported read-only DOM interface did not expose service-worker controller state. Fresh loopback origins/tabs, direct successful server responses and unchanged asset bytes were observed, but a new browser profile or proven absence of pre-existing service-worker control is **not** claimed. This is a disclosed isolation limit, not a silently satisfied check.

CSP reports are unauthenticated browser observations and cannot alone prove provenance. The controlled sequence, visible control script execution and matching received reports provide the bounded corroboration. No complete packet/request trace, all-browser egress isolation, arbitrary later interaction, Node 24 browser run, production behavior, accessibility or application acceptance is claimed.

The new evidence supplements the Stage 4C network gap with a demonstrated enforced-policy initial render. Recommendation: bring this **bounded scaffold evidence** to Locke for exit-scope review. Do not silently relabel it as exhaustive runtime-network proof or close Stage 4 without that review. If fresh-profile/service-worker proof or a full trace is required for the accepted scope, a further specifically scoped test remains necessary.

## Retention and cleanup

New local evidence: `.qualification/runs/stage4e2-0051a95/`.

- `browser-observations.json`: actual controls, DOM/CSS and console observations, plus limits.
- `server-observations.json`: policy, origins, source/asset hashes, requests, reports and server closure.
- `assessment.json`: correlated bounded result and cleanup/readback findings.
- `finish`: local operational stop marker; included in the checksums.
- `SHA256SUMS.txt`: covers the four files above; each was independently read back and matched after writing.

Assessment SHA-256: `94fc2298cf56c4fb813ebe2c013a25ac9ab2bc604f6a49609bbe992f7de54c10`.

Checksum-list SHA-256: `274371ceb7dd9b730fab3932c251f0e6e87c60a714540073adcd5dbaaa6e72f6`.

The four created tabs were closed, both servers closed normally, and connection-refused checks confirmed neither port remained listening. All 76 original Stage 4C files were rehashed against their unchanged committed checksum anchor. No temporary source/install tree was created. Local evidence remains Git-ignored and is not backed up by this documentation commit.

## Gate and rollback

Only documentation/status changes are tracked in this step. Withdrawing them must not delete the retained observation files. No push, tag, publish, release, CPQ/EPM modification or Production action was performed or authorized.

Next gate: review/commit this result and obtain Locke's Stage 4 exit-scope decision, including the stated isolation and network limits. Publication still requires separate explicit authorization and a publishable, non-fixture candidate.
