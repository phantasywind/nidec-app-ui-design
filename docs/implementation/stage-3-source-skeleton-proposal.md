# Stage 3 Source-Skeleton Proposal

- Status: Approved for Step 3B on 2026-09-03; later Stage 3 steps remain separately gated
- Decision owner: Locke Yuan (`phantasywind`)
- Proposal date: 2026-09-03
- Scope: Local, reversible package infrastructure only
- Implements: ADR-0002 infrastructure boundary
- Does not authorize: dependency installation, component implementation, publication, GitHub configuration, or consumer-repository changes

## Executive recommendation

Create a deliberately empty, private package skeleton that proves the future public boundaries before any visual component or production brand value is implemented.

The skeleton should establish one layered ESM package, deterministic maintainer tooling, explicit export and file allowlists, scoped CSS conventions, test-fixture-only token generation, and an isolated packed-artifact consumer harness. It must remain non-publishable until the brand, component inventory, qualification version, and release gates are separately approved.

This is the smallest useful implementation slice because it validates the architecture without copying CPQ code, inventing Nidec-wide brand rules, exposing premature component APIs, or modifying CPQ/EPM.

## Approved inputs and controlled assumptions

### Approved inputs

- Package identity: `@phantasywind/nidec-app-ui-design`.
- Architecture: one layered package with neutral token/style subpaths and a bounded React root API.
- Output: ESM only for the first qualification; TypeScript declarations for public JavaScript entries.
- Dependency ownership: React and React DOM are consumer-owned peer dependencies and must not be bundled.
- CSS isolation: explicit host scope, namespace, and cascade layer; no global reset.
- Token interchange: DTCG Format Module 2025.10 compatible JSON.
- Initial consumer evidence: the fixed CPQ profile at commit `e481cd0051265e2e5517f7f6de09da1a9e16a37e`.

### Proposed scaffold constants

| Contract | Proposed value | Rationale |
| --- | --- | --- |
| Maintainer Node runtime | `24.20.0` | Exact Node 24 LTS patch; repository builds use one deterministic baseline |
| Maintainer npm | `11.19.0` | npm bundled with Node `24.20.0`; no separate package-manager upgrade |
| Consumer Node engine floor | `>=22.12.0` | Does not force the Node 22 CPQ consumer to adopt the maintainer runtime; compatibility claims remain limited to tested versions |
| TypeScript | `7.0.2` | Exact development dependency; aligns with the fixed CPQ compiler evidence |
| Vite | `8.2.2` | Exact package-library build dependency at proposal time |
| Vitest | `4.1.11` | Exact test dependency at proposal time |
| ESLint | `10.9.1` | Exact lint dependency at proposal time |
| React / React DOM test host | `19.2.7` | Exact development copies matching the fixed CPQ profile |
| React / React DOM peer range | `>=19.2.0 <20` | Bounded to the evidenced React major; consumers still pin exact resolved versions |
| Package type | ESM (`"type": "module"`) | Matches ADR-0002 and the initial Vite consumers |
| CSS host | `[data-nidec-ui]` | Explicit opt-in scope |
| CSS custom-property prefix | `--nidec-ui-` | Package-owned public namespace |
| CSS class prefix | `.nidec-ui-` | Package-owned public namespace |
| CSS cascade layer | `nidec-ui` | Explicit package layer for controlled consumer overrides |

Exact development dependency metadata must be revalidated immediately before the lockfile is generated. Version drift is not silently accepted: an unavailable or changed version is recorded as a proposal deviation and returned for approval. All committed development dependencies use exact versions in both manifest and lockfile.

### Controlled assumptions

- `engines.node` describes the minimum supported consumer/build environment, while `.node-version`, `.nvmrc`, and `packageManager` pin the maintainer qualification environment. These are intentionally not the same contract.
- React peers are marked optional in package metadata so token-only consumers do not install React. Any import of the React root API still requires compatible React and React DOM peers and is verified in a React consumer fixture.
- The namespace and host values above become public API when the skeleton is approved and implemented. Changing them after publication would require a breaking-version decision.

## Proposed repository structure

Only the following bounded structure is proposed for Stage 3 implementation. Empty placeholders must carry no visual or business behavior.

```text
/
├─ .gitignore
├─ .npmrc
├─ .node-version
├─ .nvmrc
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ tsconfig.build.json
├─ vite.config.ts
├─ vitest.config.ts
├─ eslint.config.js
├─ src/
│  ├─ index.ts
│  └─ internal/
│     └─ README.md
├─ tokens/
│  └─ fixtures/
│     └─ scaffold.tokens.json
├─ styles/
│  ├─ tokens.css
│  └─ styles.css
├─ scripts/
│  ├─ build-tokens.mjs
│  ├─ check-boundaries.mjs
│  ├─ check-css-scope.mjs
│  ├─ verify-package.mjs
│  └─ verify-consumer.mjs
├─ tests/
│  ├─ package-contract.test.ts
│  ├─ token-fixture.test.ts
│  └─ css-scope.test.ts
└─ fixtures/
   ├─ token-only-consumer/
   └─ react-vite-cpq-consumer/
```

Generated `dist/`, local pack output, temporary consumer installations, coverage, and `node_modules/` remain ignored and uncommitted. The fixture consumers exist only to prove package boundaries; they are not CPQ or EPM source code.

## Package and public-boundary contract

### Safe initial metadata

- Use version `0.0.0-development` and `"private": true` throughout Stages 3 and 4.
- Record `"packageManager": "npm@11.19.0"`, the proposed Node engine floor, repository metadata, `UNLICENSED`, and ESM type.
- Use only `@phantasywind:registry=https://npm.pkg.github.com` in the repository `.npmrc`; never store authentication material.
- Use a strict npm `files` allowlist and an `exports` map. Repository source, tests, fixtures, scripts, evidence, and configuration must not enter a candidate tarball.
- Do not use install lifecycle scripts or runtime network calls.
- Keep all build/test/lint tooling in exact `devDependencies`.

`private: true` is an intentional publication interlock. Stage 4 may create and inspect a local tarball, but the package cannot be published until a separately approved release slice changes the publication metadata and supplies an approved immutable version.

### Initial public outputs

| Public subpath | Stage 3 content | React required |
| --- | --- | --- |
| package root | Structurally valid empty ESM API (`export {}`) and declaration only | Peer contract exercised, but no component exported |
| `./tokens.css` | Generated CSS from clearly labelled scaffold fixture values | No |
| `./styles.css` | Empty scoped cascade-layer infrastructure; no component rules | No |
| `./tokens.json` | Generated read-only metadata from the same scaffold fixture | No |

The scaffold fixture is technical test data, not a brand proposal. Its outputs must contain an explicit development marker, remain blocked by `private: true`, and fail package qualification if represented as approved production tokens. No logo, font, Nidec green value, CPQ token, or other brand asset/value is introduced in this stage.

### Boundary checks

The Stage 3 implementation must fail validation when it finds:

- a public export from `src/internal/`;
- application DTOs, routes, role names, lifecycle enums, API clients, or CPQ/EPM domain terminology in the public package;
- unscoped `:root`, `html`, `body`, universal selectors, native-element resets, or application IDs;
- a public CSS variable/class outside the approved namespace;
- React or React DOM included in built library chunks;
- an undeclared public file, install lifecycle script, credential-like file, or runtime GitHub dependency;
- a non-exact development dependency or a Git, URL, local-path, `latest`, caret, or tilde declaration.

## Proposed scripts and local verification

| Script | Responsibility |
| --- | --- |
| `tokens:build` | Validate the DTCG-compatible scaffold fixture and generate CSS plus JSON metadata from one source |
| `lint` | Check repository source and scripts with the pinned linter |
| `typecheck` | Run strict TypeScript checks without emitting runtime code |
| `test` | Run package-contract, token-generation, and CSS-scope tests |
| `boundaries:check` | Enforce public imports/exports, dependency ownership, terminology, and namespace rules |
| `build` | Build ESM library output and declarations into a clean `dist/` |
| `pack:verify` | Create the local npm tarball, inspect metadata/file allowlist, and calculate SHA-256 |
| `consumer:verify` | Install the actual tarball into isolated token-only and React/Vite fixtures, then type-check, test, and production-build them |
| `verify` | Execute the complete Stage 3 technical sequence in a deterministic order |

The Stage 3 implementation exit check is:

1. restore with `npm ci` under Node `24.20.0` / npm `11.19.0`;
2. prove exact dependency declarations and a reproducible lockfile;
3. lint, strict-type-check, and test;
4. generate only the labelled fixture token outputs;
5. build ESM and declarations with no bundled React/React DOM;
6. inspect the public export map, CSS scope, and `dist/` allowlist;
7. create and inspect the real local `.tgz` and SHA-256 record;
8. install that `.tgz` into an isolated token-only consumer without React;
9. install the same `.tgz` into a CPQ-compatible React 19 / Vite 8 fixture and production-build it;
10. confirm neither built consumer requires GitHub at runtime;
11. remove generated and isolated artifacts and confirm the tracked worktree is unchanged.

Stage 3 may build and validate the skeleton locally. Preserving a formally qualified candidate tarball/checksum and producing the full rollback evidence is Stage 4; local technical success is not package publication or application acceptance.

## Accessibility and browser governance in this slice

WCAG 2.2 Level AA remains the shared target. Because no component is authorized, Stage 3 establishes only the future test categories and failure gates:

- semantics and accessible-name automation;
- keyboard operation and visible focus;
- modal/portal focus containment and restoration;
- reduced-motion behavior;
- contrast using authorized production tokens;
- responsive layout and zoom/reflow against an approved viewport/browser/OS matrix.

The last three visual/interaction categories become executable when relevant components and approved brand values exist. Stage 3 must not claim browser compatibility, accessibility conformance, visual qualification, or WCAG conformance from an empty skeleton.

## Explicit non-goals

Stage 3 does not include:

- production design tokens, brand colors, logos, fonts, or other assets;
- React components, icons, charts, layouts, templates, application shells, or Gallery UI;
- a component catalog or first component inventory beyond future schema placeholders;
- CPQ/EPM source changes, adapters, migration, acceptance, deployment, or Production approval;
- GitHub Actions, repository settings, secrets, tags, Packages publication, or Releases;
- a stable package version, browser/OS compatibility claim, or public support promise;
- CommonJS output, routing ownership, business workflows, RBAC, API contracts, or domain state.

## Risks and controls

| Risk | Control |
| --- | --- |
| Fixture values are mistaken for approved brand tokens | Label every generated value as scaffold-only, keep the package private, reject production qualification, and publish no assets |
| Node 24 maintainer tooling forces a CPQ runtime uplift | Keep consumer engine/support evidence separate and exercise a Node 22 CPQ-compatible harness |
| Optional React peers hide an invalid component consumer | Verify both token-only/no-React and React-host fixtures; any future root component import requires the peer contract |
| Empty structure creates premature public API commitments | Root exports nothing; no component inventory or business-neutral API is inferred from folders |
| Tool versions drift before implementation | Revalidate primary package metadata before lockfile generation; report any deviation instead of using `latest` |
| Local build is mistaken for application acceptance | Record only technical evidence; CPQ adoption and independent acceptance remain Stage 6 gates |

## Implementation small-step plan

If this proposal is approved, Stage 3 should be implemented as separate recoverable steps, stopping after each verification checkpoint:

1. **3B — Metadata and toolchain:** create version pins, private manifest, exact dependencies, lockfile, ignore rules, and non-secret registry mapping.
2. **3C — Empty public boundary:** create the empty ESM/declaration build, export map, file allowlist, namespace constants, and boundary checks.
3. **3D — Fixture token pipeline:** add only scaffold tokens, deterministic generated outputs, and CSS-scope tests.
4. **3E — Local package consumers:** add token-only and CPQ-compatible React/Vite fixture verification using the actual local tarball.
5. **3F — Stage 3 evidence:** run the complete clean verification, remove generated evidence artifacts, and record results in the roadmap.

Each step requires its own stated purpose, operation, expected result, verification, rollback, and approval under `AGENTS.md`. Approval of this proposal authorizes none of the later publication or consumer-integration stages.

## Rollback

Before Stage 3 implementation, the tracked repository has no package source or dependency installation. Each implementation step must remain reversible by removing only the files/directories introduced by that step and restoring the prior clean tracked state.

Generated `node_modules/`, `dist/`, coverage, local pack, and temporary consumer directories may be deleted after their resolved paths are confirmed inside this repository. No rollback may reset unrelated user work, modify CPQ/EPM, or mutate a remote branch/package/release.

## Approval gate

Approval of this document authorizes only **Step 3B — Metadata and toolchain** as the next local implementation step. It does not authorize subsequent Stage 3 steps automatically. Any change to the exact maintainer toolchain, consumer engine floor, React peer policy, namespace, public subpaths, or non-goal boundary must be reported before implementation.
