# Stage 4D — Preservation review and failure rehearsal

- Date: 2026-09-04
- Authorization: Locke Yuan confirmed the Stage 4C record was committed and asked to continue.
- Entry commit: `cc036f9be616ed0b35d6ba3ebafa118a5f8fe1fe`, clean worktree.
- Audited package source: `5f41634573131751129599aa1039a79535675e40` (unchanged).
- Result: Preservation review and bounded negative rehearsals passed. Stage 4 exit approval remains pending; no publication authorization.

## What was verified

The new, inspectable `scripts/verify-stage4-evidence.mjs` audits the specific historical Stage 4C run. It is a review procedure, not a general release runner. It uses a separately computed SHA-256 check against anchors in the committed Stage 4C record, then invokes committed archive/schema controls for bounded negative cases. This is another technical review by the same agent/maintainer, not independent personnel review or application acceptance.

- All 76 retained files match the checksum list; inventory coverage is exact, with no extra unlisted files, unsafe checksum paths or duplicate entries.
- The checksum list, manifest and source ZIP match the committed external anchors. This prevents silently replacing both an evidence file and its local checksum without detection against the committed record.
- A fresh `git archive` of the recorded source commit produces the identical source ZIP. The retained root lock matches the actual Git object.
- Candidate, build A, build B and frozen fixture artifact bytes all match the manifest.
- Both frozen fixture source inventories and raw/normalized lock hashes match; four runtime/consumer output sets match their recorded content hashes.
- The original evidence was rechecked after rehearsals and remains byte-for-byte unchanged.

This does not rerun historical installations, reproduce browser observations, authenticate manually recorded command exit codes, or turn checksums into signatures. Those remain subject to the Stage 4C execution record and its limits.

## Negative rehearsals

All **18 negative cases** rejected as expected before any downstream consumer install or publication was attempted:

| Group | Cases |
| --- | --- |
| Artifact binding | One-byte corruption; differing build hash |
| Archive identity and safety | Wrong package name; wrong version; missing entry; extra entry; traversal; symbolic link; duplicate entry |
| Evidence consistency | Stale consumer artifact hash; missing lock hash; wrong committed source reference; wrong committed lock reference |
| Failure gates | Nonzero command; failed cleanup flag; failed rollback flag; unexpectedly successful publication-guard flag |
| Preservation | Attempt to reuse a retained run ID; original copied manifest/artifact remained unchanged |

Malformed archives were constructed from copies of the actual tar entries in memory and never extracted. The overwrite exercise used a new `.tmp/stage4d-proof-*` directory, not the real evidence directory. Cleanup/rollback failure cases inject failed status records; they do not simulate an operating-system deletion failure. Source/lock-reference cases exercise the historical audit's explicit anchors, not a claim that the generic schema validator independently verifies Git.

The reserved temporary proof directory was removed after validation and absence checked. The Stage 3 same-tree rollback script was also rerun: baseline `184d73b` matched 7 files, and restoration matched 62 source files at execution time. No real worktree rollback occurred.

## Retained review evidence

Directory: `.qualification/runs/stage4d-20260904-cc036f9/`

- `result.json` — detailed outcomes and rejections, SHA-256 `e9f6564765f024165aa4652ad49f657ba1843c6b117a3096785ab6cd9ce1286b`.
- `procedure.mjs` — exact executed procedure, SHA-256 `27d4ac0fe6904312bd92dff9837283e39548eb0ae3bbe0d6f9eab4c853f53dda`.
- `SHA256SUMS.txt` — hashes of those two files.

The script reserves that exact review directory exclusively and refuses rerun into an existing directory. A future rehearsal must use a separately reviewed unique run ID; do not delete or overwrite an earlier result to make the script run again. The procedure source added in this slice must be committed for durable review; it does not change the previously qualified scaffold bytes.

## Stage 4 exit assessment

Local lint passed for the audit and existing scripts. All 24 existing tests passed. The actual private/fixture publication guard was rerun and returned expected exit `1`; no publish command was invoked. The full build/install matrix was not rerun because this slice changes audit tooling and documentation, not distributable package source.

| Area | Assessment |
| --- | --- |
| Repeated package bytes, frozen inputs, archive safety, evidence retention, bounded negative gates | Technical evidence passed within the recorded scaffold scope |
| Complete browser network evidence / blocked-GitHub runtime test | Still missing; no waiver inferred |
| End-to-end orchestration | Manual execution with committed controls, not a complete automated runner |
| Evidence backup | Local and Git-ignored; committing this record does not back up the artifacts |
| Independent personnel/application acceptance | Not performed; not supplied by these tests |
| Brand, component inventory, publishable version | Pending earlier decisions; private scaffold cannot be published |

Recommendation: retain the passed mechanism evidence, but **do not close Stage 4 or enter publication**. The next bounded proposal should address the runtime-network evidence gap with an approved observation/blocking method and then bring the exit assessment back to Locke. Any tooling or implementation change must have its own verification and commit boundary. Full automated-runner implementation and evidence backup/export require separately scoped work, not an implied permission to upload or change infrastructure.

## Rollback and gate

Only the new audit script and this record/roadmap/proposal status changed. Revert only those reviewed changes if withdrawing the slice; preserve original and review evidence. Temporary rehearsal files were removed and are reproducible; retained evidence and portable runtimes remain. No push, tag, release, package publication, CPQ/EPM edit, permission change or network configuration change occurred.

Stop at review/commit and Stage 4 exit-gap planning. This result is not independent application acceptance, deployment permission, or Production approval.
