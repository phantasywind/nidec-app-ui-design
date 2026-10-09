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

- Direct consumer adoption workflow (Locke, 2026-09-10): the separate `Nidec App UI Deployment` task no longer owns future application coordination. This repository publishes immutable packages and one reusable, version-specific adoption method. Locke forwards that method to each adopting application's own task; that application task owns installation, implementation, evidence, rollback, independent acceptance and deployment within its own repository and conversation. Do not create new application-specific handoff, deployment, acceptance or rollout records in this repository. Existing records remain historical evidence. Do not contact or modify an adopting application unless Locke explicitly reassigns that action. Producing or publishing a qualified package is not authorization to install or deploy it.

- Continuous migration authorization (Locke, 2026-09-06): after accepting the complete-region preview, Locke authorized the planned six phases through legacy-system retirement and delivery. For these phases, this supersedes the older requirement to request approval for every next batch. Execute coherent, contract-bounded batches with evidence gates; do not skip qualification or declare independent acceptance from self-tests. This repository owns shared implementation; existing CPQ 02 owns application changes on existing main. No new CPQ worktrees, EPM migration, Dark Mode, business/API/RBAC changes, commits, pushes, publication or deployment are authorized by this direction. Stop for a genuine scope/authority/contract blocker. The live execution ledger is `docs/implementation/fluent-six-phase-execution.md`.

- Visual continuity (Locke, 2026-09-06): use CPQ's governed Design System gallery and its established patterns as the reference baseline for gradual Fluent adoption, not as a disposable prototype. Gradually cover reusable elements with Fluent-backed capabilities; where shared capabilities are missing, study the existing element and blend Fluent mechanisms into its established appearance and interaction. Preserve recognizable hierarchy, density, spacing, geometry, states and interaction unless a material change is explicitly approved. Do not force Fluent defaults into a visibly different redesign or bulk-copy CPQ business code into the shared package. This direction does not expand the current approved implementation batch.

- Replacement clarification (Locke, 2026-09-06): the target is gradual replacement of the existing Design System visual implementations by the new Fluent-backed system, not indefinite retention of the old component system or recoloring old controls. The old gallery is an inventory and visual/interaction reference, not a requirement to preserve its implementation. Temporary adapters must have a migration purpose and an eventual retirement check. Consumer business semantics remain consumer-owned even as their presentation is migrated. Larger subsequent batches require their concrete scope to be reviewed after the current batch result; preparation is allowed while awaiting that result, but does not start the next application batch.

- No mixed skins (Locke, 2026-09-06): each migrated control must use Fluent-owned appearance and states, with legacy control decorations excluded at the integration boundary. Visual continuity is achieved through supported Fluent theming/customization, never by layering the old skin over Fluent. Unmigrated controls may retain the old implementation temporarily. Verify computed backgrounds, pseudo-elements, borders, geometry and focus under actual host CSS; functional tests alone do not establish migration quality. Do not hide Fluent affordances merely to mask duplicate legacy decorations.

- Typography and sizing (Locke, 2026-09-06): adopt Fluent's font stacks, typography roles (size/weight/line-height), and component-supported size variants as the governing system for migrated elements. Select roles and variants centrally; do not overlay legacy DS font/weight/height rules merely to reproduce old pixels. This clarifies the earlier visual-continuity requirement: recognizable hierarchy and usable layout remain goals, exact old metrics are not mandatory. Necessary exceptions must record their purpose, scope and verification. Distinguish text line-height from control height and multiline content sizing; do not assign one fixed height to every control. Do not expand a current application batch or silently change global typography through this policy approval.

- Locke accepted the shared Nidec light-theme demonstration. Dark Mode is explicitly outside the current objective: do not add dark-theme implementation, backlog items or acceptance criteria unless Locke explicitly requests them. Retained historical dark-theme comparisons are not pending work.

- Improve shared components in coherent batches in this repository, then validate the complete batch and report to Locke. Do not use a per-component application installation/approval loop.
- After a version is published, provide Locke with the reusable exact-version adoption method for forwarding. Do not directly notify an application workstream or create an application-specific handoff file unless Locke explicitly requests it. Package implementation/testing/publication is not application adoption approval.
- CPQ work is to run on its existing `main` checkout by default. Do not create a CPQ Git worktree without Locke's explicit approval for that worktree; do not silently create a replacement worktree.
- Locke separately authorized CPQ 02 to integrate the existing single-search-field pilot into `main` and remove exactly `codex/fluent-enquiries-pilot` and `D:\Documents\ChatGPT\worktrees\cpq-fluent-enquiries-pilot`, preserving its artifact/evidence first. This one-time cleanup does not authorize other branch/worktree deletions, new component adoption, pushes or deployment.
- Generated package-consumer test directories under this repository's `.tmp/` are not Git worktrees or CPQ checkouts; keep them separate from consumer applications.

### Maintainer transition (Locke, 2026-10-09)

- Claude assumes maintenance of this repository and the `@phantasywind/nidec-app-ui-design` package, including release review and execution. Codex stops maintaining and publishing it and acts only as a consumer. Locke Yuan remains accountable for the package and every release: Claude owns the code and the release work, Locke owns the responsibility. Rationale, control limits and consequences: ADR-0007; handover and release steps: `docs/maintenance-handoff.md`.
- This is single-party control. Claude's review is not independent review, and there is no technical separation of identity, credential or pipeline authority. Do not describe it otherwise.
- Authorization: Claude may create branches, push to them, open pull requests, and merge a pull request when Locke asks for that merge. A release is authorized per release: Locke names the exact version and the candidate SHA-256 from the dry run, and Claude records his authorization in the release record. Tags, publication, a GitHub Release, and any change to repository permissions, Rulesets, environments, variables or secrets otherwise need Locke's explicit authorization for the specific action. Claude does not read, store or record tokens.
- Publication is performed by `.github/workflows/release.yml` with the workflow's built-in token.
- Adopting applications are not told about the change of maintainer. Locke continues to forward the exact-version adoption method when a new version is published, and applications decide when to update their exact pin.

## Evidence and release controls

Locke Yuan (`phantasywind`) is the accountable owner and authorizes each release. Until 2026-10-09 he was also maintainer, release executor and reviewer; since then Claude is maintainer, release reviewer and release executor under his authorization (ADR-0007). This is a single-party self-review model, and each release must use a fixed checklist and prove consistency among the immutable version, Git tag, npm package, GitHub Release, artifact filename, and SHA-256 record.

When a second maintainer is assigned, release governance must be reviewed and upgraded to dual review before relying on that role.

Self-test, build success, or demonstration is technical evidence; it is not independent application acceptance or Production approval.

## Repository hygiene

- Color ownership follows ADR-0006: shared components consume the explicit theme; current demo theme selection and shell palette are centralized. Do not scatter raw colors into components/pages or treat CPQ's candidate palette as cross-application brand approval. The bounded color guard is part of `css:check`; exceptions require a recorded source/role decision, not disabling the check.

- Preserve unrelated user changes and keep each slice narrow.
- Keep credentials and generated local secrets out of the repository.
- Prefer inspectable source, deterministic validation, and recoverable changes.
- Do not describe work as implemented and verified unless both the implementation and its stated verification have completed.
- Record phase status and gate evidence in `docs/roadmap.md`.
