# Same-version upstream Fluent comparison

Subsequent owner decision: ADR-0004 (`docs/decisions/0004-fluent-known-limitations.md`) accepts the identified sentinel finding and conditionally accepts the declaration-only limitation as non-blocking for this prototype's technical-route assessment. The original observations and then-current recommendations below remain unchanged as historical evidence.

- Date: 2026-09-04
- Authorization: Locke approved continuation of the upstream-only minimal reproduction.
- Result: the same initial-state `aria-hidden-focus` finding reproduces without Nidec code. No upstream patch or scanner exemption has been applied; the technical-route gate remains pending.

## Controlled scope

Added `fixtures/fluent-upstream-probe/` with only React, FluentProvider, Button and Dialog plus the same nonce-aware renderer setup. There are no Nidec imports, styles, tokens or source aliases. The recorded production-build module graph was checked for shared-package imports. This establishes that Nidec wrapping is **not necessary** to reproduce the finding; it does not prove every possible wrapper behavior is equivalent.

Fluent 9.74.7, React/React DOM 19.2.7 and Tabster 8.8.1 were verified in the installed packages. All 76 matching Fluent/Griffel/Tabster/Keyborg/React lock entries have the same version and integrity as the retained real-tarball Node 22 consumer. The new diagnostic build used the existing locked root installation and Node 24.20.0, not a fresh installation or a new Node 22 application acceptance run. The unchanged Nidec candidate remains bound to artifact SHA-256 `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a`.

The same verified axe 4.13.0 and serialized, no-visible-report diagnostic harness were served with the existing nonce CSP. No rules were disabled. Initial exploratory scans were at the existing 1992px viewport; the controlled keyboard comparison used an actual 720 by 900 viewport. This is not a repeat of the entire four-width matrix.

## Results

| State | Upstream-only result | Comparison with retained Nidec result |
| --- | --- | --- |
| Initial and settled, before control focus | `aria-hidden-focus` on tabindex-0 Tabster guards | Same finding |
| After first forward Tab into the page | Focus reaches Test action; guards become non-tabbable; no violations/incomplete | Same focus-dependent pass |
| Open dialog; Tab twice and Shift+Tab | Focus remains on Close dialog; scan records incomplete `aria-hidden-focus` | Dialog scans also require review; no automatic pass |
| Escape then settled scan | Focus returns to Open dialog; no violations/incomplete | Same observed return behavior |
| Unnamed-button negative control | `button-name` detected in both scans | Scanner remains active |

The forward-Tab event trace in `browser/0005-audit.json` captures a sentinel focus event at 18957.9ms and Test action focus at 18960.2ms: approximately **2.3ms** between recorded events. This is evidence of immediate forwarding in this sampled direction/state, not a universal timing guarantee or proof for both sentinels/all browsers.

The exploratory `upstream-backward` sequence is retained but excluded from a backward-sentinel pass claim: its final scan reports `document.hasFocus() === false`, and intervening interactions do not provide a clean isolated reverse-entry trace. Do not infer complete backward-entry coverage from its query label or intermediate passing scan. All 13 scans, including failures and incomplete outcomes, remain in the record.

## Primary-source interpretation, not a waiver

The [W3C ACT rule 6cfa84, Passed Example 4](https://www.w3.org/WAI/standards-guidelines/act/rules/6cfa84/#passed-example-4) explains that an aria-hidden focus sentinel which immediately moves focus to a valid control can satisfy that rule. Its failed counterpart distinguishes a sentinel whose forwarding behavior is absent. This supports behavioral adjudication of the observed forwarding, rather than treating tabindex alone as sufficient to decide the issue. ACT guidance does not automatically establish full WCAG conformance or screen-reader compatibility.

The [official Fluent issue #27517](https://github.com/microsoft/fluentui/issues/27517) documents similar Tabster sentinel findings from 2023 and is labeled `Resolution: By Design`. It concerns a different component/browser/version and is historical corroboration, **not** confirmation that the current 9.74.7/axe 4.13.0 combination is defect-free. No upstream issue or comment was posted.

## Newly explicit type-check boundary

The probe inherits the repository's existing strict TypeScript settings, including its already-established `skipLibCheck: true`; this check passes. No repository/compiler setting was relaxed in this step.

An additional diagnostic with `skipLibCheck: false` fails in upstream declaration files, including motion parameter constraints and Toast type composition under the existing exact-optional configuration. The complete compiler output is retained. Therefore previous type-check success means the project/API-use checks passed under the documented configuration, **not** that all third-party declarations pass unrestricted checking. Consumers requiring full dependency declaration checking need a separate compatibility decision. This extra finding was not repaired by changing dependencies or weakening the current baseline.

The first ad-hoc compiler invocation was rejected by TypeScript 7 because explicit files require `--ignoreConfig`; a second unrestricted invocation exposed the declaration findings. Final retained checks use the explicit inherited project configuration, with and without the diagnostic override, so the outcome is reproducible.

## Evidence, verification and recovery

Local ignored evidence: `.qualification/runs/fluent-upstream-comparison/`. Includes source, build module list/output, version and lock records, exact served script hashes, browser/CSP/request records, both compiler logs and summary. The negative control produced its expected blocked connect-src request; it is not a production CSP finding.

All 33 retained files passed checksum read-back. Manifest SHA-256: `82c4e8e26d378abd802c72697e0ec4dca38094fc94eac4e28a68716f0140bb3b`. The prior 144 Fluent qualification files and 29 focus-diagnostic files were reverified unchanged. These ignored files require separate retention and are not automatically included in a commit.

Lint and inherited probe typecheck passed; upstream production build completed. The extra full-declaration check failed as disclosed above. No package rebuild, dependency restore, full package unit-test rerun or application acceptance is claimed for this diagnostic slice. The owned test tab was closed and viewport restored; the local server was stopped.

Rollback is limited to the new probe fixture, build/seal scripts, upstream-mode wiring in the browser probe and this step's documentation updates. Preserve all diagnostic evidence and earlier/user changes. No runtime package, lockfile, CPQ/EPM repository, remote state, publication or commit was changed in this step.

## Recommendation and next decision

Keep Fluent 9.74.7 as the candidate; the evidence does not justify rewriting the Nidec adapter or downgrading the toolchain to remove this warning. Do not force initial focus, remove Tabster guards, suppress `aria-hidden-focus`, or count a post-interaction pass as a clean initial scan.

Prepare the technical-route review with these explicit conditions: the sentinel finding remains open for bounded behavioral/accessibility adjudication (including reverse entry and assistive technology), and strict third-party declaration checking is an identified compatibility gap. Any eventual exception must name the exact finding/version/evidence and be explicitly approved; it must not suppress other aria-hidden-focus failures. Brand authority and independent application acceptance remain separate. No publication or CPQ integration follows automatically.
