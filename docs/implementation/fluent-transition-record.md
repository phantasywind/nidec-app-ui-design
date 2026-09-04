# Fluent transition — stopped at the type gate

This is the historical first attempt. The authorized continuation is recorded in `fluent-adaptation-record.md`; it resolves the type gate but leaves browser qualification pending. Do not treat the rollback state below as the latest active implementation.

- Date: 2026-09-04
- Authorization: Locke's explicit Fluent v9 direct-replacement implementation plan
- Status: architecture recorded; replacement candidate failed type checking and was rolled back; Fluent qualification NOT completed
- Baseline HEAD: `ceb04a14fcaa308fdfe068290dff923e7f71f672`

## Preserved baseline

The starting worktree contained changes to `button-prototype-record.md` and `roadmap.md`, plus untracked `button-validation-record.md`. These were not discarded. The exclusive local baseline directory `.qualification/runs/fluent-transition/baseline` contains original bytes of both Button records, roadmap, source entry, build configuration, package manifest and lockfile, SHA-256 values, Git status and the original tracked diff.

Baseline lock SHA-256: `0e6bb559c365fc05cd77daacbbac4fa19b1b98f554c2d8131e9bb89b90e549ff`.

## Version check and installation limits

The public npm registry confirmed `@fluentui/react-components@9.74.7`, with React/React DOM and type peer ranges including React 19. Official metadata integrity:

`sha512-6CsXxSnhr55zflwNOB7mD/iqtv5kmr8PXfQdlwJPLkbLOiZXniTtvjaJKXhRFaJcVtZGAJ5vh1leQRyK1R+DQQ==`

An initial restricted-network query returned EACCES; the approved network query succeeded. Installation downloaded and extracted packages but did not finish before the type gate failed. The owned install process was interrupted; it did not produce a new root lockfile. Consequently this run does NOT claim a complete dependency restoration, independently verified archive integrity, vulnerability audit pass or reproducible candidate install. Ignored `node_modules` may contain partial/extraneous Fluent files; `.tmp/fluent-npm-cache` retains downloads. These are not a qualified dependency environment.

## Candidate and failure

The attempted candidate used an external exact optional Fluent peer, explicit Provider theme, native-contract Button wrapper and the approved Input/Field/Dialog exports. It updated the fixture and boundary tests without adding business semantics.

`npm run typecheck` using Node 24.20.0 failed, and a second captured check after stopping installation reproduced the errors:

1. `src/index.ts(12,38)`, TS2769: forwarding native Button properties through `createElement(FluentButton, ...)` does not satisfy Fluent's inferred component props under `exactOptionalPropertyTypes`; the first concrete mismatch is `disabled?: boolean | undefined` versus `disabled?: boolean`.
2. `src/index.ts(23,52)`, TS2769: the Provider object literal's `data-nidec-ui` attribute is not accepted by the inferred `createElement` overload.
3. Test property errors for `ref`, `theme` and `data-nidec-ui` follow the incorrect overload inference and also require correction.

These establish that this candidate does not compile. They do NOT establish that Fluent is intrinsically incompatible with React 19 or that the issues cannot be fixed. No compiler strictness was relaxed, assertions were not used to hide incompatibility, and no version was substituted. Per the approved failure gate, implementation stopped rather than expanding the interface-adaptation work.

## Evidence and rollback

`.qualification/runs/fluent-transition/type-gate` retains registry metadata, raw typecheck output, candidate diff, candidate source/type-test/fixture snapshots and source hashes. `scripts/record-fluent-type-gate.mjs` captures into a new exclusive directory and must not overwrite this run. The candidate diff is against HEAD and also includes the pre-existing documentation changes; do not apply it wholesale over the user's worktree.

Only this turn's replacement changes to the source entry, Vite config, package declaration, fixture, Button tests and three boundary/consumer scripts were reversed. The new failed Fluent type test was removed from the active test suite after preserving its bytes in the candidate snapshot. The original lockfile was never changed. ADR-0003, this report and evidence scripts remain. The prior Button records remain unchanged by this turn.

The active package therefore remains the native Button baseline, not a Fluent implementation. Local partial dependency files were not recursively deleted. A future attempt must use clean `npm ci` after producing an approved complete lockfile; do not use leftover modules as release evidence.

Post-rollback `npm run verify` passed with the existing Node 24.20.0 toolchain: lint, strict typecheck, build, scoped CSS, 32 tests in 6 files and the seven-file boundary check. Git reported no remaining runtime, fixture, package or existing-test diff. This is local baseline re-verification, not a clean-install qualification. The two pre-existing Button records and root lock retained their saved SHA-256 values:

- Button prototype record: `f8378ed24a02e288bf1af166226931e560feca95bc6392e477bd65d361c62340`.
- Button validation record: `18e6abba41aaf13a0051ece24ec7766346ff117481a5e074b62be0a0dc638bfc`.
- Root lock: `0e6bb559c365fc05cd77daacbbac4fa19b1b98f554c2d8131e9bb89b90e549ff`.

## Unexecuted gates and next decision

Fluent library build, two clean deterministic packs, Node 22 consumers, dependency isolation, browser interactions, accessibility, portal/theme isolation, CSP and size comparisons were NOT run. No Fluent artifact, application acceptance, publication or CPQ/EPM migration is claimed.

Recommended next bounded step: explicitly adapt the native-prop/Fluent type boundary and Provider host typing, preserving strict compiler settings and testing ref/undefined semantics. Also narrow inherited Provider properties so upstream unstable options cannot leak into the public API. Re-attempt installation in a clean controlled environment, then resume the original qualification sequence only after the type gate passes. This is a recommendation, not completed work.
