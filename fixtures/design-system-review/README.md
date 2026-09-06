# Design System HTML comparison review

2026-09-06. Report-only deliverable; does not modify CPQ or public package APIs.

Run from the shared repository using the existing Node 24 runtime:

```powershell
& '.tmp/node-24.20.0/node-v24.20.0-win-x64/node.exe' node_modules/vite/bin/vite.js build --config fixtures/design-system-review/vite.config.mjs
& '.tmp/node-24.20.0/node-v24.20.0-win-x64/node.exe' node_modules/vite/bin/vite.js preview --config fixtures/design-system-review/vite.config.mjs
```

Open http://127.0.0.1:5191/ via HTTP, not file://. The output is `.tmp/design-system-review-dist/index.html` plus its assets, manifest and selected screenshots. Keep the entire directory when moving this report; it is not a single self-contained HTML file.

## Provenance and scope

- Read-only imports of current CPQ Gallery, legacy controls, and actual CPQ Fluent adapters. No application source is copied into the shared package.
- Shared library resolves to the installed qualified tarball consumer, not shared source. Candidate SHA-256 was recomputed from `D:/Documents/Nidec Elevator CPQ/artifacts/nidec-ui-304a5d85.tgz` and matched `304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0`.
- Build emits SHA-256 for actual CPQ files read. Current working tree is not a pristine historical baseline.
- Synthetic local state only. Gallery is reference content, not proof every Gallery scenario is migrated. Business composition remains CPQ-owned.
- Review shell neutral colors are report-only, not new brand tokens or component policy.

## Verification and failures retained

- First report build failed because the harness used the wrong icon adapter export. Corrected to actual `NidecIconButton`.
- First button specimen had the wrong icon props and blanked the new pane. Corrected harness to `aria-label` plus `icon`; both panes then rendered and action counts updated. These are report harness defects, not attributed to CPQ.
- Production build passed; approximately 1.11 MB JS includes the complete legacy Gallery and charts plus Fluent. Large chunk warning remains visible, not disabled.
- In-app browser observed forms, actions, directory search and Fluent Drawer. Input local updates and both Save counters worked; Drawer opened with input focus and later closed after Escape.
- Full keyboard, old Sheet, multi-viewport, automated a11y, application CSP, business semantics and independent acceptance are NOT asserted passed. No standalone report TypeScript check was run.
- Viewport screenshots saved and reread in `.tmp/design-system-review-evidence/`. `forms.png` full-page capture has stitching duplication and is rejected. `drawer.png` records the closed state, not the open panel. Neither is embedded as accepted visual evidence.
- Report flags danger-button emphasis and loading-pattern differences. No CPQ fix or task notification is authorized by this review alone.

Rollback: remove only this report fixture and its dedicated generated report/evidence directories; preserve all prior package and CPQ evidence. No commits, pushes, new worktrees, application modifications, deployment or publication performed.
