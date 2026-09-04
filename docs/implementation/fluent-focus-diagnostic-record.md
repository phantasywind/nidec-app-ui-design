# Fluent focus and overflow diagnostic

- Date: 2026-09-04
- Authorization: Locke's continuation of the bounded accessibility/overflow investigation.
- Outcome: report-induced overflow reproduced and isolated; focus-dependent accessibility finding remains a technical-gate blocker.
- No library, fixture, dependency, application, publication or remote changes in this step.

## Method and version binding

Served the retained Node 22 production consumer output from `fluent-adaptation/consumer-retest/dist`, not source aliases or a newly built package. Artifact SHA-256 remains `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a`; Fluent 9.74.7, locked Tabster 8.8.1 and retained axe 4.13.0. Served assets and instrumentation have individual hashes.

The new diagnostic mode serializes scans, records focus guards and widths before/during/after each scan, and normally writes no visible results into the measured document. A keyboard shortcut allows scanning without moving focus out of a dialog. All previous WCAG-tagged rules remain enabled. The explicit `legacySummary` comparison reproduces the old report element; it is not used for normal layout results. No focus sentinel was removed or modified by the harness.

18 scans were retained. The first two were at the existing 1992px viewport despite a `720-initial` query label; they are exploratory, **not** 720px evidence. The required widths were subsequently set and measured explicitly: 1440, 1280, 900 and 720, all at 900px height.

## Findings

| Controlled observation | Evidence and interpretation |
| --- | --- |
| No visible report, initial and settled scan at all four required widths | Document width equals viewport; `aria-hidden-focus` remains on Tabster guards. Serialization/delay alone does not resolve it. |
| 720px after clicking Test action, scan via keyboard | Guards change from tabindex 0 to -1; no violations or incomplete rules. This state-specific pass does not clear the initial-state failure. |
| 720px light dialog open / Escape transition / settled close | Open and settled-close scans have no violations/incomplete; transition scan has incomplete `aria-hidden-focus`. All measured widths remain 720px. Focus returns to Open light dialog. |
| Same 720px page with old report enabled | Before report insertion: 720px; immediately after: 769px. The sole recorded overflowing descendant is `pre#audit-summary`. Next report produces 762px. Screenshot inspection also shows report text extending sideways. |
| Unnamed-button negative control | Both scans report `button-name`; detection is still active. Its separate connect-src CSP report is expected from the inherited negative control. |

The overflow comparison establishes that the report element itself can cause the previous symptom. Removing that measurement contamination gives no overflow in the sampled fixture states. It does not retrospectively prove that every historical transient, arbitrary application layout or unobserved animation frame is safe; polling is approximately 50ms during scans, not continuous every-frame coverage.

Installed upstream source corroborates the focus-state mechanism: `DummyInput.js` creates aria-hidden sentinels with tabindex 0 and content-visibility hidden; `Root.js` changes them to non-tabbable when the root receives focus and restores tabbability after root blur. Exact inspected sources are retained with the evidence. The initially passing exploratory scan had no guards in its pre-scan snapshot, while the settled failing scan did. Therefore neither an early-load pass nor a post-click pass is sufficient qualification.

This establishes reproducible upstream-node/state correlation, **not** a blanket false-positive determination or a completed assistive-technology assessment. A same-version upstream-only reproduction and rule/keyboard interpretation are still needed before choosing any remedy. No automatic version change, patched dependency, forced initial focus or rule exclusion is approved by this result.

## Delivery and recovery

New tooling: `scripts/fluent-focus-diagnostic.js` and `scripts/seal-fluent-focus-diagnostic.mjs`; the existing probe adds an explicit diagnostic mode. Historical probe modes and evidence remain available. Rollback is limited to removing these additions and reverting the diagnostic-mode wiring/document updates; preserve this diagnostic evidence. Do not reset the repository or undo earlier Fluent/user changes.

Local ignored evidence: `.qualification/runs/fluent-focus-diagnostic/`, including 18 full scans, CSP/request records, served hashes, inspected upstream source, summary and execution scripts. All 29 listed files passed checksum read-back after server shutdown. Manifest SHA-256: `d4d7f7f28162d724569b46f213d49ecd52962c2bf0ea6b15b5a694bd20680c2f`. All 144 files from the earlier sealed Fluent run were also reverified unchanged. Keep this local evidence separately; it is not included automatically in a Git commit.

Lint, diagnostic-script syntax and diff whitespace checks passed. This step did not rerun dependency restoration, package builds or unit tests because runtime/package inputs were unchanged; prior engineering results remain version-bound historical evidence. The loopback server stopped, its listening port was absent, the owned browser tab closed and the temporary viewport override was reset.

## Next gate

Fluent technical-route approval remains pending on the accessibility finding and previously disclosed brand/compatibility gaps. Recommended next bounded step: prepare and test a pure upstream Fluent 9.74.7 reproduction against the current wrapper, then propose a supported resolution or an explicitly justified review decision. Do not publish an upstream issue without authorization. No CPQ/EPM adoption or new components follow automatically.
