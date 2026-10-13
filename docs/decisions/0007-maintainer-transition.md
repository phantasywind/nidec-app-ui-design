# ADR-0007: Maintainer Transition to Claude

- Status: Accepted
- Decision owner: Locke Yuan (`phantasywind`)
- Accepted date: 2026-10-09 (confirmed by Locke in the working conversation)
- Amended: 2026-10-09 (same day) — release execution and review delegated to Claude; single-party control stated plainly
- Scope: Who maintains this repository and its package, who reviews and executes a release, who is accountable, and what controls exist
- Amends: ADR-0001 decision 8 (maintainer, release executor and approver)

## Context

Until now the repository was maintained by Codex. Maintenance by two agents risks conflicting changes to the same source, and the Design System is also presented as a Claude Design System artifact built from this repository. Locke asked for a single maintainer.

Before this decision the model was already single-party: Locke wrote, reviewed and released (ADR-0001 decision 8), later with an agent doing the work under his authorization. There was no technical two-person separation, and this decision does not add one.

## Decision

1. Claude assumes maintenance of this repository and the `@phantasywind/nidec-app-ui-design` package: source, tokens, components, documentation, tests, build, release review and release execution. Codex stops maintaining and publishing it and may continue only as a consumer of published versions.
2. **Locke Yuan remains accountable** for the package and every release. He delegates review and execution to Claude. The division is: Claude owns the code and the release work; Locke owns the responsibility.
3. A release happens only after Locke states, in the working conversation, that the exact version is authorized. Claude records that authorization (his wording and the time) in the release record. Authorization is per release unless Locke records a standing authorization here. Amended 2026-10-13 on Locke's direction ("SHA-256今后不要让我授权了，之前对话的规则建立得太严格，这种授权没有意义"): Locke no longer names or authorizes the candidate SHA-256. Claude takes it from the release workflow's dry run, passes it to the publishing run as `approved_sha256` and records it in the release record. Confirming the version covers the whole release of that version: merging its preparation pull request, the dry run, the tag, publication, the GitHub Release and merging its release record.
4. Publication uses `.github/workflows/release.yml` with the workflow's built-in token. No personal access token is stored in the repository or read by Claude. Claude does not read, store or record credentials.
5. Authorization granted by Locke: Claude may create branches and push to them, open pull requests, and merge a pull request when Locke asks for that merge. Merging, tags, publication, a GitHub Release, and any change to repository permissions, Rulesets, environments, variables or secrets still require Locke's explicit authorization for the specific action.
6. Unchanged from ADR-0001 and the release checklist: package name, GitHub Packages distribution, immutable versions, exact-version consumption, the GitHub Release contents (`.tgz`, `SHA256SUMS.txt`, release record), and the separation of package evidence from application acceptance and Production approval.

## Control limits, stated plainly

- This is **single-party control**. Claude writes the change, reviews it and runs the release. Claude's review is not an independent review and must not be presented as one.
- There is **no technical separation** of identity, credential or pipeline authority between Locke and Claude. At the time of this decision Claude acts through Locke's GitHub account, which has administrator rights; `main` has no branch protection; and the `release` environment has no required reviewer (not available for this private repository on the current plan). Claude can change the release workflow and trigger it. The controls below are procedural and evidential, not preventive.
- The `approved_sha256` workflow input binds a publication to the candidate the dry run qualified. It is a consistency check, not a security control.
- If an independent boundary is needed later, the options are a separate restricted identity for Claude with protected `main`, workflow and `v*` tag rules, a separate release repository Claude cannot change, or publication by Locke from his own machine. Each needs Locke's configuration. Record the decision here when taken.

## Controls that do not depend on separation

- Published versions are immutable. A faulty version is superseded by a new version, never overwritten.
- Adopting applications pin exact versions and update only when Locke forwards a version-specific adoption method. A faulty release does not reach an application by itself.
- Two independent builds must be byte-identical; the candidate SHA-256 is recorded; the published package is installed into an isolated consumer and compared with the Release archive.
- Each release record states the change type and what applications must do.

## Consequences

- Adopting applications observe no change: package name, registry and published versions are unchanged. They are not told that the maintainer changed. Locke continues to forward the exact-version adoption method.
- When a second human maintainer is assigned, release governance must be upgraded to dual review (ADR-0001).
- Claude has no memory across sessions. Continuity depends on `AGENTS.md`, this ADR, `docs/roadmap.md` and `docs/maintenance-handoff.md`. Material decisions are recorded there in the same change that makes them.

## Rollback

Locke may revoke or change this decision at any time by amending this ADR and `AGENTS.md`. Published versions are unaffected.
