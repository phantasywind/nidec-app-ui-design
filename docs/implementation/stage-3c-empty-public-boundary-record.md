# Stage 3C Empty Public Boundary Record

- Status: Implemented and technically verified
- Approval: Locke Yuan, 2026-09-03 (`请继续` at the Stage 3C gate)
- Verification date: 2026-09-03
- Scope: Empty ESM entry, TypeScript declarations, Vite library configuration, public export map, internal namespace constants, lint configuration, and automated boundary enforcement
- Next gate: Stage 3D — fixture-only token pipeline

## Outcome

Stage 3C created an executable package boundary without creating a component API, production token, CSS rule, brand asset, consumer fixture, or application integration.

The package root now resolves through the explicit export map to:

- `dist/index.js` — a valid empty ESM module;
- `dist/index.d.ts` — a matching empty TypeScript declaration.

The only source outside the internal directory is `src/index.ts`, containing `export {};`. The approved CSS host, prefix, and cascade-layer constants exist under `src/internal/namespace.ts` and are not exported by the package.

## Boundary contract

| Contract | Verified behavior |
| --- | --- |
| Public package root | Import succeeds and returns zero exports |
| Internal source path | `@phantasywind/nidec-app-ui-design/internal/namespace` is rejected with `ERR_PACKAGE_PATH_NOT_EXPORTED` |
| Public source surface | Only `src/index.ts` exists outside `src/internal/` |
| Runtime dependencies | None |
| React ownership | React/React DOM remain optional peers and are absent from the built JavaScript |
| Output format | ESM only |
| Declaration output | `dist/index.d.ts` exactly matches the empty API |
| Package allowlist | `dist` only |
| Built file allowlist | `index.js`, `index.d.ts` only |
| Namespace host | `[data-nidec-ui]` |
| CSS variable prefix | `--nidec-ui-` |
| CSS class prefix | `nidec-ui-` |
| Cascade layer | `nidec-ui` |

The namespace constants are internal governance inputs, not visual implementation. They contain no brand values or application behavior.

## Files introduced by Stage 3C

- `tsconfig.json`
- `tsconfig.build.json`
- `vite.config.ts`
- `eslint.config.js`
- `src/index.ts`
- `src/internal/namespace.ts`
- `src/internal/README.md`
- `scripts/clean.mjs`
- `scripts/check-boundaries.mjs`
- this verification record

Stage 3C also added the root export map, public entry fields, and local verification scripts to `package.json`. No dependency version changed.

## Automated controls

`scripts/check-boundaries.mjs` fails when:

- package identity, private status, ESM type, package manager, or Node engine floor changes unexpectedly;
- the package allowlist or public root paths drift;
- a runtime dependency is added;
- React peer ownership changes;
- any development dependency stops using an exact version;
- `src/index.ts` gains a public export;
- another public source file appears outside `src/internal/`;
- the approved namespace values are absent;
- CPQ/EPM or selected application-business terminology enters TypeScript source;
- the build contains an unexpected file, non-empty declaration surface, or React import.

The clean script resolves the repository root and deletes only its exact `dist` child. It refuses an unexpected target path.

## Verification performed

All qualification commands used the SHA-256-verified portable Node `24.20.0` / npm `11.19.0` toolchain recorded in Stage 3B.

1. Ran ESLint over the executable repository configuration and scripts.
2. Ran strict TypeScript checking over all TypeScript source, including internal namespace constants.
3. Ran boundary validation before building.
4. Cleaned only `dist/` and built the empty library with Vite `8.2.2`.
5. Emitted declarations separately with TypeScript `7.0.2`.
6. Ran boundary validation against the actual build output.
7. Rebuilt from the same inputs and compared SHA-256 output hashes.
8. Imported the package through its public self-reference and confirmed zero exports.
9. Attempted the internal package subpath and confirmed Node rejected it as not exported.
10. Rebuilt dependencies from `package-lock.json` with `npm ci --ignore-scripts`: 121 packages installed, 122 audited, 0 vulnerabilities reported.
11. Re-ran the complete `npm run verify` chain after the clean restore; exit code was 0.

Deterministic output hashes from the repeated build:

| Output | SHA-256 |
| --- | --- |
| `dist/index.js` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `dist/index.d.ts` | `8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881` |

The empty JavaScript file deliberately has the standard SHA-256 of a zero-byte file. This demonstrates structural package resolution without introducing implementation.

## Controlled implementation adjustment

The first build confirmed that Vite does not emit a source map for a zero-byte entry even when source maps are requested. Stage 3C therefore explicitly disables source maps for the empty skeleton and fixes the allowed output to the two files actually required by the public contract. A later non-empty implementation may introduce source maps through a separately verified change.

## Authorization boundary retained

Stage 3C does not authorize or implement:

- token source, generated CSS, component CSS, React components, icons, or assets;
- a first component inventory or component catalog;
- consumer fixtures or actual CPQ/EPM installation;
- production brand values, browser compatibility, visual qualification, or accessibility conformance claims;
- GitHub Actions, package publication, tags, Releases, repository settings, secrets, deployment, or Production use.

## Rollback

Rollback removes only the Stage 3C files listed above, removes the Stage 3C fields/scripts from `package.json`, and deletes the resolved repository-local `dist/`. Stage 3B metadata, dependency pins, and lockfile remain intact. No remote, CPQ, or EPM state changed.

## Next gate

Stage 3C is complete. The next separately approved step is **Stage 3D — Fixture-only token pipeline**: add clearly labelled non-brand DTCG test data, deterministic generated `tokens.css` and `tokens.json`, scoped CSS checks, and publication blockers. It must not introduce or imply authorized Nidec brand values.
