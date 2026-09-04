# Stage 3E Local Packed-Artifact Consumer Verification Record

- Status: Implemented and technically verified
- Approval: Locke Yuan, 2026-09-03 (`继续` at the Stage 3E gate)
- Verification date: 2026-09-03
- Scope: Actual local npm tarball, strict tarball allowlist, checksum, token-only consumer, and CPQ-compatible React/Vite consumer
- Next gate: Stage 3F — consolidated Stage 3 evidence and rollback proof

## Outcome

Stage 3E proves that the Design System skeleton can be consumed from the actual npm tarball without repository-source imports, Git aliases, or runtime GitHub access.

Two isolated consumers installed the same `.tgz`, deleted their first installation, restored from their generated lockfile with `npm ci`, type-checked, and production-built successfully:

1. a framework-neutral token-only consumer with no React installation;
2. a CPQ-compatible React consumer fixed to React/React DOM `19.2.7`, Vite `8.1.4`, React plugin `6.0.3`, and TypeScript `7.0.2`.

The consumers were temporary copies under `.tmp/consumers/`. They were deleted after verification. The tracked `fixtures/` directories contain only source templates and exact dependency declarations; they do not contain generated lockfiles, `node_modules`, build output, or a local tarball path.

## Actual package artifact

| Field | Verified value |
| --- | --- |
| Package | `@phantasywind/nidec-app-ui-design` |
| Version | `0.0.0-development` |
| Filename | `phantasywind-nidec-app-ui-design-0.0.0-development.tgz` |
| Packed size | 2,059 bytes |
| Unpacked size | 5,180 bytes |
| Entry count | 9 |
| SHA-256 | `1872f4229b2401297bb18802ead6732130f97c3ad6a97dbe5c4010cacfd64596` |

The tarball allowlist contained exactly:

- `README.md`
- `dist/index.d.ts`
- `dist/index.js`
- `dist/styles.css`
- `dist/styles.css.d.ts`
- `dist/tokens.css`
- `dist/tokens.css.d.ts`
- `dist/tokens.json`
- `package.json`

It contained no repository source, internal namespace file, tests, fixtures, scripts, documentation evidence, lockfile, configuration, credentials, or unapproved asset.

The `.tgz`, `pack-result.json`, `SHA256SUMS.txt`, and `consumer-result.json` remain ignored local evidence under `.pack/`. This is not a published or formally preserved release artifact.

## Consumer results

### Token-only consumer

- Installed the actual local tarball plus exact TypeScript `7.0.2` and Vite `8.2.2` tooling.
- First installation: 18 packages added, 19 audited, 0 vulnerabilities reported.
- Deleted `node_modules` and completed `npm ci --ignore-scripts` from the temporary lockfile.
- TypeScript check passed using only `tokens.css`, `styles.css`, and `tokens.json` public subpaths.
- Vite production build passed: 7 modules transformed.
- Verified neither `react` nor `react-dom` was installed.

### CPQ-compatible React/Vite consumer

- Installed the same local tarball with React/React DOM `19.2.7`, Vite `8.1.4`, React plugin `6.0.3`, and TypeScript `7.0.2`.
- First installation: 25 packages added, 26 audited, 0 vulnerabilities reported.
- Deleted `node_modules` and completed `npm ci --ignore-scripts` from the temporary lockfile.
- Strict TypeScript and Vite production build passed: 18 modules transformed.
- Imported the empty package root and all three public token/style subpaths.
- `npm ls` confirmed React and React DOM each resolved only to `19.2.7`; no duplicate React copy was installed.

Both consumer build outputs were scanned and contained no `github.com`, `npm.pkg.github.com`, or local repository-source path. Each installed Design System package was independently inspected and contained exactly the nine tarball-allowed files.

## Compatibility defect discovered and corrected

The first token-only type-check failed with TypeScript `TS2882` because the public CSS subpaths had runtime export targets but no TypeScript declaration condition.

The package contract was corrected rather than weakening consumer checks:

- `./tokens.css` now exposes `dist/tokens.css.d.ts` through its `types` condition and `dist/tokens.css` through `default`;
- `./styles.css` uses the equivalent declaration/default contract;
- the token generator deterministically creates the two declaration files;
- package, boundary, tarball, installed-file, and unit-test allowlists were updated.

After repacking, both consumers passed from clean installation. This demonstrates why an actual tarball consumer test is required in addition to repository build success.

## Verification controls introduced

### `scripts/verify-package.mjs`

- deletes only the exact repository-local `.pack` directory;
- invokes the same npm CLI used by the verified parent process;
- creates an actual tarball with lifecycle scripts disabled;
- rejects any tarball file outside the nine-file allowlist;
- records npm integrity/SHA-1 metadata plus an independent SHA-256;
- writes ignored local evidence for later inspection.

### `scripts/verify-consumer.mjs`

- requires exactly one local `.tgz`;
- copies tracked source templates into the exact repository-local temporary root;
- injects the actual tarball file dependency only into temporary manifests;
- installs, creates a temporary lockfile, deletes `node_modules`, and restores with `npm ci`;
- runs each consumer's strict type-check and production build;
- validates installed package contents, package version, React absence/uniqueness, and no runtime GitHub/source references;
- records pass/fail evidence even when desktop output is truncated;
- removes all temporary consumers in a `finally` block.

All npm child processes run through the current verified Node executable and npm CLI path, preventing accidental fallback to the host's older default npm.

## Files introduced by Stage 3E

- `fixtures/README.md`
- `fixtures/token-only-consumer/` source template
- `fixtures/react-vite-cpq-consumer/` source template
- `scripts/verify-package.mjs`
- `scripts/verify-consumer.mjs`
- this verification record

Stage 3E also updates `package.json`, the token generator, package-boundary checks, and the package-contract test to include CSS declaration conditions. No runtime dependency or production Design System implementation was added.

## Authorization boundary retained

Stage 3E is local technical verification only. It does not authorize or constitute:

- formal Stage 4 artifact qualification or preservation;
- package publication, tag, GitHub Package, or GitHub Release creation;
- a production brand/token decision;
- component implementation or component-inventory approval;
- modification, integration, independent acceptance, deployment, or Production approval of real CPQ/EPM;
- a general browser/OS compatibility claim.

## Rollback

Rollback removes the Stage 3E fixture templates and verification scripts, removes the Stage 3E package scripts and CSS declaration conditions/files, restores the Stage 3D export/allowlist/test contract, and deletes only resolved repository-local `.pack/` and `.tmp/consumers/` evidence. No remote, CPQ, or EPM state changed.

## Next gate

Stage 3E is complete. The next separately approved step is **Stage 3F — Consolidated Stage 3 evidence and rollback proof**: execute the complete clean workflow, verify tracked generated outputs and ignored artifacts, exercise a controlled skeleton rollback/restoration check, and decide whether Stage 3 exit evidence is complete. It must not publish, modify a consumer application, or advance Stage 4 automatically.
