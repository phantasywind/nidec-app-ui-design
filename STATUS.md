# Project Status — Design System Preview Site & GitHub Pages

Last updated: 2026-11-19
Target package baseline: `@phantasywind/nidec-app-ui-design@0.3.0`
Live preview URL (after push & Actions run): `https://phantasywind.github.io/nidec-app-ui-design/`

## Milestones

- [x] **Step 1: Repository Discovery & Baseline Verification**
  - Confirmed `0.3.0` exports (`.` root, `/layouts`, `/date-picker`, `tokens.css`, `styles.css`, `tokens.json`).
  - Verified root `npm ci && npm run verify` (28 test files / 214 tests passing).
  - Audited existing docs (`docs/`, `design-system/content/`) and preview fixtures (`fixtures/react-composite-patterns-consumer/`).
- [x] **Step 2: Alignment & GitHub Repository Setup**
  - Decisions confirmed: full-English site, public repository with GitHub Actions Pages, standalone `site/` directory preserving npm package immutability.
  - Repository switched to `PUBLIC` and GitHub Pages configured to `workflow` (`GitHub Actions`).
- [x] **Step 3: Interactive Spec Dictionary & Component Preview Site (`site/`)**
  - [x] Site scaffold (`site/package.json`, `site/vite.config.ts`, `site/tsconfig.json`, `site/index.html`, Hash router `#/...`, responsive `ApplicationFrame` shell with searchable navigation and prev/next pager).
  - [x] Overview + Detailed Install & Usage Guide (GitHub Packages `.npmrc` auth, exact-version pinning, `NidecProvider` + `nidecLightTheme`, subpath imports, legacy skin removal, upgrade/rollback, v0.3.0 notes).
  - [x] Visual Foundations: Design Tokens swatch gallery (17+1 governed light roles + live WCAG contrast matrix), Fluent typography scale, spacing scale, border radius scale, Page Archetypes matrix.
  - [x] Interactive Component Pages (23 component specification routes with live playgrounds, Full/900px/640px width previewer, collapsible code snippets, Do/Don't rules, ownership boundaries, and Props dictionaries) covering Actions & Modes, Form Controls, Tables & Grids, Feedback & Overlays, Layouts & Navigation, and Stages & Workflows.
  - [x] Full-Page Workspace Examples (6 routes: Enterprise Directory, Complete Entry Form, Master Data Form + List, Record Workspace, Versioned Governance, Authentication Entry).
- [x] **Step 4: GitHub Actions Pages Workflow**
  - [x] Added `.github/workflows/deploy-pages.yml` (Node 24, root `npm ci && npm run build`, `site/` `npm ci && npm run build` with `VITE_BASE_PATH=/nidec-app-ui-design/`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`).
- [x] **Step 5: Build, Test & Browser Verification**
  - [x] Root `npm run verify` passed (lint, typecheck, tokens:build, vite build, declarations, css:check across 60 source files, 28 test files / 214 tests, boundaries:check across 11 build files, adoption:check).
  - [x] `site/` typecheck + production build verified for both default relative base (`./`) and GitHub Pages base (`VITE_BASE_PATH=/nidec-app-ui-design/`).
  - [x] Headless Chromium verification against `vite preview` at `/nidec-app-ui-design/` passed across wide (`1440x900`, all 33 routes), tablet (`900x900`, 10 routes), and mobile (`390x844`, 10 routes): 0 console errors, 0 page exceptions, 0 failed HTTP requests, 0 horizontal overflows, interactive checks verified (Button states, Design Tokens category filter, FormDrawer overlay, LiteEditableGrid 1,000-row virtualized mode, mobile navigation drawer), and visual screenshots inspected.

## Backlog / Follow-up Notes (Out of Current Scope)
- Update `"This private repository"` wording in `README.md` in the next scheduled package version release (kept untouched now so `0.3.0` tarball contents remain unchanged).
- Push local commits to `origin/main` only after explicit owner authorization to trigger the first live GitHub Pages deployment.
