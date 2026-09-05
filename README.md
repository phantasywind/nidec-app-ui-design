# Nidec App UI Design

Shared, versioned UI design system for Nidec applications.

This private repository is the source of truth for the Nidec Engineering Design System package `@phantasywind/nidec-app-ui-design`. It owns reusable UI foundations and their build, verification, documentation, and release mechanisms. Each adopting application retains ownership of its integration and business behavior.

CPQ and EPM are the initial reference consumers used to establish and verify the first compatibility contract. Future Nidec applications may adopt qualified versions after completing the same application-specific compatibility assessment; compatibility is not assumed solely because an application belongs to Nidec.

## Governance

- [Agent governance and responsibility boundary](AGENTS.md)
- [ADR-0001: Repository and distribution governance](docs/decisions/0001-repository-and-distribution-governance.md)
- [Gated delivery roadmap](docs/roadmap.md)

The package remains private and unpublished. The Fluent transition is under technical qualification; historical scaffold or native Button evidence does not qualify this implementation.

## Fluent React prototype

The controlled React surface is `Button`, `NidecProvider`, `Input`, `Field`, and the `Dialog`, `DialogTrigger`, `DialogSurface`, `DialogBody`, `DialogTitle`, `DialogContent`, `DialogActions` composition family, with corresponding Props types. The first form batch adds `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Radio`, `Switch` and their Props types, preserving upstream contracts. See [ADR-0003](docs/decisions/0003-fluent-ui-foundation.md), [batch scope and approval gate](docs/decisions/0005-batched-form-components.md) and [transition evidence](docs/implementation/fluent-transition-record.md).

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

`tokens.css`, `styles.css` and `tokens.json` remain framework-neutral entrypoints. Fixture tokens are NOT production brand values. Nidec static CSS is explicitly imported; Fluent runtime styles are managed by its Provider/Griffel mechanism and do not require `styles.css` to activate. CSP, portal isolation and application acceptance remain separate qualification gates. No custom fonts, icons or global reset are introduced by this prototype.
