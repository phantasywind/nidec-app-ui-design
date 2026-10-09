# Maintenance handoff

Written 2026-10-09 for whoever maintains this repository next, including a new Claude session with no memory of earlier work. Read `AGENTS.md`, ADR-0001, ADR-0006 and ADR-0007 first.

## Roles

- Maintainer of record and release approver: Locke Yuan.
- Day-to-day maintenance: Claude (ADR-0007). Codex is a consumer only.
- Locke's authorization is required for: merging to `main`, tags, publication, GitHub Releases, repository settings, Rulesets, environments, variables and secrets, and any change to an adopting application.

## Current state

- Latest published version: `0.1.0` (see `docs/releases/0.1.0.md`). Source commit `6f8bae7`, tag `v0.1.0`.
- Unreleased changes on the maintenance branch since `0.1.0`: a subtle grey hover background on application navigation items; removal of the divider lines before the frozen Actions column of the Editable Grid. Both are visual changes that consumers must re-check on upgrade. Neither has a version or release record yet.
- Table-header colour direction (`docs/table-header-visual-direction.md`) is selected but not implemented.
- A Claude Design System artifact is built from this repository by `design-system/` (see its README). It reproduces the published artifact files exactly. Rebuild and republish it after any change to components, styles or palette.

## Working rules

- Work on a branch. Never commit to `main` directly and never force-push.
- Before each change, record the purpose, expected result, verification and rollback in the commit or PR description.
- Verify with `npm run verify` (lint, strict types, build, tests, CSS and colour checks, export boundaries, adoption check). For a release candidate also follow `docs/release-checklist.md` in full.
- Dark Mode is out of scope unless Locke requests it. Do not add business rules, role rules or API behaviour to the package.
- Record unresolved semantics as `Business Rule Pending` and name the owning application.

## Releasing

1. Prepare: set the exact version in `package.json` and `package-lock.json`, write `docs/releases/<version>.md` (changes, change type, what applications must do, whether Fluent or React exact versions change), and update `docs/roadmap.md`.
2. Run the release workflow with `dry_run` left at `true`. It builds twice, compares the two archives byte for byte, runs all checks and reports the SHA-256. Nothing is published.
3. Ask Locke to approve the exact version and SHA-256.
4. Run the workflow again with `dry_run` set to `false`. The publish job waits for Locke's approval in the `release` environment, then creates the tag, publishes to GitHub Packages and creates the GitHub Release with the `.tgz`, `SHA256SUMS.txt` and the release record.
5. Verify tag, package, Release, filename and SHA-256 agree, then install the published version into an isolated consumer and compare content.
6. Give Locke the exact-version adoption method to forward to adopting applications. Do not contact applications directly.

Corrections always use a new version. A published version, tag or artifact is never overwritten.

## One-time setup Locke performs in GitHub

The workflow cannot run its publish job until these exist. Claude must not change repository settings.

1. Repository Settings, Environments, create an environment named `release`. Under Required reviewers add `phantasywind`. Optionally restrict deployment branches to `main`.
2. Repository Settings, Actions, General: allow GitHub Actions to run, and set Workflow permissions so that the workflow can be given `packages: write` and `contents: write` (the workflow requests them only in the publish job).
3. Confirm the package `@phantasywind/nidec-app-ui-design` is linked to this repository under its Package settings, so the workflow's built-in token may publish it. If a Ruleset blocks tags named `v*` for the Actions token, add the workflow as a permitted actor.

## Known gaps

- The release workflow has not been executed. Its first run must be a dry run, and its first real run should be watched.
- Third-party actions are referenced by major version tag. Pinning them to full commit SHAs is recommended before relying on the workflow for a release.
- Two-person review does not exist. See ADR-0007.
