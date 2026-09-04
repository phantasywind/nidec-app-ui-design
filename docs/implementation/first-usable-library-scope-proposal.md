# First usable-library scope — proposal

- Date: 2026-09-04
- Status: Button-only functional prototype explicitly approved by Locke on 2026-09-04; TextInput/Field and production styling remain unapproved.
- Decision owner: Locke Yuan.
- Authorization: Locke replied “同意” to the Button-only implementation question after proposal preparation. Approval is limited to that slice and preserves publication blocking.
- Applies to: Shared Design System; CPQ is the first reference consumer, EPM and future applications retain their own adoption gates.

## Business objective

Move from a verified packaging scaffold toward useful, consistent UI capabilities without turning CPQ's workflows into shared rules. The first deliverable should be small enough to inspect and validate in isolation before application integration.

Recommendation: plan an initial family of **Button, TextInput and Field**, but authorize only a **Button functional prototype** as the next implementation slice. Keep fixture-only styling and publication blocking until authoritative brand inputs are approved. Field/TextInput remain proposals requiring their own contract review; approving the Button slice must not authorize the whole family.

This is an intervening capability-definition gate before the existing Stage 5 publication gate, not approval to publish the Stage 4 scaffold or a change to the CPQ-first adoption sequence.

## Facts, recommendations and pending inputs

| Category | Current position |
| --- | --- |
| Approved | Layered package; neutral token/style exports; React peer ownership; application-owned business semantics; Stage 4 bounded infrastructure closure |
| Verified historical evidence | CPQ compatibility profile and isolated fixtures; no assertion that the live CPQ codebase has been refreshed in this step |
| Recommended inventory | Button, TextInput, Field; first implementation restricted to Button |
| Not yet approved | Component contracts, concrete production tokens/assets, visual variants, exact supported browser/OS matrix, first publishable version |
| Risk | Treating existing CPQ appearance as corporate authority, or importing its permissions/lifecycle logic, would undermine cross-app reuse |

## Candidate contracts (proposed, not public API yet)

| Capability | Shared responsibility | Explicitly application-owned / excluded |
| --- | --- | --- |
| Button | Native button semantics, accessible name, keyboard activation and focus, explicit disabled behavior, typed consumer event/native attributes | Who may act; action availability; submit/save/approve workflow; retries; API calls; permission-derived disabled state |
| TextInput — later | Native text input rendering and controlled/uncontrolled value behavior, accessible association, consumer-provided invalid/disabled/read-only flags | Business validation, data fetching, persistence, required-field decisions, masks or format rules inferred from CPQ |
| Field — later | Consistent association of label, hint and supplied error text with a control | Determining whether a field is required, when validation runs, error generation, business lifecycle or required-by-role rules |

Labels/errors come from the application; no shared hard-coded CPQ/EPM wording. The contract must preserve meaningful distinctions between disabled and read-only. Unknown business semantics remain `Business Rule Pending` with the consumer owner. No blanket required defaults or role-based logic is allowed.

## Proposed next implementation slice: Button only

Purpose: validate the first real, business-neutral React export and interaction evidence before expanding the library.

Proposed operations after explicit approval:

- Define a native-button wrapper contract and its root export. Recommend `type="button"` by default, with explicit caller opt-in for `submit`/`reset`; record and test that choice before adopting it.
- Support a visible text label, normal/disabled native behavior, consumer-supplied event handler and applicable native attributes. Test keyboard activation and focus without recreating a custom button element.
- Do not include links, routing, loading spinners, async deduplication, icon-only mode, destructive/approval variants, tooltips or application-specific action semantics in this slice.
- Use clearly marked non-brand fixture styling only in the approved host scope. No guessed Nidec colors, fonts or logos. No production visual claim.
- Update export-boundary checks, declaration tests and isolated fixtures deliberately: the current empty-root API checks must change only to the approved Button export, not become unrestricted.
- Keep `private: true`, `0.0.0-development` and publication guard. New public bytes require new qualification evidence; historical scaffold hashes cannot qualify the component.

Expected result: one reviewable, non-publishable Button prototype with typed public access and interaction evidence, not a complete design system or CPQ integration.

Verification: native attributes/default behavior, disabled event suppression, keyboard/focus and accessible naming; lint/typecheck/build; scoped CSS/public-export checks; existing tests; packed fixture installation in the approved toolchains; no bundled/duplicate React; regression of the token-only consumer. Interaction-test tooling and a local demo harness must be explicitly selected/documented in the implementation plan, with exact new dependency versions if needed.

Browser evidence must record the actual browser version, Windows build and test dimensions before execution. Propose the existing CPQ input widths 1440/1280/900/720 for review; do not call them an approved support matrix. Retain automated accessibility results and a manual keyboard/focus checklist. Detailed pass/fail criteria must be fixed before calling the prototype verified; no component or WCAG conformance is presumed from the architecture target.

Rollback: targeted removal/revert of the new Button export, its source/tests/demo and changed empty-API expectations; restore the prior verified boundary without modifying applications or deleting old evidence. Stop at prototype review, before TextInput/Field, publication or integration.

## Brand/input register

| Input | Required evidence / owner | Effect while missing |
| --- | --- | --- |
| Authorized brand source | Locke identifies the applicable corporate manual/source owner, version and permitted assets | `Business Rule Pending`; no production tokens, logo/font distribution or branded visual acceptance |
| Approved semantic token values | Traceable mapping from authoritative source to intended usage; do not assume every spacing/focus/error value is in the brand manual | Unspecified values stay pending; fixture-only prototype allowed only by explicit approval |
| CPQ reference needs | CPQ workstream provides a read-only summary of usage patterns, focus/disabled conventions, tests and relevant file paths | Reference requirements only, not brand authority or permission to copy code |
| Browser/OS and interaction matrix | Locke approves support expectations; executor freezes actual test environment versions | Runs provide observed-environment evidence only, not a general compatibility claim |
| Candidate release version | Separate release decision after approved implementation/qualification | No version bump or publishable candidate designated |

Brand inputs are not needed to discuss the functional contract. They are needed before production visual implementation/qualification. EPM inputs may be added later and cannot silently redefine shared business-neutral boundaries.

## Optional CPQ handoff request for Locke to forward

No message has been sent to another task. If useful, forward this bounded request:

> Please provide a read-only handoff for the independent Nidec Design System's proposed Button / TextInput / Field family. Identify representative usage and source paths, native keyboard/focus/disabled behavior, existing tests, and known UI inconsistencies. Separate reusable presentation concerns from CPQ permissions, validation and workflow rules. Identify the authoritative source/version for any brand values if known; otherwise mark them pending. Do not edit CPQ, copy components in bulk, implement integration, or send credentials. This is reference material, not approval of shared contracts.

## Approval request and stop

Recommend approving **only the Button functional prototype with non-brand fixture styling**, keeping publication blocked, and obtaining the brand/CPQ reference inputs in parallel through Locke. Approval does not settle those inputs, authorize the later components, or permit CPQ/EPM writes.

The proposal-preparation turn made no code changes. Locke subsequently approved the Button-only slice; its implementation and evidence are recorded separately in `button-prototype-record.md`. TextInput/Field and all authoritative-input gaps remain subject to their own decisions, never invented defaults.
