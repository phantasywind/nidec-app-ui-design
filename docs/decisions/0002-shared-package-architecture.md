# ADR-0002: Shared Package Architecture

- Status: Accepted with controlled deferrals
- Decision owner: Locke Yuan (`phantasywind`)
- Proposed date: 2026-09-03
- Accepted date: 2026-09-03
- Scope: Package layering, toolchain policy, public exports, token generation, CSS isolation, dependency ownership, and qualification strategy
- First qualification consumer: CPQ
- Second adoption consumer: EPM

## Executive proposal

Build one independently versioned npm package, `@phantasywind/nidec-app-ui-design`, with a layered public contract:

1. platform-neutral design-token source and generated CSS/metadata outputs;
2. business-neutral React foundations, primitives, and interaction components;
3. explicit public subpath exports and no consumer access to internal source;
4. application-owned adapters and compositions kept in CPQ, EPM, or another adopting application.

This layered single-package model is the recommended first architecture because CPQ is React-based while future Nidec applications may need only tokens/styles or may use different application composition. It creates an extensible boundary without introducing a multi-package estate before a real second framework requires one.

This ADR is accepted with the controlled deferrals recorded below. It does not authorize source scaffolding, dependency installation, CPQ/EPM modification, Package publication, GitHub Actions, Release creation, or repository settings changes.

## Context

CPQ contains a mature application-local Design System, but it is not independently publishable. It mixes reusable visual foundations with CPQ business composition, global CSS, legacy compatibility adapters, application routing, and dual App/Sites build concerns.

The approved sequence is:

1. establish the independent framework, governance, packaging, and qualification controls;
2. qualify a local packed artifact without modifying CPQ;
3. publish only after separate authorization;
4. perform a bounded, reversible CPQ adoption slice;
5. after CPQ acceptance, let EPM adopt or rebuild its early-stage frontend.

The architecture must therefore support CPQ's verified React/Vite/TypeScript environment while preventing CPQ-specific semantics from becoming the shared API.

## Options considered

| Option | Description | Advantages | Risks | Assessment |
| --- | --- | --- | --- | --- |
| A — Framework-neutral only | Publish tokens, CSS, assets, and documentation; every application builds its own components | Maximum framework portability and lowest runtime dependency | Repeats interaction/accessibility implementation and does not solve CPQ component consistency | Not recommended as the complete first architecture |
| B — React-specific monolith | Publish tokens, React components, application shell, templates, and business compositions as one root API | Fastest apparent CPQ extraction | Strong CPQ/React coupling, global cascade risk, large public API, poor future-app portability | Rejected |
| C — Layered single package | Publish neutral token/style subpaths plus a bounded React component API; keep application adapters outside | Supports CPQ now, permits token-only future consumers, preserves one governed version and release | Requires strict export, CSS, peer-dependency, and application-boundary controls | Recommended |
| D — Multiple packages immediately | Split tokens, React components, icons, charts, and application adapters into separate packages | Strong physical separation | Premature release/version/permission complexity without validated consumers | Deferred until evidence requires it |

## Proposed decision

### 1. Package and repository model

- Keep one package and one repository for the initial architecture.
- Package name remains `@phantasywind/nidec-app-ui-design`.
- Use ESM as the required first JavaScript output because the fixed CPQ profile uses ESNext modules and Vite. CommonJS output is not part of the first qualification scope unless consumer evidence requires it.
- Generate TypeScript declaration files for every public JavaScript entry.
- Use an npm `files` allowlist and `exports` map so only qualified outputs are installable.
- Do not publish repository source, tests, internal scripts, credentials, local evidence, or unapproved assets in the package.

Proposed public subpaths:

| Subpath | Purpose | React required |
| --- | --- | --- |
| `@phantasywind/nidec-app-ui-design` | Business-neutral React public API | Yes |
| `@phantasywind/nidec-app-ui-design/tokens.css` | Generated, scoped CSS custom properties | No |
| `@phantasywind/nidec-app-ui-design/styles.css` | Generated component styles | Only when component classes are used |
| `@phantasywind/nidec-app-ui-design/tokens.json` | Platform-neutral generated token metadata | No |

Internal source paths remain private. A future breaking need for independent framework bindings may trigger a new ADR and major version or a separately governed package; it must not be anticipated by publishing unused packages now.

### 2. Toolchain policy

- Use a supported Node.js LTS line for repository builds. The initial scaffold should pin an exact Node 24 LTS patch and exact npm version available at implementation time; do not use Node 26 Current for the qualification baseline.
- Record the package manager in `packageManager`, commit `package-lock.json`, and require `npm ci` for qualification.
- Pin all development dependencies to exact versions in both manifest and lockfile. `latest`, caret, tilde, Git, URL, and local-path declarations are prohibited in this repository.
- Use TypeScript strict mode for source and public types.
- Use Vite Library Mode for browser-library JavaScript/CSS output and TypeScript `declaration`/`emitDeclarationOnly` for `.d.ts` output.
- Keep toolchain dependencies in `devDependencies`; no build tool may become a consumer runtime dependency without an explicit decision.
- Do not use package install lifecycle scripts to download assets, call GitHub, or mutate the consumer environment.

The exact Node/npm/Vite/TypeScript versions are implementation records, not permanent architecture constants. Updating them requires a verified maintenance change and new package version when distributed output changes.

### 3. Token architecture

- Author design tokens as platform-neutral JSON compatible with the Design Tokens Community Group Format Module 2025.10.
- Treat DTCG 2025.10 as a stable community specification, not as a W3C Recommendation.
- Separate token intent into three governed layers:
  1. primitives: raw palette, size, duration, and type values;
  2. semantic tokens: text, surface, border, action, focus, feedback, and layout intent;
  3. component tokens: exceptional component-level decisions, introduced only when semantic tokens are insufficient.
- Generate CSS variables and typed/read-only metadata from the same token source. Generated files are never edited by hand.
- Do not copy CPQ token values into the new source until the Nidec-wide brand authority is identified and the values are approved.
- Keep business states such as Quote, Configuration, approval, rejection, or lifecycle stages out of the shared token taxonomy. Applications map their server-authored states to approved neutral semantic tones.

### 4. CSS and theme isolation

- Do not publish a global reset and do not target unscoped `:root`, `html`, `body`, `*`, native elements, or application IDs.
- Scope shared variables and component styles beneath an explicit Design System host such as `[data-nidec-ui]`.
- Prefix public CSS variables and component classes with one package-owned namespace; the exact prefix is fixed at scaffold approval and thereafter treated as public API.
- Put package styles in an explicit CSS cascade layer so consumers can define a documented override layer without selector escalation.
- Components must remain usable when another application's global CSS is present.
- Portal-based surfaces must preserve the same theme scope, focus containment, background isolation, and focus restoration contract.
- Importing tokens and component styles must be explicit. Installing the package alone must have no visual side effects.

### 5. React boundary and dependencies

- React and React DOM are peer dependencies for the component API and exact development dependencies for package testing. They must not be bundled into the artifact.
- The peer range represents a tested host compatibility contract; each consuming application still pins exact resolved versions in its own manifest/lockfile and pins the exact Design System version.
- Initial qualification targets the React major and versions proven by the fixed CPQ Consumer Compatibility Profile. Broader React support requires evidence, not optimistic ranges.
- React Router remains application-owned. Shared components accept routes, links, callbacks, and state as typed inputs but do not own application routing.
- Recharts remains outside the initial shared core. Data visualization requires a later bounded decision.
- Do not make Lucide or another icon library part of the first public contract. Components accept governed icon slots; a semantic icon registry requires a separate inventory and decision.
- The component API must not import CPQ/EPM DTOs, API clients, role names, lifecycle enums, routes, server error codes, or domain types.

### 6. Initial public-surface boundary

ADR-0002 approves architecture layers, not the first component inventory.

The first implementation slice may include only:

- generated token outputs using approved values, or clearly isolated test-fixture values that are blocked from publication;
- framework-neutral style infrastructure;
- business-neutral React foundations, layout, controls, form semantics, feedback, and modal interaction primitives explicitly approved in a later component-inventory checkpoint;
- package metadata, documentation, tests, a Gallery/development harness, and artifact qualification scripts.

The first slice excludes:

- CPQ/EPM application shells and navigation policy;
- Quote, Pricing, BOM, Configuration, Engineering Change, approval, lifecycle, RBAC, API, and server-state semantics;
- application page templates whose information architecture is not proven neutral;
- dashboards/charts, document rendering, routing adapters, and migration compatibility adapters;
- bulk copying from any application repository.

### 7. Build and artifact contract

The build must produce a deterministic `dist/` containing only qualified public outputs, declarations, styles, token metadata, and required approved assets.

`npm pack` qualification must:

1. build from a clean dependency restoration;
2. produce the actual candidate `.tgz`;
3. inspect the tarball file allowlist and package metadata;
4. confirm no credentials, environment files, repository-only sources, tests, or unexpected assets are included;
5. compute SHA-256 for the preserved artifact;
6. install the `.tgz` into an isolated consumer harness;
7. type-check, test, and production-build the harness using only public exports;
8. confirm the built harness has no GitHub runtime calls or package-source dependency;
9. remove the isolated harness and prove rollback.

The local harness initially models the fixed CPQ React/Vite/TypeScript constraints without modifying the CPQ repository. Real CPQ integration remains Stage 6 and requires separate authorization.

### 8. Verification and quality gates

Every public change must pass:

- clean `npm ci`;
- formatting/linting and strict type-check;
- unit and interaction tests;
- public-export and component-catalog checks;
- CSS isolation and forbidden-global-selector checks;
- accessibility automation plus documented keyboard/focus tests;
- responsive checks at the approved viewport matrix;
- library build, declaration validation, `npm pack`, tarball inspection, checksum, and isolated consumer build;
- a compatibility record identifying exactly which consumer profiles were exercised.

Package self-test is technical qualification, not CPQ/EPM acceptance. A component or package version is not Production-approved merely because these gates pass.

### 9. Version and release posture

- Consumer manifests use an exact Design System version.
- Published versions and tags are immutable; corrections use new versions.
- Qualification versions should remain pre-1.0 until the first bounded CPQ adoption is independently accepted. The exact initial version requires a separate release decision.
- Every published version follows ADR-0001: matching Git tag, GitHub Package, GitHub Release, actual `.tgz`, `SHA256SUMS.txt`, and release record.
- Repository `.npmrc` may contain only the non-secret scope-to-registry mapping. Tokens are supplied through approved user/CI credential stores and never committed.

## Decision record and controlled deferrals

| Decision | Accepted direction | Status and next gate |
| --- | --- | --- |
| Architecture option | Option C — layered single package | Accepted |
| Token interchange | DTCG Format Module 2025.10 JSON source with generated CSS/metadata | Accepted |
| Build runtime policy | Exact Node 24 LTS patch and npm version pinned at scaffold time | Accepted; exact patch versions fixed and verified in the Stage 3 proposal |
| JavaScript output | ESM first; no CommonJS until consumer evidence requires it | Accepted |
| React ownership | React/React DOM external peer dependencies, tested against fixed CPQ profile | Accepted |
| CSS isolation | Explicit host scope, package prefix, cascade layer, no global reset | Accepted |
| Accessibility target | WCAG 2.2 Level AA | Accepted as the shared target; detailed automated/manual acceptance matrix is a Stage 3 governance deliverable |
| Browser/device target | CPQ's 1440/1280/900/720 evidence is the initial viewport input | Controlled deferral: exact browser/version/OS support matrix must be frozen before CPQ adoption and before any compatibility claim |
| Brand source | Authorized Nidec-wide colors, typography, logo assets, and usage rules | Controlled deferral / `Business Rule Pending`: blocks production token values, distributable brand assets, and stable visual qualification; does not block package-infrastructure scaffolding with non-publishable test fixtures |
| First component inventory | Separate bounded approval after architecture acceptance | Controlled deferral: required before component implementation; Stage 3 may establish folders, contracts, tests, and empty/public-boundary infrastructure only |
| Qualification version | Pre-1.0 until CPQ independent acceptance | Accepted; exact first version remains a separate release decision before publication |

### Deferral ownership and failure behavior

- Locke Yuan is the decision owner for the browser/OS matrix, brand authority, first component inventory, and exact qualification version.
- A deferral permits only work explicitly described as non-blocked above. It is not permission to insert guessed values or silently adopt CPQ defaults.
- Missing browser/OS evidence blocks compatibility claims and CPQ adoption acceptance.
- Missing brand authority blocks production token values, distributable brand assets, stable visual qualification, and publication of a visually branded package.
- Missing component-inventory approval blocks component implementation and public component exports.
- If a later decision conflicts with this ADR's package boundary, dependency ownership, or isolation contract, revise the ADR before implementation rather than bypassing it.

## Consequences

### Benefits

- CPQ can validate real package consumption without becoming the shared source tree.
- Future applications can consume token/style outputs without adopting CPQ business composition.
- React duplication, global CSS leakage, hidden routing, and runtime GitHub dependency are explicitly controlled.
- One package/version/release evidence chain remains operationally manageable during the first adoption cycle.
- A later package split remains possible only when real consumer evidence justifies its governance cost.

### Costs and risks

- One package with optional neutral subpaths still requires careful peer-dependency and export testing.
- The independent implementation must reconstruct approved neutral capabilities instead of copying CPQ code, increasing initial effort.
- Brand and accessibility decisions can block visual completion even while package infrastructure progresses.
- ESM-only output may exclude a future legacy toolchain; that consumer must provide evidence before CommonJS is added.
- Pre-1.0 qualification still creates immutable published versions; iteration must use new versions rather than overwrite history.

## Rejected shortcuts

- Copying `client/src/design-system` from CPQ into this repository.
- Publishing CPQ's `:root` tokens, global reset, legacy CSS, or compatibility adapters.
- Bundling React into the package.
- Exposing internal source paths or relying on consumer alias `@/design-system`.
- Using `latest`, mutable tags, version ranges for the Design System dependency, Git URLs, or `main`.
- Using a Skill or knowledge-base article as the package source.
- Calling a Gallery, build, or self-test independent application acceptance.

## Official technical references

- [Vite Library Mode and CSS exports](https://vite.dev/guide/build)
- [npm package.json fields, exports, files, and peer dependencies](https://docs.npmjs.com/files/package.json/)
- [TypeScript declaration output](https://www.typescriptlang.org/tsconfig/declaration.html)
- [React warning about duplicate React and library dependency ownership](https://react.dev/warnings/invalid-hook-call-warning)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [DTCG Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Acceptance gate

ADR-0002 is accepted with the explicit deferrals above. Acceptance authorizes only preparation of the next separately stated Stage 3 source-skeleton proposal; it does not authorize implementation automatically.
