# Stage 3B Metadata and Toolchain Record

- Status: Implemented and technically verified
- Approval: Locke Yuan, 2026-09-03 (`请继续` at the Stage 3B gate)
- Verification date: 2026-09-03
- Scope: Local package metadata, exact maintainer version pins, exact development dependencies, lockfile, ignore rules, and non-secret npm registry mapping
- Next gate: Stage 3C — empty public boundary proposal execution

## Outcome

Stage 3B established a deterministic, private package-toolchain baseline without creating package source, token/style implementation, tests, consumer fixtures, components, or public exports.

The repository now declares:

- package `@phantasywind/nidec-app-ui-design` at non-release version `0.0.0-development`;
- `private: true`, `UNLICENSED`, and ESM package type;
- maintainer pins Node `24.20.0` and npm `11.19.0`;
- consumer Node engine floor `>=22.12.0`;
- optional React/React DOM peer range `>=19.2.0 <20`;
- exact CPQ-evidenced React/React DOM test-host versions `19.2.7`;
- exact TypeScript, Vite, Vitest, ESLint, React plugin, and React type dependencies;
- npm lockfile version 3 generated with npm `11.19.0`;
- a `dist`-only future package-file allowlist;
- only the public GitHub Packages scope mapping and `save-exact=true` in `.npmrc`.

## Exact tool and dependency evidence

| Item | Verified value |
| --- | --- |
| Node maintainer runtime | `v24.20.0` |
| npm maintainer package manager | `11.19.0` |
| Node archive SHA-256 | `6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba` |
| Lockfile format | `lockfileVersion: 3` |
| TypeScript | `7.0.2` |
| Vite | `8.2.2` |
| Vitest | `4.1.11` |
| ESLint | `10.9.1` |
| React Vite plugin | `6.1.1` |
| React / React DOM | `19.2.7` / `19.2.7` |
| React types / React DOM types | `19.2.18` / `19.2.7` |

The portable Node archive was downloaded from the official Node.js `v24.20.0` distribution and matched the corresponding official `SHASUMS256.txt` entry before extraction. It was used only as ignored local verification tooling under `.tmp/`; it is not part of the repository deliverable.

## Verification performed

1. Queried npm registry metadata immediately before implementation.
2. Confirmed React `19.2.7` remained available and deliberately retained the fixed CPQ compatibility version rather than adopting a newer patch without consumer evidence.
3. Generated `package-lock.json` with npm `11.19.0` and lifecycle scripts disabled.
4. Deleted only the resolved repository-local `node_modules` directory.
5. Ran a clean `npm ci --ignore-scripts` with verified Node `24.20.0` / npm `11.19.0`.
6. Result: 121 packages installed, 122 audited, 0 vulnerabilities reported.
7. Ran `npm ls --depth=0`; every direct development dependency matched the exact manifest version.
8. Parsed the manifest and lockfile to verify private/version/type/package-manager/engine contracts, exact dependency syntax, and root lockfile agreement.
9. Confirmed `.npmrc` contains only the approved scope registry mapping and exact-save policy; no credential was added.
10. Ran `git diff --check`; no whitespace error was reported.
11. Confirmed all Stage 3C+ source, token, style, script, test, fixture, TypeScript, Vite, Vitest, and ESLint configuration paths remain absent.

The host's default executable remains Node `24.13.0` / npm `11.6.2`; it was not changed globally. Repository pins and the verified portable toolchain prevent that host state from being misreported as the qualification runtime.

## Files introduced by Stage 3B

- `.gitignore`
- `.npmrc`
- `.node-version`
- `.nvmrc`
- `package.json`
- `package-lock.json`
- this verification record

The previously approved Stage 3A proposal and roadmap update are part of the same uncommitted documentation series, not new package behavior.

## Authorization boundary retained

Stage 3B does not authorize or implement:

- package source or public exports;
- design tokens, CSS, React components, tests, or consumer fixtures;
- production brand values or assets;
- GitHub Actions, repository settings, credentials, package publication, tags, or Releases;
- CPQ/EPM integration, modification, acceptance, deployment, or Production use.

## Rollback

Rollback is limited to deleting the Stage 3B files listed above and the ignored repository-local `node_modules/` plus `.tmp/node-24.20.0/` verification tooling after resolving and confirming their paths remain within this repository. The Stage 3A documentation can be retained or separately removed. No remote or adopting-application state changed.

## Next gate

Stage 3B is complete. The next separately approved step is **Stage 3C — Empty public boundary**: TypeScript/Vite configuration, an empty ESM root and declaration, export map, namespace constants, and automated boundary checks. It must not introduce components, production tokens, brand assets, or consumer integration.
