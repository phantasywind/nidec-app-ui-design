# Stage 4B — Evidence contract and control-level verification

- Date: 2026-09-04
- Status: Implemented and locally tested; formal qualification not executed
- Authorization: Locke Yuan's continuation instruction after the Stage 4 proposal
- Source entry point: Stage 3 commit `3b7f5cb670e7250a58732b201cc0144facbabd83`; this step is an uncommitted local slice
- Scope: Private scaffold mechanism only; no publication or application adoption

## Contract and ownership

`scripts/qualification-contract.mjs` provides validation primitives. It does not attest that commands ran or that a supplied commit is clean. The future runner must obtain these facts from actual executions, never user-entered success flags. A validated manifest alone is not qualification approval.

The version-1 manifest records `scope`, unique `runId`, clean full source commit, root lock hash, exact maintainer Node/npm, OS/architecture, timestamps, status, limitations, artifact byte size/SHA-256/per-file hashes, command exits, both build hashes, both consumer results, publication guard exit, cleanup and rollback results. Successful records require matching build/artifact/consumer hashes and successful smoke status. Publication guard exit 1 is recorded separately from successful commands.

Consumer results record name, artifact hash, frozen source and lock hashes, actual Node/npm and smoke status. Recording a runtime string does not prove compatibility: the runner must execute the approved exact runtime matrix and retain its output. No Node 22 result exists in this step.

## Retention layout

Use `.qualification/runs/<unique-run-id>/`, outside disposable `.pack`, `.tmp` and `dist`. The directory is Git-ignored and excluded from rollback snapshots. `preserveRun` exclusively reserves a new run directory and writes:

- `candidate.tgz`: actual inspected bytes, not reconstructed contents.
- `manifest.json`: UTF-8 JSON with a trailing newline.
- `SHA256SUMS.txt`: hashes of both files above.

Existing run IDs, including partial failed writes, must never be reused or overwritten. A partial directory is incomplete evidence, not success. Retain until Locke explicitly authorizes deletion; Git exclusion is not backup. A separate approved backup/export is needed before relying on durable retention. Checksums detect changes relative to the record; they are not signatures or protection against an actor rewriting all evidence.

The future runner must additionally retain sanitized logs, frozen fixture inputs and their hashes, and explicit completion evidence. The current writer intentionally writes only the three core files; complete runner retention and read-back verification are still pending.

## Archive and consumer controls

The archive reader examines gzip/tar bytes without extracting files. Compressed and expanded sizes are bounded. Only regular ustar entries with safe paths and the exact nine-file scaffold allowlist are accepted. Header checksum, package name, private flag, development version, and per-file hashes are checked. Links, extensions, traversal and duplicate case-insensitive paths fail closed.

`verify-package.mjs` now adds independent `archiveEvidence` to its scratch pack record. `verify-consumer.mjs` validates that evidence before install, before `npm ci`, and after `npm ci`; old scratch records without it are rejected and must be regenerated with `pack:verify`. There is no promise of protection against concurrent malicious filesystem mutation; isolated runs must have a single writer.

React resolution compares real package paths from both the application and Design System context, retaining the existing dependency-tree version check. Invoke after installation stabilizes in a fresh process: Node caches module resolution. This checks the relevant two resolution contexts, not every unrelated transitive package in the application.

## Fixed fixture inputs

Future qualified replay uses this relative layout within a retained input bundle:

- `artifacts/candidate.tgz`
- `fixtures/token-only-consumer/package.json` and `package-lock.json`
- `fixtures/react-vite-cpq-consumer/package.json` and `package-lock.json`

Both manifests and locks must reference `file:../../artifacts/candidate.tgz`. `validateFixtureLock` checks lock version 3, exact direct versions, manifest/lock agreement and registry-resolved transitive entries with integrity fields. Its return value is the SHA-256 of `JSON.stringify(parsedLock)` (normalized object serialization), not the raw file hash. The future runner must retain raw file hashes too and let npm verify integrity during `npm ci`.

A separate preparation operation may resolve and freeze these locks. Qualified replay must use the frozen inputs with `npm ci`, never generate a fresh lock with `npm install`. This step implements/tests the validator only. The existing Stage 3 consumer script still creates transient locks; it is not a Stage 4 qualified replay runner.

## Credentials and logs

Do not capture environment dumps, npm credentials or authenticated URLs. `redactLog` masks common authorization, token/password/secret assignments and URL credentials; it is a best-effort secondary filter, not a complete secret detector. Only sanitized, inspected logs may enter retained evidence. The helper is not yet wired into a full qualification runner; existing Stage 3 console output is not retained qualification evidence.

## Local verification and limitations

Executed with portable Node `v24.20.0` / npm `11.19.0`, leaving global tooling unchanged:

- `npm run verify`: lint, typecheck, build, CSS and public-boundary checks; 4 test files / 24 tests passed, including 19 new qualification-control tests.
- `node scripts/verify-stage3-rollback.mjs`: baseline `184d73b` matched across 7 files; restoration compared the current snapshot against the same rolled-back tree. Temporary proof directories were removed; the working repository was not rolled back.
- Read-only inspection of the pre-existing real npm tarball succeeded with 9 files and SHA-256 `01ef72aba1535a45815f9241612d0cfe394ee79eafc3a3a8b0cfa940f3af7084`. This is parser compatibility evidence, not a newly qualified artifact.
- `node scripts/check-publication.mjs`: expected exit 1, private/fixture publication blockers intact.

Tests exercise synthetic valid records, byte tampering, size/content mismatch, traversal, absolute paths, links, duplicates, unexpected files, stale consumer/build records, failed commands, missing cleanup/rollback, incomplete smoke evidence, portable lock constraints, redaction, exclusive retention, and same-version physical React duplicates. Synthetic success flags are fixtures, not real qualification evidence.

No full consumer install was run in this step. Pack/consumer integration has lint and helper-level evidence only. Two clean committed builds, frozen real fixture locks, Node 22 execution, browser smoke/network checks, complete retained-run read-back and formal negative rehearsals remain for subsequent approved steps. Stage 4 is incomplete.

## Rollback and next gate

Before commit, revert only this slice's reviewed files, preserving unrelated changes. After commit, use a separately approved targeted revert; never reset the repository. Disposable test directories are removed by their tests; no formal retained run was created.

Stop here. Review/commit Step 4B, then obtain approval for Step 4C runner completion and actual qualification executions. Keep `private: true`, `0.0.0-development` and publication blocking unchanged.
