# Nidec Engineering Design System Roadmap

This roadmap separates governance, implementation, release qualification, publication, and application adoption. Passing one gate does not imply approval for the next.

## Stage status

| Stage | Objective | Exit evidence | Current status |
| --- | --- | --- | --- |
| Stage 0 — Repository decisions | Establish repository, package identity, distribution channel, ownership, and local checkout | Approved decisions and verified clean checkout | Complete |
| Stage 1 — Governance baseline | Record responsibility, authorization, architecture decision, and gated roadmap | `AGENTS.md`, ADR-0001, roadmap, and README navigation reviewed | In progress |
| Stage 2 — Architecture definition | Define the public contract, technical stack, package boundaries, compatibility policy, and verification approach | Approved architecture record; pending business rules identified | Not started |
| Stage 3 — Source skeleton | Establish only the approved source, test, documentation, and package structure | Local build and validation evidence for the skeleton | Not started |
| Stage 4 — Release qualification | Prove deterministic packing, consumer restoration, artifact hashing, and release checklist behavior without publishing | Qualified local `.tgz`, checksum, validation record, and rollback result | Not started |
| Stage 5 — First publication | Publish one explicitly approved immutable version and its matching evidence | Matching version, tag, GitHub Package, Release, `.tgz`, checksum, and release record | Not authorized |
| Stage 6 — Consumer adoption | Let CPQ and EPM independently adopt an exact approved version | Separate consumer implementation, verification, acceptance, and deployment evidence | Out of current scope |

## Gate rules

- Each stage requires an explicit scope and approval before implementation begins.
- Every step must state purpose, operations, expected result, verification, and rollback before changes are made.
- Technical verification does not authorize publication, application integration, independent acceptance, deployment, or Production use.
- A stage with unresolved required evidence remains incomplete. Narrow verified slices must not be presented as the completed stage.
- Brand rules, component requirements, consumer behavior, and business semantics not yet approved remain pending; they must not be invented to advance the roadmap.

## Current checkpoint

Stage 1 is limited to repository governance documents. It does not authorize tooling selection, source scaffolding, component migration, GitHub Actions, package publication, Release creation, repository settings changes, or CPQ/EPM modifications.

The next gate after Stage 1 is a review of this governance baseline. Stage 2 may begin only after that review is accepted with a separately stated architecture-definition slice.
