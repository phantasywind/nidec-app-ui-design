# Stage 4C — Repeatable local execution record

- Date: 2026-09-04
- Decision owner: Locke Yuan
- Authorization: Confirmation that Stage 4B was committed and instruction to continue
- Source commit: `5f41634573131751129599aa1039a79535675e40`
- Entry and pre-seal state: clean worktree at that commit
- Result: Bounded execution passed; Stage 4 exit assessment and independent evidence review remain pending

## Purpose and boundaries

Exercise the committed Stage 4B controls against the private scaffold in isolated directories. No package version, public API, source implementation, global runtime, CPQ/EPM repository or GitHub state changed. Only this execution record and roadmap/proposal status are added to the tracked repository.

This was a manually orchestrated execution of committed controls and npm scripts. It does not introduce or claim a committed end-to-end automation runner. The retained manifest records commands, contexts, exit codes, logs and inputs. Future automation remains a separate implementation slice that must be committed before its qualification run.

## Source, tools and repeated builds

`git archive` exported the full source commit once; the archive was expanded into two independent directories without shared `node_modules` or `dist`. Each ran:

1. `npm ci --ignore-scripts --no-audit --no-fund --offline`
2. `npm run verify`
3. `npm run pack:verify`

Both used portable Node `24.20.0` and npm `11.19.0`. Both verification chains passed lint, typecheck, build, CSS and boundary checks, plus 4 test files / 24 tests. The actual archives each contain 9 allowed files and are 2,110 bytes, with identical SHA-256:

`0cd1d24cee41582c3bb776c08f4092fb2afe42f269c3d9c055e4efb330c67c62`

The first build-A dependency restoration was blocked by sandbox `EPERM` while reading the local npm cache. No build ran on that attempt. Its logs remain preserved. A scoped elevated retry using the same runtime, source and lock succeeded; the failed attempt is not presented as a passed command.

The additional portable runtime was downloaded from the [official Node 22.22.0 distribution](https://nodejs.org/dist/v22.22.0/). The Windows x64 ZIP matched the official HTTPS checksum list:

`c97fa376d2becdc8863fcd3ca2dd9a83a9f3468ee7ccf7a6d076ec66a645c77a`

Actual runtime output confirmed Node `22.22.0` / bundled npm `10.9.4`. No cryptographic signature verification is claimed. Neither portable runtime changed the global installation.

## Frozen consumer inputs and results

Preparation copied committed fixture sources, inserted the controlled relative `file:../../artifacts/candidate.tgz` dependency, and generated each lock once with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org`. These are private local fixtures, not the exact-version policy for adopting applications.

The prepared manifests, sources, raw lockfiles, normalized lock hashes, source inventories and candidate bytes were retained before replay. The committed lock validator accepted both. Each runtime received a fresh copy and used `npm ci`, followed by fixture typecheck/build; no lock was regenerated during replay.

| Consumer fixture | Node 24.20.0 / npm 11.19.0 | Node 22.22.0 / npm 10.9.4 |
| --- | --- | --- |
| Token-only | Install, typecheck, build, exact installed content and no React: passed | Same checks: passed |
| CPQ-compatible React/Vite | Install, typecheck, build, exact installed content and physical React resolution: passed | Same checks: passed |

Additional checks confirmed:

- Candidate bytes matched the build manifest before preparation/copy and after consumer use.
- Frozen manifest/source/lock bytes were unchanged after replay.
- Installed package inventory and every file hash matched the inspected archive.
- React and React DOM resolved to the same physical package from app and Design System contexts, at `19.2.7`. This is not a census of all unrelated transitive packages.
- Built outputs contained no `github.com` or `npm.pkg.github.com` strings. This is static evidence only.

All four built output inventories and their files were retained. Source and lock hashes are in `inputs/frozen-inputs.json`; detailed runtime, installed-file and React results are in `consumer-checks.json`.

## Browser smoke and explicit evidence limit

On Windows `10.0.26200.0`, Microsoft Edge `152.0.4191.53` opened the two **Node 22 built** fixture outputs using loopback-only Vite preview servers. Both pages showed their expected text, script-generated `data-token-count="4"`, computed fixture spacing `7px`, and local JS/CSS URLs. No warning/error entries were returned by the captured console log interface.

The browser interface did not expose Resource Timing in its read-only evaluation scope. No complete request trace or GitHub-blocked network test was obtained. Therefore:

- Functional DOM/CSS smoke passed for the two observed pages.
- Node 24 outputs have build/static evidence, not a separately observed browser smoke.
- Exhaustive runtime GitHub independence remains unproven; no general browser/OS support, visual/brand, accessibility or application acceptance claim is made.

This limitation must remain visible in the Stage 4D exit assessment; do not upgrade it through wording alone.

## Retained evidence and integrity anchors

Local evidence directory:

`D:\Documents\ChatGPT\GitHub Nidec App UI Design\.qualification\runs\stage4c-20260904-5f41634`

It was reserved as a new run directory, with no existing evidence overwritten. It contains the original and repeated archives, source ZIP, root/fixture locks, frozen input manifests, built consumer outputs, command logs, browser observations and final manifest. `SHA256SUMS.txt` covers 76 retained files, including `manifest.json`, excluding itself to avoid circular hashing.

| Evidence | SHA-256 |
| --- | --- |
| Source ZIP | `49b9d499183cfe60bbf66338d326c2e6f0d30394f8026bf59c2bbfa5b0f09009` |
| Committed root lock bytes | `0e6bb559c365fc05cd77daacbbac4fa19b1b98f554c2d8131e9bb89b90e549ff` |
| Final manifest | `2e2729ceac9147a9a8035449bc1c2535a31855d71530fbf8dfdfe3d771c11251` |
| Checksum list | `7de1867fa53ecca61ea475ab7d6d7bf8b7028114398b8b1983ca46ef36ba452c` |

The committed manifest validator accepted the final scoped record. Logs were checked with the existing redaction helper before sealing; none required substitutions. This is best-effort hygiene, not a comprehensive secret-detection guarantee. Original sandbox-failure logs are retained.

Local evidence is Git-ignored and not backed up by committing this document. Preserve it until explicitly authorized to delete. Stage 4D must independently read back and verify all retained evidence against these anchors; that independent review has not been performed in this step.

## Guard, rollback and cleanup

The private/fixture publication guard returned expected exit `1`. No publication was attempted.

The committed rollback script restored the baseline `184d73b` across 7 files, then restored and compared 60 current source files in the same isolated tree. The real worktree was not rolled back.

Both preview processes were stopped and their two agent-created tabs closed. The exact temporary directory `.tmp/stage4c-20260904-5f41634` was verified and removed, including its two source installations and four consumer installations. It can be reconstructed from retained source and frozen inputs. Retained evidence and portable tools remain; cleanup did not touch CPQ/EPM or the repository source.

## Next gate

Review and commit this record, then approve Stage 4D to independently verify retention and exercise corruption, overwrite, stale-evidence, and other failure cases on disposable copies. Keep the network evidence gap explicit. Stage 4, publication, integration, independent application acceptance and Production approval remain incomplete or unauthorized.

To withdraw this documentation slice, revert only its reviewed changes. Do not delete retained evidence as part of a documentation rollback.
