# Maintenance handoff

Written 2026-10-09 for whoever maintains this repository next, including a new Claude session with no memory of earlier work. Read `AGENTS.md`, ADR-0001, ADR-0006 and ADR-0007 first.

## Roles

- Accountable owner: Locke Yuan. He authorizes each release; responsibility stays with him.
- Maintenance, release review and release execution: Claude (ADR-0007). Codex is a consumer only. This is single-party control with no technical separation; Claude's review is not independent.
- Locke's authorization is required for: merging to `main`, releases (he confirms the exact version, which covers merging its preparation pull request, the tag, publication, the GitHub Release and merging its release record), repository settings, Rulesets, environments, variables and secrets, and any change to an adopting application.

## Current state

- Latest published version: `0.3.0` (`docs/releases/0.3.0.md`), released 2026-10-26 from `899cd90` through the release workflow (run 9). It is a minor release with two breaking changes: LiteEditableGrid `rowHeight` defaults to `auto`, and only the primary, attention and secondary button types remain (`ToggleButton`, `MenuButton`, `SplitButton` removed). Fluent and React versions unchanged.
- Previous version: `0.2.0` (`docs/releases/0.2.0.md`), released 2026-10-13 from `c44ca47` (run 7): new components and props, no removed export.
- Earlier: `0.1.2` (`docs/releases/0.1.2.md`), released 2026-10-09 from `895672d` through the release workflow. It is a visual refinement of `0.1.0`: a grey hover background on application navigation items and no divider lines before the Editable Grid frozen Actions column. `0.1.1` was abandoned and never published (tag `v0.1.1` stays unused at `f56bbb0`, see `docs/releases/0.1.1.md`).
- Table-header colour direction (`docs/table-header-visual-direction.md`) is selected but not implemented.
- A Claude Design System artifact is built from this repository by `design-system/` (see its README). It reproduces the published artifact files exactly. Rebuild and republish it after any change to components, styles or palette.

## Working rules

- Work on a branch. Never commit to `main` directly and never force-push.
- Before each change, record the purpose, expected result, verification and rollback in the commit or PR description.
- Verify with `npm run verify` (lint, strict types, build, tests, CSS and colour checks, export boundaries, adoption check). For a release candidate also follow `docs/release-checklist.md` in full.
- Dark Mode is out of scope unless Locke requests it. Do not add business rules, role rules or API behaviour to the package.
- Record unresolved semantics as `Business Rule Pending` and name the owning application.

## Versioning

While the package is pre-1.0: a patch version for fixes and visual refinements with no export, prop, dependency or peer-version change; a minor version for new exports, changed behaviour, or a change to the exact Fluent, React or date-picker versions applications must install. Every release record states the change type and what applications must do. Locke confirmed this rule on 2026-10-13 when he confirmed `0.2.0`.

## Releasing

1. Ask Locke to confirm the exact version (by the versioning rule above). Record his words and the time in the release record. He does not authorize the SHA-256 (his direction, 2026-10-13).
2. Prepare: set the exact version in `package.json` and `package-lock.json`, write `docs/releases/<version>.md` (changes, change type, what applications must do, whether Fluent or React exact versions change), update `docs/roadmap.md`, and merge the preparation pull request. Locke's version confirmation covers this merge.
3. Run the release workflow on `main` with `dry_run` left at `true`. It builds twice, compares the two archives byte for byte, runs all checks and reports the SHA-256. Nothing is published.
4. Run the workflow again with `dry_run` set to `false` and `approved_sha256` set to the dry run's candidate hash, and record that hash in the release record. The publish job creates the tag, publishes to GitHub Packages with the workflow's built-in token and creates the GitHub Release with the `.tgz`, `SHA256SUMS.txt` and the release record.
5. Verify tag, package, Release, filename and SHA-256 agree, then install the published version into an isolated consumer and compare content.
6. Give Locke the exact-version adoption method to forward to adopting applications. Do not contact applications directly.

Corrections always use a new version. A published version, tag or artifact is never overwritten.

## GitHub settings

No environment reviewer is configured or required: protection rules on environments are not available for this private repository on the current plan, and the model does not depend on them (ADR-0007). Before the first real release confirm in the repository settings that Actions may run, that the workflow may be given `packages: write` and `contents: write` (the publish job requests them), that the package `@phantasywind/nidec-app-ui-design` is linked to this repository, and that no Ruleset blocks `v*` tags for the Actions token. Claude does not change repository settings.

## Known gaps

- The Claude Design System artifact is a snapshot of the repository at one commit and is republished by hand (`design-system/README.md`). After every release, rebuild and republish it, and check that its README names the released version; nothing triggers this automatically. Applications built outside Claude must still install the exact package; the artifact is a reference for work done inside Claude (prototypes, designs, slides, pages) and is private unless Locke shares it.

- Lesson from the first real release attempt (0.1.1, run 3): the publish step passed a path without `./` and npm read it as a GitHub repository, after the tag had already been pushed. Fixed: the path now starts with `./`, and the tag is created locally for the authorization check and pushed only after publication succeeds. The workflow completed a publication end to end for 0.1.2 (run 5).

- The workflow's post-publication verification (registry download, Release archive and `SHA256SUMS.txt` against the authorized hash) ran for the first time in 0.1.2 and passed. It runs after publication and cannot undo it, so a failure there must be investigated before anyone adopts the version. It does not replace installing the published version into an isolated consumer; that comparison was not done for 0.1.2 because Claude's environment cannot download from GitHub Packages.
- The workflow uses GitHub actions that still target Node 20 (`actions/checkout`, `setup-node`, `upload-artifact`, `download-artifact` at `v4`). GitHub forces them onto Node 24 for now and warns. Move them to maintained versions and pin full commit SHAs.
- Claude cannot download Actions artifacts from its environment, so hashes must be readable in the run logs; the workflow prints them.

- The release workflow has not been executed. Its first run must be a dry run, and its first real run should be watched.
- Third-party actions are referenced by major version tag. Pinning them to full commit SHAs is recommended before relying on the workflow for a release.
- There is no independent review and no technical separation of identity, credential or pipeline authority. See the control limits in ADR-0007.
