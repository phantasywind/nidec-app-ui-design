# CPQ Consumer Compatibility Profile

- Application: Nidec Elevator CPQ
- Role: Initial reference consumer and current-state evidence source
- Source repository: `D:\Documents\Nidec Elevator CPQ`
- Evidence branch: `main`
- Evidence commit: `e481cd0051265e2e5517f7f6de09da1a9e16a37e`
- Evidence date: 2026-09-03
- Discovery mode: Read-only
- Profile status: Collected and cross-checked with the CPQ UI workstream; architecture and governance gaps remain

## Interpretation boundary

CPQ contains a mature application-local Design System and extensive UI governance evidence. It is not the source repository for the future shared package and is not automatically the standard for other Nidec applications.

This profile separates:

- current technical constraints that a shared package must be able to support;
- governance patterns worth evaluating for reuse;
- CPQ-specific compositions and business semantics that must remain in CPQ;
- coupling and reproducibility problems that the independent Design System must not copy.

No CPQ file was modified during this discovery. EPM currently reuses CPQ UI patterns and has exposed problems that motivated the independent Design System project; the specific EPM reuse path and problems require a separate evidence handoff.

## Evidence baseline

The CPQ worktree was clean before and after discovery at the fixed commit above. Repository governance assigns `client/` and UI-specific documentation to its dedicated UI workstream and keeps server contracts, business rules, independent acceptance, and deployment under separate ownership.

Primary governance evidence:

- `AGENTS.md:1-73`
- `docs/workstreams/README.md`
- `docs/workstreams/02-ui-design.md:634-713`
- `docs/implementation/master-implementation-plan.md:506-527`
- `docs/design/ui-design-system-and-interaction-principles.md`

The CPQ UI workstream also supplied a fixed-commit, read-only evidence index. Its additional claims were sampled against the same commit before inclusion here; the handoff itself is not treated as a substitute for repository evidence.

## CPQ-approved specifications versus shared governance

The following are normative inside CPQ but are not automatically approved as cross-application Design System standards:

- local Segoe UI with Arial/Helvetica/sans-serif fallbacks, no external font CDN, 14px body text, 24–26px page headings, 16–18px section headings, and a 12px minimum supporting-text floor (`docs/design/ui-design-system-and-interaction-principles.md:27-35`);
- full acceptance widths at 1440px and 1280px, layout contraction around 900px, icon-led navigation below approximately 1080px, and a navigation drawer below 760px (`docs/design/ui-design-system-and-interaction-principles.md:37-49`);
- official Nidec assets, Nidec Green `#009B4A`, restricted red semantics, CSS tokens, and no Tailwind/shadcn without a new decision (`AGENTS.md:60-69`);
- server authority for roles, validation, transitions, eligibility, and concurrency (`AGENTS.md:52-56`).

ADR-0002 must distinguish which of these become shared standards, which remain CPQ compatibility requirements, and which require an authorized Nidec-wide source.

## Current technical profile

### Application and package boundary

| Field | Verified current state | Evidence | Profile result |
| --- | --- | --- | --- |
| Application package | Private ESM application package `nidec-elevator-cpq-client` version `0.1.0` | `client/package.json:2-5` | Collected |
| Shared-package boundary | No independent package exists; pages consume the application-local `@/design-system` barrel. The manifest has no export map, `publishConfig`, or library-build command | `client/package.json:1-15`; `client/src/design-system/README.md:3-15`; `client/src/design-system/index.ts:1-24` | Architecture gap |
| Lockfile | npm `package-lock.json`, lockfile version 3 | `client/package-lock.json:1-5` | Collected |
| Package-manager declaration | No `packageManager`, `.npmrc`, `.nvmrc`, or repository Node-version file was found | `client/package.json`; repository file inventory | Governance gap |
| Build container | Application build uses `node:22-alpine`, `npm ci`, and Nginx runtime hosting | `client/Dockerfile:1-11`; `client/nginx.conf:1-36` | Collected |

### Framework and compiler

| Field | Verified current state | Evidence | Profile result |
| --- | --- | --- | --- |
| React | Manifest uses `latest`; lock resolves React and React DOM `19.2.7` | `client/package.json:20-21`; `client/package-lock.json:3540-3553` | Collected with drift risk |
| Router | Manifest uses `latest`; lock resolves React Router DOM `7.18.1` | `client/package.json:22`; `client/package-lock.json:3616-3619` | Collected with drift risk |
| TypeScript | Manifest uses `latest`; lock resolves `7.0.2` | `client/package.json:24`; `client/package-lock.json:3989-3992` | Collected with drift risk |
| Vite / React plugin | Manifest uses `latest`; lock resolves Vite `8.1.4` and plugin-react `6.0.3` | `client/package.json:18,25`; `client/package-lock.json:2380-2383,4075-4078` | Collected with drift risk |
| Compiler contract | ES2022 target, ESNext modules, Bundler resolution, strict mode, `react-jsx`, no emit | `client/tsconfig.app.json:3-19` | Collected |
| Module alias | `@/*` resolves to `client/src/*` | `client/tsconfig.app.json:14`; `client/vite.app.config.ts:11` | Application-local constraint |

The lockfile makes the current checkout reproducible with `npm ci`, but the manifest's `latest` and range declarations can resolve differently when the lockfile is regenerated. Those declarations are current-state facts, not an acceptable dependency policy for the shared package.

### Build and verification

| Field | Verified current state | Evidence | Profile result |
| --- | --- | --- | --- |
| Canonical application build | Type-check, Vite application build, then a custom build verifier | `client/package.json:10`; `client/vite.app.config.ts:8-14` | Collected |
| Additional Sites build | Separate Vite configuration adds Sites and Cloudflare plugins and outputs `dist-sites` | `client/package.json:8-12`; `client/vite.config.ts:8-16` | Application-specific |
| Default `build` command | Delegates to `build:sites`, not `build:app` | `client/package.json:9-11` | Integration risk |
| Unit/component tests | Vitest in jsdom with CSS enabled and Testing Library dependencies | `client/package.json:15,32-37`; `client/vitest.config.ts:5-8` | Collected |
| Design governance check | Custom `design-system:check` validates the route ledger, catalog, exports, and migrated-page boundaries | `client/package.json:14`; `client/src/design-system/README.md:5-15` | Reusable governance candidate |
| Browser support declaration | No explicit Browserslist file or package field was found | repository file inventory; `client/package.json` | Governance Decision Pending |

The shared package requires its own build and packed-artifact verification. CPQ's application and Sites builds are consumer evidence, not a package build design.

### Styling, tokens, responsive behavior, and assets

| Field | Verified current state | Evidence | Profile result |
| --- | --- | --- | --- |
| Style entry | `main.tsx` imports five global stylesheets, including the Design System stylesheet | `client/src/main.tsx:5-9` | Collected |
| Token scope | Both the base tokens and Design System tokens use global `:root`; base CSS also changes `*`, `html`, `body`, native controls, links, selection, and focus | `client/src/styles/tokens.css:1-64`; `client/src/design-system/styles.css:1-46` | Isolation gap |
| Brand color | CPQ governance identifies Nidec Green; current token files contain `#009b4a` and related tones | `AGENTS.md:60-64`; `client/src/styles/tokens.css:1-22`; `client/src/design-system/styles.css:1-20` | Requires cross-application brand authority |
| Typography | Base stack is Segoe UI, Arial, Helvetica, sans-serif; Design System uses Segoe UI and Arial with 400/600 governed weights and 12/13/14px readable levels | `client/src/styles/tokens.css:1-2`; `client/src/design-system/styles.css:20-30`; `client/src/design-system/README.md:33-43` | Candidate pending governance review |
| Responsive baseline | Code exports 720/900/1280 breakpoints and CSS additionally contains component-specific 520/760/1080 rules | `client/src/design-system/foundations.ts:3`; `client/src/design-system/styles.css:736-761,905-1079` | Candidate, not yet shared contract |
| Minimum application width | Base body uses `min-width: 320px` | `client/src/styles/tokens.css:55-56` | Collected |
| Reduced motion | Base and Design System CSS contain `prefers-reduced-motion` handling | `client/src/styles/tokens.css:62-64`; `client/src/design-system/styles.css:757,962` | Reusable accessibility candidate |
| Brand assets | Two local Nidec Elevator horizontal logo PNGs are bundled under the client source tree; no external font CDN, font binary, or `@font-face` rule was found | `client/src/assets/brand/`; `AGENTS.md:60-64`; client source inventory | Asset licensing/authority pending |

Global selectors and root-level variables are safe only in CPQ's controlled single-application entry point. They must not be copied into a shared package without an approved token host, reset policy, and consumer isolation contract.

### UI dependencies

| Dependency | Current resolved version | Current use | Evidence |
| --- | --- | --- | --- |
| `lucide-react` | `1.24.0` | Icons across 52 source files | `client/package-lock.json:3326-3329`; source import inventory |
| `recharts` | `3.9.2` | Dashboard/data visualization in two source files | `client/package-lock.json:3632-3635`; source import inventory |
| `react-router-dom` | `7.18.1` | Routing/navigation across 51 source files | `client/package-lock.json:3616-3619`; source import inventory |

ADR-0002 must decide whether React, routing, icons, and charts are peer, direct, optional, internal, or application-owned dependencies. This profile does not make that decision.

## Existing application-local Design System

### Governance patterns worth evaluating

- A single public barrel for page consumption.
- A machine-readable component catalog.
- A route maturity ledger with `frozen`, `governed`, `candidate`, `partial`, and `legacy` states.
- Automated checks preventing raw visual controls, direct internal imports, unregistered exports, and page-owned visual drift.
- Component tests, a development-only Gallery, responsive checks, visible focus, modal focus isolation, reduced-motion handling, and local overflow control.
- Clear separation between technical verification and independent application acceptance.

Evidence: `client/src/design-system/README.md:3-43`, `client/scripts/design-system-route-inventory.json`, `client/src/design-system/component-catalog.json`, and `client/package.json:14-15`.

These are governance concepts to re-evaluate. Their current files and scripts remain CPQ-owned and must not be copied wholesale.

### Coupling that prevents direct extraction

1. The public barrel still exports compatibility adapters from `../ui/components` and `../ui/versionRelease` (`client/src/design-system/index.ts:20-24`).
2. `business.tsx` and the Design System documentation contain CPQ-specific Quote, Configuration, Pricing, Engineering Change, BOM, and lifecycle compositions (`client/src/design-system/README.md:81-160,162-180`).
3. The stylesheet is a large application-wide artifact and coexists with legacy `components.css`, `pages.css`, `layout.css`, and `admin.css`; ownership and cascade boundaries are not package-isolated.
4. The local `designSystemVersion = '1.0.0-baseline'` is a source constant, not a published package version (`client/src/design-system/foundations.ts:1`).
5. Application shell, routing, server-authoritative capabilities, and business composition are interwoven with visual primitives.
6. CPQ has application-specific dual build paths and a default build aimed at Sites rather than the canonical application output.

## Reuse classification

This is an architecture input, not an approved migration list.

| Classification | Current CPQ examples | Required action before shared use |
| --- | --- | --- |
| Candidate shared foundations | semantic tones, spacing/type/radius concepts, focus/reduced-motion behavior, basic layout and control contracts | Confirm brand/accessibility authority; redesign token scope; implement independently with tests |
| Candidate reusable interaction patterns | Sheet focus isolation, dialogs, form-field semantics, directory/table overflow, loading/empty/error states | Prove business neutrality and framework/dependency contract |
| Candidate governance mechanisms | catalog, Gallery, route/component checks, maturity states | Recreate for an independent package and multi-application adoption model |
| Requires abstraction | shell, navigation, page templates, charts, versioned-governance surfaces | Separate application routing, identity, data, and capability inputs from presentation |
| Must remain CPQ-owned | Quote/Pricing/BOM/Configuration/Engineering Change semantics, lifecycle mappings, RBAC, API contracts, server state interpretation | Keep in CPQ or a CPQ adapter; do not place in the shared core |
| Legacy/migration evidence only | old `ui/` adapters and page-owned/global legacy CSS | Do not copy; use only to define regression and migration checks |

## Gaps and risks

### Architecture gaps

- No independent package manifest, export map, type declaration build, stylesheet export, packed-artifact test, or consumer restoration test exists.
- Framework and dependency ownership is unresolved.
- Global CSS and token scoping are not safe for unknown applications.
- Browser and Node/package-manager support policies are not explicitly governed.
- The authorized cross-application brand source and asset-use policy are not yet identified.
- No governed semantic icon registry separates application meaning from direct Lucide imports.
- No explicit browser/OS/DPR matrix or screenshot-regression system qualifies the visual output across applications.
- CPQ's generic primitives and business compositions are not separated into independently versioned layers.

### Reproducibility risks

- `latest` declarations and semver ranges can drift when the lockfile is regenerated.
- Vite, TypeScript, and the React Vite plugin are declared as runtime dependencies rather than development-only build dependencies; shared-package dependency ownership must be redesigned rather than inherited.
- The default build command targets the Sites build, while the canonical application build is separate.
- A source constant resembling a version can be confused with a qualified package version.

### Organizational risks

- Treating CPQ as the universal reference could encode CPQ information architecture and business semantics into every future application.
- Treating existing maturity labels as cross-application acceptance would conflate CPQ-specific verification with package qualification and other applications' acceptance.
- Copying the existing directory would move historical adapters and global cascade debt into the new repository.

## Recommendations, not decisions

- Use this profile as a compatibility target and problem inventory, not as source-copy authorization.
- Preserve useful governance ideas while implementing the shared package from an explicitly approved public contract.
- Evaluate a layered model that distinguishes foundations/primitives, optional framework bindings, application-neutral compositions, and application-owned adapters.
- Require exact tool and dependency versions in the shared repository and verify the actual `npm pack` artifact.
- Establish a scoped token/reset strategy before any consumer integration.
- Keep CPQ-specific components in CPQ until a separate review proves a business-neutral contract.

## Remaining evidence required before ADR-0002

1. Authorized browser/device and accessibility targets for the shared package.
2. The authoritative Nidec brand/token and logo-asset source for cross-application use.
3. An approved first public surface: foundations only, framework bindings, components, or a layered combination.
4. A bounded CPQ qualification approach that demonstrates shared-package use without copying CPQ business semantics or requiring a broad migration.

The approved sequence uses CPQ as the first qualification consumer. An EPM handoff identifying its current CPQ reuse path and observed problems is deferred until EPM adoption planning; it is no longer an ADR-0002 entry requirement.

Until these inputs are resolved, this profile supports option analysis but does not authorize ADR-0002 approval, source scaffolding, migration, or publication.
