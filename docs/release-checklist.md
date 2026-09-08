# Immutable release checklist

This checklist governs every GitHub Packages publication. Package self-test is not application acceptance or Production approval.

## Before qualification

- [ ] Approved exact pre-1.0 version is present in `package.json` and `package-lock.json`.
- [ ] Public export inventory and Consumer Compatibility Profile are frozen.
- [ ] Governed token source identifies its authority; no scaffold marker remains.
- [ ] Worktree is clean and HEAD is the intended release source.
- [ ] React, React DOM, Fluent and build dependencies remain within their recorded exact/range contracts.

## Qualification

- [ ] Two independent Node 24 `npm ci` restores produce byte-identical `.tgz` files.
- [ ] Lint, strict types, build, tests, CSS/color/boundary checks and publication-input check pass.
- [ ] Token-only consumer installs without React, React DOM or Fluent.
- [ ] React consumers install the real `.tgz`, resolve one physical React/React DOM pair, and production-build without source aliases.
- [ ] Cold navigation consumer succeeds without an application-declared `@fluentui/react-icons` dependency, or the dependency contract is revised and requalified.
- [ ] Browser evidence covers 1440/1280/900/720, keyboard/focus, portal/theme behavior, accessibility scan, host CSS and bounded CSP.
- [ ] Package file allowlist, size, SHA-256, source commit, lock and limitations are sealed and read back.

## Publication authorization and execution

- [ ] Locke explicitly authorizes this exact version and exact candidate SHA-256.
- [ ] Create immutable tag `v<version>` at the qualified commit; never reuse it.
- [ ] Set `NIDEC_UI_RELEASE_APPROVED` to that exact version only for the authorized command.
- [ ] Publish to GitHub Packages without changing the qualified package bytes.
- [ ] Create the matching GitHub Release with the actual `.tgz`, `SHA256SUMS.txt`, and completed release record.
- [ ] Verify version, tag, Package, Release, artifact filename and SHA-256 consistency.

## After publication

- [ ] Install the exact published version into an isolated consumer and compare installed package content with the Release `.tgz`.
- [ ] Record package evidence as `RELEASED`; keep application adoption, independent acceptance, deployment and Production gates separate.
- [ ] Corrections always use a new version.
