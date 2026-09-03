# Nidec App UI Design — Agent Governance

## Purpose

This repository owns the shared, versioned Nidec Engineering Design System used by Nidec CPQ and EPM applications.

Work in this repository must establish reusable UI foundations without importing application-specific business state machines, role rules, API contracts, or domain behavior.

## Decision order

For every change:

1. Confirm the business objective and affected consumers.
2. Separate approved decisions, facts, assumptions, risks, recommendations, and pending business rules.
3. Define the reusable contract and governance impact.
4. Implement only the approved, smallest verifiable slice.

Do not invent brand standards, component requirements, application semantics, release rules, or consumer obligations. Record unresolved semantics as `Business Rule Pending` and identify the owning consumer.

## Responsibility matrix

| Area | Design System repository | CPQ repository | EPM repository |
| --- | --- | --- | --- |
| Repository governance and architecture | Owns | Consumes | Consumes |
| Design tokens and reusable components | Owns | Adopts | Adopts |
| Shared documentation, tests, build, and release mechanism | Owns | Consumes evidence | Consumes evidence |
| Package version selection | Publishes immutable versions | Owns CPQ pin | Owns EPM pin |
| Application integration and adaptation | Does not own | Owns CPQ integration | Owns EPM integration |
| Business workflows, RBAC, API contracts, and domain state | Must not duplicate | Owns CPQ semantics | Owns EPM semantics |
| Acceptance and production approval | Provides package evidence only | Separate CPQ gate | Separate EPM gate |

If a proposed shared design depends on CPQ or EPM business rules, record it as a consumer requirement or pending decision. Do not encode the rule in the public package without explicit approval.

## Approved baseline

- GitHub repository: `phantasywind/nidec-app-ui-design`.
- Default branch: `main`.
- npm package: `@phantasywind/nidec-app-ui-design`.
- GitHub Packages is the normal distribution channel.
- Every published version must also have a GitHub Release containing the actual `npm pack` `.tgz`, `SHA256SUMS.txt`, and release record.
- Consumers must install an exact version. `latest`, `^`, `~`, version ranges, Git URLs, and direct references to `main` are prohibited.
- A built consumer application must not require GitHub at runtime.
- Published versions are immutable and must never be overwritten or reused. Corrections require a new version.
- Long-lived standards, decisions, and adoption records belong in the knowledge base. Skills may guide correct use but must not contain or duplicate Design System source code.

The architecture decision record under `docs/decisions/` is the durable rationale for this baseline.

## Authorization boundary

Unless Locke Yuan explicitly authorizes the specific action:

- Do not push commits or tags.
- Do not publish a package or create a GitHub Release.
- Do not modify repository permissions, Rulesets, environments, variables, or secrets.
- Do not modify or integrate the CPQ or EPM repositories.
- Do not copy CPQ or EPM components into this repository in bulk.
- Do not expose, record, or commit tokens, passwords, cookies, connection strings, or other credentials.

Local, reversible work must still follow an approved small step. Before each step, state its purpose, operations, expected result, verification method, and rollback method. Stop at the next gate and wait for confirmation.

## Evidence and release controls

The initial maintainer, release executor, and approver is Locke Yuan (`phantasywind`). While this is a self-review model, each release must use a fixed checklist and prove consistency among the immutable version, Git tag, npm package, GitHub Release, artifact filename, and SHA-256 record.

When a second maintainer is assigned, release governance must be reviewed and upgraded to dual review before relying on that role.

Self-test, build success, or demonstration is technical evidence; it is not independent application acceptance or Production approval.

## Repository hygiene

- Preserve unrelated user changes and keep each slice narrow.
- Keep credentials and generated local secrets out of the repository.
- Prefer inspectable source, deterministic validation, and recoverable changes.
- Do not describe work as implemented and verified unless both the implementation and its stated verification have completed.
- Record phase status and gate evidence in `docs/roadmap.md`.
