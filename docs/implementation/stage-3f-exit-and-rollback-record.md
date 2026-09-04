# Stage 3F Exit and Rollback Record

- Status: Technical exit verified; repository commit pending
- Approval: Locke Yuan, 2026-09-03 (`请继续` at the Stage 3F gate)
- Verification date: 2026-09-03
- Stage 3 baseline: `184d73b85245774b625a8f702e98e611ede17f43`
- Scope: Clean restoration, complete Stage 3 validation, actual tarball consumption, publication blocking, and isolated rollback/restoration proof
- Next gate: Commit the Stage 3E/3F work and verify a clean durable repository state before any Stage 4 proposal

## Executive conclusion

The Stage 3 source skeleton has met its local technical exit criteria. It can be restored from the committed root lockfile, validated, built, packed, installed into both approved fixture types, rolled back to the pre-Stage-3 governance baseline in isolation, and restored byte-for-byte at the source-file level.

Stage 3 is not yet recorded as durably complete because the Stage 3E and Stage 3F changes remain uncommitted. No Stage 4 work, publication, GitHub mutation, or real CPQ/EPM integration is authorized by this result.

## Clean restoration proof

Before the final workflow, only these confirmed repository-local, reproducible paths were removed:

- `node_modules/`
- `dist/`
- `.pack/`
- `.tmp/consumers/`

The verified portable Node runtime under `.tmp/node-24.20.0/` was retained so the exact maintainer toolchain remained available.

From the empty dependency/build/package state:

1. Node `24.20.0` / npm `11.19.0` ran `npm ci --ignore-scripts`.
2. 123 packages were installed and 124 audited; npm reported 0 vulnerabilities.
3. `npm run verify:stage3f` executed the root verification, actual packing, two isolated consumers, and rollback proof.
4. The complete command exited with code 0.

## Complete verification-chain result

### Repository verification

- ESLint passed over repository JavaScript configuration and scripts.
- Strict TypeScript checking passed over source, tests, and configuration.
- Vite library build passed.
- CSS scope and namespace checks passed.
- Vitest passed 3 test files and 5 tests.
- The public-boundary check accepted exactly 7 build files.
- No runtime dependency or public component API was added.

### Final local tarball

| Field | Final Stage 3F value |
| --- | --- |
| Package | `@phantasywind/nidec-app-ui-design` |
| Version | `0.0.0-development` |
| Filename | `phantasywind-nidec-app-ui-design-0.0.0-development.tgz` |
| Packed size | 2,088 bytes |
| Unpacked size | 5,293 bytes |
| Entry count | 9 |
| SHA-256 | `01ef72aba1535a45815f9241612d0cfe394ee79eafc3a3a8b0cfa940f3af7084` |

The tarball retained the exact nine-file allowlist recorded in Stage 3E. The hash supersedes the earlier Stage 3E local hash because the packed `package.json` now includes the Stage 3F verification commands. This is an expected input change, not nondeterministic drift.

### Isolated consumers

- Token-only consumer: exact install and `npm ci`, strict type-check, Vite `8.2.2` production build, no React or React DOM installed.
- CPQ-compatible consumer: exact install and `npm ci`, strict type-check, Vite `8.1.4` production build, one React and React DOM resolution at `19.2.7`.
- Both installed the same final `.tgz` and only its public package paths.
- Both installed packages matched the nine-file allowlist.
- Both built outputs contained no GitHub registry/URL or repository-source path.
- Temporary consumer installations were removed.

The final ignored `consumer-result.json` records `status: passed`, Node `v24.20.0`, npm `11.19.0`, both completed consumers, and successful temporary cleanup.

## Rollback and restoration proof

`scripts/verify-stage3-rollback.mjs` performs the destructive part only inside `.tmp/stage3-rollback-proof/`:

1. copies the current non-generated repository source into an isolated snapshot;
2. removes the explicit Stage 3 implementation paths from the isolated copy;
3. restores the baseline roadmap blob from commit `184d73b`;
4. compares the isolated rollback inventory and normalized SHA-256 content against every file in the baseline commit;
5. restores the current Stage 3 source into a second isolated copy and compares inventory plus file hashes;
6. removes the entire proof directory in a `finally` block.

Final result after this record was added:

- rollback matched all 7 files in baseline `184d73b`;
- restoration matched all 56 current source files;
- `.tmp/stage3-rollback-proof/` was removed;
- the real worktree was never mutated by the rollback exercise.

## Publication remains blocked

After the successful complete workflow, `npm run publication:check` exited with code 1 as required. It identified:

- `package.json` remains private;
- the scaffold token source remains present;
- the generated scaffold CSS and JSON remain present.

Therefore a successful local build, tarball, or consumer build cannot be confused with publication readiness.

## Clean-workflow defect discovered and corrected

The first Stage 3F clean run exposed that the earlier `verify` order depended on an existing full `dist/`:

- `npm test` generated the five token/style outputs;
- the following boundary check correctly rejected the partial directory because `index.js` and `index.d.ts` had not yet been built.

The workflow was corrected to build the complete package before tests and final boundary validation. The entire Stage 3F chain then passed from the clean state. This removes hidden dependence on historical build output.

## Stage 3 exit assessment

| Exit requirement | Evidence | Status |
| --- | --- | --- |
| Approved source/package/test/documentation structure | Stage 3A–3F implementation and records | Met locally |
| Exact maintainer toolchain and lock restoration | Node `24.20.0`, npm `11.19.0`, successful clean `npm ci` | Met |
| Empty governed public boundary | ESM root, declarations, export allowlist, internal rejection | Met |
| Non-brand token pipeline | DTCG scaffold source, deterministic CSS/JSON, publication markers | Met |
| CSS isolation | host, namespace, cascade layer, forbidden-selector checks | Met |
| Automated validation | lint, strict source type-check, 5 tests, build/boundary checks | Met |
| Actual package consumption | final `.tgz`, token-only and CPQ-compatible consumers | Met locally |
| Runtime independence | no GitHub/source reference in consumer output | Met |
| Rollback and restoration | isolated baseline and current-source hash comparison | Met |
| Durable repository record | Stage 3E/3F changes committed and clean | Pending user commit |

Controlled deferrals remain unchanged: authoritative Nidec brand values/assets, first component inventory, exact browser/OS support matrix, and exact first qualification version. Stage 3 has not bypassed any of them.

## Authorization boundary retained

Stage 3F does not authorize or implement:

- Stage 4 formal artifact qualification or release-runbook execution;
- production tokens, brand assets, React components, or a component inventory;
- package publication, tags, GitHub Releases, Actions, settings, or credentials;
- actual CPQ/EPM modification, migration, acceptance, deployment, or Production approval.

## Rollback of this step

Remove `scripts/verify-stage3-rollback.mjs`, the `rollback:verify` and `verify:stage3f` package scripts, this record, and the Stage 3F roadmap update. Generated `.pack/`, `dist/`, `node_modules/`, and Stage 3F temporary paths may be deleted only after their resolved paths are confirmed inside this repository. Stage 3E remains intact.

## Next gate

The immediate next action is not Stage 4 implementation. The current Stage 3E/3F changes must first be committed and the repository rechecked as clean. After that, a separate Stage 4 release-qualification proposal may be prepared for approval. It must define formal artifact preservation, checksum/manifest qualification, repeatability, and rollback without publishing anything.
