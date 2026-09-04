# Nidec Engineering Design System Roadmap

This roadmap separates governance, implementation, release qualification, publication, and application adoption. Passing one gate does not imply approval for the next.

## Stage status

| Stage | Objective | Exit evidence | Current status |
| --- | --- | --- | --- |
| Stage 0 — Repository decisions | Establish repository, package identity, distribution channel, ownership, and local checkout | Approved decisions and verified clean checkout | Complete |
| Stage 1 — Governance baseline | Record responsibility, authorization, architecture decision, and gated roadmap | `AGENTS.md`, ADR-0001, roadmap, and README navigation reviewed | Complete |
| Stage 2 — Architecture definition | Define the public contract, technical stack, package boundaries, compatibility policy, and verification approach | Approved architecture record; pending business rules identified | Complete — ADR-0002 accepted with controlled deferrals |
| Stage 3 — Source skeleton | Establish only the approved source, test, documentation, and package structure | Local build and validation evidence for the skeleton | Complete — committed at `3b7f5cb` |
| Stage 4 — Release qualification | Prove deterministic packing, consumer restoration, artifact hashing, and release checklist behavior without publishing or modifying CPQ | Local scaffold artifact, checksums, consumer evidence and rollback; bounded scope defined in the exit review | Complete for bounded private-scaffold mechanism scope — explicitly accepted by Locke on 2026-09-04; not publishable-library qualification |
| Capability definition — Before Stage 5 | Define the first usable library surface and authoritative inputs | Approved component slice, input register and acceptance plan before implementation | Fluent prototype implemented; type/build/package/Node 22 checks passed; browser findings and brand inputs pending; technical gate remains open |
| Stage 5 — First publication | Publish one explicitly approved immutable version and its matching evidence | Matching version, tag, GitHub Package, Release, `.tgz`, checksum, and release record | Not authorized |
| Stage 6 — CPQ reference adoption | Use a bounded, reversible CPQ slice to adopt an exact approved version and validate practical effect | Separate CPQ integration, technical verification, independent acceptance, and rollback evidence | Out of current scope |
| Stage 7 — EPM and future application adoption | After CPQ acceptance, let EPM or another application independently qualify and adopt; EPM may rebuild its early-stage frontend | Consumer Compatibility Profile plus separate implementation, verification, acceptance, deployment, and rollback evidence per application | Out of current scope |

## Gate rules

- Each stage requires an explicit scope and approval before implementation begins.
- Every step must state purpose, operations, expected result, verification, and rollback before changes are made.
- Technical verification does not authorize publication, application integration, independent acceptance, deployment, or Production use.
- CPQ technical verification or acceptance does not automatically accept EPM or another application; each consumer retains its own compatibility and acceptance gate.
- A stage with unresolved required evidence remains incomplete. Narrow verified slices must not be presented as the completed stage.
- Brand rules, component requirements, consumer behavior, and business semantics not yet approved remain pending; they must not be invented to advance the roadmap.

## Current checkpoint

Upstream-only comparison (2026-09-04): Fluent 9.74.7 without Nidec code reproduces the initial-state sentinel warning. Forward Tab records about 2.3ms to the real button; dialog keyboard containment/return were observed, but an incomplete dialog scan and unqualified reverse-entry attempt remain disclosed. Existing project typecheck passes; the additional full upstream declaration check fails. See `docs/implementation/fluent-upstream-comparison-record.md`. Recommendation: retain the candidate for technical-route review with explicit accessibility and declaration-compatibility conditions; no rule waiver, version change or application adoption is approved.

Focus/overflow follow-up (2026-09-04): the old on-page scan report was reproduced as a source of horizontal overflow; no-report scans at actual 1440/1280/900/720 widths and the sampled light-dialog states did not overflow. Serialized scans still report focus-state-dependent `aria-hidden-focus` on Tabster sentinels. This is not waived; Fluent technical-route approval remains pending. See `docs/implementation/fluent-focus-diagnostic-record.md`. Next proposed step is same-version upstream-only reproduction and supported-remedy assessment, not application adoption or publication. Earlier findings below are retained as history.

Fluent continuation (2026-09-04): Locke authorized the bounded type-adaptation follow-up. Strict type/build checks and 36 tests passed; two clean working-source snapshot builds produced identical tarballs, and both Node 22 consumers passed. The active source is the Fluent candidate. Browser interaction/theme/CSP observations were recorded, but intermittent `aria-hidden-focus` findings and transient overflow flags remain unresolved. The technical gate is NOT closed. See `docs/implementation/fluent-adaptation-record.md`; next is bounded accessibility/overflow investigation, not publication or CPQ/EPM adoption. The stopped first attempt below remains historical evidence.

On 2026-09-04, Locke authorized direct replacement of the native Button prototype with Fluent UI v9. ADR-0003 records the controlled architecture adjustment. The official registry confirmed candidate 9.74.7, but the attempted wrapper failed strict type checking and installation did not complete. Per the approved failure gate, the candidate was preserved locally and the runtime/source/manifest changes were rolled back. See `docs/implementation/fluent-transition-record.md`. The active package remains the native Button baseline; Fluent technical qualification, packing, browser checks and application adoption are pending. This does not reopen or transfer historical scaffold qualification to Fluent.

Stage 1 is complete. Stage 2A records the architecture inputs, evidence requirements, decision matrix, and ADR-0002 entry criteria in `docs/architecture/architecture-inputs.md`.

The approved qualification sequence is independent framework and governance first, CPQ bounded reference adoption second, and EPM adoption or frontend rebuild after CPQ acceptance. EPM evidence is deferred until its adoption planning and does not block ADR-0002.

Stage 2 is complete. ADR-0002 at `docs/decisions/0002-shared-package-architecture.md` accepts the layered single-package architecture, DTCG token interchange, Node 24 LTS build policy, ESM-first output, React peer dependencies, scoped/layered CSS, WCAG 2.2 Level AA target, and pre-1.0 qualification posture.

Controlled deferrals remain for the exact browser/version/OS matrix, Nidec-wide brand authority, first component inventory, and exact first qualification version. Their blocking effects are defined in ADR-0002 and must not be bypassed with CPQ defaults or guessed values.

Stage 3A is complete as a proposal at `docs/implementation/stage-3-source-skeleton-proposal.md`. It fixes the proposed maintainer toolchain, separates that toolchain from the CPQ-compatible consumer contract, defines the empty public boundary, namespace, fixture-only token pipeline, local verification, non-goals, and rollback.

Stage 3B is implemented and technically verified. The evidence record at `docs/implementation/stage-3b-metadata-toolchain-record.md` confirms the private package metadata, exact Node/npm and development dependency pins, npm 11 lockfile, clean exact-toolchain `npm ci`, installed-version agreement, zero reported audit vulnerabilities, and absence of Stage 3C+ implementation paths. The host's global Node/npm installation was not changed.

Stage 3C is implemented and technically verified. The evidence record at `docs/implementation/stage-3c-empty-public-boundary-record.md` confirms the empty root API and declaration, internal-subpath rejection, deterministic two-file ESM build, namespace enforcement, no runtime dependencies, no bundled React, exact-toolchain clean restoration, and complete verification-chain success.

Stage 3D is implemented and technically verified. The evidence record at `docs/implementation/stage-3d-fixture-token-pipeline-record.md` confirms deterministic DTCG fixture transformation, scoped/layered CSS, identical reviewable and distributable outputs, 5 passing tests, exact-toolchain clean restoration, and a publication guard that fails while non-brand scaffold data exists.

Stage 3E is implemented and technically verified. The evidence record at `docs/implementation/stage-3e-local-consumer-verification-record.md` confirms the real nine-file tarball and SHA-256, clean lockfile restoration, token-only consumption without React, CPQ-compatible React/Vite consumption without duplicate React, installed-file allowlists, no runtime GitHub/source dependency, and removal of temporary consumers. The test also identified and corrected missing TypeScript declarations for CSS subpath imports.

Stage 3F is technically verified. The exit record at `docs/implementation/stage-3f-exit-and-rollback-record.md` confirms clean lockfile restoration, the complete Stage 3 verification chain, the final local nine-file tarball, both isolated consumers, enforced publication blocking, rollback to baseline `184d73b`, full source restoration, and temporary cleanup. A clean-run ordering defect was corrected so verification no longer depends on historical `dist/` output.

On 2026-09-04, Stage 3E/3F were confirmed committed at `3b7f5cb670e7250a58732b201cc0144facbabd83` with a clean worktree before this documentation step. This closes the pending-commit condition in the historical Stage 3F record. HEAD matched the local `origin/main` reference; no network refresh was performed. Stage 3 is complete within its scaffold scope, not release or application qualification.

The Stage 4 proposal is at `docs/implementation/stage-4-qualification-proposal.md`. It separates private scaffold mechanism qualification from publication readiness, and identifies evidence preservation, actual archive inspection, fixed consumer locks, Node 22 validation, physical React resolution, and same-tree restoration as follow-on controls.

Step 4B was authorized by Locke Yuan's continuation instruction on 2026-09-04. The evidence contract and local test record are at `docs/implementation/stage-4b-evidence-contract.md`. Archive inspection, artifact binding, exclusive evidence retention, fixture-lock validation, physical React resolution checks, and same-tree rollback restoration are implemented. The root verification chain passed with 24 tests. This is control-level evidence, not a formal qualification run; end-to-end consumer execution of the new controls remains pending.

On 2026-09-04, Step 4B was confirmed committed at `5f41634573131751129599aa1039a79535675e40` with a clean worktree. Locke authorized Step 4C by confirming the commit and asking to continue. The execution record is `docs/implementation/stage-4c-execution-record.md`: two independent committed-source restores each passed 24 tests and produced byte-identical tarballs; frozen consumer inputs passed install/build/content checks under Node 24 and Node 22; Node 22 outputs passed a bounded Edge DOM/CSS smoke check; same-tree rollback and temporary cleanup passed.

The local retained manifest is a scoped execution pass, not a Stage 4 exit approval. Complete browser network evidence is unavailable and end-to-end orchestration was manual using committed controls. These limits remain explicit.

Step 4C's record was confirmed committed at `cc036f9be616ed0b35d6ba3ebafa118a5f8fe1fe` on 2026-09-04. Locke authorized Step 4D by asking to continue. The assessment at `docs/implementation/stage-4d-exit-assessment.md` records exact verification of all 76 retained files against committed anchors, a matching fresh source archive, consistent frozen inputs and four consumer output sets, 18 correctly rejected negative cases, unchanged original evidence, and successful cleanup/same-tree restoration. Lint and 24 existing tests passed; publication blocking remains intact. This is technical re-verification by the same agent/maintainer, not independent personnel/application acceptance.

Step 4D was confirmed committed at `a3cf773ff4bd8ebbad0ade88b74dd78fd001a2aa`. Locke's continuation authorized network-evidence preparation. The plan at `docs/implementation/stage-4e-network-evidence-plan.md` records a loopback-only, response-header CSP probe that serves original retained bytes and requires a separate enforced-block control case. Step 4E1 is implemented: lint and 27 tests passed, all four retained output sets loaded with hash checks, and same-tree restoration passed. Synthetic report tests do not prove browser enforcement.

The probe implementation was confirmed committed at `0051a951b587ce00636a8b954fd8d63ffcb43151`. Locke authorized continuation. `docs/implementation/stage-4e2-browser-result.md` records two observed enforced `connect-src` control reports, successful unchanged fixture initial renders, no fixture CSP reports/errors, successful asset responses, and a post-render observation interval over 19 seconds. Both servers and all four test tabs closed; retained evidence passed readback and the original 76 files remained unchanged.

Step 4E2 was confirmed committed at `6d7d22757481b53a1010f57bc79731f4039ecb0a`. The exit review at `docs/implementation/stage-4-exit-review.md` recommends accepting only bounded private-scaffold mechanism verification with disclosed limits, then preparing a first usable-library scope proposal rather than publishing the scaffold. The review rechecked 82 listed evidence files across Stage 4C/4D/4E2; this is read-back, not a rerun of historical execution.

Locke explicitly replied “同意” to the bounded Stage 4 closure and next-proposal preparation request on 2026-09-04. The accepted scope and retained limitations are recorded in `docs/implementation/stage-4-exit-review.md`. Stage 4 is closed only for private-scaffold mechanism verification; full network isolation, publishable visual-library qualification and application acceptance are not claimed.

The first usable-library scope proposal is `docs/implementation/first-usable-library-scope-proposal.md`. Locke approved only the Button functional prototype on 2026-09-04. The record at `docs/implementation/button-prototype-record.md` documents its native contract, sole runtime export, 32 passing tests, package-consumer regression and bounded browser interaction results. The prototype retains native visual styling and publication blocking; no production brand data or later components were implemented.

The prototype was confirmed committed at `ceb04a14fcaa308fdfe068290dff923e7f71f672`. `docs/implementation/button-validation-record.md` records clean-source verification (32 tests and inspected artifact), both Node 22 consumers, and axe-core 4.13.0 browser scans at actual widths 1440/1280/900/720. Each scan had 12 passed rules, zero violations/incomplete items and no original-fixture overflow; the unnamed-button negative control was detected. Keyboard/focus checks at 720 passed. One initial width-mismatch attempt was retained and excluded. All 59 new evidence files passed checksum readback and temporary installations were removed.

The next gate is review/commit of this bounded Button validation and a decision on the next capability/input slice. These observations are not full WCAG/all-browser conformance, production visual qualification or independent application acceptance. Brand inputs, TextInput/Field, publication and CPQ/EPM changes retain their separate approvals; historical scaffold evidence is not transferred to the Button bytes.
