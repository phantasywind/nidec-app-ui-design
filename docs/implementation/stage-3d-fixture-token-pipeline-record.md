# Stage 3D Fixture-Only Token Pipeline Record

- Status: Implemented and technically verified
- Approval: Locke Yuan, 2026-09-03 (`请继续` at the Stage 3D gate)
- Verification date: 2026-09-03
- Scope: Non-brand DTCG scaffold fixture, deterministic CSS/JSON generation, scoped style infrastructure, automated tests, and publication blockers
- Next gate: Stage 3E — local packed-artifact consumer fixtures

## Outcome

Stage 3D proves the token transformation and isolation architecture without proposing or distributing Nidec brand values.

One source file, `tokens/fixtures/scaffold.tokens.json`, generates identical reviewable and build outputs:

- `styles/tokens.css` and `dist/tokens.css`;
- `styles/tokens.json` and `dist/tokens.json`;
- `styles/styles.css` and `dist/styles.css`.

Every source and generated artifact states `SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.` The package remains private, and a `prepublishOnly` guard rejects publication while any fixture marker remains.

## Fixture boundary

The four fixture tokens deliberately use diagnostic, non-brand values:

| Token path | DTCG type | Diagnostic value | Generated CSS variable |
| --- | --- | --- | --- |
| `fixture.color.marker` | `color` | sRGB magenta marker | `--nidec-ui-fixture-color-marker` |
| `fixture.dimension.spacing` | `dimension` | `7px` | `--nidec-ui-fixture-dimension-spacing` |
| `fixture.duration.motion` | `duration` | `137ms` | `--nidec-ui-fixture-duration-motion` |
| `fixture.number.opacity` | `number` | `0.37` | `--nidec-ui-fixture-number-opacity` |

These values exercise color, dimension, duration, and numeric transforms only. They do not define primitives, semantic tokens, component tokens, accessibility values, or a Nidec-wide visual standard.

## Public and CSS contract

Stage 3D adds three explicit package subpaths:

- `@phantasywind/nidec-app-ui-design/tokens.css`;
- `@phantasywind/nidec-app-ui-design/styles.css`;
- `@phantasywind/nidec-app-ui-design/tokens.json`.

The generated token CSS is contained by both:

- cascade layer `@layer nidec-ui`;
- host selector `[data-nidec-ui]`.

Every generated variable begins with `--nidec-ui-fixture-`. The component stylesheet contains only the labelled empty `nidec-ui` layer. It cannot introduce component appearance before the component-inventory gate.

Automated checks reject global `:root`, `html`, `body`, universal selectors, application IDs, unscoped variables, missing fixture markers, unexpected output files, or a non-empty component stylesheet. CSS comments are removed before selector analysis so the required `*/` warning-comment terminator cannot be misclassified as a universal selector.

## Publication controls

Publication is independently blocked by:

1. `private: true` in `package.json`;
2. `publication: blocked` and `brandAuthority: absent` in fixture metadata;
3. the fixture marker in source and generated artifacts;
4. `prepublishOnly` invoking `scripts/check-publication.mjs`;
5. the package and boundary tests.

The publication check was executed and exited with code 1 as expected. It identified the private package and each reviewable scaffold source/output. A successful publication check is not possible until a later authorized step removes all scaffold data, supplies approved production inputs, and deliberately changes the private release metadata.

## Files introduced by Stage 3D

- `tokens/fixtures/scaffold.tokens.json`
- `styles/tokens.css`
- `styles/tokens.json`
- `styles/styles.css`
- `scripts/build-tokens.mjs`
- `scripts/check-css-scope.mjs`
- `scripts/check-publication.mjs`
- `tests/package-contract.test.ts`
- `tests/token-fixture.test.ts`
- `tests/css-scope.test.ts`
- `vitest.config.ts`
- this verification record

Stage 3D also updates `package.json`, `package-lock.json`, `tsconfig.json`, and `scripts/check-boundaries.mjs`. The exact development dependency `@types/node@24.13.3` was added to type-check Node-based configuration and tests against the Node 24 maintainer line.

## Verification performed

All final commands used the SHA-256-verified Node `24.20.0` / npm `11.19.0` toolchain.

1. Generated four tokens from the DTCG-structured fixture.
2. Ran strict TypeScript checking over package source, tests, and Vite/Vitest configuration.
3. Ran ESLint over executable JavaScript configuration and scripts.
4. Ran Vitest `4.1.11`: 3 test files and 5 tests passed.
5. Verified the package export contract, fixture metadata, reviewable/distributable equality, CSS scope, empty component layer, and absence of the CPQ Nidec-green value.
6. Built five allowed distributable files: `index.js`, `index.d.ts`, `tokens.css`, `tokens.json`, and `styles.css`.
7. Rebuilt from identical inputs and compared every reviewable and distributable SHA-256 hash; all matched.
8. Executed `publication:check`; exit code 1 was required and observed.
9. Rebuilt dependencies from the updated lockfile with lifecycle scripts disabled: 123 packages installed, 124 audited, 0 vulnerabilities reported.
10. Re-ran the complete verification chain after the clean restore; tests, build, CSS scope, and boundary checks passed.

Deterministic generated-output hashes:

| Output pair | SHA-256 |
| --- | --- |
| `styles/tokens.css`, `dist/tokens.css` | `eac9e79a4193dc768659a161dfeb8d68fee13dad0a91fb8892d9635d3ac3417f` |
| `styles/tokens.json`, `dist/tokens.json` | `e3b06d04fc2c57ab275965ef21d57d715c0045a088db9ecba2a133d732c398e5` |
| `styles/styles.css`, `dist/styles.css` | `3aeec4b6b357d8faf0e30423eaa546838c3c2efc6f2bd1fad77bea3439b4b844` |

The unchanged empty root outputs retain the Stage 3C hashes.

## Type-checking adjustment

TypeScript 7 reported an unresolved `NodeProps` name inside the transitive `postcss@8.5.27` declaration file used by Vite. This is third-party declaration checking, not a package-source error. `skipLibCheck` is therefore enabled while `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and TypeScript checking of this repository's source, tests, and configuration remain enabled.

This prevents an external declaration incompatibility from disabling local strictness. It does not suppress errors in Design System code.

## Authorization boundary retained

Stage 3D does not authorize or implement:

- approved Nidec colors, typography, spacing, motion, logos, or other brand assets;
- semantic/component token taxonomies for production use;
- React components, component CSS, component inventory, catalog, or Gallery;
- actual package publication or a stable visual qualification claim;
- CPQ/EPM source changes, migration, acceptance, deployment, or Production use;
- GitHub Actions, tags, Releases, repository settings, or credentials.

## Rollback

Rollback removes the Stage 3D files listed above, removes the Stage 3D scripts/subpath exports and `@types/node` dependency, restores the Stage 3C boundary/configuration, regenerates the Stage 3C lockfile with the pinned toolchain, and deletes only resolved repository-local generated output. No remote, CPQ, or EPM state changed.

## Next gate

Stage 3D is complete. The next separately approved step is **Stage 3E — Local packed-artifact consumer fixtures**: build an actual local `.tgz`, install it into isolated token-only and CPQ-compatible React/Vite fixtures, validate only public imports, and then remove the temporary installations. This remains local technical verification, not formal Stage 4 artifact qualification or CPQ acceptance.
