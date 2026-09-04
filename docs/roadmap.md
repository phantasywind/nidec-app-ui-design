# Nidec Engineering Design System Roadmap

This roadmap separates governance, implementation, release qualification, publication, and application adoption. Passing one gate does not imply approval for the next.

## Stage status

| Stage | Objective | Exit evidence | Current status |
| --- | --- | --- | --- |
| Stage 0 — Repository decisions | Establish repository, package identity, distribution channel, ownership, and local checkout | Approved decisions and verified clean checkout | Complete |
| Stage 1 — Governance baseline | Record responsibility, authorization, architecture decision, and gated roadmap | `AGENTS.md`, ADR-0001, roadmap, and README navigation reviewed | Complete |
| Stage 2 — Architecture definition | Define the public contract, technical stack, package boundaries, compatibility policy, and verification approach | Approved architecture record; pending business rules identified | Complete — ADR-0002 accepted with controlled deferrals |
| Stage 3 — Source skeleton | Establish only the approved source, test, documentation, and package structure | Local build and validation evidence for the skeleton | Complete — committed at `3b7f5cb` |
| Stage 4 — Release qualification | Prove deterministic packing, consumer restoration, artifact hashing, and release checklist behavior without publishing or modifying CPQ | Qualified local `.tgz`, checksum, validation record, consumer-harness evidence, and rollback result | Step 4C bounded run passed with declared limits; Step 4D pending; Stage 4 not complete |
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

The local retained manifest is a scoped execution pass, not a Stage 4 exit approval. Complete browser network evidence is unavailable and end-to-end orchestration was manual using committed controls. These limits remain explicit. The next gate is review/commit of the execution record and approval of Step 4D — independent retained-evidence verification and failure rehearsal. No publication, GitHub mutation, component/brand implementation, or adopting-application modification is authorized.
