# Architecture Input Baseline

- Stage: 2A — Architecture input baseline
- Status: In progress
- Decision owner: Locke Yuan
- Scope: Inputs and decision criteria required before ADR-0002

## Objective

Define the evidence needed to design a reusable, versioned Design System architecture for Nidec applications without inferring consumer technology, brand rules, accessibility obligations, or application business behavior.

This document is an input contract. It does not select a technology stack, define a component inventory, authorize source scaffolding, or approve consumer integration.

## Verified facts

- The source repository is the private GitHub repository `phantasywind/nidec-app-ui-design` with `main` as its default branch.
- The package identity is `@phantasywind/nidec-app-ui-design`.
- GitHub Packages is the normal distribution channel, with matching GitHub Release evidence for every published version.
- CPQ and EPM are the initial reference consumers and will adopt approved versions independently.
- Future Nidec applications may adopt through the same governed compatibility process. Compatibility with an unknown application is not assumed in advance.
- The repository currently contains governance documentation only. No technical stack, source structure, component implementation, build, test, or publication configuration has been established.
- User-confirmed current-state context: EPM currently reuses CPQ UI capabilities, and observed problems with that reuse are a business driver for establishing this independent, governed Design System. The exact reuse mechanism and problem evidence remain pending an EPM handoff.

## Approved architecture invariants

These constraints come from `AGENTS.md` and ADR-0001 and must be preserved by ADR-0002:

1. Consumers install immutable, exact package versions; mutable branches, Git references, tags used as floating versions, and npm version ranges are not valid dependencies.
2. A completed consumer build must not depend on GitHub at runtime.
3. The published package must not duplicate any adopting application's business workflows, RBAC, API contracts, domain state machines, or consumer-specific behavior.
4. The package, Git tag, GitHub Release, packed `.tgz`, and SHA-256 evidence must identify the same immutable version.
5. Corrections require a new version; a published version or artifact must never be overwritten or reused.
6. Credentials and environment-specific secrets must not be embedded in source, package contents, documentation examples, or release evidence.
7. Package technical verification is distinct from each application's acceptance, deployment, and Production approval.
8. The knowledge base may retain long-lived standards and adoption decisions, while skills may guide use; neither replaces or duplicates the package source.

## Assumptions

No unverified consumer or brand assumptions are accepted as architecture inputs at this stage.

In particular, this baseline does not assume that the initial reference consumers—or any future consumer—share a frontend framework, runtime version, package manager, bundler, CSS model, browser target, accessibility target, localization model, or deployment topology. Similar-looking application behavior is not evidence of a shared business contract.

## Approved qualification and adoption sequence

The following sequencing decision was approved on 2026-09-03:

1. Establish the independent Design System architecture, governance, package boundary, documentation, tests, packing, and release controls before modifying a consumer application.
2. Use CPQ as the first qualification consumer through a separately approved, bounded, and reversible adoption slice. CPQ validates practical usability but does not define the shared package by copying its current implementation.
3. Keep CPQ technical verification, independent CPQ acceptance, package publication, deployment, and Production approval as separate gates.
4. After the CPQ slice is accepted, use EPM as the second adoption consumer. EPM is currently early-stage and may replace or rebuild its frontend rather than preserve its current CPQ reuse approach.
5. An EPM Consumer Compatibility Profile is deferred until EPM adoption planning and does not block ADR-0002, the independent source skeleton, or local package qualification.
6. EPM adoption remains application-owned and must not import CPQ business workflows, RBAC, API contracts, state machines, or domain-specific compositions through the shared package.
7. The CPQ-first sequence is a bounded qualification strategy, not a claim that CPQ is the universal architecture standard. Future applications still complete the governed compatibility process.

This decision does not authorize CPQ modification, EPM modification, package publication, GitHub Release creation, or component migration. Each remains a separately approved step.

## Required consumer evidence

Each adopting workstream must provide a Consumer Compatibility Profile containing current, source-backed evidence. Version numbers and configuration details must come from the consuming repository or an approved technical record rather than recollection.

| Profile field | Evidence expected | Initial status |
| --- | --- | --- |
| Application identity and evidence owner | Named application, repository or approved record, and accountable adopting workstream | Architecture Decision Pending |
| Frontend framework and exact supported version | Manifest and lockfile/config references | Architecture Decision Pending |
| Language and compiler constraints | Compiler configuration and build manifest | Architecture Decision Pending |
| Package manager, lockfile, and registry restore method | Manifest, lockfile, and credential-free restore description | Architecture Decision Pending |
| Module formats and bundler capabilities | Build configuration and supported import behavior | Architecture Decision Pending |
| Styling model and global-style constraints | Style entry points, isolation conventions, and build handling | Architecture Decision Pending |
| Asset loading and runtime hosting constraints | Build/deployment configuration without secrets | Architecture Decision Pending |
| Supported browsers and devices | Approved application support matrix and evidence source | Governance Decision Pending |
| Localization, text direction, and density needs | Approved application requirements | Business Rule Pending |
| Accessibility and compliance target | Named standard/version and acceptance method | Governance Decision Pending |
| Existing UI dependencies that may conflict | Dependency inventory and relevant usage evidence | Architecture Decision Pending |
| Build-time and runtime network constraints | Approved restoration path and evidence that runtime is self-contained | Architecture Decision Pending |

### Initial profile registry

| Application | Role | Evidence owner | Profile status |
| --- | --- | --- | --- |
| CPQ | Initial reference consumer and current-state evidence source | CPQ adopting workstream | Collected and cross-checked with the CPQ UI workstream at `e481cd0051265e2e5517f7f6de09da1a9e16a37e`; gaps remain; see `consumer-profiles/cpq.md` |
| EPM | Second adoption consumer; currently reuses CPQ capabilities and may rebuild its early-stage frontend | EPM adopting workstream | Deferred until post-CPQ adoption planning; not an ADR-0002 blocker |

Every future application must add and complete the same profile before compatibility is claimed or integration is authorized. Reading any consumer repository for this evidence requires a separately approved, read-only discovery slice. This Design System task must not modify a consumer repository.

## Future application onboarding contract

1. The adopting workstream submits a source-backed Consumer Compatibility Profile.
2. The profile is compared with the published package compatibility contract and supported-version policy.
3. If the application is within the qualified contract, it may separately request integration using an exact package version.
4. If it is outside the contract, an explicit architecture decision must choose whether to add a business-neutral adapter or layer, introduce a compatible new version, defer adoption, or reject the requested compatibility.
5. Future compatibility work must not retrofit application business semantics into the shared package or silently break already qualified consumers.

This process provides an extensible adoption path; it is not a claim of universal compatibility.

## Decision matrix for ADR-0002

ADR-0002 must resolve each architecture question using the approved invariants and consumer evidence.

| Decision area | Question to resolve | Required evidence | Acceptance criterion | Current state |
| --- | --- | --- | --- | --- |
| Framework boundary | Must the package be framework-coupled, framework-neutral, or layered? | Qualified reference-consumer profiles and future-onboarding criteria | Supported by the approved reference scope with an explicit path for evaluating additional applications | Architecture Decision Pending |
| Public package surface | Which tokens, styles, assets, types, primitives, or components are public? | Approved initial reusable scope | Every public export has an owner and consumer-independent purpose | Architecture Decision Pending |
| Styling and isolation | How are styles delivered without leaking or conflicting with consumers? | Qualified consumer styling/build constraints | Deterministic inclusion and an explicit global-style boundary | Architecture Decision Pending |
| Token model | What is the source-of-truth format and generated output contract? | Authorized brand source and consumer needs | Values are traceable; semantic usage does not encode application state | Architecture Decision Pending |
| Package output | Which module, type, style, and asset outputs are required? | Qualified compiler, bundler, and runtime profiles | Restores and builds in each environment claimed as compatible | Architecture Decision Pending |
| Dependency policy | Which dependencies are bundled, direct, optional, or peer dependencies? | Consumer dependency and version evidence | Avoids hidden runtime downloads and unmanaged version conflicts | Architecture Decision Pending |
| Compatibility policy | Which application profiles and browser versions are supported, and for how long? | Approved compatibility profiles and support matrices | Testable, versioned compatibility statement with a future-application assessment path | Governance Decision Pending |
| Accessibility | Which standard and automated/manual checks form the shared baseline? | Approved compliance target | Named requirements with a verifiable test method | Governance Decision Pending |
| Documentation | What package contract and usage evidence must accompany a version? | Maintainer and consumer review needs | Documentation is version-aligned and does not contain consumer business rules | Architecture Decision Pending |
| Verification | What proves packing, restoration, type/style/asset consumption, and runtime independence? | Consumer build constraints and release controls | Repeatable checks with inspectable evidence and rollback | Architecture Decision Pending |

## Business-rule boundary

The following must remain consumer-owned unless an explicit reusable contract is approved:

- permission-driven visibility or action enablement;
- workflow, approval, lifecycle, or domain-status behavior;
- mapping business states to semantic labels, icons, or colors;
- API error interpretation, navigation policy, or server-authoritative capabilities;
- application-specific terminology and data validation.

Any proposed shared component that requires one of these meanings is `Business Rule Pending`. The Design System may provide presentation capability only after its business-neutral contract is demonstrated and approved.

## Risks

| Risk | Impact | Required control |
| --- | --- | --- |
| Selecting a stack before reference-consumer evidence | An initial application cannot adopt the package or requires a fork | Complete the approved reference-consumer profiles before ADR-0002 |
| Uncontrolled global CSS or assets | Consumer regressions and inconsistent rendering | Define and verify an explicit isolation and asset contract |
| Treating unapproved brand values as facts | Incorrect corporate representation becomes package API | Require an authorized source or keep values pending |
| Misclassified dependencies | Duplicate frameworks, version conflicts, or runtime network reliance | Decide dependency policy from both consumer environments and test packed output |
| Shared components absorbing business behavior | Cross-application coupling and false reuse | Enforce the responsibility matrix and business-rule boundary |
| Self-test presented as application acceptance | Release confidence exceeds available evidence | Keep package qualification and consumer acceptance as separate gates |

## Recommendations for the next decision

These are recommendations, not approved architecture decisions:

- Prefer the smallest public contract that the approved reference consumers can adopt and future applications can assess without hidden assumptions.
- Keep package outputs self-contained for runtime use and make every required external dependency explicit.
- Evaluate candidate toolchains against the consumer evidence rather than selecting by convention.
- Define compatibility and deprecation behavior before publishing the first public API.
- Validate the actual packed artifact in representative consumer builds before authorizing publication.

## ADR-0002 entry criteria

ADR-0002 may be drafted for approval only when:

1. The CPQ Consumer Compatibility Profile is fixed to a source-backed commit and identifies the constraints, coupling, and gaps relevant to the first qualification consumer. The approved CPQ-first scope explicitly defers the EPM profile.
2. The authorized browser/device and accessibility targets are identified, or explicitly excluded from the first architecture decision with recorded risk ownership.
3. The authoritative source for brand/token values is identified, or token values are explicitly excluded from the first slice.
4. The proposed initial public package surface is described without consumer business semantics.
5. Candidate architecture options are compared against the same decision criteria, including reference-consumer compatibility, future-application onboarding, maintainability, verification, and migration cost.
6. All unresolved business semantics remain marked `Business Rule Pending` with an adopting-workstream owner.

Meeting these entry criteria permits an architecture decision proposal. It does not authorize source scaffolding, package publication, GitHub configuration changes, or adopting-application integration.
