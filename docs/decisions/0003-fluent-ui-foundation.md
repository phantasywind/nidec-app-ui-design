# ADR-0003: Fluent UI v9 foundation

- Status: Accepted for controlled implementation; technical qualification pending
- Decision owner: Locke Yuan
- Date: 2026-09-04
- Authorization: explicit instruction to implement the Fluent transition plan, directly replacing the prototype

## Decision and limits

Use the official `@fluentui/react-components` package as the React component foundation. Nidec owns theme integration, necessary thin wrappers, usage rules and qualification. Each application retains its business semantics. Do not fork/copy the upstream implementation, re-export the entire library, or expose unstable APIs.

The first slice replaces Button and adds NidecProvider, Input, Field and the Dialog composition family. This does not authorize publication, pushes, application changes or application acceptance. The package stays private at `0.0.0-development`; fixture tokens and publication guards stay in place.

## Overrides to ADR-0002

- Nidec-authored static CSS retains explicit imports, namespace, host scope and cascade-layer rules. Fluent-generated CSS follows its upstream Griffel mechanism, not rewritten Nidec classes/layers. Rendering Fluent components can insert styles; a static stylesheet import is not sufficient to style them.
- Runtime isolation is tested using inside/outside controls, independent themes and portal surfaces. Upstream class names and DOM internals are not a Nidec public override API. No global reset is introduced by Nidec.
- Add Fluent as an exact optional peer and exact development dependency. React component consumers must explicitly install the qualified Fluent version; token-only consumers must not need Fluent or React. React, React DOM and Fluent stay external to the library bundle. Consumer lockfiles freeze upstream transitive ranges.
- NidecProvider requires an explicit theme. The official light/dark themes are test inputs only, not approved Nidec brand data. Platform-neutral tokens remain separate; a future production token-to-Fluent mapping requires approved brand inputs.

All other ADR-0002 controls remain applicable. Upstream Microsoft fonts/icons are not added by this slice. The repository's own license is not changed; upstream licensing and any future assets must be reviewed before distribution.

## Interface contract

Button keeps its text-child native-button contract, default non-submit behavior and `nidec-ui-button` class; implementation delegates to Fluent. NidecProvider accepts FluentProvider properties with a required non-null theme, and always establishes `data-nidec-ui`. Input/Field and Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions are named upstream exports, with their matching Props types. No new business validation or lifecycle protocol is added.

The authorized type-adaptation continuation excludes `customStyleHooks_unstable` and `overrides_unstable` from NidecProviderProps. Object Button refs are bridged through a typed callback; callback refs retain identity and React cleanup semantics. `disabled={undefined}` normalizes to false at the Fluent boundary without narrowing the existing native public prop type. Compiler strictness is unchanged. Response-specific renderer nonces are demonstrated only in the consumer fixture, not imposed as application CSP policy.

## Qualification gate

Verify published version and integrity before replacement; do not silently substitute versions. Then run existing toolchain/type/package boundaries, clean deterministic packs, real Node 22 consumers, interaction/accessibility/responsive/isolation and CSP checks. Record limitations and bundle changes, without inventing a size threshold. A failing compatibility or security check stops qualification; do not disable the check to pass.

Historical Button/scaffold evidence is preserved but does not qualify new bytes. Baseline backups under `.qualification/runs/fluent-transition/baseline` retain the initial dirty documentation and key source/lock bytes. Rollback is targeted to this slice, never a whole-worktree reset.

## Sources

- [Official Fluent v9 development and styling](https://fluent2.microsoft.design/get-started/develop)
- [Official repository and licensing](https://github.com/microsoft/fluentui)
- Published npm metadata for `@fluentui/react-components@9.74.7`, checked 2026-09-04; GitHub master is not release authority.
