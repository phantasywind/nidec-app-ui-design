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
- [ ] **Step 3: Interactive Spec Dictionary & Component Preview Site (`site/`)**
  - [ ] Site scaffold (`site/package.json`, `site/vite.config.ts`, `site/tsconfig.json`, `site/index.html`, Hash router, responsive `ApplicationFrame` shell).
  - [ ] Overview + Detailed Install, Registry & Usage Guide (exact-version pinning, `.npmrc`, `NidecProvider`, subpaths, legacy UI replacement, v0.3.0 notes).
  - [ ] Visual Foundations: Theme Tokens swatch table (17+1 governed light roles + contrast checks), Typography scale, Spacing scale, Border Radius scale, Page Archetypes matrix.
  - [ ] Interactive Component Pages (live demos + code snippets + Do/Don't rules + Props dictionaries) covering all v0.3.0 categories: Actions & Modes, Forms, Tables & Editable Grids, Feedback & Overlays, Layouts & Navigation, Stages & Workflows.
  - [ ] Full-Page Workspace Examples (Enterprise Directory, Complete Entry Form, Master Data Form + List, Record Workspace, Versioned Governance, Authentication Entry).
- [ ] **Step 4: GitHub Actions Pages Workflow**
  - [ ] Add `.github/workflows/deploy-pages.yml` (Node 24, root build + `site/` build, `upload-pages-artifact`, `deploy-pages`).
- [ ] **Step 5: Build, Test & Browser Verification**
  - [ ] Root `npm run verify` passes without regressions.
  - [ ] `site/` typecheck + production build (`VITE_BASE_PATH=/nidec-app-ui-design/`) succeeds cleanly.
  - [ ] Automated headless Chromium inspection across wide (`1440x900`) and narrow (`720x900`, `390x844`) viewports: zero console/page errors, zero horizontal overflow, interactive state checks (buttons, editable grids, form drawer, tabs, navigation drawer, token swatches).

## Backlog / Follow-up Notes (Out of Current Scope)
- Update `"This private repository"` wording in `README.md` in the next scheduled package version release (kept untouched now so `0.3.0` tarball contents remain unchanged).
- Push to `origin/main` only after explicit owner authorization.
