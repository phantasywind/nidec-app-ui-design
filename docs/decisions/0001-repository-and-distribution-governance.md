# ADR-0001: Repository and Distribution Governance

- Status: Accepted
- Decision owner: Locke Yuan (`phantasywind`)
- Accepted date: 2026-09-03
- Amended date: 2026-09-03 — clarified the multi-application scope and initial reference consumers
- Scope: Repository identity, package distribution, version consumption, and release evidence

## Context

Nidec applications require a shared design system that can evolve independently while remaining reproducible and auditable. CPQ and EPM are the initial reference consumers, while future applications may adopt the same governed package through an explicit compatibility assessment. The Design System must not couple application builds or runtime behavior to a mutable branch or to GitHub availability.

The repository is currently an independent private GitHub repository with no design-system implementation or release configuration. This decision establishes the governance boundary before architecture and source scaffolding begin.

## Decision

1. The source of truth is the private repository `phantasywind/nidec-app-ui-design`, with `main` as its default branch.
2. The distributed npm package is `@phantasywind/nidec-app-ui-design`.
3. GitHub Packages is the normal package distribution channel.
4. Each package version must have a matching GitHub Release that preserves:
   - the `.tgz` produced by the actual `npm pack` operation;
   - `SHA256SUMS.txt` covering the preserved artifact;
   - the release record describing the qualified version and evidence.
5. Every adopting application must consume an exact package version. The following are prohibited: `latest`, caret ranges, tilde ranges, other version ranges, Git URLs, and direct references to `main`.
6. Consumer builds may download the approved package during dependency restoration, but a completed application build must not depend on GitHub at runtime.
7. A published version, Git tag, package, or release artifact must not be overwritten or reused. Any correction requires a new version.
8. Until another maintainer is assigned, Locke Yuan is the maintainer, release executor, and approver. Self-review must use a fixed release checklist and prove version, tag, package, release, artifact, and hash consistency.
9. The Design System repository owns governance, tokens, reusable components, documentation, tests, build, and release mechanisms. Each adopting application separately owns package adoption, application adaptations, domain rules, RBAC, API contracts, acceptance, and Production approval.
10. CPQ and EPM are the initial reference consumers used to establish and verify the first compatibility contract. Future Nidec applications must complete the same governed compatibility assessment; compatibility is not automatic or universal.
11. Knowledge and skills remain separate from source distribution: the knowledge base retains long-lived standards and adoption decisions; a skill may teach correct consumption but must not copy or carry the package source.

## Consequences

### Benefits

- Consumers can reproduce an adopted UI baseline from an immutable version.
- Release artifacts remain independently inspectable if package restoration needs audit or recovery.
- Initial and future applications can adopt on separate schedules without sharing application business logic.
- Package publication, application acceptance, and Production approval remain distinct decisions.

### Costs and risks

- Every release requires coordinated package, tag, Release, and checksum evidence.
- A single-person approval model has reduced independence until a second maintainer is assigned.
- Consumer-specific needs may create pressure to add business behavior to the shared package; the responsibility boundary must be enforced.

## Controls

- Use an immutable version for every correction.
- Validate tag/package/release/hash consistency before declaring a release qualified.
- Keep application-specific rules out of shared components unless separately reviewed and approved as a reusable contract.
- Treat build and self-test as technical verification, not independent acceptance.
- Require explicit authorization before Push, Package publication, GitHub Release creation, settings changes, or adopting-application integration.

## Not decided by this ADR

The following remain future gated decisions:

- source language, framework, build tool, test tool, and documentation tool;
- token taxonomy, brand values, component inventory, and accessibility targets;
- initial semantic version and detailed release automation;
- Initial or future application integration sequence and application acceptance criteria.

These items must not be inferred from this decision.
