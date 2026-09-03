# Nidec Engineering Design System Roadmap

This roadmap separates governance, implementation, release qualification, publication, and application adoption. Passing one gate does not imply approval for the next.

## Stage status

| Stage | Objective | Exit evidence | Current status |
| --- | --- | --- | --- |
| Stage 0 — Repository decisions | Establish repository, package identity, distribution channel, ownership, and local checkout | Approved decisions and verified clean checkout | Complete |
| Stage 1 — Governance baseline | Record responsibility, authorization, architecture decision, and gated roadmap | `AGENTS.md`, ADR-0001, roadmap, and README navigation reviewed | Complete |
| Stage 2 — Architecture definition | Define the public contract, technical stack, package boundaries, compatibility policy, and verification approach | Approved architecture record; pending business rules identified | In progress — input baseline |
| Stage 3 — Source skeleton | Establish only the approved source, test, documentation, and package structure | Local build and validation evidence for the skeleton | Not started |
| Stage 4 — Release qualification | Prove deterministic packing, consumer restoration, artifact hashing, and release checklist behavior without publishing or modifying CPQ | Qualified local `.tgz`, checksum, validation record, consumer-harness evidence, and rollback result | Not started |
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

Stage 2A does not select tooling or authorize source scaffolding, component migration, GitHub Actions, package publication, Release creation, repository settings changes, or adopting-application modifications. ADR-0002, source scaffolding, CPQ adoption, and EPM adoption remain separate approval gates.
