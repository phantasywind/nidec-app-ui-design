# Button prototype — committed-source compatibility and accessibility checks

- Date: 2026-09-04
- Authorization: Locke asked to continue component accessibility/compatibility verification.
- Source commit: `ceb04a14fcaa308fdfe068290dff923e7f71f672`; entry worktree clean.
- Result: **Bounded prototype validation passed.** No full WCAG, all-browser, application or publication approval.

## Scope and execution

The committed source was exported with `git archive` to an isolated directory. Portable Node `24.20.0` / npm `11.19.0` performed clean offline dependency restoration, the complete verification chain (32 tests), and actual package inspection. All passed. The resulting 9-file artifact is 4,768 bytes:

`031b26fd61a30bcaaca71079629f288c34e1a19454913f01d09a815befe7cf6e`

This is a new clean-source artifact, not the previous dirty-worktree prototype artifact. It retains `0.0.0-development` and `private: true`; it cannot be published or relabelled as a release.

Both token-only and React consumer fixtures prepared their lockfiles once and then used `npm ci` with Node `22.22.0` / npm `10.9.4`. Typecheck and build passed. Locks were retained before replay and verified unchanged afterward; the local artifact reference is portable within the retained `inputs/fixtures` and `inputs/artifacts` layout. Installed package content hashes matched the inspected archive. Token-only installation did not contain React/React DOM; the React fixture passed physical peer-resolution checks. This run did not repeat the full Node 24 consumer matrix or a second independent build; the scope is the committed Button source and additional Node 22 evidence.

No shared source, package dependencies, application code or production CSS changed in this turn. npm audit was disabled only in test processes; no security-audit pass is claimed.

## Accessibility scan setup

The temporary test tooling installed exact `axe-core` **4.13.0** from the official npm registry; its lock integrity matched the queried distribution integrity. Tool package/lock, executable script, licenses and runner sources are retained. No scanning dependency was added to the Design System package.

The local server served the Node 22 consumer's built JS/CSS without changing their bytes. Test-only HTML instrumentation loaded axe and a local runner, then saved raw results before adding diagnostic text to the DOM. This is an instrumented accessibility fixture, not a rerun of the earlier CSP or unchanged-HTML network proof.

The scan used tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`. A separate control page with an unnamed native button correctly produced `button-name`; a rejected/empty scanner result could therefore not masquerade as a successful scan. [axe-core's documentation](https://github.com/dequelabs/axe-core#the-accessibility-rules) explains that automated checks cover only part of accessibility and that incomplete results require manual review.

Observed browser: Edge `152.0.4191.53`, Windows `10.0.26200.0`. Each accepted run recorded its actual dimensions, not just its requested label:

| Actual viewport | Passed rules | Violations | Incomplete | Fixture horizontal overflow |
| --- | --- | --- | --- | --- |
| 1440 × 900 | 12 | 0 | 0 | No |
| 1280 × 900 | 12 | 0 | 0 | No |
| 900 × 900 | 12 | 0 | 0 | No |
| 720 × 900 | 12 | 0 | 0 | No |

The first requested 1440-width tab actually opened at 1992 pixels. Its result was preserved as `axe-1440-initial-width-mismatch.json`, excluded from the pass matrix, and repeated after setting the active tab's actual viewport. No failing/inapplicable attempt was overwritten. These four widths are observed test inputs, not a new Nidec-wide support policy.

All accepted scans recorded `serviceWorkerControlled: false` on the instrumented test pages. This does not retroactively qualify the earlier Stage 4 pages or claim a fresh browser profile.

## Keyboard and layout observations

At 720 × 900, click + Enter + Space on the default Button yielded 3 clicks and zero submits. Tab skipped the disabled control and reached explicit submit; Enter produced one submit; Shift+Tab skipped the disabled control and returned to the first button. The native `auto` focus outline was visibly present. Captured fixture console warnings/errors were empty.

The screenshot showed the heading wrapping and buttons remaining accessible at the narrowest tested width. The scanner's diagnostic `pre` is appended afterward and can itself overflow; the recorded overflow assertion measures the original fixture before that diagnostic output, not the augmented report text.

The existing prototype record retains the disabled-pointer and native-attribute tests. This run does not claim live reset-form testing, screen-reader testing, OS forced-colors/high-contrast, zoom/reflow beyond these widths, internationalized/long button labels, all browser versions, or full WCAG conformance. Native unbranded appearance is not brand approval.

## Retained evidence, cleanup and integrity

Local directory: `.qualification/runs/button-validation-ceb04a1/`.

It contains source ZIP, candidate and pack record, command logs, frozen consumer inputs, Node 22 results, consumer output files, exact audit-tool/runner inputs, raw scans including the negative control and dimension-mismatch attempt, keyboard observations and summary. Local retention is Git-ignored, not a backup or a Release.

- `validation-summary.json` SHA-256: `b058b50698f86e7ff767fe874b546d79132e4065da9b7add090e65b1b0c2a255`
- `SHA256SUMS.txt` SHA-256: `5e4d86d2845476a132ce28c7f78eed5c6ecf13aa1e73aa67f124ea4cfeaba367`

The checksum list covers 59 files; all were read back and matched. Logs passed the existing best-effort redaction check. The new source/consumer/tool installation directory was removed after its exact path was checked. The test server closed normally, two created browser tabs closed, and the temporary viewport override was reset. Historical qualification evidence was not modified.

## Gate and recommendation

Recommend reviewing this result as the **first Button prototype's bounded technical validation**, together with the prior functional record. Do not reopen the same infrastructure checks without a change or concrete gap; do not upgrade the result to production readiness either.

Next gate: review/commit this record and decide the next bounded capability/input step. Brand authority and production values remain `Business Rule Pending`; TextInput/Field need a separate contract approval. Any public-surface or visual change requires its own relevant validation. No publication, CPQ/EPM integration, independent application acceptance or Production action is authorized.

Rollback of this documentation slice does not remove retained evidence. No shared implementation files need reverting because none changed in this verification turn.
