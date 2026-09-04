# Stage 4 Local Qualification Proposal

- Status: Step 4B authorized and implemented; Step 4C approval pending
- Date: 2026-09-04
- Decision owner: Locke Yuan
- Verified Stage 3 commit: `3b7f5cb670e7250a58732b201cc0144facbabd83`
- Entry observation: local worktree clean; HEAD matched the locally recorded `origin/main` reference (no network refresh performed)
- Scope: Local qualification of the packaging mechanism, not approval of a publishable visual library

## Recommendation

Qualify the release mechanism using the private scaffold before approving any publication. Keep `0.0.0-development`, `private: true`, fixture markers, and the publication guard intact. A successful result means **local scaffold mechanism qualified**, not **release ready**, brand approved, component accepted, or CPQ accepted.

The eventual published candidate must undergo qualification again against its own committed source, approved production inputs, version, and exact bytes. A scaffold artifact must never be relabelled as that candidate.

## Facts and evidence limits

Stage 3 is committed and locally verified. Its root build, fixture tests, packed installation, and isolated baseline comparison provide a useful foundation. The following gaps remain for stronger release evidence:

| Observed implementation | Evidence limit | Proposed Stage 4 control |
| --- | --- | --- |
| `verify-package.mjs` deletes `.pack` before packing | Prior qualification evidence can be overwritten | Separate disposable scratch output from uniquely identified retained runs; refuse overwrite |
| Package file list comes from npm's pack report and installed file names | Does not independently prove archive entry safety or per-file contents | Inspect actual tar entries, reject traversal/links/duplicates, and compare file-content hashes with the manifest |
| Consumers generate locks on each run and remove them with temporary installs | Exact direct versions do not freeze transitive resolution between runs | Preserve normalized fixture locks and their hashes; restore with `npm ci` from fixed inputs |
| Both consumers ran on Node 24 | CPQ-shaped package versions do not prove Node 22 compatibility | Add a separately pinned, verified Node 22 run before making that runtime claim |
| React check collects a set of version strings | Two physical copies of the same version could pass | Inspect resolved physical module paths from the app and package contexts, plus dependency-tree evidence |
| Runtime check searches built files for strings | Static absence is not a browser network test | Label the result as static evidence; add a bounded served-build smoke/network check before stronger runtime claims |
| Rollback verifies a baseline copy, then makes a fresh current-source copy | Proves snapshot equivalence, not restoration into the rolled-back directory | Exercise restoration into the same isolated rolled-back tree and compare inventory and hashes |
| Root verification previously depended on old `dist` files | Fixed in Stage 3F, but needs clean-checkout evidence | Build twice in separate clean source snapshots with no shared build output |

These limits do not erase Stage 3's scoped results. They prevent those results from being overstated as formal release or application compatibility evidence.

## Proposed evidence contract

Each qualification run receives a unique run identifier, separate from the npm version. The retained directory is outside `.pack` and excluded from automatic cleanup. Its exact local location and retention policy must be fixed in Step 4B before execution. Local retention is not a backup or a GitHub Release.

The proposed run manifest records:

- manifest schema version, run ID, timestamps, result and qualification scope;
- full source commit and clean-tree observation; implementation/configuration changes require a new committed input;
- actual Node/npm versions, OS/architecture, root lock hash, fixture source/lock hashes, and effective build commands;
- package name/version, archive filename, byte size, SHA-256, archive entry list and per-file hashes;
- build A/B archive and output hashes with explicit comparison results;
- per-consumer runtime, install/type-check/build/smoke result, React resolution evidence, and the exact consumed archive hash;
- publication-guard result, negative-test outcomes, cleanup/restoration outcome, and unresolved limitations;
- command exit codes and redacted log paths.

The consumer verifier must verify the supplied archive hash against the manifest **before installation**, and again after use. It must not select an arbitrary `.tgz` merely because only one filename happens to exist. The manifest and checksum list must cover preserved evidence without circular self-hashing.

Preserved fixture locks must avoid machine-specific absolute paths: stage the same verified tarball at a controlled relative location within the isolated evidence layout. Do not change the root dependency policy or ship a `file:` dependency to real consumers.

## Repeatability and failure gates

Qualification requires two independently restored source snapshots of the same committed input, exact tools, root lock and fixture locks. Compare actual tarball bytes, not just `dist` contents. If hashes differ, record the differing entries and cause; do not silently normalize or waive the discrepancy.

Proposed negative cases, exercised only on disposable copies:

- one-byte archive corruption and checksum mismatch;
- wrong package identity/version or source/lock reference;
- missing/extra archive entry, unsafe path, symbolic link, or duplicate entry;
- stale consumer result referring to a different archive;
- missing consumer lock, nonzero verification command, or failed cleanup;
- attempt to reuse a retained run directory;
- scaffold/private publication guard unexpectedly passing.

Each case must fail before downstream use where applicable. A cleanup failure is recorded as failure, not hidden by a prior build pass. No negative test invokes an actual publish, push, tag, Release, credential, or settings operation.

## Controlled implementation steps

| Step | Bounded work | Stop condition |
| --- | --- | --- |
| 4B — Evidence contract and controls | Define manifest/retention layout, redaction, safe archive checks, hash binding, fixed fixture inputs, and same-tree rollback verification; add tests | Review local changes and tests; no formal qualification run yet |
| 4C — Repeatable qualification execution | After implementation is committed, run two clean snapshots; pin and verify Node 22 separately; exercise consumers and declared smoke checks | Preserve pass/fail evidence and disclose every unsupported claim |
| 4D — Preservation and failure rehearsal | Verify preserved artifacts independently, run corruption/overwrite/stale-evidence cases, prove cleanup and restoration | Produce Stage 4 exit assessment without publication |

Node 24 `24.20.0` / npm `11.19.0` remains the maintainer baseline. The exact Node 22 patch and associated npm runtime must be recorded and checked before Step 4C; `node:22-alpine` is not an exact runtime pin. No new runtime is installed globally by this proposal.

## Required deferrals and exclusions

- Brand authority remains pending: no production colors, fonts, logos or other assets.
- First component inventory remains pending: no components or production visual qualification.
- Exact browser/OS support remains pending: any smoke environment is evidence for that run, not a general support declaration.
- Published version remains pending: no version bump, private-flag removal, tag, Package or Release.
- CPQ and EPM remain untouched. Local fixtures are not application acceptance.
- No GitHub Actions, settings, secrets, external storage upload, or remote mutation.

## Rollback and approval

This proposal changes documentation only. It can be withdrawn by removing this file and reverting its roadmap entry, preserving the Stage 3 closure record.

Approval authorizes **Step 4B only**. Each later step still needs its own purpose, operation, expected result, verification, rollback, and confirmation. Stage 5 publication requires separate explicit authorization and cannot inherit approval from this proposal.
