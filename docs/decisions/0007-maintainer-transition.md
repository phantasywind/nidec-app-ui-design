# ADR-0007: Maintainer Transition to Claude

- Status: Accepted
- Decision owner: Locke Yuan (`phantasywind`)
- Accepted date: 2026-10-09 (confirmed by Locke in the working conversation)
- Scope: Who maintains this repository and its package, who approves a release, and how publication is performed
- Amends: ADR-0001 decision 8 (maintainer, release executor and approver)

## Context

Until now the repository was maintained by Codex. Maintenance by two agents risks conflicting changes to the same source, and the Design System is now also presented as a Claude Design System artifact built from this repository. Locke asked for a single maintainer.

## Decision

1. Claude assumes maintenance of this repository and the `@phantasywind/nidec-app-ui-design` package: source, tokens, components, documentation, tests, build and release preparation.
2. Codex stops maintaining and publishing this package. It may continue to work only as a consumer of published versions, under the existing application-ownership rules.
3. Locke Yuan remains the maintainer of record and the **sole release approver**. Claude prepares and qualifies a candidate; Locke approves the exact version and candidate SHA-256 before anything is published. Claude never approves its own release.
4. Publication uses GitHub Actions (`.github/workflows/release.yml`). The publish job runs in a GitHub Environment named `release`, which Locke configures with himself as required reviewer. Handling of any access tokens is Locke's responsibility; Claude does not read, store or record credentials.
5. Authorization granted by Locke on 2026-10-09: Claude may create branches in this repository and push to them. This does **not** authorize merging to `main`, creating tags, publishing, creating a GitHub Release, or changing repository permissions, Rulesets, environments, variables or secrets. Each of those still requires Locke's explicit authorization for the specific action.
6. Unchanged from ADR-0001 and the release checklist: package name, GitHub Packages distribution, immutable versions, exact-version consumption, the GitHub Release contents (`.tgz`, `SHA256SUMS.txt`, release record), and the separation of package evidence from application acceptance and Production approval.

## Consequences

- Adopting applications observe no change: package name, registry and published versions are unchanged. They do not need to be told that the maintainer changed. Locke continues to forward the exact-version adoption method when a new version is published.
- Review is still self-review plus Locke's approval. When a second human maintainer is assigned, release governance must be upgraded to dual review.
- Claude has no memory across sessions. Continuity depends on the repository documents, in particular `AGENTS.md`, this ADR, `docs/roadmap.md` and `docs/maintenance-handoff.md`. Material decisions must be recorded there in the same change that makes them.
- The release workflow cannot approve itself. Its `dry_run` default only qualifies a candidate.

## Rollback

Locke may revoke this decision at any time by amending this ADR and `AGENTS.md`. Published versions are unaffected.
