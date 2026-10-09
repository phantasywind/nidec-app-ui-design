# Maintenance handoff

Written 2026-10-09 for whoever maintains this repository next, including a new Claude session with no memory of earlier work. Read `AGENTS.md`, ADR-0001, ADR-0006 and ADR-0007 first.

## Roles

- Accountable owner: Locke Yuan. He authorizes each release; responsibility stays with him.
- Maintenance, release review and release execution: Claude (ADR-0007). Codex is a consumer only. This is single-party control with no technical separation; Claude's review is not independent.
- Locke's authorization is required for: merging to `main`, tags, publication, GitHub Releases, repository settings, Rulesets, environments, variables and secrets, and any change to an adopting application.

## Current state

- Latest published version: `0.1.0` (see `docs/releases/0.1.0.md`). Source commit `6f8bae7`, tag `v0.1.0`.
- Prepared but not released: `0.1.1` (`docs/releases/0.1.1.md`), a visual refinement with a grey hover background on application navigation items and no divider lines before the Editable Grid frozen Actions column. It still needs a release workflow dry run, Locke's approval of the exact SHA-256, and publication.
- Table-header colour direction (`docs/table-header-visual-direction.md`) is selected but not implemented.
- A Claude Design System artifact is built from this repository by `design-system/` (see its README). It reproduces the published artifact files exactly. Rebuild and republish it after any change to components, styles or palette.

## Working rules

- Work on a branch. Never commit to `main` directly and never force-push.
- Before each change, record the purpose, expected result, verification and rollback in the commit or PR description.
- Verify with `npm run verify` (lint, strict types, build, tests, CSS and colour checks, export boundaries, adoption check). For a release candidate also follow `docs/release-checklist.md` in full.
- Dark Mode is out of scope unless Locke requests it. Do not add business rules, role rules or API behaviour to the package.
- Record unresolved semantics as `Business Rule Pending` and name the owning application.

## Versioning (proposed, pending Locke's confirmation)

While the package is pre-1.0: a patch version for fixes and visual refinements with no export, prop, dependency or peer-version change; a minor version for new exports, changed behaviour, or a change to the exact Fluent, React or date-picker versions applications must install. Every release record states the change type and what applications must do.

## Releasing

1. Prepare: set the exact version in `package.json` and `package-lock.json`, write `docs/releases/<version>.md` (changes, change type, what applications must do, whether Fluent or React exact versions change), and update `docs/roadmap.md`.
2. Run the release workflow with `dry_run` left at `true`. It builds twice, compares the two archives byte for byte, runs all checks and reports the SHA-256. Nothing is published.
3. Ask Locke to authorize the exact version and the candidate SHA-256 from the dry run. Record his words and the time in the release record before continuing.
4. Run the workflow again with `dry_run` set to `false` and `approved_sha256` set to the authorized hash. The publish job creates the tag, publishes to GitHub Packages with the workflow's built-in token and creates the GitHub Release with the `.tgz`, `SHA256SUMS.txt` and the release record.
5. Verify tag, package, Release, filename and SHA-256 agree, then install the published version into an isolated consumer and compare content.
6. Give Locke the exact-version adoption method to forward to adopting applications. Do not contact applications directly.

Corrections always use a new version. A published version, tag or artifact is never overwritten.

## GitHub settings

No environment reviewer is configured or required: protection rules on environments are not available for this private repository on the current plan, and the model does not depend on them (ADR-0007). Before the first real release confirm in the repository settings that Actions may run, that the workflow may be given `packages: write` and `contents: write` (the publish job requests them), that the package `@phantasywind/nidec-app-ui-design` is linked to this repository, and that no Ruleset blocks `v*` tags for the Actions token. Claude does not change repository settings.

## Known gaps

- The release workflow has not been executed. Its first run must be a dry run, and its first real run should be watched.
- Third-party actions are referenced by major version tag. Pinning them to full commit SHAs is recommended before relying on the workflow for a release.
- There is no independent review and no technical separation of identity, credential or pipeline authority. See the control limits in ADR-0007.
