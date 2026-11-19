# Design & Engineering Decisions (Preview Site & GitHub Pages)

> Note: Repository-level Architecture Decision Records remain in [`docs/decisions/`](decisions/) (`0001`–`0007`). This document records the engineering decisions specific to the interactive specification dictionary and GitHub Pages preview site.

## D-001: Standalone `site/` Workspace Isolated from npm Package Contract
- **Date**: 2026-11-19
- **Decision**: Place the documentation and interactive preview site under `site/` with its own `package.json`, `vite.config.ts`, and `tsconfig.json`, compiling to `site/dist/`.
- **Rationale**:
  - Preserves the root `package.json` contract enforced by `scripts/check-boundaries.mjs` (`files: ["dist"]`, zero runtime `dependencies`, exact-pinned `devDependencies`) and avoids altering published tarball SHA-256 hashes.
  - Keeps `fixtures/react-composite-patterns-consumer/` intact for existing qualification tests (`tests/preview-language.test.ts` and package consumer scripts).
  - Resolves `@phantasywind/nidec-app-ui-design` (root, `/layouts`, `/date-picker`, `/styles.css`) directly to the repository's built `dist/` artifacts via Vite aliases so the preview always exercises the exact compiled library output.

## D-002: Full-English Site Content & Single-Source-of-Truth Token Data
- **Date**: 2026-11-19
- **Decision**: Author all preview site navigation, guides, specifications, props dictionaries, and interactive demos in English, following Nidec's UI copy convention (sentence case, synthetic business-neutral data). Read version numbers from root `package.json` and token values from `tokens/nidec-light.tokens.json`, `src/internal/light-palette.mjs`, and `design-system/content/tokens.template.json`.
- **Rationale**:
  - Matches all component copy guidelines and avoids drift between token definitions and documentation.
  - Keeps the preview site light-theme only (`NidecProvider` + `nidecLightTheme`, ADR-0006); dark mode remains out of scope.

## D-003: Dogfooding the Design System Shell & CSS Tokens
- **Date**: 2026-11-19
- **Decision**: Build the preview site itself using `NidecProvider`, `nidecLightTheme`, `ApplicationFrame`, `ApplicationTopBar`, `ApplicationNavigation`, `PageHeader`, `WorkspaceSection`, `TableScrollRegion`, and Fluent/Nidec semantic CSS variables (`--nidec-ui-color-*` and `--color*` / `--spacing*` / `--borderRadius*`).
- **Rationale**:
  - Demonstrates the real responsive application shell (`ApplicationFrame` desktop sidebar + mobile overlay drawer) and enforces visual continuity without introducing a competing third-party docs skin or raw hardcoded colors.

## D-004: Hash Routing + Configurable Vite `base` Path for GitHub Pages
- **Date**: 2026-11-19
- **Decision**:
  - Configure `site/vite.config.ts` with `base: process.env.VITE_BASE_PATH ?? './'`.
  - Use client-side Hash routing (`#/`, `#/install`, `#/tokens`, `#/archetypes`, `#/components/<id>`, `#/examples/<id>`).
- **Rationale**:
  - Guarantees deep links and full page reloads never 404 on GitHub Pages static hosting without requiring `404.html` redirect hacks.
  - Works seamlessly both under `https://phantasywind.github.io/nidec-app-ui-design/` (with `VITE_BASE_PATH=/nidec-app-ui-design/`) and local `vite preview` / static file servers.

## D-005: Public Repository + GitHub Actions Pages Deployment
- **Date**: 2026-11-19
- **Decision**: Switch `phantasywind/nidec-app-ui-design` to `PUBLIC` and deploy the preview site via `.github/workflows/deploy-pages.yml` using official `actions/upload-pages-artifact` and `actions/deploy-pages` with minimal permissions (`contents: read`, `pages: write`, `id-token: write`).
- **Rationale**:
  - Avoids maintaining a separate mirror repository for static artifacts while keeping the Pages pipeline completely independent from `.github/workflows/release.yml`.
  - Automatically refreshes the live preview on `main` pushes affecting components/docs/site, on published GitHub Releases, or via manual `workflow_dispatch`.
  - Note: GitHub Packages (`npm.pkg.github.com`) still requires authenticated npm credentials (`read:packages`) for consumer installation even on public repositories; this is documented explicitly in the site's Install & Usage Guide.

## D-006: Shared Business-Neutral `Lookup`, `LookupSearchWindow`, and `createLookupAnchor`
- **Date**: 2026-11-19
- **Decision**: Promote the anchored multi-column lookup interaction pattern into the shared root entry (`src/index.ts`) as `Lookup<TItem>`, `LookupSearchWindow<TItem>`, and `createLookupAnchor(rect)`, stripping all application-specific API calls, React Query hooks, icon-pack dependencies, and domain copy.
- **Rationale**:
  - Preserves 100% of the approved keyboard/mouse ergonomics (click / `Enter` / `F4` / `ArrowDown` / printable-char open, `Delete` / `Backspace` clear, debounced search, sortable multi-column table, sticky headers, double-click confirm, and equal-height `300px` optional `manualMode` tab so footer buttons never jump).
  - Keeps zero new runtime dependencies (uses built-in SVG glyphs in `src/internal/components/icons.ts` and Fluent semantic tokens) and passes `scripts/check-boundaries.mjs` business-term and export-surface checks.
  - Staged cleanly on `main` for the next scheduled package release without mutating the published `0.3.0` release.
