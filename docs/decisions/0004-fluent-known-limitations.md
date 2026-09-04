# ADR-0004: Accept the identified Fluent limitations

- Status: Accepted for the current prototype technical-route assessment
- Decision owner: Locke Yuan
- Date: 2026-09-04
- Authorization: Locke explicitly directed that the discussed accessibility warning may be ignored, and that the type-declaration failure may be ignored provided it does not affect user interaction or cause incorrect operation.

## Decision

The two identified findings below no longer independently block the current Fluent technical-route assessment. This is a risk-acceptance decision, not a change to the observed test results, a declaration of full compliance, or an instruction to disable checks.

| Finding | Accepted treatment | Boundary |
| --- | --- | --- |
| `aria-hidden-focus` violations/incomplete outcomes on the identified Tabster focus sentinels | Retain as an accepted known limitation; further sentinel-specific investigation is not required to advance this prototype's route assessment | Does not accept an observed focus trap, inaccessible functional control, wrong activation or other user-interaction defect; not a global exemption for every accessibility finding |
| Upstream declaration errors when full library checking is enabled | Accept the identified declaration-only compatibility limitation under the existing project configuration | Conditional on no demonstrated user-interaction/incorrect-operation effect; does not accept failures in shared/application source, public API use, normal builds or consumer compatibility checks |

The current evidence has not demonstrated an interaction defect caused by these findings in the tested states. It does **not** prove absence of defects in all states or applications. If an actual interaction, focus-navigation, event, form-submission or incorrect-operation defect is found, it is a new blocking functional finding and must be investigated. A future consumer that cannot build under its required compiler policy has a compatibility blocker, not permission to silently weaken its configuration.

## Exact scope and evidence

- Fluent 9.74.7; Tabster 8.8.1; React/React DOM 19.2.7; axe 4.13.0.
- Current Nidec prototype artifact SHA-256: `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a`.
- Project compiler settings remain unchanged, including existing `skipLibCheck: true`; the additional full-declaration diagnostic remains recorded as failed.
- Evidence and limitations: `docs/implementation/fluent-adaptation-record.md`, `fluent-focus-diagnostic-record.md` and `fluent-upstream-comparison-record.md` in the same implementation directory.
- The backward-entry evidence gap, incomplete dialog scan and absence of full assistive-technology coverage remain disclosed, but are not required follow-ups solely to dispose of the accepted sentinel warning for this route assessment.

Do not automatically transfer this acceptance to another dependency version, changed artifact or adopting application. Reassess whether the same finding and evidence still apply. Each application owns its independent acceptance and required policies.

## Overrides and retained controls

This decision narrowly overrides ADR-0003's stop-on-failure rule and the historical pending dispositions **only for these identified findings and this gate**. Original scans, compiler logs and checksum records are preserved; failures must not be rewritten as passes. Automated scans and existing source/API type checks stay enabled. No new `any`, compiler weakening, forced initial focus, dependency patch, sentinel deletion or scanner suppression is authorized or implemented.

The WCAG target is not a claim of achieved conformance. Neither this decision nor a future technical-route approval grants publication, production, CPQ/EPM changes or independent application acceptance. Brand inputs, browser/consumer boundaries and release controls remain separate. No change to business semantics is authorized.

## Next gate and reversal

Proceed to consolidate the Fluent technical-route review with these accepted limitations rather than repeating the same warning investigation. The overall gate is not automatically approved by accepting two findings. Any newly observed user-interaction or incorrect-operation impact reopens the corresponding blocker; no dependency on an additional waiver should delay reporting it.

This step is documentation only. Reversal requires a superseding decision reopening these dispositions; preserve this record and the original evidence. No runtime rollback is needed because no runtime code or dependency was changed.
