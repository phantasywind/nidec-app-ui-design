# Nidec App UI Design — Agent Governance

## Purpose

This repository owns the shared, versioned Nidec Engineering Design System for Nidec applications. CPQ and EPM are the initial reference consumers, not the permanent consumer boundary.

Work in this repository must establish reusable UI foundations without importing application-specific business state machines, role rules, API contracts, or domain behavior.

## Decision order

For every change:

1. Confirm the business objective and affected consumers.
2. Separate approved decisions, facts, assumptions, risks, recommendations, and pending business rules.
3. Define the reusable contract and governance impact.
4. Implement only the approved, smallest verifiable slice.

Do not invent brand standards, component requirements, application semantics, release rules, or consumer obligations. Record unresolved semantics as `Business Rule Pending` and identify the owning consumer.

## Responsibility matrix

| Area | Design System repository | Each adopting application workstream |
| --- | --- | --- |
| Repository governance and architecture | Owns | Consumes the approved contract |
| Design tokens and reusable components | Owns | Adopts qualified capabilities |
| Shared documentation, tests, build, and release mechanism | Owns | Consumes version-aligned evidence |
| Package version selection | Publishes immutable versions | Owns its exact version pin |
| Application integration and adaptation | Does not own | Owns its application integration |
| Business workflows, RBAC, API contracts, and domain state | Must not duplicate | Owns its application semantics |
| Acceptance and Production approval | Provides package evidence only | Uses separate application gates |

If a proposed shared design depends on any adopting application's business rules, record it as a consumer requirement or pending decision. Do not encode the rule in the public package without explicit approval.

## Approved baseline

- GitHub repository: `phantasywind/nidec-app-ui-design`.
- Default branch: `main`.
- npm package: `@phantasywind/nidec-app-ui-design`.
- The Design System is intended for multiple Nidec applications. CPQ and EPM are the initial reference consumers used to establish the first compatibility contract.
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
- Do not modify or integrate any adopting application repository, including CPQ and EPM.
- Do not copy components from any application repository into this repository in bulk.
- Do not expose, record, or commit tokens, passwords, cookies, connection strings, or other credentials.

Local, reversible work must still follow an approved small step. Before each step, state its purpose, operations, expected result, verification method, and rollback method. Stop at the next gate and wait for confirmation.

### Current application handoff workflow (Locke, 2026-09-05)

- Improve shared components in coherent batches in this repository, then validate the complete batch and report to Locke. Do not use a per-component CPQ installation/approval loop.
- Only after Locke approves a completed batch may this task notify the CPQ UI workstream to adopt that new batch. Package implementation/testing is not application adoption approval.
- CPQ work is to run on its existing `main` checkout by default. Do not create a CPQ Git worktree without Locke's explicit approval for that worktree; do not silently create a replacement worktree.
- Locke separately authorized CPQ 02 to integrate the existing single-search-field pilot into `main` and remove exactly `codex/fluent-enquiries-pilot` and `D:\Documents\ChatGPT\worktrees\cpq-fluent-enquiries-pilot`, preserving its artifact/evidence first. This one-time cleanup does not authorize other branch/worktree deletions, new component adoption, pushes or deployment.
- Generated package-consumer test directories under this repository's `.tmp/` are not Git worktrees or CPQ checkouts; keep them separate from consumer applications.

## Evidence and release controls

The initial maintainer, release executor, and approver is Locke Yuan (`phantasywind`). While this is a self-review model, each release must use a fixed checklist and prove consistency among the immutable version, Git tag, npm package, GitHub Release, artifact filename, and SHA-256 record.

When a second maintainer is assigned, release governance must be reviewed and upgraded to dual review before relying on that role.

Self-test, build success, or demonstration is technical evidence; it is not independent application acceptance or Production approval.

## Repository hygiene

- Color ownership follows ADR-0006: shared components consume the explicit theme; current demo theme selection and shell palette are centralized. Do not scatter raw colors into components/pages or treat CPQ's candidate palette as cross-application brand approval. The bounded color guard is part of `css:check`; exceptions require a recorded source/role decision, not disabling the check.

- Preserve unrelated user changes and keep each slice narrow.
- Keep credentials and generated local secrets out of the repository.
- Prefer inspectable source, deterministic validation, and recoverable changes.
- Do not describe work as implemented and verified unless both the implementation and its stated verification have completed.
- Record phase status and gate evidence in `docs/roadmap.md`.
