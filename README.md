# Nidec App UI Design

Shared, versioned UI design system for Nidec applications.

This private repository is the source of truth for the Nidec Engineering Design System package `@phantasywind/nidec-app-ui-design`. It owns reusable UI foundations and their build, verification, documentation, and release mechanisms. Each adopting application retains ownership of its integration and business behavior.

CPQ and EPM are the initial reference consumers used to establish and verify the first compatibility contract. Future Nidec applications may adopt qualified versions after completing the same application-specific compatibility assessment; compatibility is not assumed solely because an application belongs to Nidec.

## Governance

- [Agent governance and responsibility boundary](AGENTS.md)
- [ADR-0001: Repository and distribution governance](docs/decisions/0001-repository-and-distribution-governance.md)
- [Gated delivery roadmap](docs/roadmap.md)

The first complete shared surface is published as immutable pre-release `0.1.0-rc.1` through GitHub Packages and the matching [GitHub Release](https://github.com/phantasywind/nidec-app-ui-design/releases/tag/v0.1.0-rc.1). Its qualified archive SHA-256 is `66f199f1b66b34968851cd020d31be7a0b731d44457fc5135ef7f148bfeae91c`. This publication enables controlled application qualification; it is not a stable `0.1.0`, independent application acceptance, deployment approval or Production approval.

## Fluent React package

The finite React surface covers governed forms, dialogs/drawers, feedback, navigation, menus, tables/data grids, cards, status/content controls, and the shared `CollectionList`, `CardGallery`, and `ProcessStageIndicator` compositions. Upstream Fluent contracts are preserved where components are directly exported; consumer business workflows remain outside this package. See [ADR-0003](docs/decisions/0003-fluent-ui-foundation.md), [batch scope](docs/decisions/0005-batched-form-components.md), and the [release-candidate record](docs/releases/0.1.0-rc.1.md).

React consumers explicitly install the exact qualified `@fluentui/react-components@9.74.7` alongside the exact shared-package version. React/React DOM and Fluent are external optional peers; optional means token-only consumers can omit them, not that React consumers can omit them. Commit the application lockfile to freeze transitive dependencies.

```tsx
import { NidecProvider, Button, nidecLightTheme } from '@phantasywind/nidec-app-ui-design';

// Explicit shared light theme; application adoption remains separately approved.
<NidecProvider theme={nidecLightTheme}>
  <Button onClick={handleAction}>Example action</Button>
</NidecProvider>
```

The light-theme palette basis is approved in [ADR-0006](docs/decisions/0006-color-governance.md); the [central mapping record](docs/implementation/nidec-light-theme-record.md) distinguishes source colors from derived UI states and tracks verification. Raw values live in one internal configuration; consumers use the public theme, never internal paths. A Nidec dark theme is not provided.

Button remains a text-only native-button interface, defaults to `type="button"`, preserves disabled/form/ref behavior and composes the `nidec-ui-button` class. There is no polymorphic link or new business behavior. Input/Field/Dialog preserve their upstream public protocols. NidecProvider requires a complete explicit theme and excludes upstream unstable styling options.

`tokens.css`, `styles.css` and `tokens.json` are framework-neutral entrypoints generated from the governed ADR-0006 light-theme input. Nidec static CSS is explicitly imported; Fluent runtime styles are managed by its Provider/Griffel mechanism and do not require `styles.css` to activate. CSP, portal isolation and application acceptance remain separate qualification gates. No custom fonts, icon package contract or global reset is introduced.

## Exact-version consumption

Configure the private GitHub Packages registry through the application's credential-managed npm setup, then install exact versions:

```ini
@phantasywind:registry=https://npm.pkg.github.com
save-exact=true
```

```powershell
npm install --save-exact @phantasywind/nidec-app-ui-design@0.1.0-rc.1 @fluentui/react-components@9.74.7
```

The application must already use a qualified exact React/React DOM 19.2.x pair. Do not use `latest`, ranges, Git URLs, or `main`. A built application does not contact GitHub at runtime.
